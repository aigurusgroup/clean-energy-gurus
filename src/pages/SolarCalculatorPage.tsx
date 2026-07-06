import { useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SiteLayout } from "@/components/site/SiteLayout";
import { SolarCalculator } from "@/components/site/SolarCalculator";
import { FinalCTA } from "@/components/site/FinalCTA";

const SolarCalculatorPage = () => {
  useEffect(() => {
    document.title = "Solar Suitability Map | Clean Energy Gurus";
    const m = document.querySelector('meta[name="description"]') as HTMLMetaElement;
    if (m) m.content = "Use our interactive Solar Suitability Map to locate your property, outline potential roof or land space and start a solar suitability check with Clean Energy Gurus.";
  }, []);

  const scrollToMap = () => {
    const el = document.getElementById("solar-map");
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <SiteLayout>
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-soft pt-16 pb-20 lg:pt-24 lg:pb-28">
        <div className="absolute inset-0 grid-bg pointer-events-none" />
        <div className="absolute -top-32 -right-32 h-[400px] w-[400px] bg-gradient-electric opacity-15 blur-3xl rounded-full" />
        <div className="container-tight relative">
          <div className="max-w-3xl">
            <span className="eyebrow">Solar Suitability Map</span>
            <h1 className="mt-4 text-4xl sm:text-5xl lg:text-[58px] leading-[1.05] font-display font-semibold text-navy">
              Map your property for <span className="text-gradient">solar</span>.
            </h1>
            <p className="mt-6 text-lg text-navy-soft leading-relaxed max-w-2xl">
              Use our interactive solar mapping tool to locate your property, outline potential roof or land space and start a solar suitability check with Clean Energy Gurus.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button
                size="lg"
                onClick={scrollToMap}
                className="bg-gradient-electric text-white border-0 rounded-full px-7 h-12 shadow-glow"
              >
                Start Solar Map <ArrowRight className="ml-1.5 h-4 w-4" />
              </Button>
              <Link to="/energy-iq">
                <Button
                  size="lg"
                  variant="outline"
                  className="rounded-full px-7 h-12 border-navy/15 text-navy hover:bg-navy hover:text-white"
                >
                  Explore Energy IQ
                </Button>
              </Link>
            </div>
            <p className="mt-5 text-sm text-navy-soft/80 max-w-2xl">
              Looking for a broader assessment across solar, batteries, EV charging, heat pumps and optimisation?{" "}
              <Link to="/energy-iq" className="underline underline-offset-2 hover:text-navy">
                Explore Energy IQ
              </Link>
              .
            </p>
          </div>
        </div>
      </section>

      {/* Map section heading (overrides the calculator's built-in heading) */}
      <section id="solar-map" className="pt-20 lg:pt-28">
        <div className="container-tight">
          <div className="max-w-3xl">
            <span className="eyebrow">
              <span className="h-1.5 w-1.5 rounded-full bg-electric animate-pulse" />
              Instant solar check
            </span>
            <h2 className="mt-3 text-3xl sm:text-4xl lg:text-5xl font-display font-semibold text-navy">
              Outline your roof. <span className="text-gradient">Start your solar check.</span>
            </h2>
            <p className="mt-4 text-navy-soft text-lg leading-relaxed">
              Search your postcode, outline the area you would like us to review and answer a few quick questions so we can understand your solar opportunity.
            </p>
            <p className="mt-4 text-xs text-muted-foreground">
              Solar suitability is subject to property review, technical assessment and system design.
            </p>
          </div>
        </div>
      </section>

      <SolarCalculator segment="home" selectable hideHeading className="pt-8 lg:pt-10" />
      <FinalCTA />
    </SiteLayout>
  );
};

export default SolarCalculatorPage;
