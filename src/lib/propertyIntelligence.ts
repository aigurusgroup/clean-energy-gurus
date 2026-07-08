// Property Intelligence service.
//
// Calls the `property-analysis` edge function, which securely proxies the
// GOV.UK Energy Performance of Buildings API using the server-side
// EPC_API_BEARER_TOKEN secret. The bearer token is NEVER present in
// front-end code or network traffic from the browser.
//
// Contract is unchanged from the previous mock so no UI code needs to change.

import { supabase } from "@/integrations/supabase/client";

export type EpcRating = "A" | "B" | "C" | "D" | "E" | "F" | "G";

export type PropertyIntelligence = {
  address: {
    line1: string;
    town: string;
    postcode: string;
  };
  currentRating: EpcRating;
  currentScore: number;
  potentialRating: EpcRating;
  potentialScore: number;
  propertyType: string;
  builtForm: string;
  floorAreaSqm: number;
  mainHeating: string;
  recommendedImprovements: string[];
};

export type LookupResult =
  | { status: "found"; data: PropertyIntelligence }
  | { status: "not_found"; searchedAddress: string };

// UK postcode matcher — used to pull a postcode out of a free-text address
// when the user has typed a full address rather than just a postcode.
const UK_POSTCODE =
  /\b([A-PR-UWYZ][A-HK-Y]?[0-9][0-9A-HJKPS-UW]?\s*[0-9][ABD-HJLNP-UW-Z]{2})\b/i;

function extractPostcode(input: string): string | null {
  const m = input.match(UK_POSTCODE);
  return m ? m[1].toUpperCase().replace(/\s+/g, " ").trim() : null;
}

/**
 * Look up property intelligence for a given address / postcode by calling
 * the `property-analysis` edge function.
 */
export async function lookupProperty(
  address: string,
  opts: { minDelayMs?: number } = {},
): Promise<LookupResult> {
  const delay = opts.minDelayMs ?? 0;
  if (delay > 0) {
    await new Promise((r) => setTimeout(r, delay));
  }

  const cleaned = address.trim();
  if (!cleaned) {
    return { status: "not_found", searchedAddress: address };
  }

  const postcode = extractPostcode(cleaned);
  if (!postcode) {
    // No recognisable UK postcode — the EPC API is postcode-indexed so we
    // can't meaningfully look this up. Fall through to the manual flow.
    return { status: "not_found", searchedAddress: cleaned };
  }

  try {
    const { data, error } = await supabase.functions.invoke("property-analysis", {
      body: {
        postcode,
        selectedAddress: cleaned,
      },
    });

    if (error) {
      console.error("property-analysis invoke failed", error);
      return { status: "not_found", searchedAddress: cleaned };
    }

    if (data && data.status === "found" && data.data) {
      return { status: "found", data: data.data as PropertyIntelligence };
    }

    return { status: "not_found", searchedAddress: cleaned };
  } catch (err) {
    console.error("property-analysis call threw", err);
    return { status: "not_found", searchedAddress: cleaned };
  }
}
