import { Link } from "react-router-dom";
import { ArrowRight, Map } from "lucide-react";
import { Button } from "@/components/ui/button";

export const SolarMapCTA = () => (
  <section className="py-16 lg:py-20">
    <div className="container-tight">
      <div className="card-premium p-8 lg:p-10 flex flex-col lg:flex-row gap-8 items-start lg:items-center justify-between">
        <div className="max-w-2xl">
          <span className="eyebrow"><Map className="h-3.5 w-3.5" /> Solar Suitability Map</span>
          <h2 className="mt-3 text-2xl lg:text-3xl font-display font-semibold text-navy">
            Map your property for solar
          </h2>
          <p className="mt-3 text-navy-soft leading-relaxed">
            Locate your property, review potential roof or land space and start a solar suitability check.
          </p>
        </div>
        <Link to="/solar-calculator" className="flex-shrink-0">
          <Button className="rounded-full h-12 px-6 bg-gradient-electric text-white border-0 shadow-glow">
            Open Solar Suitability Map <ArrowRight className="ml-1.5 h-4 w-4" />
          </Button>
        </Link>
      </div>
    </div>
  </section>
);
