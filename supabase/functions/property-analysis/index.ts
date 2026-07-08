// property-analysis edge function
//
// Single secure backend endpoint used by the Energy IQ front-end to look up
// property information from the GOV.UK Energy Performance of Buildings API.
//
// The front-end MUST call ONLY this function — it never talks to the EPC API
// directly. The EPC bearer token is read from the EPC_API_BEARER_TOKEN
// secret and never leaves the server.
//
// Contract (kept intentionally compatible with src/lib/propertyIntelligence.ts):
//
//   POST { postcode: string, selectedAddress?: string, uprn?: string }
//   ->  { status: "found", data: PropertyIntelligence }
//   ->  { status: "not_found", searchedAddress: string }

import { corsHeaders } from "npm:@supabase/supabase-js@2/cors";

type EpcRating = "A" | "B" | "C" | "D" | "E" | "F" | "G";

interface PropertyIntelligence {
  address: { line1: string; town: string; postcode: string };
  currentRating: EpcRating;
  currentScore: number;
  potentialRating: EpcRating;
  potentialScore: number;
  propertyType: string;
  builtForm: string;
  floorAreaSqm: number;
  mainHeating: string;
  recommendedImprovements: string[];
}

const EPC_DOMESTIC_SEARCH =
  "https://epc.opendatacommunities.org/api/v1/domestic/search";
const EPC_DOMESTIC_RECOMMENDATIONS =
  "https://epc.opendatacommunities.org/api/v1/domestic/recommendations";

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });

const normaliseRating = (r: unknown): EpcRating => {
  const v = String(r ?? "").trim().toUpperCase();
  return (["A", "B", "C", "D", "E", "F", "G"] as const).includes(v as EpcRating)
    ? (v as EpcRating)
    : "D";
};

const toInt = (v: unknown, fallback = 0): number => {
  const n = Number(v);
  return Number.isFinite(n) ? Math.round(n) : fallback;
};

const cleanText = (v: unknown, fallback = "Unknown"): string => {
  const s = String(v ?? "").trim();
  return s.length ? s : fallback;
};

/** Pick the best matching EPC row for a given selected address, if any. */
function pickBestMatch(
  rows: Record<string, unknown>[],
  selectedAddress?: string,
  uprn?: string,
): Record<string, unknown> | null {
  if (!rows.length) return null;
  if (uprn) {
    const byUprn = rows.find((r) => String(r["uprn"] ?? "") === uprn);
    if (byUprn) return byUprn;
  }
  if (selectedAddress) {
    const needle = selectedAddress.toLowerCase().replace(/\s+/g, " ").trim();
    const byAddr = rows.find((r) => {
      const a1 = String(r["address1"] ?? "").toLowerCase();
      const full = [r["address1"], r["address2"], r["address3"], r["posttown"]]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
      return a1.includes(needle) || full.includes(needle);
    });
    if (byAddr) return byAddr;
  }
  // Default: newest lodgement first if present, else first row.
  return [...rows].sort((a, b) => {
    const da = String(a["lodgement-date"] ?? "");
    const db = String(b["lodgement-date"] ?? "");
    return db.localeCompare(da);
  })[0] ?? rows[0];
}

