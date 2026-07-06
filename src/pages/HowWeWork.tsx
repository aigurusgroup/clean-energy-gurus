import { useEffect } from "react";
import { SiteLayout } from "@/components/site/SiteLayout";
import { PageHero } from "@/components/site/PageHero";
import { Journey } from "@/components/site/Journey";
import { Process } from "@/components/site/Process";
import { PlatformPreview } from "@/components/site/PlatformPreview";
import { FinalCTA } from "@/components/site/FinalCTA";

const HowWeWork = () => {
  useEffect(() => {
    document.title = "How We Work | Clean Energy Gurus";
    const m = document.querySelector('meta[name="description"]') as HTMLMetaElement;
    if (m) m.content = "How Clean Energy Gurus designs, installs and manages clean energy systems as a single accountable partner for UK property owners.";
  }, []);

  return (
    <SiteLayout>
      <PageHero
        eyebrow="How We Work"
        title={<>One team, <span className="text-gradient">one accountable partner</span>.</>}
        lead="We design and project-manage every system, partnering with accredited MCS, OZEV and DNO specialists for installation. Then we stay involved — monitoring, optimising and reporting for the life of the asset."
      />
      <Journey />
      <Process />
      <PlatformPreview />
      <FinalCTA />
    </SiteLayout>
  );
};

export default HowWeWork;
