import { useEffect } from "react";
import { SiteLayout } from "@/components/site/SiteLayout";
import { PageHero } from "@/components/site/PageHero";
import { SolarCalculator } from "@/components/site/SolarCalculator";
import { FinalCTA } from "@/components/site/FinalCTA";

const SolarCalculatorPage = () => {
  useEffect(() => {
    document.title = "Solar Calculator | Clean Energy Gurus";
    const m = document.querySelector('meta[name="description"]') as HTMLMetaElement;
    if (m) m.content = "Estimate solar output, savings and payback for your UK home, business or farm — free, instant, no obligation.";
  }, []);

  return (
    <SiteLayout>
      <PageHero
        eyebrow="Solar Calculator"
        title={<>Estimate your solar in <span className="text-gradient">60 seconds</span>.</>}
        lead="Draw your roof, pick a segment, and get an honest read on generation, savings and payback — before you commit to anything."
      />
      <SolarCalculator segment="home" selectable />
      <FinalCTA />
    </SiteLayout>
  );
};

export default SolarCalculatorPage;
