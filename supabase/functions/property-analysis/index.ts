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

// GOV.UK "get-energy-performance-data" API returns enum codes for
// property_type and built_form. Map to human labels.
const PROPERTY_TYPE_LABELS: Record<string, string> = {
  "0": "House",
  "1": "Bungalow",
  "2": "Flat",
  "3": "Maisonette",
  "4": "Park home",
};
const BUILT_FORM_LABELS: Record<string, string> = {
  "1": "Detached",
  "2": "Semi-Detached",
  "3": "End-Terrace",
  "4": "Mid-Terrace",
  "5": "Enclosed End-Terrace",
  "6": "Enclosed Mid-Terrace",
};

const labelFromEnum = (raw: string, map: Record<string, string>): string => {
  const trimmed = raw.trim();
  if (!trimmed) return "";
  if (map[trimmed]) return map[trimmed];
  // Some payloads may already contain the label — return as-is.
  return trimmed;
};

// main_heating on this API is an object such as
//   { description: "Boiler and radiators, mains gas", fuel: "mains gas", ... }
// but the exact key set varies, so fall back to any string field.
const extractHeating = (v: unknown): string => {
  if (v == null) return "";
  if (typeof v === "string") return v.trim();
  if (typeof v === "object") {
    const o = v as Record<string, unknown>;
    for (const k of [
      "description", "desc", "type", "name",
      "system_description", "systemDescription", "fuel",
      "main_heating_description", "mainHeatingDescription",
    ]) {
      const s = o[k];
      if (typeof s === "string" && s.trim().length) return s.trim();
    }
    // Last-resort: return the first string value in the object.
    for (const val of Object.values(o)) {
      if (typeof val === "string" && val.trim().length) return val.trim();
    }
  }
  return "";
};

function toIntelligence(
  match: Record<string, unknown>,
  cert: Record<string, unknown> | null,
  postcodeFallback: string,
): PropertyIntelligence {
  // Try cert first (camelCase + snake_case), then fall back to search row.
  const c = cert ?? {};
  const line1 =
    pick(c, ["addressLine1", "address_line_1", "address1", "address"], "") ||
    pick(match, ["addressLine1", "address1", "address"], "");
  const town =
    pick(c, ["postTown", "post_town", "town"], "") ||
    pick(match, ["postTown", "town"], "");
  const postcode =
    pick(c, ["postcode"], "") || pick(match, ["postcode"], postcodeFallback);

  const currentBand =
    pick(c, ["currentEnergyRating", "currentEnergyEfficiencyBand", "current_energy_rating", "current_energy_efficiency_band"], "") ||
    pick(match, ["currentEnergyRating", "currentEnergyEfficiencyBand"], "");
  const potentialBand =
    pick(c, ["potentialEnergyRating", "potentialEnergyEfficiencyBand", "potential_energy_rating", "potential_energy_efficiency_band"], "") ||
    pick(match, ["potentialEnergyRating", "potentialEnergyEfficiencyBand"], "");
  // On this API, the numeric score lives in `energy_rating_current` /
  // `energy_rating_potential`. Older EPC APIs called it
  // `current_energy_efficiency`.
  const currentScore =
    pick(c, ["energy_rating_current", "currentEnergyEfficiency", "current_energy_efficiency"], "") ||
    pick(match, ["currentEnergyEfficiency", "energyRatingCurrent"], "");
  const potentialScore =
    pick(c, ["energy_rating_potential", "potentialEnergyEfficiency", "potential_energy_efficiency"], "") ||
    pick(match, ["potentialEnergyEfficiency", "energyRatingPotential"], "");

  const propertyTypeRaw =
    pick(c, ["propertyType", "property_type"], "") ||
    pick(match, ["propertyType"], "");
  const builtFormRaw =
    pick(c, ["builtForm", "built_form"], "") ||
    pick(match, ["builtForm"], "");
  const floorArea =
    pick(c, ["totalFloorArea", "total_floor_area"], "") ||
    pick(match, ["totalFloorArea"], "");
  const mainHeating =
    extractHeating(c["main_heating"]) ||
    extractHeating(c["mainHeating"]) ||
    extractHeating(c["sap_heating"]) ||
    pick(c, [
      "mainheatDescription", "mainHeatingDescription",
      "mainheat_description", "main_heating_description",
      "mainheatDesc", "mainheat_desc",
    ], "") ||
    pick(match, ["mainheatDescription", "mainHeatingDescription"], "");

  const suggestions = cert && Array.isArray(cert["suggested_improvements"])
    ? cert["suggested_improvements"] as unknown[]
    : cert && Array.isArray(cert["recommendations"])
      ? cert["recommendations"] as unknown[]
      : [];
  const recs = suggestions
    .map((r) => {
      if (typeof r === "string") return r.trim();
      if (r && typeof r === "object") {
        return pick(r as Record<string, unknown>, [
          "description", "improvementDescrText", "improvementSummaryText",
          "improvement", "improvement_descr_text", "improvement_summary_text",
        ], "");
      }
      return "";
    })
    .filter((s) => s.length)
    .slice(0, 6);

  const cScoreN = Number(currentScore);
  const pScoreN = Number(potentialScore);
  const fArea = Number(floorArea);

  return {
    address: {
      line1: line1 || "Address on file",
      town,
      postcode: postcode.toUpperCase().replace(/\s+/g, " "),
    },
    currentRating: normaliseRating(currentBand),
    currentScore: Number.isFinite(cScoreN) && cScoreN > 0 ? Math.round(cScoreN) : 0,
    potentialRating: normaliseRating(potentialBand),
    potentialScore: Number.isFinite(pScoreN) && pScoreN > 0 ? Math.round(pScoreN) : 0,
    propertyType: labelFromEnum(propertyTypeRaw, PROPERTY_TYPE_LABELS) || "Not available",
    builtForm: labelFromEnum(builtFormRaw, BUILT_FORM_LABELS) || "Not available",
    floorAreaSqm: Number.isFinite(fArea) && fArea > 0 ? Math.round(fArea) : 0,
    mainHeating: mainHeating.trim().length ? mainHeating.trim() : "Not available",
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

    const fieldNames = Object.keys(certObj);
    console.log("[property-analysis] certificate field names:", fieldNames.join(","));
    const debugWithFields = { ...debug, certificateFieldNames: fieldNames };

    const intel = toIntelligence({}, certObj, postcodeFromAddr);
    console.log("[property-analysis] returning live EPC certificate");
    return json({ status: "found", data: intel, debug: debugWithFields });
  }

  return json({ error: "Unknown action" }, 400);
});
