import { Sun, Battery, Plug, Building2, ClipboardCheck } from "lucide-react";
import { HubPage } from "@/components/site/HubPage";
import { SimplePage } from "@/components/site/SimplePage";

export const BusinessHub = () => (
  <HubPage
    metaTitle="Business Energy | Clean Energy Gurus"
    metaDesc="Commercial solar, EV charging, battery storage and managed energy optimisation for UK businesses."
    eyebrow="Business"
    heroTitle={<>Turn your site into a <span className="text-gradient">managed energy asset</span>.</>}
    lead="Reduce operating costs, protect against price shocks and unlock new revenue from your roofs, land and load."
    sectionTitle="Business solutions"
    items={[
      { title: "Commercial Solar", desc: "Rooftop and ground-mount PV designed for site load.", to: "/business/commercial-solar", icon: Sun },
      { title: "Workplace EV Charging", desc: "Staff, visitor and fleet charging that scales.", to: "/business/workplace-ev", icon: Plug },
      { title: "Commercial Battery Storage", desc: "Peak-shave, resilience and market participation.", to: "/business/commercial-battery", icon: Battery },
      { title: "Landlords & Property Portfolios", desc: "Upgrade assets and support tenants across a portfolio.", to: "/business/landlords", icon: Building2 },
      { title: "Business Energy Review", desc: "A commercial read of your site's energy position.", to: "/contact?type=business", icon: ClipboardCheck },
    ]}
  />
);

export const CommercialSolar = () => (
  <SimplePage
    metaTitle="Commercial Solar PV UK | Clean Energy Gurus"
    metaDesc="Design-led commercial solar for UK businesses — rooftop, ground-mount and carport."
    eyebrow="Commercial Solar"
    heroTitle={<>Commercial solar that <span className="text-gradient">earns its space</span>.</>}
    lead="Site-load-led design, robust hardware and accredited installation — with performance monitored for the life of the asset."
    bullets={[
      "Consumption-led yield modelling",
      "Rooftop, ground-mount and carport options",
      "Tier-1 panels, inverters and monitoring",
      "MCS and DNO coordination",
      "PPA, lease and CapEx finance routes",
      "Half-hourly performance reporting",
    ]}
    sections={[
      { title: "Sized to your load", body: "We model actual site consumption before recommending array size — no oversized systems selling cheap." },
    ]}
  />
);

export const WorkplaceEV = () => (
  <SimplePage
    metaTitle="Workplace EV Charging UK | Clean Energy Gurus"
    metaDesc="OZEV partner-led workplace EV charging designed to scale with fleet and staff demand."
    eyebrow="Workplace EV Charging"
    heroTitle={<>EV charging that <span className="text-gradient">grows with your site</span>.</>}
    lead="AC and DC charging planned around your grid capacity, solar and future fleet trajectory."
    bullets={[
      "Grid capacity and load-balancing design",
      "OZEV partner installation",
      "Staff, visitor and fleet use cases",
      "Access control and billing options",
      "Solar-aware charging logic",
      "Fault monitoring and reporting",
    ]}
    sections={[{ title: "Integrated, not bolted on", body: "Chargers coordinate with solar, batteries and tariff — not standalone hardware." }]}
  />
);

export const CommercialBattery = () => (
  <SimplePage
    metaTitle="Commercial Battery Storage UK | Clean Energy Gurus"
    metaDesc="Battery storage for commercial sites — peak-shaving, resilience and export revenue."
    eyebrow="Commercial Battery Storage"
    heroTitle={<>Batteries as <span className="text-gradient">commercial infrastructure</span>.</>}
    lead="Store solar, shift peaks, protect critical loads and participate in flexibility markets."
    bullets={[
      "Peak-shaving and demand-charge reduction",
      "Backup for critical loads",
      "Solar time-shifting",
      "Export and flexibility market participation via partners",
      "Warranty-backed cycles",
      "Full monitoring and dispatch reporting",
    ]}
    sections={[{ title: "Beyond self-consumption", body: "Sized right, commercial batteries pay back through multiple stacked revenue streams." }]}
  />
);
