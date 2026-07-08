// property-analysis edge function
//
// Secure backend for the Energy IQ property intake.
// Front-end MUST call ONLY this function — GOV.UK EPC API is never called
// from the browser. The bearer token comes from EPC_API_BEARER_TOKEN and
// never leaves the server.
//
// Two actions:
//
//   POST { action: "search", postcode }
//     -> { status: "ok", addresses: [{ label, lmkKey, postcode }] }
//     -> { status: "empty", searchedPostcode }
//
//   POST { action: "certificate", lmkKey, fallbackAddress? }
//     -> { status: "found", data: PropertyIntelligence }
//     -> { status: "not_found", searchedAddress }
//
// Legacy shape (still supported for older callers):
//   POST { postcode, selectedAddress? }  -> { status: "found"|"not_found", ... }

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

const rowLabel = (r: Record<string, unknown>): string => {
  const parts = [r["address1"], r["address2"], r["address3"], r["posttown"], r["postcode"]]
    .map((x) => cleanText(x, ""))
    .filter((s) => s.length);
  return parts.join(", ");
};

// GOV.UK Energy certificate data API — Bearer token authentication only.
type EpcCallDebug = {
  status: number;
  rowCount: number;
  bodyPreview: string;
  contentType: string;
};

async function fetchEpc(
  url: string,
  token: string,
): Promise<{ res: Response; body: string; debug: EpcCallDebug }> {
  const res = await fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/json",
    },
  });
  const body = await res.text();
  const contentType = res.headers.get("content-type") ?? "";
  let rowCount = 0;
  try {
    const parsed = JSON.parse(body);
    rowCount = Array.isArray(parsed?.rows) ? parsed.rows.length : 0;
  } catch {
    rowCount = 0;
  }
  const debug: EpcCallDebug = {
    status: res.status,
    rowCount,
    contentType,
    bodyPreview: body.slice(0, 200),
  };
  return { res, body, debug };
}


async function searchByPostcode(postcode: string, token: string) {
  const params = new URLSearchParams();
  params.set("postcode", postcode);
  params.set("size", "100");
  const url = `${EPC_DOMESTIC_SEARCH}?${params.toString()}`;
  console.log("[property-analysis] search url:", url);
  const result = await fetchEpcWithFallback(url, token);
  for (const d of result.debug) {
    console.log(
      `[property-analysis] auth=${d.authMode} status=${d.status} rows=${d.rowCount} bodyPreview=${d.bodyPreview}`,
    );
  }
  return result;
}


