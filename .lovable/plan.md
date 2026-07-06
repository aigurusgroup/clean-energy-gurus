## Publish current preview to Lovable URL

Deploy the current preview build to the project's Lovable-hosted URL so all recent changes go live.

### What will go live
- Solar Suitability Map page wording updates
- New legal pages: `/terms`, `/privacy`, `/complaints`, `/quality` (with Clean Energy Gurus Limited, company no. 17191107, registered office in Barnsley)
- Footer updated with legal page links and correct company name
- Partner Network "Become an Installer Partner" CTA linking to `/partners`

### Heads-up before publishing
The legal pages still contain `[REPLACE — …]` placeholders that will appear publicly:
- ICO registration number
- Privacy email, general enquiries email/phone
- Governing law (E&W / Scotland / NI)
- Complaints email, phone, postal address, response SLAs, escalation body
- Data retention periods
- Quality feedback email
- "Last reviewed" dates on each legal page

Publishing now means these placeholder markers will be visible on the live legal pages until replaced.

### Steps
1. Run a security scan and check results for any critical findings.
2. If clear, publish to the Lovable-managed URL (`*.lovable.app`).
3. Confirm the live URL and note that deployment takes ~1 minute to be reachable.
4. Remind you that a custom domain can be connected afterwards from Project settings → Domains, and the Lovable slug can be renamed if desired.

No code, content, or visibility settings will be changed. Visibility stays at its current setting (public by default).
