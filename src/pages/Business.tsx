import { SimplePage } from "@/components/site/SimplePage";
import segBusiness from "@/assets/segment-business.jpg";

export default () => (
  <SimplePage
    metaTitle="Business Energy Optimisation | Clean Energy Gurus"
    metaDesc="Reduce grid spend and protect your business from energy price volatility with managed solar, batteries, EV charging and ongoing optimisation."
    eyebrow="For Businesses"
    heroTitle={<>Business energy, <span className="text-gradient">engineered for resilience</span>.</>}
    lead="Cut grid electricity, hedge against price volatility, support your EV fleet and turn your operating site into a long-term energy asset."
    image={segBusiness}
    bullets={[
      "Commercial-grade rooftop and ground-mount solar PV",
      "Battery storage sized to your operational load profile",
      "Workplace and fleet EV charging via OZEV partners",
      "Half-hourly monitoring and quarterly performance reporting",
      "Tariff and export optimisation as the market evolves",
      "Finance pathways: cash, lease, asset-finance and PPA",
    ]}
    sections={[
      { title: "Built around your load curve", body: "We model your half-hourly consumption to size every component for genuine self-consumption — not headline kW." },
      { title: "ESG and reporting ready", body: "Auditable performance data and emissions reductions for your sustainability disclosures." },
      { title: "Long-term partnership", body: "We stay involved long after handover — managing performance, tariffs and upgrades." },
    ]}
  />
);
