// Property Intelligence service.
//
// DEV-ONLY MOCK: returns hard-coded property data with a short delay so the
// intake UX can be built and tested end-to-end. The real implementation will
// replace `lookupProperty` with a secure backend call (EPC-backed data
// service). The PropertyIntelligence shape and the async contract must NOT
// change — the front-end consumes only this module.

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

// Mock dataset. When a real service is wired in, this file is the only place
// that changes — the return type stays identical.
const MOCK_PROPERTY: PropertyIntelligence = {
  address: {
    line1: "1 Example Road",
    town: "Arundel",
    postcode: "BN18 9AA",
  },
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

export type LookupResult =
  | { status: "found"; data: PropertyIntelligence }
  | { status: "not_found"; searchedAddress: string };

/**
 * Look up premium property intelligence for a given address / postcode.
 *
 * The current implementation returns mock data after a short delay.
 * A future backend implementation must preserve this async contract.
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
  // Dev toggle: any address containing "nodata" simulates a miss so the
  // "Property Information Limited" state can be exercised.
  if (/nodata/i.test(cleaned)) {
    return { status: "not_found", searchedAddress: cleaned };
  }
  return {
    status: "found",
    data: {
      ...MOCK_PROPERTY,
      address: {
        ...MOCK_PROPERTY.address,
        // Reflect whatever the user typed as the "line 1" so the confirmation
        // feels tied to their input, while keeping the mocked town/postcode.
        line1: cleaned.split(",")[0]?.trim() || MOCK_PROPERTY.address.line1,
      },
    },
  };
}
