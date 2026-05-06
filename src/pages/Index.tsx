import { SiteLayout } from "@/components/site/SiteLayout";
import { Hero } from "@/components/site/Hero";
import { Segments } from "@/components/site/Segments";
import { Services } from "@/components/site/Services";
import { Optimisation } from "@/components/site/Optimisation";
import { Journey } from "@/components/site/Journey";
import { BusinessCase } from "@/components/site/BusinessCase";
import { PlatformPreview } from "@/components/site/PlatformPreview";
import { Process } from "@/components/site/Process";
import { Trust } from "@/components/site/Trust";
import { CaseStudies } from "@/components/site/CaseStudies";
import { FinalCTA } from "@/components/site/FinalCTA";
import { useEffect } from "react";

const Index = () => {
  useEffect(() => {
    document.title = "Clean Energy Gurus — UK Managed Energy Platform";
    const meta = document.querySelector('meta[name="description"]') || (() => {
      const m = document.createElement("meta"); m.setAttribute("name", "description"); document.head.appendChild(m); return m;
    })();
    meta.setAttribute("content", "Turn your property into a managed energy asset. Clean Energy Gurus delivers solar, batteries, EV charging and ongoing optimisation for UK businesses, farms, landlords and homes.");
  }, []);

  return (
    <SiteLayout>
      <Hero />
      <Segments />
      <Services />
      <Optimisation />
      <Journey />
      <BusinessCase />
      <PlatformPreview />
      <Process />
      <Trust />
      <CaseStudies />
      <FinalCTA />
    </SiteLayout>
  );
};

export default Index;
