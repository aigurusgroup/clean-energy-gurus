import { useEffect } from "react";
import { SiteLayout } from "@/components/site/SiteLayout";
import { PageHero } from "@/components/site/PageHero";
import { SolarCalculator } from "@/components/site/SolarCalculator";
import { FinalCTA } from "@/components/site/FinalCTA";

const SolarCalculatorPage = () => {
  useEffect(() => {
    document.title = "Solar Suitability Map | Clean Energy Gurus";
    const m = document.querySelector('meta[name="description"]') as HTMLMetaElement;
    if (m) m.content = "Use our interactive Solar Suitability Map to locate your property, review potential roof or land space and start a solar assessment with Clean Energy Gurus.";
  }, []);

  return (
    <SiteLayout>
      <PageHero
        eyebrow="Solar Suitability Map"
        title={<>Map your property for <span className="text-gradient">solar</span>.</>}
        lead="Use our interactive solar mapping tool to locate your property, review potential roof or land space and start a solar assessment with Clean Energy Gurus. This is a solar-specific tool — for a broader property energy assessment covering solar, battery, EV, heat pumps and optimisation, use Energy IQ."
      />
      <SolarCalculator segment="home" selectable />
      <FinalCTA />
    </SiteLayout>
  );
};

export default SolarCalculatorPage;
