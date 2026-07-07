## Animate the Energy IQ score gauge on home page load

Add an intro animation to the decorative Energy IQ score gauge in `src/components/site/Hero.tsx` so it comes alive when a visitor lands on the home page. Purely presentational — no changes to scoring logic, routes, or copy.

### What will animate

1. **Gauge ring sweep** — the coloured progress arc draws from 0 up to 74 over ~1.6s using an ease-out curve (animating `stroke-dashoffset`).
2. **Number count-up** — the big `74` counts from 0 → 74 in sync with the ring, using `requestAnimationFrame` (no dependencies).
3. **Tick marks** — fade/scale in with a subtle stagger just after the ring starts.
4. **"Good ✓" pill + subtitle** — fade+rise in once the count-up finishes (existing `animate-fade-in` style, delayed).
5. **Floating label cards** — staggered fade-in-up (top-left → top-right → bottom-left → bottom-right) after the gauge lands.
6. **Soft glow pulse** — one-shot pulse on the gauge's drop-shadow at the end for a "settled" feel.

### Behaviour details

- Runs **once on mount** (page load / route enter), not on every re-render.
- Respects `prefers-reduced-motion`: if reduced motion is set, skip the sweep/count-up and render the final state immediately.
- No scroll trigger needed — the gauge is above the fold.
- No new dependencies; uses `useEffect` + `requestAnimationFrame` + existing Tailwind keyframes (`fade-in`, `fade-in-up`) plus the existing `iq-ring-pulse` keyframe already defined in `src/index.css`.

### Files touched

- `src/components/site/Hero.tsx` — turn `ScoreGauge` into a small stateful component with the animated ring offset and count-up; add staggered animation delays to floating labels.

### Out of scope

- Animating the bottom live stat tiles (Solar / Battery / EV / Tariff).
- Re-triggering the animation on scroll or hover.
- Hooking the gauge to real Energy IQ data.

Nothing will be published.