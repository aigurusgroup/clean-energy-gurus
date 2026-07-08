// property-analysis edge function
//
// Secure backend for the Energy IQ property intake.
// Front-end MUST call ONLY this function — the GOV.UK EPC API is never
// called from the browser. The bearer token comes from EPC_API_BEARER_TOKEN
// and never leaves the server.
//
// API base (per GOV.UK "Energy certificate data APIs" tech docs):
//   https://api.get-energy-performance-data.communities.gov.uk
// Endpoints used:
//   GET /api/domestic/search?postcode=...
//   GET /api/certificate?certificate_number=...
//
// Actions:
//   POST { action: "search", postcode }
//     -> { status: "ok", addresses: [{ label, lmkKey, postcode }] }
//     -> { status: "empty", searchedPostcode }
//   POST { action: "certificate", lmkKey, fallbackAddress? }
//     -> { status: "found", data: PropertyIntelligence }
//     -> { status: "not_found", searchedAddress }
//
// NOTE: `lmkKey` in the response is now the GOV.UK `certificateNumber`
// (kept named `lmkKey` so the frontend contract is unchanged).

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

const EPC_API_BASE =
  "https://api.get-energy-performance-data.communities.gov.uk";
const EPC_DOMESTIC_SEARCH = `${EPC_API_BASE}/api/domestic/search`;
const EPC_CERTIFICATE = `${EPC_API_BASE}/api/certificate`;

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

// New GOV.UK API uses camelCase: addressLine1..4, postTown, postcode.
const rowLabel = (r: Record<string, unknown>): string => {
  const parts = [
    r["addressLine1"], r["addressLine2"], r["addressLine3"], r["addressLine4"],
    r["postTown"], r["postcode"],
  ].map((x) => cleanText(x, "")).filter((s) => s.length);
  return parts.join(", ");
};

type EpcCallDebug = {
  endpoint: string;
  status: number;
  contentType: string;
  jsonReturned: boolean;
  rowCount: number;
  bodyPreview: string;
};

async function fetchEpc(url: string, token: string) {
  const res = await fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/json",
    },
  });
  const body = await res.text();
  const contentType = res.headers.get("content-type") ?? "";
  const jsonReturned = contentType.toLowerCase().includes("json");
  let rows: Record<string, unknown>[] = [];
  let parsed: unknown = null;
  if (jsonReturned) {
    try {
      parsed = JSON.parse(body);
      const data = (parsed as { data?: unknown })?.data;
      if (Array.isArray(data)) rows = data as Record<string, unknown>[];
      else if (data && typeof data === "object") {
        // Some payloads wrap rows inside data.rows / data.results
        const inner = (data as Record<string, unknown>);
        if (Array.isArray(inner.rows)) rows = inner.rows as Record<string, unknown>[];
        else if (Array.isArray(inner.results)) rows = inner.results as Record<string, unknown>[];
      }
    } catch {
      // fall through
    }
  }
  const debug: EpcCallDebug = {
    endpoint: url,
    status: res.status,
    contentType,
    jsonReturned,
    rowCount: rows.length,
    bodyPreview: body.slice(0, 200),
  };
  console.log(
    `[property-analysis] endpoint=${url} status=${res.status} contentType=${contentType} json=${jsonReturned} rows=${rows.length}`,
  );
  return { res, body, parsed, rows, debug };
}

async function searchByPostcode(postcode: string, token: string) {
  const params = new URLSearchParams();
  params.set("postcode", postcode);
  const url = `${EPC_DOMESTIC_SEARCH}?${params.toString()}`;
  return await fetchEpc(url, token);
}

async function fetchCertificate(certificateNumber: string, token: string) {
  const params = new URLSearchParams();
  params.set("certificate_number", certificateNumber);
  const url = `${EPC_CERTIFICATE}?${params.toString()}`;
  return await fetchEpc(url, token);
}

function pick(
  r: Record<string, unknown>,
  keys: string[],
  fallback = "",
): string {
  for (const k of keys) {
    const v = r[k];
    if (v !== undefined && v !== null && String(v).trim().length) return String(v).trim();
  }
  return fallback;
}

