import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import dashImg from "@/assets/platform-dashboard.jpg";

const features = [
  ["Live monitoring", "Solar, battery, grid and EV in one view."],
  ["Performance reporting", "Monthly, quarterly and annual outputs."],
  ["Tariff review", "Match the right tariff to your load profile."],
  ["Battery optimisation", "Dispatch logic that pays for itself."],
  ["EV charging oversight", "Sessions, costs, faults and load balancing."],
];

export const PlatformPreview = () => (
  <section className="py-20 lg:py-28 bg-surface">
    <div className="container-tight">
      <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
        <div className="order-2 lg:order-1 relative">
          <div className="absolute -inset-8 bg-gradient-electric opacity-20 blur-3xl rounded-full" />
          <div className="relative rounded-3xl overflow-hidden border border-border shadow-elegant">
            <img src={dashImg} alt="Gurus Optimise platform dashboard" loading="lazy" width={1600} height={1024} className="w-full h-auto" />
          </div>
        </div>
        <div className="order-1 lg:order-2">
          <span className="eyebrow">Gurus Optimise™</span>
          <h2 className="mt-3 text-3xl sm:text-4xl lg:text-5xl font-display font-semibold text-navy">
            Your energy, in one calm dashboard.
          </h2>
          <p className="mt-5 text-navy-soft text-lg leading-relaxed">
            The platform that sits behind every Clean Energy Gurus install — bringing
            visibility, control and intelligence to your site for the long term.
          </p>
          <div className="mt-8 grid sm:grid-cols-2 gap-4">
            {features.map(([t, d]) => (
              <div key={t} className="rounded-xl border border-border bg-card p-4">
                <div className="text-sm font-semibold text-navy">{t}</div>
                <div className="text-xs text-muted-foreground mt-1">{d}</div>
              </div>
            ))}
          </div>
          <Link to="/platform" className="inline-block mt-8">
            <Button className="bg-navy text-white rounded-full px-6 hover:bg-navy/90">
              Explore the platform <ArrowRight className="ml-1.5 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  </section>
);
