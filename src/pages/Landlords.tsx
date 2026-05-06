import { SimplePage } from "@/components/site/SimplePage";
import segLandlord from "@/assets/segment-landlord.jpg";

export default () => (
  <SimplePage
    metaTitle="Landlord Energy Upgrades | Clean Energy Gurus"
    metaDesc="Upgrade portfolios with solar, batteries and EV charging. Improve EPC ratings, attract better tenants and protect asset values."
    eyebrow="For Landlords"
    heroTitle={<>Portfolio-wide <span className="text-gradient">energy upgrades</span>.</>}
    lead="Improve EPC ratings, futureproof against MEES legislation and turn rental properties into desirable, energy-efficient assets."
    image={segLandlord}
    bullets={[
      "EPC-improving solar and efficiency upgrades",
      "Tenant-friendly battery and EV charging options",
      "Roll-out planning across multi-property portfolios",
      "Compliance with MEES and forthcoming standards",
      "Per-property reporting and asset documentation",
      "Finance pathways for landlord-friendly capex",
    ]}
    sections={[
      { title: "Portfolio thinking", body: "We plan installations as a programme — not one-off jobs — for predictable cost and consistent quality." },
      { title: "Better tenants, longer leases", body: "Lower running costs and EV-ready properties attract higher-quality, longer-term tenants." },
    ]}
  />
);
