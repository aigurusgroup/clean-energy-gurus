import { Sun, Plug, Building2, CheckCircle2, BatteryCharging, Layers } from "lucide-react";
import { useEffect } from "react";
import { HubPage } from "@/components/site/HubPage";
import { SimplePage } from "@/components/site/SimplePage";
import { SiteLayout } from "@/components/site/SiteLayout";
import { PageHero } from "@/components/site/PageHero";
import { FinalCTA } from "@/components/site/FinalCTA";
import { SolarMapCTA } from "@/components/site/SolarMapCTA";

export const BusinessHub = () => (
  <HubPage
    metaTitle="Business Energy | Clean Energy Gurus"
    metaDesc="Commercial solar, EV charging and managed energy optimisation for UK businesses and property portfolios."
    eyebrow="Business"
    heroTitle={<>Turn your site into a <span className="text-gradient">managed energy asset</span>.</>}
    lead="Reduce operating costs, protect against price shocks and unlock new revenue from your roofs, land and load."
    sectionTitle="Business solutions"
    items={[
      { title: "Commercial Solar", desc: "Rooftop, ground-mount and battery — sized to site load.", to: "/business/commercial-solar", icon: Sun },
      { title: "Workplace EV Charging", desc: "Staff, visitor and fleet charging that scales.", to: "/business/workplace-ev", icon: Plug },
      { title: "Landlords & Property Portfolios", desc: "Upgrade assets and support tenants across a portfolio.", to: "/business/landlords", icon: Building2 },
    ]}
  />
);

const useMeta = (title: string, desc: string) => {
  useEffect(() => {
    document.title = title;
    const meta = document.querySelector('meta[name="description"]') || (() => {
      const m = document.createElement("meta"); m.setAttribute("name", "description"); document.head.appendChild(m); return m;
    })();
    meta.setAttribute("content", desc);
  }, [title, desc]);
};

const BulletList = ({ items }: { items: string[] }) => (
  <ul className="mt-6 space-y-3.5">
    {items.map((b) => (
      <li key={b} className="flex gap-3 text-navy">
        <CheckCircle2 className="h-5 w-5 text-electric flex-shrink-0 mt-0.5" />
        <span className="text-[15px]">{b}</span>
      </li>
    ))}
  </ul>
);

export const CommercialSolar = () => {
  useMeta(
    "Commercial Solar & Battery UK | Clean Energy Gurus",
    "Design-led commercial solar — rooftop, ground-mount and carport — with commercial battery storage for peak-shaving, resilience and export revenue."
  );
  return (
    <SiteLayout>
      <PageHero
        eyebrow="Commercial Solar & Battery"
        title={<>Commercial solar that <span className="text-gradient">earns its space</span>.</>}
        lead="Site-load-led design, robust hardware and accredited installation — with optional battery storage to peak-shave, protect critical loads and unlock export and flexibility revenue."
      />

      <section className="py-20 lg:py-24">
        <div className="container-tight grid lg:grid-cols-3 gap-8">
          <div className="card-premium p-7">
            <div className="h-11 w-11 rounded-xl bg-gradient-electric grid place-items-center text-white shadow-glow"><Sun className="h-5 w-5" /></div>
            <h3 className="mt-5 text-xl font-display font-semibold text-navy">Commercial Solar</h3>
            <p className="mt-2 text-sm text-muted-foreground leading-relaxed">Consumption-led design with Tier-1 hardware and MCS partner installation.</p>
            <BulletList items={["Consumption-led yield modelling", "Tier-1 panels, inverters and monitoring", "MCS and DNO coordination", "PPA, lease and CapEx finance routes", "Half-hourly performance reporting"]} />
          </div>
          <div className="card-premium p-7">
            <div className="h-11 w-11 rounded-xl bg-gradient-electric grid place-items-center text-white shadow-glow"><Layers className="h-5 w-5" /></div>
            <h3 className="mt-5 text-xl font-display font-semibold text-navy">Rooftop & Ground-Mount</h3>
            <p className="mt-2 text-sm text-muted-foreground leading-relaxed">The right array format for your buildings, land and load profile.</p>
            <BulletList items={["Rooftop arrays on warehouses & offices", "Ground-mount on unproductive land", "Carport solar over staff and fleet parking", "Structural surveys and roof suitability", "Grid connection and DNO liaison"]} />
          </div>
          <div className="card-premium p-7">
            <div className="h-11 w-11 rounded-xl bg-gradient-electric grid place-items-center text-white shadow-glow"><BatteryCharging className="h-5 w-5" /></div>
            <h3 className="mt-5 text-xl font-display font-semibold text-navy">Commercial Battery Storage</h3>
            <p className="mt-2 text-sm text-muted-foreground leading-relaxed">Batteries as commercial infrastructure — stacked revenue and resilience.</p>
            <BulletList items={["Peak-shaving and demand-charge reduction", "Backup for critical loads", "Solar time-shifting", "Export & flexibility market participation", "Warranty-backed cycles and full monitoring"]} />
          </div>
        </div>
      </section>

      <section className="py-16 bg-surface">
        <div className="container-tight grid lg:grid-cols-2 gap-10">
          <div className="card-premium p-7">
            <h3 className="text-lg font-display font-semibold text-navy">Solar + battery, working together</h3>
            <p className="mt-3 text-sm text-navy leading-relaxed">On commercial sites, solar and battery are strongest as one designed system. Solar generates during the working day, batteries capture surplus, shave peak-tariff windows and dispatch stored energy where it earns most — either on-site or exported at price peaks.</p>
            <BulletList items={["Single integrated design and controls", "Combined DNO and metering strategy", "Coordinated dispatch across generation, storage and load", "One monitoring layer for the whole system", "One accountable partner across the lifecycle"]} />
          </div>
          <div className="card-premium p-7">
            <h3 className="text-lg font-display font-semibold text-navy">Sized to your load</h3>
            <p className="mt-3 text-sm text-navy leading-relaxed">We model actual site consumption before recommending array size or battery capacity — no oversized systems selling cheap into export markets, no undersized batteries that clip on the first sunny day.</p>
          </div>
        </div>
      </section>

      <SolarMapCTA />
      <FinalCTA />
    </SiteLayout>
  );
};

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
