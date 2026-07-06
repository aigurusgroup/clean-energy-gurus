import { Activity, LineChart, Battery, CheckCircle2, Wrench, Upload, BarChart3, Thermometer, Droplets, Home, Handshake } from "lucide-react";
import { useEffect } from "react";
import { HubPage } from "@/components/site/HubPage";
import { SimplePage } from "@/components/site/SimplePage";
import { SiteLayout } from "@/components/site/SiteLayout";
import { PageHero } from "@/components/site/PageHero";
import { FinalCTA } from "@/components/site/FinalCTA";
import { EnergyIQTeaser } from "@/components/site/EnergyIQTeaser";

const LowCarbonHeatingSection = () => (
  <section className="py-20 lg:py-24 bg-surface">
    <div className="container-tight">
      <div className="max-w-2xl mb-10">
        <span className="eyebrow"><span className="h-1.5 w-1.5 rounded-full bg-electric" />Partner-supported</span>
        <h2 className="mt-3 text-3xl lg:text-4xl font-display font-semibold text-navy">Low Carbon Heating & Efficiency</h2>
        <p className="mt-4 text-navy-soft leading-relaxed">
          Optimising a property isn't only about generation and storage. Heating and hot water often make up the largest share of a home's energy use — and are where the biggest efficiency gains can be found. Where suitable, we coordinate low carbon heating upgrades through our accredited partner network as part of a wider energy plan.
        </p>
      </div>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
        {[
          { icon: Thermometer, title: "Air Source Heat Pumps", body: "MCS-accredited partner installs, sized against your heat loss, radiators and hot water demand — never a one-size-fits-all quote." },
          { icon: Wrench, title: "Heating efficiency", body: "Controls, zoning and flow temperature tuning to get more useful heat from every kWh." },
          { icon: Droplets, title: "Hot water considerations", body: "Cylinder sizing, immersion diverts and integration with solar and off-peak tariffs." },
          { icon: Home, title: "Property suitability", body: "Fabric, insulation, ventilation and electrical capacity are all assessed before we recommend any upgrade." },
          { icon: Battery, title: "Solar, battery & tariff compatibility", body: "A heat pump can be tuned to run on cheap off-peak windows or self-consumed solar where the system supports it." },
          { icon: Handshake, title: "Partner-supported delivery", body: "Delivered by CEG Accredited heat pump partners. Suitability, performance and any grant eligibility are subject to survey and current scheme availability." },
        ].map(({ icon: Icon, title, body }) => (
          <div key={title} className="card-premium p-6">
            <div className="h-11 w-11 rounded-xl bg-accent grid place-items-center text-electric">
              <Icon className="h-5 w-5" />
            </div>
            <div className="mt-4 font-semibold text-navy">{title}</div>
            <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{body}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export const OptimisationHub = () => (
  <HubPage
    metaTitle="Energy Optimisation | Clean Energy Gurus"
    metaDesc="Ongoing monitoring, maintenance, tariff and battery optimisation for solar, battery and EV systems — plus partner-supported low carbon heating."
    eyebrow="Energy Optimisation"
    heroTitle={<>The savings come from <span className="text-gradient">what happens after install</span>.</>}
    lead="Continuous monitoring, tuning and reporting — so your energy system keeps performing over its whole life."
    sectionTitle="Optimisation services"
    items={[
      { title: "Monitoring & Maintenance", desc: "Half-hourly data, fault detection and rapid intervention.", to: "/energy-optimisation/monitoring", icon: Activity },
      { title: "Tariff & Export Optimisation", desc: "The right tariff and export route, reviewed as the market shifts.", to: "/energy-optimisation/tariff", icon: LineChart },
      { title: "Battery Optimisation", desc: "Dispatch tuned to load, solar and wholesale prices.", to: "/energy-optimisation/battery", icon: Battery },
    ]}
    extra={<><LowCarbonHeatingSection /><EnergyIQTeaser /></>}
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

export const OptMonitoring = () => {
  useMeta(
    "Monitoring & Maintenance | Clean Energy Gurus",
    "Continuous monitoring, preventative maintenance, performance checks and long-term support for solar, battery and EV systems."
  );
  return (
    <SiteLayout>
      <PageHero
        eyebrow="Monitoring & Maintenance"
        title={<>Always-on <span className="text-gradient">performance oversight</span>.</>}
        lead="Every asset watched in real time. Issues caught before they impact yield — and closed out fast by our maintenance partners."
      />
      <section className="py-20 lg:py-24">
        <div className="container-tight grid lg:grid-cols-2 gap-10">
          <div className="card-premium p-7">
            <div className="h-11 w-11 rounded-xl bg-gradient-electric grid place-items-center text-white shadow-glow"><Activity className="h-5 w-5" /></div>
            <h3 className="mt-5 text-xl font-display font-semibold text-navy">Monitoring</h3>
            <p className="mt-2 text-sm text-muted-foreground leading-relaxed">Continuous half-hourly performance data across every asset.</p>
            <BulletList items={["Half-hourly performance data", "Fault detection and alerting", "Inverter and battery health tracking", "Portfolio and single-site dashboards", "Historical trend tracking"]} />
          </div>
          <div className="card-premium p-7">
            <div className="h-11 w-11 rounded-xl bg-gradient-electric grid place-items-center text-white shadow-glow"><Wrench className="h-5 w-5" /></div>
            <h3 className="mt-5 text-xl font-display font-semibold text-navy">Maintenance</h3>
            <p className="mt-2 text-sm text-muted-foreground leading-relaxed">Preventative and reactive maintenance that protects yield.</p>
            <BulletList items={["Annual inspections", "Firmware and control updates", "Fault triage and dispatch", "Component-level tracking", "Warranty coordination"]} />
          </div>
          <div className="card-premium p-7">
            <h3 className="text-lg font-display font-semibold text-navy">System performance checks</h3>
            <BulletList items={["Quarterly performance review", "Comparison to design yield", "Degradation and drift tracking", "Tariff and dispatch effectiveness review", "Recommendations report"]} />
          </div>
          <div className="card-premium p-7">
            <h3 className="text-lg font-display font-semibold text-navy">Long-term system support</h3>
            <BulletList items={["Lifecycle planning across 20+ years", "Component replacement scheduling", "Warranty and claim management", "Ongoing tariff and export re-review", "Single point of accountability"]} />
          </div>
        </div>
      </section>
      <FinalCTA />
    </SiteLayout>
  );
};

export const OptTariff = () => {
  useMeta(
    "Tariff & Export Optimisation | Clean Energy Gurus",
    "Tariff optimisation, export optimisation, battery dispatch and clear energy performance reporting — reviewed as the market shifts."
  );
  return (
    <SiteLayout>
      <PageHero
        eyebrow="Tariff & Export Optimisation"
        title={<>The right tariff. <span className="text-gradient">Every kWh exported well.</span></>}
        lead="Tariff choice is one of the biggest drivers of a system's economics — and it doesn't stay right forever. We monitor, model and adjust."
      />
      <section className="py-20 lg:py-24">
        <div className="container-tight grid lg:grid-cols-2 gap-10">
          <div className="card-premium p-7">
            <div className="h-11 w-11 rounded-xl bg-gradient-electric grid place-items-center text-white shadow-glow"><LineChart className="h-5 w-5" /></div>
            <h3 className="mt-5 text-xl font-display font-semibold text-navy">Tariff Optimisation</h3>
            <p className="mt-2 text-sm text-muted-foreground leading-relaxed">Match the right electricity tariff to your load and generation profile.</p>
            <BulletList items={["Tariff modelling to your load", "SEG and dynamic export review", "Switch guidance and support", "Half-hourly settlement readiness", "Annual re-review"]} />
          </div>
          <div className="card-premium p-7">
            <div className="h-11 w-11 rounded-xl bg-gradient-electric grid place-items-center text-white shadow-glow"><Upload className="h-5 w-5" /></div>
            <h3 className="mt-5 text-xl font-display font-semibold text-navy">Export Optimisation</h3>
            <p className="mt-2 text-sm text-muted-foreground leading-relaxed">Every exported kWh at its best price — SEG through to flexibility markets.</p>
            <BulletList items={["SEG enrolment", "Dynamic export tariff selection", "Battery dispatch tuned to wholesale prices", "Half-hourly export reporting", "Flexibility market access via partners"]} />
          </div>
          <div className="card-premium p-7">
            <div className="h-11 w-11 rounded-xl bg-gradient-electric grid place-items-center text-white shadow-glow"><BarChart3 className="h-5 w-5" /></div>
            <h3 className="mt-5 text-xl font-display font-semibold text-navy">Energy Performance Reporting</h3>
            <p className="mt-2 text-sm text-muted-foreground leading-relaxed">Quarterly reports translating data into savings, revenue and ESG evidence.</p>
            <BulletList items={["Quarterly performance reports", "Savings and revenue breakdown", "CO₂ and ESG-ready metrics", "Portfolio roll-up for multi-site owners", "Board-ready summaries"]} />
          </div>
          <div className="card-premium p-7">
            <div className="h-11 w-11 rounded-xl bg-gradient-electric grid place-items-center text-white shadow-glow"><Battery className="h-5 w-5" /></div>
            <h3 className="mt-5 text-xl font-display font-semibold text-navy">Battery Optimisation (where relevant)</h3>
            <p className="mt-2 text-sm text-muted-foreground leading-relaxed">Dispatch logic tuned to the day ahead, not a factory default.</p>
            <BulletList items={["Custom dispatch strategies", "Forecast-aware charging", "Wholesale-price-aware discharge", "Self-consumption / export / trading modes", "Ongoing tuning"]} />
          </div>
        </div>
      </section>
      <FinalCTA />
    </SiteLayout>
  );
};

export const OptBattery = () => (
  <SimplePage
    metaTitle="Battery Optimisation | Clean Energy Gurus"
    metaDesc="Battery dispatch tuned to load, solar and wholesale prices — for self-consumption, resilience and revenue."
    eyebrow="Battery Optimisation"
    heroTitle={<>Batteries tuned to <span className="text-gradient">the day ahead</span>.</>}
    lead="Dispatch logic that responds to your load, solar forecast and tariff windows — not a factory default."
    bullets={["Custom dispatch strategies", "Forecast-aware charging", "Wholesale-price-aware discharge", "Self-consumption / export / trading modes", "Cycle and warranty tracking", "Ongoing tuning"]}
    sections={[{ title: "Same hardware, more value", body: "The right dispatch strategy adds meaningful revenue with no extra kit." }]}
  />
);