function toIntelligence(
  match: Record<string, unknown>,
  cert: Record<string, unknown> | null,
  postcodeFallback: string,
): PropertyIntelligence {
  // certificate detail (snake_case) if present, else search row (camelCase)
  const c = cert ?? {};
  const line1 = pick(c, ["address_line_1", "address"], "") ||
    pick(match, ["addressLine1", "address"], "Address on file");
  const town = pick(c, ["post_town"], "") || pick(match, ["postTown"], "");
  const postcode = pick(c, ["postcode"], "") || pick(match, ["postcode"], postcodeFallback);
  const currentBand = pick(c, ["current_energy_efficiency_band", "current_energy_rating"], "") ||
    pick(match, ["currentEnergyEfficiencyBand", "currentEnergyRating"], "");
  const potentialBand = pick(c, ["potential_energy_efficiency_band", "potential_energy_rating"], "") ||
    pick(match, ["potentialEnergyEfficiencyBand", "potentialEnergyRating"], "");
  const currentScore = pick(c, ["current_energy_efficiency"], "") ||
    pick(match, ["currentEnergyEfficiency"], "");
  const potentialScore = pick(c, ["potential_energy_efficiency"], "") ||
    pick(match, ["potentialEnergyEfficiency"], "");
  const propertyType = pick(c, ["property_type"], "") || pick(match, ["propertyType"], "Unknown");
  const builtForm = pick(c, ["built_form"], "") || pick(match, ["builtForm"], "Unknown");
  const floorArea = pick(c, ["total_floor_area"], "") || pick(match, ["totalFloorArea"], "");
  const mainHeating = pick(
    c,
    ["mainheat_description", "main_heating_description", "mainheat_desc"],
    "",
  ) || pick(match, ["mainheatDescription", "mainHeatingDescription"], "Unknown");

  const recRaw = (cert && Array.isArray((cert as Record<string, unknown>)["recommendations"]))
    ? (cert as Record<string, unknown>)["recommendations"] as Record<string, unknown>[]
    : [];
  const recs = recRaw
    .map((r) => pick(r, ["improvement_descr_text", "improvement_summary_text", "improvement"], ""))
    .filter((s) => s.length)
    .slice(0, 6);

  return {
    address: { line1, town, postcode: postcode.toUpperCase().replace(/\s+/g, " ") },
    currentRating: normaliseRating(currentBand),
    currentScore: toInt(currentScore),
    potentialRating: normaliseRating(potentialBand),
    potentialScore: toInt(potentialScore),
    propertyType: cleanText(propertyType, "Unknown"),
    builtForm: cleanText(builtForm, "Unknown"),
    floorAreaSqm: toInt(floorArea),
    mainHeating: cleanText(mainHeating, "Unknown"),
    recommendedImprovements: recs,
  };
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  if (req.method !== "POST") return json({ error: "Method not allowed" }, 405);

  const token = Deno.env.get("EPC_API_BEARER_TOKEN");
  console.log("[property-analysis] invoked. token configured:", Boolean(token));
  if (!token) {
    return json({
      status: "error",
      errorCode: "no_token",
      devMessage: "EPC API token not configured. Using mock data.",
    });
  }

  let body: {
    action?: "search" | "certificate";
    postcode?: string;
    selectedAddress?: string;
    lmkKey?: string;
    fallbackAddress?: string;
  };
  try {
    body = await req.json();
  } catch {
    return json({ error: "Invalid JSON body" }, 400);
  }

  const action = body.action ?? (body.lmkKey ? "certificate" : "search");
  console.log("[property-analysis] action:", action);

  // ---------- SEARCH ----------
  if (action === "search") {
    const postcode = String(body.postcode ?? "").trim().toUpperCase();
    console.log("[property-analysis] postcode:", postcode);
    if (!postcode) return json({ error: "postcode required" }, 400);

    let searchResult;
    try {
      searchResult = await searchByPostcode(postcode, token);
    } catch (err) {
      console.error("[property-analysis] search fetch failed", err);
      return json({
        status: "error",
        errorCode: "fetch_failed",
        devMessage: `EPC API fetch failed: ${String(err)}`,
      });
    }

    const { res, rows, debug } = searchResult;

    if (res.status === 401 || res.status === 403) {
      return json({
        status: "error",
        errorCode: "auth_rejected",
        httpStatus: res.status,
        debug,
        devMessage:
          `EPC API rejected the Bearer token (HTTP ${res.status}). ` +
          `Verify EPC_API_BEARER_TOKEN matches the token on your GOV.UK "my account" page.`,
      });
    }
    if (!debug.jsonReturned) {
      return json({
        status: "error",
        errorCode: "html_response",
        httpStatus: res.status,
        debug,
        devMessage:
          `EPC API returned non-JSON (${debug.contentType || "unknown"}) from ${debug.endpoint}. ` +
          `Expected application/json.`,
      });
    }
    if (res.status === 404 || res.status === 204) {
      return json({ status: "empty", searchedPostcode: postcode, debug });
    }
    if (!res.ok) {
      return json({
        status: "error",
        errorCode: "search_failed",
        httpStatus: res.status,
        debug,
        devMessage: `EPC API returned HTTP ${res.status}. Body: ${debug.bodyPreview}`,
      });
    }

    // De-dupe on address label, prefer newest registrationDate per address.
    const bestByLabel = new Map<string, Record<string, unknown>>();
    for (const r of rows) {
      const label = rowLabel(r);
      if (!label) continue;
      const current = bestByLabel.get(label);
      if (!current) {
        bestByLabel.set(label, r);
      } else {
        const da = String(current["registrationDate"] ?? current["lodgementDate"] ?? "");
        const db = String(r["registrationDate"] ?? r["lodgementDate"] ?? "");
        if (db.localeCompare(da) > 0) bestByLabel.set(label, r);
      }
    }

    const addresses = Array.from(bestByLabel.entries())
      .map(([label, r]) => ({
        label,
        lmkKey: pick(r, ["certificateNumber", "lmk-key", "lmkKey"], ""),
        postcode: pick(r, ["postcode"], postcode),
      }))
      .filter((a) => a.lmkKey.length > 0)
      .sort((a, b) => a.label.localeCompare(b.label));

    if (!addresses.length) {
      return json({
        status: "empty",
        searchedPostcode: postcode,
        debug,
        devMessage: `EPC API returned HTTP 200 with 0 rows for postcode ${postcode}.`,
      });
    }
    return json({ status: "ok", addresses, debug });
  }

  // ---------- CERTIFICATE ----------
  if (action === "certificate") {
    const certificateNumber = String(body.lmkKey ?? "").trim();
    const fallbackAddress = String(body.fallbackAddress ?? "").trim();
    console.log("[property-analysis] certificateNumber present:", Boolean(certificateNumber));
    if (!certificateNumber) return json({ error: "lmkKey required" }, 400);

    const postcodeFromAddr = (fallbackAddress.match(
      /\b([A-PR-UWYZ][A-HK-Y]?[0-9][0-9A-HJKPS-UW]?\s*[0-9][ABD-HJLNP-UW-Z]{2})\b/i,
    )?.[1] ?? "").toUpperCase();

    let certResult;
    try {
      certResult = await fetchCertificate(certificateNumber, token);
    } catch (err) {
      console.error("[property-analysis] certificate fetch failed", err);
      return json({ status: "error", errorCode: "fetch_failed", devMessage: String(err) });
    }

    const { res, parsed, debug } = certResult;
    if (!debug.jsonReturned || !res.ok) {
      return json({
        status: "not_found",
        searchedAddress: fallbackAddress,
        debug,
        devMessage: !debug.jsonReturned
          ? `Certificate endpoint returned non-JSON from ${debug.endpoint}.`
          : `Certificate endpoint returned HTTP ${res.status}.`,
      });
    }

    const data = (parsed as { data?: unknown } | null)?.data ?? null;
    const certObj = (data && typeof data === "object" && !Array.isArray(data))
      ? (data as Record<string, unknown>)
      : null;
    if (!certObj) {
      return json({ status: "not_found", searchedAddress: fallbackAddress, debug });
    }

    const intel = toIntelligence({}, certObj, postcodeFromAddr);
    console.log("[property-analysis] returning live EPC certificate");
    return json({ status: "found", data: intel, debug });
  }

  return json({ error: "Unknown action" }, 400);
});
