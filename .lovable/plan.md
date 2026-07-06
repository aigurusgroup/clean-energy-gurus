# Fix white box around header logo on scroll

## Problem
The Clean Energy Gurus logo (`src/assets/logo.png`) is a PNG with a solid white background baked in. The sticky header (`SiteHeader.tsx`) uses a semi-transparent, blurred background that changes on scroll — so the logo's white rectangle becomes visible as a "white box" against the translucent header.

## Fix
Generate a transparent-background version of the existing logo (no re-upload required from you) and swap it in.

1. Run `imagegen--edit_image` on `src/assets/logo.png` with `transparent_background: true` to produce `src/assets/logo.png` (PNG with alpha, same artwork, no white fill).
2. Verify `SiteHeader.tsx` still imports `@/assets/logo.png` — no code change needed if the filename stays the same. The existing `object-contain` sizing continues to work.
3. Check the footer (`SiteFooter.tsx`) and any other place the logo is used to confirm the transparent version still reads correctly on light backgrounds (dark navy wordmark stays legible on white; only the surrounding rectangle changes).
4. Visually verify at the top of the page and after scrolling on desktop and mobile via Playwright screenshots.

## Out of scope
- No changes to header layout, sizing, nav, or scroll behaviour.
- No new asset upload from you.
- No changes to any other image.
