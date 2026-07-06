import { SiteLayout } from "@/components/site/SiteLayout";
import { Hero } from "@/components/site/Hero";
import { Segments } from "@/components/site/Segments";
import { Services } from "@/components/site/Services";
import { Trust } from "@/components/site/Trust";
import { CaseStudies } from "@/components/site/CaseStudies";
import { FinalCTA } from "@/components/site/FinalCTA";
import { EnergyIQTeaser } from "@/components/site/EnergyIQTeaser";
import { useEffect } from "react";

const Index = () => {
  useEffect(() => {
    document.title = "Clean Energy Gurus — UK Managed Energy Platform";
    const meta = document.querySelector('meta[name="description"]') || (() => {
      const m = document.createElement("meta"); m.setAttribute("name", "description"); document.head.appendChild(m); return m;
    })();
    meta.setAttribute("content", "Lower energy costs, greater control and long-term support for UK homes, businesses, farms and landlords. Solar, battery, EV charging and heat pumps in one managed plan.");
  }, []);

  return (
    <SiteLayout>
      <Hero />
      <Segments />
      <Services />
      <Trust />
      <CaseStudies />
      <EnergyIQTeaser />
      <FinalCTA />
    </SiteLayout>
  );
};

export default Index;