function toIntelligence(
  match: Record<string, unknown>,
  recs: string[],
  postcodeFallback: string,
): PropertyIntelligence {
  return {
    address: {
      line1: cleanText(match["address1"] ?? match["address"], "Address on file"),
      town: cleanText(match["posttown"], ""),
      postcode: cleanText(match["postcode"], postcodeFallback),
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
    recommendedImprovements: recs,
  };
}

async function fetchRecommendations(lmkKey: string, token: string): Promise<string[]> {
  try {
    const { res, body } = await fetchEpcWithFallback(
      `${EPC_DOMESTIC_RECOMMENDATIONS}/${encodeURIComponent(lmkKey)}`,
      token,
    );
    if (!res.ok) return [];
    const recPayload = JSON.parse(body) as { rows?: Record<string, unknown>[] };
    return (recPayload.rows ?? [])
      .map((r) => cleanText(r["improvement-descr-text"] ?? r["improvement-summary-text"], ""))
      .filter((s) => s.length)
      .slice(0, 6);
  } catch (err) {
    console.warn("[property-analysis] recommendations failed (non-fatal)", err);
    return [];
  }
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
      }, 200);
    }

    const { res, body: rawBody, debug } = searchResult;
    const lastDebug = debug[debug.length - 1];
    const contentType = res.headers.get("content-type") ?? "";
    const looksHtml =
      contentType.includes("html") || rawBody.trim().toLowerCase().startsWith("<!doctype");

    if (res.status === 401 || res.status === 403 || looksHtml) {
      return json({
        status: "error",
        errorCode: looksHtml ? "auth_html_response" : "auth_rejected",
        httpStatus: res.status,
        debug,
        devMessage:
          `EPC API did not accept credentials — got ${looksHtml ? "an HTML page" : `HTTP ${res.status}`} instead of JSON. ` +
          `The EPC_API_BEARER_TOKEN must be base64(email:api-key). ` +
          `Generate it in your terminal with: echo -n "your-email@example.com:your-api-key" | base64`,
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
        devMessage: `EPC API returned HTTP ${res.status}. Body: ${lastDebug?.bodyPreview ?? ""}`,
      });
    }


    let payload: { rows?: Record<string, unknown>[] } = {};
    try {
      payload = JSON.parse(rawBody);
    } catch {
      return json({ status: "empty", searchedPostcode: postcode, debug });
    }

    const rows = Array.isArray(payload.rows) ? payload.rows : [];
    console.log("[property-analysis] search rows:", rows.length);

    // De-dupe on address label, prefer newest lodgement date per address.
    const bestByLabel = new Map<string, Record<string, unknown>>();
    for (const r of rows) {
      const label = rowLabel(r);
      if (!label) continue;
      const current = bestByLabel.get(label);
      if (!current) {
        bestByLabel.set(label, r);
      } else {
        const da = String(current["lodgement-date"] ?? "");
        const db = String(r["lodgement-date"] ?? "");
        if (db.localeCompare(da) > 0) bestByLabel.set(label, r);
      }
    }

    const addresses = Array.from(bestByLabel.entries())
      .map(([label, r]) => ({
        label,
        lmkKey: cleanText(r["lmk-key"], ""),
        postcode: cleanText(r["postcode"], postcode),
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
    const lmkKey = String(body.lmkKey ?? "").trim();
    const fallbackAddress = String(body.fallbackAddress ?? "").trim();
    console.log("[property-analysis] lmkKey:", lmkKey ? "(present)" : "(missing)");
    if (!lmkKey) return json({ error: "lmkKey required" }, 400);

    // The EPC API doesn't expose a single-certificate GET, so we search by
    // postcode extracted from fallbackAddress and pick the matching lmk-key.
    const postcode = (fallbackAddress.match(
      /\b([A-PR-UWYZ][A-HK-Y]?[0-9][0-9A-HJKPS-UW]?\s*[0-9][ABD-HJLNP-UW-Z]{2})\b/i,
    )?.[1] ?? "").toUpperCase();

    if (!postcode) {
      return json({ status: "not_found", searchedAddress: fallbackAddress });
    }

    let searchResult;
    try {
      searchResult = await searchByPostcode(postcode, token);
    } catch (err) {
      console.error("[property-analysis] cert search fetch failed", err);
      return json({ status: "error", errorCode: "fetch_failed" }, 502);
    }
    const { res, body: rawBody } = searchResult;
    if (!res.ok) {
      return json({ status: "not_found", searchedAddress: fallbackAddress });
    }

    let payload: { rows?: Record<string, unknown>[] } = {};
    try {
      payload = JSON.parse(rawBody);
    } catch {
      return json({ status: "not_found", searchedAddress: fallbackAddress });
    }

    const rows = Array.isArray(payload.rows) ? payload.rows : [];
    const match = rows.find((r) => String(r["lmk-key"] ?? "") === lmkKey);
    if (!match) {
      return json({ status: "not_found", searchedAddress: fallbackAddress });
    }

    const recommendations = await fetchRecommendations(lmkKey, token);
    const data = toIntelligence(match, recommendations, postcode);
    console.log("[property-analysis] returning live EPC certificate");
    return json({ status: "found", data });
  }


  return json({ error: "Unknown action" }, 400);
});
