// GoHighLevel contact sync for Energy IQ assessments.
// Runs after an assessment row is written; upserts a contact and populates
// four Energy IQ custom fields. Never exposes secrets to the browser.

import { createClient } from "npm:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const GHL_BASE = "https://services.leadconnectorhq.com";
const GHL_VERSION = "2021-07-28";

const CUSTOM_FIELD_NAMES = {
  score: "Energy IQ Score",
  band: "Energy IQ Band",
  reference: "Assessment Reference",
  date: "Assessment Date",
  roof: "Roof / Land Suitability",
  annualKwh: "Annual Electricity Usage (kWh)",
  spendEstimate: "Estimated Electricity Spend",
  solar: "Existing Solar PV",
  battery: "Existing Battery Storage",
  ev: "EV Charging Position",
  monitoring: "Energy Monitoring Status",
  goal: "Main Energy Goal",
  timeline: "Timeline for Making Changes",
  marketing: "Marketing Consent",
  privacy: "Privacy & Assessment Consent",
} as const;

// Value → human label maps for each questionnaire answer we sync.
// Keep in step with src/pages/EnergyIQ.tsx question definitions.
const LABELS: Record<string, Record<string, string>> = {
  spaceSuitability: {
    plenty: "Yes — plenty of suitable space",
    some: "Some — likely workable",
    limited: "Limited space",
    unsure: "Not sure",
  },
  billBand: {
    low: "Under £100/month (typically under 3,000 kWh/year)",
    mid: "£100–£250/month (typically 3,000–6,000 kWh/year)",
    high: "£250–£800/month (typically 6,000–15,000 kWh/year)",
    vhigh: "Over £800/month (typically 15,000+ kWh/year)",
  },
  solar: { yes: "Yes", no: "No", planning: "Planning / quoted" },
  battery: { yes: "Yes", no: "No", considering: "Considering it" },
  ev: {
    have: "Already have a charger installed",
    need: "Need one / planning EV soon",
    none: "No EV planned",
  },
  monitoring: {
    active: "Yes — actively monitored and optimised",
    basic: "Basic app / occasional check",
    interested: "Not yet, but interested",
    no: "No — I don't have visibility",
  },
  goal: {
    cost: "Lower costs",
    independence: "Greater independence",
    ev: "EV charging",
    resilience: "Resilience / backup power",
    sustainability: "Sustainability",
    improvement: "Property improvement / asset value",
  },
  timeline: {
    now: "Ready now — within 3 months",
    soon: "3–6 months",
    year: "6–12 months",
    explore: "Just exploring",
  },
};

function labelFor(field: string, value: unknown): string | null {
  if (value == null || value === "") return null;
  const map = LABELS[field];
  if (!map) return String(value);
  return map[String(value)] ?? String(value);
}

type SyncBody = {
  assessment_id: string;
  first_name: string;
  last_name: string;
  email: string;
  telephone: string;
  full_address?: string | null;
  postcode?: string | null;
  energy_iq_score: number;
  energy_iq_band: string;
  completed_at: string;
  answers?: Record<string, unknown> | null;
  marketing_consent?: boolean | null;
  privacy_consent?: boolean | null;
};

function json(status: number, body: unknown) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

async function ghlFetch(
  token: string,
  path: string,
  init: RequestInit = {},
): Promise<Response> {
  const headers = new Headers(init.headers);
  headers.set("Authorization", `Bearer ${token}`);
  headers.set("Version", GHL_VERSION);
  headers.set("Accept", "application/json");
  if (init.body && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }
  return fetch(`${GHL_BASE}${path}`, { ...init, headers });
}

