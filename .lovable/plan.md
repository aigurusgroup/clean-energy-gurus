## Goal

Rebuild the `SolarCalculator` as a guided, step-by-step wizard inspired by path.energy, replacing the current single-panel layout. The map shows a default UK location immediately (no "unavailable" overlay), and the user is led through small, focused steps to the savings result.

## Flow

```text
Step 1  Postcode     → map centred on UK by default, search input with
                       Google Places autocomplete dropdown of addresses.
Step 2  Draw roof    → satellite map zoomed to chosen address; user
                       outlines roof; "Calculate" button enables once drawn.
Step 3  Customer     → Business / Farm / Landlord / Home (skipped on
                       segment-specific pages — pre-selected).
Step 4  Roof type    → Pitched / Flat / Other.
Step 5  Building     → Warehouse, Factory, Office, Retail, Hospitality,
                       Accommodation, Ground mounted, Other  (business/farm/
                       landlord). Home shows: Detached, Semi, Terrace,
                       Bungalow, Flat, Other.
Step 6  Results      → £/yr saving headline, system kWp, kWh/yr, payback,
                       CO₂. Two CTAs:
                         • "Email me a copy"  (captures email, sends via
                           contact form / Lovable Cloud function later)
                         • "Book a free energy review" (links to /contact
                           with prefilled query params).
```

A slim progress bar ("Step N of 6") sits at the top of the active card.

## Component changes

- Rewrite `src/components/site/SolarCalculator.tsx`:
  - Internal `step` state (1–6) with forward / back buttons.
  - Map mounts on Step 1; default centre `{ lat: 54.5, lng: -2.5 }`, zoom 6, satellite. No more "Map unavailable" overlay covering the map — only show a small inline error toast/banner if the API key is missing or load fails.
  - Use Google Places Autocomplete in **dropdown** mode (the existing `places.Autocomplete` already renders a dropdown of addresses below the input — keep, but style and ensure it's visible above the map). On selection, advance to Step 2 and recentre the map.
  - Step 2 keeps the current drawing manager; "Next" enabled once `areaM2 > 5`.
  - Steps 3–5 are simple card-grid pickers (icon + label), matching the look in the screenshots (rounded white cards, electric/teal icon).
  - Step 6 is the results card: large £ savings figure on the left, spec breakdown on the right, plus the two CTAs. Email field uses zod validation (trim, email, max 255).
  - Keep all existing calculation logic, segment defaults, roof yield table; just feed inputs from the new step state.
  - Preserve the `segment` and `selectable` props. When `selectable=false` (segment pages), Step 3 is skipped.

- `src/lib/loadGoogleMaps.ts`: no change needed.

- Pages (`Index.tsx`, `Business.tsx`, `Farms.tsx`, `Landlords.tsx`, `Homes.tsx`): no API change, still embed `<SolarCalculator segment=... selectable? />`.

## Email capture

For now, "Email me a copy" opens a small inline form (name + email) and POSTs to the existing `ReviewForm` handler (or simply records to `localStorage` + shows a toast: "We'll send your estimate to {email}"). A follow-up task can wire it to a Lovable Cloud edge function for real email sending — flagged in the closing sentence so the user can opt in.

## Design notes

- Use existing semantic tokens (`bg-navy`, `text-electric`, `bg-gradient-electric`, `card-premium`, `rounded-3xl`, `shadow-glow`).
- Step cards: white background, `border border-border`, large rounded corners, hover `border-electric/40`, selected `border-electric bg-electric/5`.
- Progress bar: 6 short pills, completed = `bg-navy`, current = `bg-electric`, upcoming = `bg-muted`.
- Results headline mirrors the screenshot: oversized display number ("£3k / per year") on a navy panel with subtle electric glow.

## Out of scope (this round)

- Real transactional email sending (needs Lovable Cloud + Resend). Will offer to wire up afterwards.
- Persisting leads to a database.
- Address-level energy data lookup (path.energy uses MPAN data; we'll keep it estimate-only).
