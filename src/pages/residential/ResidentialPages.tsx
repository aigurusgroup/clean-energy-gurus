import { LayoutGrid, Plug, ClipboardCheck } from "lucide-react";
import { HubPage } from "@/components/site/HubPage";
import { SimplePage } from "@/components/site/SimplePage";

export const ResidentialHub = () => (
  <HubPage
    metaTitle="Residential Energy | Clean Energy Gurus"
    metaDesc="Solar, battery storage, EV charging and ongoing optimisation for UK homes."
    eyebrow="Residential"
    heroTitle={<>Home energy, <span className="text-gradient">designed and managed</span> for you.</>}
    lead="Solar, batteries, EV charging and long-term monitoring — one team taking care of your home energy position."
    sectionTitle="Residential solutions"
    items={[
      { title: "Solar & Battery", desc: "Rooftop solar and matched storage, tuned to your tariff and load.", to: "/residential/solar-battery", icon: LayoutGrid },
      { title: "EV Charging", desc: "OZEV partner-led home chargers, solar-aware by default.", to: "/residential/ev-charging", icon: Plug },
      { title: "Residential Energy Review", desc: "A clear read of your home's energy position — free.", to: "/contact?type=residential", icon: ClipboardCheck },
    ]}
  />
);

export const ResidentialSolarBattery = () => (
  <SimplePage
    metaTitle="Solar + Battery for Homes | Clean Energy Gurus"
    metaDesc="Integrated solar and battery systems for UK homes, designed around your consumption and tariff."
    eyebrow="Solar + Battery"
    heroTitle={<>Solar and batteries, <span className="text-gradient">designed as one system</span>.</>}
    lead="The complete home package — panels, storage, smart dispatch and tariff optimisation from day one."
    bullets={[
      "Solar array sized to your actual load",
      "Battery matched to solar output and tariff windows",
      "Smart dispatch: self-consume, time-shift, export",
      "MCS partner-led installation",
      "Monitoring app and dashboard",
      "Long-term tariff review and optimisation",
    ]}
    sections={[
      { title: "One system, not two products", body: "Solar and storage sized together always outperform two devices bought separately." },
      { title: "Optimised for how you actually live", body: "We tune dispatch to your day, your car and your tariff — and revisit as the market shifts." },
    ]}
  />
);
