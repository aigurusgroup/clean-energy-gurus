import { Activity, LineChart, Battery, CheckCircle2, Wrench, Upload, BarChart3 } from "lucide-react";
import { useEffect } from "react";
import { HubPage } from "@/components/site/HubPage";
import { SimplePage } from "@/components/site/SimplePage";
import { SiteLayout } from "@/components/site/SiteLayout";
import { PageHero } from "@/components/site/PageHero";
import { FinalCTA } from "@/components/site/FinalCTA";

export const OptimisationHub = () => (
  <HubPage
    metaTitle="Energy Optimisation | Clean Energy Gurus"
    metaDesc="Ongoing monitoring, maintenance, tariff and battery optimisation for solar, battery and EV systems."
    eyebrow="Energy Optimisation"
    heroTitle={<>The savings come from <span className="text-gradient">what happens after install</span>.</>}
    lead="Continuous monitoring, tuning and reporting — so your energy system keeps performing over its whole life."
    sectionTitle="Optimisation services"
    items={[
      { title: "Monitoring & Maintenance", desc: "Half-hourly data, fault detection and rapid intervention.", to: "/energy-optimisation/monitoring", icon: Activity },
      { title: "Tariff & Export Optimisation", desc: "The right tariff and export route, reviewed as the market shifts.", to: "/energy-optimisation/tariff", icon: LineChart },
      { title: "Battery Optimisation", desc: "Dispatch tuned to load, solar and wholesale prices.", to: "/energy-optimisation/battery", icon: Battery },
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
