import { SiteLayout } from "@/components/site/SiteLayout";
import { PageHero } from "@/components/site/PageHero";
import { PlatformPreview } from "@/components/site/PlatformPreview";
import { FinalCTA } from "@/components/site/FinalCTA";
import { Activity, BarChart3, Zap, Battery, Plug, FileText } from "lucide-react";

const features = [
  { icon: Activity, t: "Live monitoring", d: "Half-hourly visibility across solar, battery, grid and EV." },
  { icon: BarChart3, t: "Performance reporting", d: "Monthly, quarterly and annual reports for finance and ESG." },
  { icon: Zap, t: "Tariff intelligence", d: "Match the right tariff to your real load profile." },
  { icon: Battery, t: "Battery optimisation", d: "Dispatch tuned to wholesale prices and self-consumption." },
  { icon: Plug, t: "EV oversight", d: "Sessions, load balancing, faults — across every charger." },
  { icon: FileText, t: "Asset documentation", d: "Warranties, certificates and handover packs in one place." },
];

const Platform = () => (
  <SiteLayout>
    <PageHero
      eyebrow="Gurus Optimise™ Platform"
      title={<>The <span className="text-gradient">brain</span> behind every Clean Energy Gurus install.</>}
      lead="Gurus Optimise™ brings monitoring, tariff intelligence and asset oversight together — so your energy system keeps performing for the next 25 years."
    />
    <section className="py-20">
      <div className="container-tight grid md:grid-cols-2 lg:grid-cols-3 gap-5">
        {features.map(({ icon: Icon, t, d }) => (
          <div key={t} className="card-premium p-7">
            <div className="h-11 w-11 rounded-xl bg-gradient-electric grid place-items-center text-white shadow-glow">
              <Icon className="h-5 w-5" />
            </div>
            <h3 className="mt-5 text-lg font-display font-semibold text-navy">{t}</h3>
            <p className="mt-2 text-sm text-muted-foreground">{d}</p>
          </div>
        ))}
      </div>
    </section>
    <PlatformPreview />
    <FinalCTA />
  </SiteLayout>
);

export default Platform;
