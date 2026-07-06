# Add Terms, Privacy, Complaints and Quality pages + footer links

## Scope
Add four new public routes and surface them in the site footer. Content will be **clearly labelled draft placeholder templates** — sensible UK-style scaffolding with `[REPLACE]` markers for company-specific facts (company number, ICO reg, ombudsman body, SLA numbers) so nothing invented is presented as fact. A visible banner at the top of each page states the copy is a draft pending review by the app owner and should not be treated as legal advice.

## New pages (all under `src/pages/legal/`)
Each uses `SiteLayout` + `PageHero` to match the existing design system — no new tokens, palette, or components introduced.

1. `Terms.tsx` → route `/terms`
   Sections: intro, use of website, services & installation partners, quotations & pricing, cancellations, warranties (installer-provided), limitation of liability, governing law, contact. `[REPLACE]` markers on company registration line and jurisdiction confirmation.

2. `Privacy.tsx` → route `/privacy`
   Sections: who we are + `[ICO registration number REPLACE]`, what data we collect (Energy IQ questionnaire answers, Solar Map postcode/roof outline, contact form fields), lawful bases, how we use it, sharing with installer partners, cookies & analytics (states only what the app actually loads — Google Maps for Solar Map), retention, your rights, contact & complaints route to ICO.

3. `Complaints.tsx` → route `/complaints`
   Sections: how to raise a complaint (email/phone `[REPLACE]`), what to include, acknowledgement window `[REPLACE — e.g. 5 working days]`, resolution window `[REPLACE — e.g. 8 weeks]`, escalation route `[REPLACE — e.g. RECC / Energy Ombudsman / TrustMark]`, records.

4. `Quality.tsx` → route `/quality`
   Sections: quality commitment, accredited partner model (MCS, OZEV, DNO wording already used elsewhere on the site), site survey & design, installation standards, aftercare & monitoring, continuous improvement, feedback channel.

Each page:
- App-owner qualifier: "This page is maintained by Clean Energy Gurus Ltd to describe our current practices for [App Name]."
- Shared-responsibility note where relevant (installations delivered through accredited partners — mirrors existing footer wording).
- No certification-style claims, no "Verified by Lovable", no absolute compliance claims (GDPR/ISO/SOC 2), no guarantees about payback, savings, breach-free operation.

## Router wiring
Register the four routes in `src/App.tsx` alongside existing routes with lazy or direct imports matching current convention.

## Footer changes (`src/components/site/SiteFooter.tsx`)
- Remove the current "Terms, Privacy, Complaints and Quality Policy pages coming soon." line in the bottom bar.
- Add a compact horizontal legal link row in that same bottom bar: Terms · Privacy · Complaints · Quality — same muted styling as the copyright line, no layout/palette changes.

## Out of scope
- No changes to navigation, homepage, service pages, Energy IQ, Solar Map, About, Knowledge Centre, or any other page.
- No new dependencies.
- No cookie banner, consent manager, or analytics changes.
- Nothing published.

## Confirmation after build
- Files created, route paths, footer diff, and the fact that every legal claim on the four pages is either scaffolding text or a `[REPLACE]` marker for the owner to fill in before going live.
