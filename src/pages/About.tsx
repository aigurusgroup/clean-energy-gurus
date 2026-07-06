import { useEffect } from "react";
import { Link } from "react-router-dom";
import { Compass, HeartHandshake, Workflow, ShieldCheck, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SiteLayout } from "@/components/site/SiteLayout";
import { PageHero } from "@/components/site/PageHero";
import { Trust } from "@/components/site/Trust";
import { FinalCTA } from "@/components/site/FinalCTA";

const values = [
  { icon: ShieldCheck, title: "Independent", body: "We recommend what actually fits the property — not what a manufacturer wants us to sell." },
  { icon: HeartHandshake, title: "Long-term", body: "We stay involved for the life of the asset, not until the invoice is paid." },
  { icon: Compass, title: "Transparent", body: "Clear numbers, clear trade-offs, clear reporting. No jargon, no small print." },
  { icon: Workflow, title: "System-first", body: "Every decision is made in the context of the whole energy system, not one piece of kit." },
];

const explore = [
  { title: "How We Work", desc: "The managed energy platform model — design, install, monitor, optimise.", to: "/about/how-we-work" },
  { title: "Partner Network", desc: "Our UK-wide network of accredited installation partners.", to: "/about/partner-network" },
];

const About = () => {
  useEffect(() => {
    document.title = "About Clean Energy Gurus | UK Managed Energy Platform";
    const m = document.querySelector('meta[name="description"]') as HTMLMetaElement;
    if (m) m.content = "Clean Energy Gurus is a UK managed energy platform — designing, installing and running clean energy systems with a network of accredited installation partners.";
  }, []);

  return (
    <SiteLayout>
      <PageHero
        eyebrow="About"
        title={<>A UK clean energy platform — <span className="text-gradient">not just an installer</span>.</>}
        lead="Clean Energy Gurus exists to help UK property owners reduce energy costs and build long-term value through managed clean-energy systems."
      />

      {/* Mission */}
      <section id="mission" className="py-20 lg:py-24 scroll-mt-24">
        <div className="container-tight max-w-3xl">
          <span className="eyebrow">Our Mission</span>
          <h2 className="mt-3 text-3xl font-display font-semibold text-navy">Why we exist</h2>
          <p className="mt-5 text-navy-soft text-lg leading-relaxed">
            The energy market is changing faster than most property owners can track. Solar alone isn't enough; batteries need intelligence; EV charging needs to integrate; tariffs need to be reviewed. We bring it all together as one managed system so homes, businesses, farms and landlords aren't left navigating it alone.
          </p>
        </div>
      </section>

      {/* Values */}
      <section id="values" className="py-20 bg-surface scroll-mt-24">
        <div className="container-tight">
          <div className="max-w-2xl mb-12">
            <span className="eyebrow">Our Values</span>
            <h2 className="mt-3 text-3xl sm:text-4xl font-display font-semibold text-navy">
              How we make decisions.
            </h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
            {values.map(({ icon: Icon, title, body }) => (
              <div key={title} className="card-premium p-7">
                <div className="h-12 w-12 rounded-xl bg-gradient-electric grid place-items-center text-white shadow-glow">
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="mt-5 text-lg font-display font-semibold text-navy">{title}</h3>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Explore more about CEG */}
      <section className="py-20 lg:py-24">
        <div className="container-tight">
          <div className="max-w-2xl mb-10">
            <span className="eyebrow">More about CEG</span>
            <h2 className="mt-3 text-3xl sm:text-4xl font-display font-semibold text-navy">Explore further.</h2>
          </div>
          <div className="grid md:grid-cols-2 gap-5">
            {explore.map((e) => (
              <Link key={e.to} to={e.to} className="card-premium p-7 group flex flex-col">
                <h3 className="text-lg font-display font-semibold text-navy">{e.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed flex-1">{e.desc}</p>
                <div className="mt-5 text-xs font-semibold uppercase tracking-[0.18em] text-electric group-hover:translate-x-1 transition-transform inline-flex items-center gap-1.5">
                  Learn more <ArrowRight className="h-3.5 w-3.5" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <Trust />
      <FinalCTA />
    </SiteLayout>
  );
};

export default About;