async function fetchEpc(url: string, token: string) {
  const res = await fetch(url, {
    headers: {
      // GOV.UK EPC accepts Basic auth OR a Bearer token — we use Bearer per spec.
      Authorization: `Bearer ${token}`,
      Accept: "application/json",
    },
  });
  return res;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  if (req.method !== "POST") {
    return json({ error: "Method not allowed" }, 405);
  }

  const token = Deno.env.get("EPC_API_BEARER_TOKEN");
  console.log("[property-analysis] invoked. token configured:", Boolean(token));
  if (!token) {
    console.error("[property-analysis] EPC_API_BEARER_TOKEN is not configured");
    return json({
      status: "not_found",
      searchedAddress: "",
      devMessage: "EPC API token not configured. Using mock data.",
    });
  }

  let body: { postcode?: string; selectedAddress?: string; uprn?: string };
  try {
    body = await req.json();
  } catch {
    return json({ error: "Invalid JSON body" }, 400);
  }

  const postcode = String(body.postcode ?? "").trim().toUpperCase();
  const selectedAddress = body.selectedAddress?.toString().trim();
  const uprn = body.uprn?.toString().trim();

  console.log("[property-analysis] postcode received:", postcode || "(none)");
  console.log("[property-analysis] address received:", selectedAddress || "(none)");
  console.log("[property-analysis] uprn received:", uprn || "(none)");

  if (!postcode && !selectedAddress && !uprn) {
    return json({ error: "postcode, selectedAddress or uprn is required" }, 400);
  }

  // 1. Search domestic EPC certificates.
  const params = new URLSearchParams();
  if (postcode) params.set("postcode", postcode);
  if (uprn) params.set("uprn", uprn);
  params.set("size", "50");

  const searchUrl = `${EPC_DOMESTIC_SEARCH}?${params.toString()}`;
  console.log("[property-analysis] EPC API request attempted:", searchUrl);
  let searchRes: Response;
  try {
    searchRes = await fetchEpc(searchUrl, token);
  } catch (err) {
    console.error("[property-analysis] EPC search fetch failed", err);
    return json({ error: "Failed to reach EPC service" }, 502);
  }
  console.log("[property-analysis] EPC API response status:", searchRes.status);


  if (searchRes.status === 401 || searchRes.status === 403) {
    console.error("EPC auth failed", searchRes.status);
    return json({ error: "EPC credentials rejected" }, 500);
  }

  // 404 or 204 => no certificate on file for this query.
  if (searchRes.status === 404 || searchRes.status === 204) {
    return json({ status: "not_found", searchedAddress: selectedAddress ?? postcode });
  }

  if (!searchRes.ok) {
    const text = await searchRes.text();
    console.error(`EPC search failed [${searchRes.status}]: ${text}`);
    return json({ error: "EPC search failed", status: searchRes.status }, 502);
  }

  let searchPayload: { rows?: Record<string, unknown>[] } = {};
  try {
    searchPayload = await searchRes.json();
  } catch {
    // Some responses come back as empty body on no-match.
    return json({ status: "not_found", searchedAddress: selectedAddress ?? postcode });
  }

  const rows = Array.isArray(searchPayload.rows) ? searchPayload.rows : [];
  const match = pickBestMatch(rows, selectedAddress, uprn);
  if (!match) {
    return json({ status: "not_found", searchedAddress: selectedAddress ?? postcode });
  }

  // 2. Best-effort fetch of recommendations for this certificate.
  let recommendations: string[] = [];
  const lmk = match["lmk-key"];
  if (lmk) {
    try {
      const recRes = await fetchEpc(
        `${EPC_DOMESTIC_RECOMMENDATIONS}/${encodeURIComponent(String(lmk))}`,
        token,
      );
      if (recRes.ok) {
        const recPayload = (await recRes.json()) as {
          rows?: Record<string, unknown>[];
        };
        recommendations = (recPayload.rows ?? [])
          .map((r) => cleanText(r["improvement-descr-text"] ?? r["improvement-summary-text"], ""))
          .filter((s) => s.length)
          .slice(0, 6);
      }
    } catch (err) {
      console.warn("EPC recommendations fetch failed (non-fatal)", err);
    }
  }

  // 3. Shape into the front-end contract.
  const data: PropertyIntelligence = {
    address: {
      line1: cleanText(match["address1"] ?? match["address"], "Address on file"),
      town: cleanText(match["posttown"], ""),
      postcode: cleanText(match["postcode"], postcode),
    },
    currentRating: normaliseRating(match["current-energy-rating"]),
    currentScore: toInt(match["current-energy-efficiency"]),
    potentialRating: normaliseRating(match["potential-energy-rating"]),
    potentialScore: toInt(match["potential-energy-efficiency"]),
    propertyType: cleanText(match["property-type"], "Unknown"),
    builtForm: cleanText(match["built-form"], "Unknown"),
    floorAreaSqm: toInt(match["total-floor-area"]),
    mainHeating: cleanText(
      match["mainheat-description"] ?? match["main-heating-description"] ?? match["mainheat-desc"],
      "Unknown",
    ),
    recommendedImprovements: recommendations,
  };

  console.log("[property-analysis] returning live data for postcode", postcode);
  return json({ status: "found", data });
});

