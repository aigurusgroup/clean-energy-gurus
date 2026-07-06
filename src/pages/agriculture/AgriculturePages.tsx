import { LayoutGrid, ShieldCheck, ClipboardCheck } from "lucide-react";
import { HubPage } from "@/components/site/HubPage";
import { SimplePage } from "@/components/site/SimplePage";

export const AgricultureHub = () => (
  <HubPage
    metaTitle="Agricultural Energy | Clean Energy Gurus"
    metaDesc="Solar, battery storage and resilience solutions for UK farms and rural businesses."
    eyebrow="Agriculture"
    heroTitle={<>Energy independence for <span className="text-gradient">working farms</span>.</>}
    lead="Use your roofs, land and high daytime load to build a resilient, low-cost, revenue-generating farm energy system."
    sectionTitle="Agricultural solutions"
    items={[
      { title: "Farm Solar & Battery", desc: "Rooftop, ground-mount and storage — designed together.", to: "/agriculture/solar", icon: LayoutGrid },
      { title: "Farm Energy Resilience", desc: "Keep critical loads running through grid outages.", to: "/agriculture/resilience", icon: ShieldCheck },
      { title: "Farm Energy Review", desc: "A clear read of your farm's energy position — free.", to: "/contact?type=agriculture", icon: ClipboardCheck },
    ]}
  />
);

export const FarmSolar = () => (
  <SimplePage
    metaTitle="Farm Solar UK | Clean Energy Gurus"
    metaDesc="Farm-grade solar PV for UK agricultural sites — rooftop, ground-mount and carport."
    eyebrow="Farm Solar"
    heroTitle={<>Farm solar built for <span className="text-gradient">real daytime load</span>.</>}
    lead="Barn roofs, unproductive land and machinery sheds turned into long-term energy assets."
    bullets={[
      "Rooftop, ground-mount and carport options",
      "Farm consumption profile modelling",
      "Grant and finance route support",
      "MCS partner installation",
      "DNO coordination",
      "Long-term monitoring",
    ]}
    sections={[{ title: "Designed for farm load", body: "Farms use energy when solar is generating — the payback fundamentals are strong." }]}
  />
);

export const FarmBattery = () => (
  <SimplePage
    metaTitle="Farm Battery Storage | Clean Energy Gurus"
    metaDesc="Battery storage for farms — daytime capture, night-time use, resilience and export revenue."
    eyebrow="Battery Storage for Farms"
    heroTitle={<>Store the day. <span className="text-gradient">Power the night.</span></>}
    lead="Batteries turn a solar-heavy midday into steady, controllable, revenue-generating farm energy."
    bullets={[
      "Daytime solar capture",
      "Night-time and peak dispatch",
      "Backup for critical farm loads",
      "Tariff and export optimisation",
      "Warranty-backed cycles",
      "Remote monitoring",
    ]}
    sections={[{ title: "Not just self-use", body: "Batteries unlock export windows and flexibility revenue on top of savings." }]}
  />
);

export const FarmResilience = () => (
  <SimplePage
    metaTitle="Farm Energy Resilience | Clean Energy Gurus"
    metaDesc="Keep critical farm systems running through grid outages with integrated solar, battery and backup design."
    eyebrow="Energy Resilience"
    heroTitle={<>Keep critical loads <span className="text-gradient">running through outages</span>.</>}
    lead="Milking, ventilation, refrigeration and pumping — protected by integrated solar, storage and backup design."
    bullets={[
      "Critical load audit",
      "Backup-capable inverters and batteries",
      "Automatic islanding where suitable",
      "Generator and hybrid integration",
      "Monitoring and alerting",
      "Test-and-verify commissioning",
    ]}
    sections={[{ title: "Beyond a backup box", body: "Resilience is a system design — batteries, inverters, loads and controls working together." }]}
  />
);

export const AgriculturalSolutions = () => (
  <SimplePage
    metaTitle="Agricultural Energy Solutions | Clean Energy Gurus"
    metaDesc="A complete managed energy stack for UK farms — solar, storage, EV, monitoring and optimisation."
    eyebrow="Agricultural Energy Solutions"
    heroTitle={<>The complete <span className="text-gradient">farm energy stack</span>.</>}
    lead="One team designing, installing and managing every layer of your farm's energy system."
    bullets={[
      "Solar, battery, EV and monitoring integrated",
      "Grant and finance route guidance",
      "Accredited partner installation",
      "Ongoing tariff and export review",
      "Half-hourly performance reporting",
      "Single point of accountability",
    ]}
    sections={[{ title: "One system, one team", body: "You get one designer, one installer network and one performance partner — not five." }]}
  />
);
