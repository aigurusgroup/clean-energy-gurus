import { SimplePage } from "@/components/site/SimplePage";

export const SolarPV = () => (
  <SimplePage
    metaTitle="Solar PV Installation UK | Clean Energy Gurus"
    metaDesc="Commercial and residential solar PV designed and installed by accredited UK partners."
    eyebrow="Solar PV"
    heroTitle={<>Solar PV that <span className="text-gradient">earns its place</span> on your roof.</>}
    lead="Design-led solar systems built around your actual consumption profile, installed by accredited UK partners."
    bullets={["Site survey and yield modelling", "Tier-1 panels and inverters", "Roof, ground-mount and carport options", "MCS partner-led installation", "DNO and metering coordination", "25-year performance horizon"]}
    sections={[{ title: "Design first", body: "Sized to your load, not the roof area." }, { title: "Quality components", body: "Long-warranty hardware from leading manufacturers." }]}
  />
);

export const BatteryStorage = () => (
  <SimplePage
    metaTitle="Battery Storage Systems UK | Clean Energy Gurus"
    metaDesc="Battery storage for self-consumption, resilience and export trading."
    eyebrow="Battery Storage"
    heroTitle={<>Batteries that <span className="text-gradient">trade and protect</span>.</>}
    lead="Capture surplus solar, time-shift load to the cheapest hours, and earn from export at peak windows."
    bullets={["AC and DC-coupled architectures", "Sized to load and tariff profile", "Smart dispatch via Gurus Optimise™", "Backup power for critical loads", "Future-ready for V2G", "Warranty-backed cycles"]}
    sections={[{ title: "Beyond self-use", body: "Batteries become trading assets — buying low, exporting high." }]}
  />
);

export const EVCharging = () => (
  <SimplePage
    metaTitle="EV Charging Installation | Clean Energy Gurus"
    metaDesc="OZEV partner-led EV charging for homes, businesses, fleets and tenants."
    eyebrow="EV Charging"
    heroTitle={<>EV charging, <span className="text-gradient">site-aware</span>.</>}
    lead="Chargers that integrate with your solar, battery and tariff — not standalone boxes on a wall."
    bullets={["Home, workplace, destination and fleet", "OZEV partner-led installation", "Load balancing across multiple chargers", "Solar-aware charging logic", "Driver and operator dashboards", "Fault monitoring and remote support"]}
    sections={[{ title: "Integrated by default", body: "EVs charge from your own solar, your cheapest tariff hours, and never trip your supply." }]}
  />
);

export const Monitoring = () => (
  <SimplePage
    metaTitle="Energy Monitoring & Maintenance | Clean Energy Gurus"
    metaDesc="Continuous monitoring, performance reporting and rapid maintenance for solar, battery and EV systems."
    eyebrow="Monitoring & Maintenance"
    heroTitle={<>Always-on <span className="text-gradient">performance oversight</span>.</>}
    lead="A system isn't earning if it's not performing. We monitor every asset and intervene before issues impact yield."
    bullets={["Half-hourly performance data", "Fault detection and alerting", "Quarterly reports", "Annual inspections", "Inverter and battery health tracking", "Lifecycle management"]}
    sections={[{ title: "Performance guaranteed", body: "We catch issues before you do — and fix them fast." }]}
  />
);

export const Tariff = () => (
  <SimplePage
    metaTitle="Tariff & Export Optimisation | Clean Energy Gurus"
    metaDesc="Match the right tariff to your load profile and unlock export revenue across the UK energy market."
    eyebrow="Tariff & Export"
    heroTitle={<>The right tariff. <span className="text-gradient">Every kWh exported well.</span></>}
    lead="The energy market is changing fast. We make sure your site is always on the right tariff and earning the most from export."
    bullets={["Tariff modelling and switching support", "SEG and dynamic export rates", "Battery dispatch tuned to wholesale prices", "Half-hourly export performance review", "Flexibility market access via partners", "Future market participation pathways"]}
    sections={[{ title: "Markets shift. We adjust.", body: "We review your tariff position regularly and recommend changes when worthwhile." }]}
  />
);
