import { SimplePage } from "@/components/site/SimplePage";
import segFarm from "@/assets/segment-farm.jpg";

export default () => (
  <SimplePage
    metaTitle="Farm Energy Independence | Clean Energy Gurus"
    metaDesc="Power barns, irrigation, dairy and farm operations with solar, batteries and EV charging — and earn from export."
    eyebrow="For Farms"
    heroTitle={<>Farm energy <span className="text-gradient">independence</span>.</>}
    lead="From dairy parlours to grain stores, generate, store and trade your own power. Less grid exposure, more long-term certainty."
    image={segFarm}
    bullets={[
      "Roof and ground-mount solar across barns and outbuildings",
      "Battery storage for outage resilience and load shifting",
      "EV charging for farm and visitor vehicles",
      "Diversified income through optimised export",
      "DNO coordination for high-capacity sites",
      "Long-term monitoring across all assets",
    ]}
    sections={[
      { title: "Diversified farm income", body: "Selling clean energy back to the grid becomes a quiet, recurring revenue line alongside core operations." },
      { title: "Resilience that matters", body: "Batteries keep refrigeration, milking and security running through grid outages." },
    ]}
  />
);
