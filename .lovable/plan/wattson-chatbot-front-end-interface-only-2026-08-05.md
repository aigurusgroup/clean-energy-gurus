# Wattson chatbot — front-end interface only

Add a branded floating chat widget called "Wattson" to every page. UI only: no AI backend, no changes to Energy IQ, routing, or existing page design.

## What the visitor sees

**Floating button (bottom-right, all pages)**
- Pill-shaped button: circular Wattson avatar + label "Ask Wattson".
- Brand styling: electric gradient accent, soft glow/elegant shadow, rounded-full, subtle hover lift.
- Mobile: collapses to a compact circular avatar button (label hidden) so it never crowds the screen.
- Safe-area aware spacing so it sits above mobile browser chrome.

**Chat window (opens on click)**
- Desktop: compact panel anchored bottom-right (~380px wide, ~560px tall, capped to viewport).
- Mobile: near-full-screen sheet with a close control.
- Header: Wattson avatar, name "Wattson", subtitle "Your Clean Energy Guide", close button.
- Opening message from Wattson, exactly as specified (greeting, role, what he can help with, "What can I help you understand?").
- Four suggested-question chips below the opening message:
  - Is solar right for my home?
  - How does battery storage work?
  - What is Energy IQ?
  - I'm not sure where to start
- Message list styled for two roles: Wattson messages on the light surface with avatar, visitor messages as a filled brand bubble aligned right.
- Composer at the bottom: text input with placeholder "Ask Wattson a question…" plus a send icon button.

**Interim behaviour (no AI yet)**
- Clicking a suggestion or sending text adds the visitor's message to the transcript and shows a short placeholder Wattson reply noting he's still being connected. This keeps the interface demonstrable and is a single function to swap for the real backend later.

## Wattson avatar

No Wattson image exists in the project assets. I'll generate a clean placeholder mascot avatar (friendly energy-spark character in brand navy/electric colours, transparent PNG) saved to `src/assets/wattson-avatar.png`, imported in one place so you can replace that single file with the real Wattson artwork later.

## Technical notes

- New components: `src/components/site/WattsonChat.tsx` (button + window + message state) and small internal subcomponents if the file grows.
- Mounted once in `src/components/site/SiteLayout.tsx` so it appears on every page using the shared layout.
- Uses existing semantic tokens only (`navy`, `electric`, `surface`, `muted`, `border`, `bg-gradient-electric`, `shadow-elegant`, `shadow-glow`) and existing shadcn `Button` / `Input`; no hardcoded colours.
- Animations reuse existing keyframes (`fade-in`, `scale-in`) and respect reduced-motion.
- Accessibility: `aria-label` on the toggle, focus moves to the input on open, Escape closes, `aria-live` region for new messages.
- Nothing is published.
