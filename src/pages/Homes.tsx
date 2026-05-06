import { SimplePage } from "@/components/site/SimplePage";
import segHome from "@/assets/segment-home.jpg";

export default () => (
  <SimplePage
    metaTitle="Home Energy Optimisation | Clean Energy Gurus"
    metaDesc="High-consumption homes deserve more than a basic install. Solar, batteries, EV charging and ongoing optimisation."
    eyebrow="For Homes"
    heroTitle={<>For homes that <span className="text-gradient">demand more</span>.</>}
    lead="Larger homes, electric heating, multiple EVs, hot tubs, home offices — we design for serious consumption and serious savings."
    image={segHome}
    bullets={[
      "High-output solar arrays for high-consumption homes",
      "Battery storage with smart-tariff dispatch logic",
      "Home and dual-vehicle EV charging via OZEV partners",
      "Continuous monitoring and tariff optimisation",
      "Future-ready for heat pumps and EV expansion",
      "MCS partner-led delivery for grants and SEG eligibility",
    ]}
    sections={[
      { title: "Engineered, not bolted-on", body: "Every system is designed around your actual usage — not a generic template." },
      { title: "Stay optimised", body: "We monitor performance and adjust tariffs as the market shifts so the system keeps paying you back." },
    ]}
  />
);
