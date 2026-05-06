import { SiteLayout } from "@/components/site/SiteLayout";
import { PageHero } from "@/components/site/PageHero";
import { Trust } from "@/components/site/Trust";
import { FinalCTA } from "@/components/site/FinalCTA";

const About = () => (
  <SiteLayout>
    <PageHero
      eyebrow="About"
      title={<>A UK clean energy platform — <span className="text-gradient">not just an installer</span>.</>}
      lead="Clean Energy Gurus exists to help UK property owners reduce energy costs and build long-term value through managed clean-energy systems."
    />
    <section className="py-20">
      <div className="container-tight grid lg:grid-cols-2 gap-14">
        <div>
          <h2 className="text-3xl font-display font-semibold text-navy">Why we exist</h2>
          <p className="mt-5 text-navy-soft text-lg leading-relaxed">
            The energy market is changing faster than most property owners can
            track. Solar alone isn't enough; batteries need intelligence; EV
            charging needs to integrate; tariffs need to be reviewed. We bring
            it all together as one managed system.
          </p>
        </div>
        <div>
          <h2 className="text-3xl font-display font-semibold text-navy">How we work</h2>
          <p className="mt-5 text-navy-soft text-lg leading-relaxed">
            We design and project-manage every system, partnering with accredited
            MCS, OZEV and DNO specialists for installation. Then we stay involved —
            monitoring, optimising and reporting for the life of the asset.
          </p>
        </div>
      </div>
    </section>
    <Trust />
    <FinalCTA />
  </SiteLayout>
);

export default About;
