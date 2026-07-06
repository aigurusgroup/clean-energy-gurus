import { Activity, Wrench, LineChart, Upload, Battery, BarChart3 } from "lucide-react";
import { HubPage } from "@/components/site/HubPage";
import { SimplePage } from "@/components/site/SimplePage";

export const OptimisationHub = () => (
  <HubPage
    metaTitle="Energy Optimisation | Clean Energy Gurus"
    metaDesc="Ongoing monitoring, maintenance, tariff and export optimisation for solar, battery and EV systems."
    eyebrow="Energy Optimisation"
    heroTitle={<>The savings come from <span className="text-gradient">what happens after install</span>.</>}
    lead="Continuous monitoring, tuning and reporting — so your energy system keeps performing over its whole life."
    sectionTitle="Optimisation services"
    items={[
      { title: "Monitoring", desc: "Half-hourly performance data across every asset.", to: "/energy-optimisation/monitoring", icon: Activity },
      { title: "Maintenance", desc: "Health checks, firmware and rapid intervention.", to: "/energy-optimisation/maintenance", icon: Wrench },
      { title: "Tariff Optimisation", desc: "The right tariff, reviewed as the market shifts.", to: "/energy-optimisation/tariff", icon: LineChart },
      { title: "Export Optimisation", desc: "Sell back at the right time, at the best rate.", to: "/energy-optimisation/export", icon: Upload },
      { title: "Battery Optimisation", desc: "Dispatch tuned to load, solar and wholesale prices.", to: "/energy-optimisation/battery", icon: Battery },
      { title: "Energy Performance Reporting", desc: "Clear quarterly reads of what your system did.", to: "/energy-optimisation/reporting", icon: BarChart3 },
    ]}
  />
);

export const OptMonitoring = () => (
  <SimplePage
    metaTitle="Energy Monitoring | Clean Energy Gurus"
    metaDesc="Continuous monitoring of solar, battery and EV performance with half-hourly data."
    eyebrow="Monitoring"
    heroTitle={<>Always-on <span className="text-gradient">performance oversight</span>.</>}
    lead="Every asset watched in real time. Issues caught before they impact yield."
    bullets={["Half-hourly performance data", "Fault detection and alerting", "Inverter and battery health", "Portfolio and single-site dashboards", "Historical trend tracking", "Integrated with maintenance"]}
    sections={[{ title: "A system isn't earning if it isn't performing", body: "Monitoring is the foundation of every optimisation service we run." }]}
  />
);

export const OptMaintenance = () => (
  <SimplePage
    metaTitle="Energy System Maintenance | Clean Energy Gurus"
    metaDesc="Preventative and reactive maintenance for solar, battery and EV systems across the UK."
    eyebrow="Maintenance"
    heroTitle={<>Maintenance that <span className="text-gradient">protects yield</span>.</>}
    lead="Health checks, firmware updates, cleaning schedules and rapid intervention when something drifts."
    bullets={["Annual inspections", "Firmware and control updates", "Fault triage and dispatch", "Component-level tracking", "Warranty coordination", "Site access management"]}
    sections={[{ title: "Fix before you feel it", body: "Monitoring flags the issue — maintenance closes it out fast." }]}
  />
);

export const OptTariff = () => (
  <SimplePage
    metaTitle="Tariff Optimisation | Clean Energy Gurus"
    metaDesc="Match the right electricity tariff to your load and generation profile — reviewed as the market shifts."
    eyebrow="Tariff Optimisation"
    heroTitle={<>The right tariff. <span className="text-gradient">Revisited as the market moves.</span></>}
    lead="Tariff choice is one of the biggest drivers of a system's economics — and it doesn't stay right forever."
    bullets={["Tariff modelling to your load", "SEG and dynamic export review", "Switch guidance and support", "Half-hourly settlement readiness", "Annual re-review", "Cross-site portfolio view"]}
    sections={[{ title: "Small change, big impact", body: "A tariff review often pays back more than a new piece of hardware." }]}
  />
);

export const OptExport = () => (
  <SimplePage
    metaTitle="Export Optimisation | Clean Energy Gurus"
    metaDesc="Unlock export revenue from solar and batteries with the right tariff, dispatch and market access."
    eyebrow="Export Optimisation"
    heroTitle={<>Every kWh exported <span className="text-gradient">at its best price</span>.</>}
    lead="From SEG enrolment to dynamic export and flexibility markets — we set your system up to earn."
    bullets={["SEG enrolment", "Dynamic export tariff selection", "Battery dispatch tuned to wholesale prices", "Half-hourly export reporting", "Flexibility market access via partners", "Regulatory change tracking"]}
    sections={[{ title: "Export is not a bonus", body: "For many systems, export revenue is the difference between good and great payback." }]}
  />
);

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

export const OptReporting = () => (
  <SimplePage
    metaTitle="Energy Performance Reporting | Clean Energy Gurus"
    metaDesc="Clear quarterly and annual reports on how your energy system performed — savings, revenue and ESG."
    eyebrow="Energy Performance Reporting"
    heroTitle={<>Know exactly what your <span className="text-gradient">system did</span>.</>}
    lead="Quarterly reports that translate half-hourly data into savings, revenue and ESG-ready evidence."
    bullets={["Quarterly performance reports", "Savings and revenue breakdown", "CO₂ and ESG-ready metrics", "Actionable recommendations", "Portfolio roll-up for multi-site owners", "Board-ready summaries"]}
    sections={[{ title: "Numbers you can share", body: "Reports designed to answer the questions your finance and sustainability teams actually ask." }]}
  />
);