async function fetchCustomFieldIdMap(
  token: string,
  locationId: string,
): Promise<Record<string, string>> {
  const res = await ghlFetch(
    token,
    `/locations/${locationId}/customFields?model=contact`,
  );
  const text = await res.text();
  if (!res.ok) {
    throw new Error(`customFields fetch ${res.status}: ${text.slice(0, 500)}`);
  }
  let parsed: { customFields?: Array<{ id: string; name: string }> };
  try {
    parsed = JSON.parse(text);
  } catch {
    throw new Error(`customFields non-JSON: ${text.slice(0, 200)}`);
  }
  const map: Record<string, string> = {};
  for (const f of parsed.customFields ?? []) {
    map[f.name.trim().toLowerCase()] = f.id;
  }
  return map;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  if (req.method !== "POST") return json(405, { error: "Method not allowed" });

  const token = Deno.env.get("GHL_PRIVATE_INTEGRATION_TOKEN");
  const locationId = Deno.env.get("GHL_LOCATION_ID");
  const supabaseUrl = Deno.env.get("SUPABASE_URL");
  const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

  const missingSecrets: string[] = [];
  if (!token) missingSecrets.push("GHL_PRIVATE_INTEGRATION_TOKEN");
  if (!locationId) missingSecrets.push("GHL_LOCATION_ID");
  console.log("GHL secrets check", {
    hasToken: !!token,
    hasLocationId: !!locationId,
    missing: missingSecrets,
  });
  if (missingSecrets.length > 0) {
    return json(500, {
      error: "GHL credentials not configured",
      missing: missingSecrets,
    });
  }
  if (!supabaseUrl || !serviceKey) {
    return json(500, { error: "Supabase service credentials not configured" });
  }

  let body: SyncBody;
  try {
    body = (await req.json()) as SyncBody;
  } catch {
    return json(400, { error: "Invalid JSON body" });
  }
  if (!body?.assessment_id || !body?.email) {
    return json(400, { error: "assessment_id and email required" });
  }

  const supabase = createClient(supabaseUrl, serviceKey);

  const recordFailure = async (reason: string) => {
    await supabase
      .from("energy_iq_assessments")
      .update({ ghl_sync_status: "failed", ghl_sync_error: reason.slice(0, 500) })
      .eq("assessment_id", body.assessment_id);
  };

  try {
    // 1. Look up custom field IDs by name (do NOT hardcode).
    const fieldMap = await fetchCustomFieldIdMap(token, locationId);
    const customFields: Array<{ id: string; field_value: string | number | string[] }> = [];
    const missingFields: string[] = [];
    const fieldErrors: Array<{ field: string; reason: string }> = [];
    const addField = (
      name: string,
      value: string | number | string[] | null | undefined,
    ) => {
      try {
        if (value === null || value === undefined || value === "") return;
        if (Array.isArray(value) && value.length === 0) return;
        const id = fieldMap[name.trim().toLowerCase()];
        if (id) customFields.push({ id, field_value: value });
        else missingFields.push(name);
      } catch (e) {
        fieldErrors.push({
          field: name,
          reason: e instanceof Error ? e.message : String(e),
        });
      }
    };
    addField(CUSTOM_FIELD_NAMES.score, body.energy_iq_score);
    addField(CUSTOM_FIELD_NAMES.band, body.energy_iq_band);
    addField(CUSTOM_FIELD_NAMES.reference, body.assessment_id);
    addField(CUSTOM_FIELD_NAMES.date, body.completed_at);

    // Questionnaire answers → contact custom fields.
    const a = (body.answers ?? {}) as Record<string, unknown>;
    addField(CUSTOM_FIELD_NAMES.roof, labelFor("spaceSuitability", a.spaceSuitability));

    // Annual kWh: prefer the customer's entered number; otherwise leave blank.
    const rawKwh = a.annualKwh;
    const kwhNum =
      typeof rawKwh === "number"
        ? rawKwh
        : typeof rawKwh === "string" && rawKwh.trim() !== "" && !Number.isNaN(Number(rawKwh))
          ? Number(rawKwh)
          : null;
    if (kwhNum !== null && kwhNum > 0) {
      addField(CUSTOM_FIELD_NAMES.annualKwh, kwhNum);
    } else {
      // Only populate the estimate field when no actual kWh was entered.
      addField(CUSTOM_FIELD_NAMES.spendEstimate, labelFor("billBand", a.billBand));
    }

    addField(CUSTOM_FIELD_NAMES.solar, labelFor("solar", a.solar));
    addField(CUSTOM_FIELD_NAMES.battery, labelFor("battery", a.battery));
    addField(CUSTOM_FIELD_NAMES.ev, labelFor("ev", a.ev));
    addField(CUSTOM_FIELD_NAMES.monitoring, labelFor("monitoring", a.monitoring));
    addField(CUSTOM_FIELD_NAMES.goal, labelFor("goal", a.goal));
    addField(CUSTOM_FIELD_NAMES.timeline, labelFor("timeline", a.timeline));

    // Consents — sent as array for checkbox-style fields; GHL also accepts these on text fields.
    if (body.marketing_consent === true) addField(CUSTOM_FIELD_NAMES.marketing, ["Yes"]);
    else if (body.marketing_consent === false) addField(CUSTOM_FIELD_NAMES.marketing, ["No"]);
    if (body.privacy_consent === true) addField(CUSTOM_FIELD_NAMES.privacy, ["Yes"]);
    else if (body.privacy_consent === false) addField(CUSTOM_FIELD_NAMES.privacy, ["No"]);


    // 2. Upsert contact by email.
    const upsertBody: Record<string, unknown> = {
      locationId,
      firstName: body.first_name,
      lastName: body.last_name,
      email: body.email,
      phone: body.telephone,
      address1: body.full_address ?? undefined,
      postalCode: body.postcode ?? undefined,
      customFields,
    };

    const upsertRes = await ghlFetch(token, "/contacts/upsert", {
      method: "POST",
      body: JSON.stringify(upsertBody),
    });
    const upsertText = await upsertRes.text();
    if (!upsertRes.ok) {
      await recordFailure(`upsert ${upsertRes.status}: ${upsertText.slice(0, 300)}`);
      return json(upsertRes.status, {
        error: "GHL upsert failed",
        status: upsertRes.status,
        details: upsertText.slice(0, 300),
      });
    }
    const upsertJson = JSON.parse(upsertText) as {
      contact?: { id: string };
      new?: boolean;
    };
    const contactId = upsertJson.contact?.id;
    if (!contactId) {
      await recordFailure("upsert returned no contact id");
      return json(502, { error: "GHL upsert returned no contact id" });
    }

    // 3. Record success in the assessment row.
    await supabase
      .from("energy_iq_assessments")
      .update({
        ghl_sync_status: "synced",
        ghl_contact_id: contactId,
        ghl_sync_error: null,
      })
      .eq("assessment_id", body.assessment_id);

    return json(200, {
      ok: true,
      contact_id: contactId,
      is_new: upsertJson.new === true,
      custom_fields_updated: customFields.length,
      missing_custom_fields: missingFields,
    });
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    await recordFailure(msg);
    return json(500, { error: "GHL sync failed", details: msg.slice(0, 300) });
  }
});
