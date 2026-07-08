// Property Intelligence service.
//
// Calls the `property-analysis` edge function, which securely proxies the
// GOV.UK Energy Performance of Buildings API using the server-side
// EPC_API_BEARER_TOKEN secret. The bearer token is NEVER present in
// front-end code or network traffic from the browser.

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

export type AddressCandidate = {
  label: string;
  lmkKey: string;
  postcode: string;
};

export type AddressSearchResult =
  | { status: "ok"; addresses: AddressCandidate[]; source: "live" }
  | { status: "empty"; searchedPostcode: string; source: "live" }
  | {
      status: "fallback";
      addresses: AddressCandidate[];
      devMessage: string;
      source: "mock";
    };

export type LookupResult =
  | { status: "found"; data: PropertyIntelligence; source: "live" | "mock" }
  | { status: "not_found"; searchedAddress: string };

// -------- Mock fallbacks (DEV ONLY) --------

const DEV_MESSAGE = "Live EPC API unavailable — using test data.";

export function mockAddressesForPostcode(postcode: string): AddressCandidate[] {
  const town = postcode.startsWith("BN18") ? "Arundel" : "Your Town";
  return [
    { label: `1 Example Road, ${town}, ${postcode}`, lmkKey: "MOCK-1", postcode },
    { label: `2 Example Road, ${town}, ${postcode}`, lmkKey: "MOCK-2", postcode },
    { label: `3 Example Road, ${town}, ${postcode}`, lmkKey: "MOCK-3", postcode },
  ];
}

export function mockPropertyFor(address: string, postcode: string): PropertyIntelligence {
  const line1 = address.split(",")[0]?.trim() || "1 Example Road";
  const town = address.split(",")[1]?.trim() || "Arundel";
  return {
    address: { line1, town, postcode },
    currentRating: "C",
    currentScore: 71,
    potentialRating: "B",
    potentialScore: 82,
    propertyType: "Detached House",
    builtForm: "Detached",
    floorAreaSqm: 148,
    mainHeating: "Gas Boiler",
    recommendedImprovements: [
      "Solar PV",
      "Battery Storage",
      "Loft Insulation",
      "Smart Tariff Review",
    ],
  };
}

// -------- Live calls --------

export async function searchAddresses(postcode: string): Promise<AddressSearchResult> {
  const pc = postcode.trim().toUpperCase();
  try {
    console.debug("[propertyIntelligence] searchAddresses", pc);
    const { data, error } = await supabase.functions.invoke("property-analysis", {
      body: { action: "search", postcode: pc },
    });
    if (error) {
      console.error("[propertyIntelligence] search invoke error", error);
      return {
        status: "fallback",
        addresses: mockAddressesForPostcode(pc),
        devMessage: `${DEV_MESSAGE} (invoke error: ${error.message ?? "unknown"})`,
        source: "mock",
      };
    }
    console.debug("[propertyIntelligence] search response", data);
    if ((data as any)?.debug) {
      console.info("[propertyIntelligence] EPC API debug", (data as any).debug);
    }

    if (data?.status === "ok" && Array.isArray(data.addresses)) {
      return { status: "ok", addresses: data.addresses as AddressCandidate[], source: "live" };
    }
    if (data?.status === "empty") {
      // If server included a devMessage (e.g. "0 rows"), surface it via fallback
      if ((data as any).devMessage) {
        return {
          status: "fallback",
          addresses: mockAddressesForPostcode(pc),
          devMessage: (data as any).devMessage,
          source: "mock",
        };
      }
      return { status: "empty", searchedPostcode: pc, source: "live" };
    }
    return {
      status: "fallback",
      addresses: mockAddressesForPostcode(pc),
      devMessage: (data as any)?.devMessage ?? DEV_MESSAGE,
      source: "mock",
    };
  } catch (err) {
    console.error("[propertyIntelligence] search threw", err);
    return {
      status: "fallback",
      addresses: mockAddressesForPostcode(pc),
      devMessage: `${DEV_MESSAGE} (threw: ${String(err)})`,
      source: "mock",
    };
  }
}


export async function fetchPropertyByAddress(
  candidate: AddressCandidate,
): Promise<LookupResult & { devMessage?: string }> {
  // Mock candidates never round-trip to the API.
  if (candidate.lmkKey.startsWith("MOCK-")) {
    return {
      status: "found",
      data: mockPropertyFor(candidate.label, candidate.postcode),
      source: "mock",
    };
  }

  try {
    console.debug("[propertyIntelligence] fetchPropertyByAddress", candidate);
    const { data, error } = await supabase.functions.invoke("property-analysis", {
      body: {
        action: "certificate",
        lmkKey: candidate.lmkKey,
        fallbackAddress: candidate.label,
      },
    });
    if (error) {
      console.error("[propertyIntelligence] cert invoke error", error);
      return {
        status: "found",
        data: mockPropertyFor(candidate.label, candidate.postcode),
        source: "mock",
        devMessage: DEV_MESSAGE,
      };
    }
    console.debug("[propertyIntelligence] cert response", data);

    if (data?.status === "found" && data.data) {
      return { status: "found", data: data.data as PropertyIntelligence, source: "live" };
    }
    if (data?.status === "not_found") {
      return { status: "not_found", searchedAddress: candidate.label };
    }
    return {
      status: "found",
      data: mockPropertyFor(candidate.label, candidate.postcode),
      source: "mock",
      devMessage: (data as any)?.devMessage ?? DEV_MESSAGE,
    };
  } catch (err) {
    console.error("[propertyIntelligence] cert threw", err);
    return {
      status: "found",
      data: mockPropertyFor(candidate.label, candidate.postcode),
      source: "mock",
      devMessage: DEV_MESSAGE,
    };
  }
}
