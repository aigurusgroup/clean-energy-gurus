## Rebuild the home hero to match the reference

Restructure the existing `src/components/site/Hero.tsx` into the two-column layout shown in the reference, while keeping current copy, routes, CTAs, and the four live tiles. Nothing will be published.

### New layout (desktop)

```text
┌─────────────────────────────────────────────────────────────┐
│ • UK MANAGED ENERGY PLATFORM                                │
│                                ┌─ Save Money ─┐ ┌─ Gain Control ─┐
│ Lower costs.                   └────────┐   └────────┘
│ Greater control.                        ▼       ▼
│ More energy confidence.            ╭───────────────╮
│                                    │ ENERGY IQ®    │
│ We help UK homeowners…             │    SCORE      │
│                                    │      74       │
│ [ Get Your Energy IQ → ]           │    Good ✓     │
│ [ Estimate My Solar   ]            │  better than  │
│                                    │  74% similar  │
│ Solar PV, battery storage…         ╰───────────────╯
│                                ┌ Increase Value ┐ ┌ Future-Proof ┐
│                                └────────────────┘ └──────────────┘
├─────────────────────────────────────────────────────────────┤
│ [LIVE 14.2kW] [BATTERY 86%] [EV 3] [TARIFF 6h window]        │
└─────────────────────────────────────────────────────────────┘
```

Mobile: single column — text and CTAs first, gauge second, live tiles last.

### Elements to build

1. **Left column** — keep existing eyebrow, headline (gradient on last line), sub-copy, two CTA buttons (`/energy-iq`, `/solar-calculator`), and the sub-note with a small shield icon.
2. **Right column — Energy IQ score gauge (decorative only)**
   - SVG circular gauge using the existing electric→blue gradient.
   - Center: `ENERGY IQ® SCORE`, big `74`, green `Good ✓`, sub-line "You're performing better than 74% of similar properties".
   - No interaction, no scoring logic changes.
3. **Four floating label cards** around the gauge (Save Money, Gain Control, Increase Value, Future-Proof) with small circular icons and thin connector lines. Icons: `PoundSterling`, `SlidersHorizontal`, `Home`, `Leaf` from `lucide-react`.
4. **Bottom stat row** — reuse the four existing tiles (Live / Battery / EV / Tariff) but add icons (`SunMedium`, `BatteryCharging`, `Car`, `Clock`) and a large tinted value line as in the mock.
5. **Background** — keep existing grid + arc glow, softened so the gauge stays legible.

### What will NOT change

- Header, footer, routes, navigation, tokens, Energy IQ questionnaire, scoring logic, other pages.
- CTA destinations and copy stay as-is.
- No new dependencies; all icons already in `lucide-react`.
- Uses existing semantic tokens (`text-navy`, `bg-gradient-electric`, `card-premium`, `text-electric`). No hardcoded colours.

### Files touched

- `src/components/site/Hero.tsx` — full refactor of layout, add gauge SVG, floating label cards, iconised tiles.

### Responsive behaviour

- `lg`: two columns, gauge ~520px.
- `md`: single column, gauge ~380px.
- `sm`: floating labels stack tightly; connector lines hidden to prevent overlap; live tiles remain 2×2.

### Out of scope (ask before doing)

- Making the gauge dynamic from real Energy IQ data.
- Adding a pylon photograph.
- Restyling the header/logo.

Nothing will be published as part of this change.
