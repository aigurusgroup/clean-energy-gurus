import { SiteLayout } from "@/components/site/SiteLayout";
import { PageHero } from "@/components/site/PageHero";
import { Services } from "@/components/site/Services";
import { FinalCTA } from "@/components/site/FinalCTA";
import { useEffect } from "react";

export default () => {
  useEffect(() => {
    document.title = "Services | Clean Energy Gurus";
  }, []);
  return (
    <SiteLayout>
      <PageHero
        eyebrow="Services"
        title={<>One stack. <span className="text-gradient">Every layer of clean energy.</span></>}
        lead="From the solar panel on the roof to the dispatch logic in the battery, we design, install and manage every layer of your energy system."
      />
      <Services />
      <FinalCTA />
    </SiteLayout>
  );
};
