import { useEffect } from "react";
import { Link } from "react-router-dom";
import { Compass, HeartHandshake, Workflow, ShieldCheck, ArrowRight, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SiteLayout } from "@/components/site/SiteLayout";
import { PageHero } from "@/components/site/PageHero";
import { Trust } from "@/components/site/Trust";
import { FinalCTA } from "@/components/site/FinalCTA";
import { Journey } from "@/components/site/Journey";
import { Process } from "@/components/site/Process";
import { PlatformPreview } from "@/components/site/PlatformPreview";

const values = [
  { icon: ShieldCheck, title: "Independent", body: "We recommend what actually fits the property — not what a manufacturer wants us to sell." },
  { icon: HeartHandshake, title: "Long-term", body: "We stay involved for the life of the asset, not until the invoice is paid." },
  { icon: Compass, title: "Transparent", body: "Clear numbers, clear trade-offs, clear reporting. No jargon, no small print." },
  { icon: Workflow, title: "System-first", body: "Every decision is made in the context of the whole energy system, not one piece of kit." },
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

      {/* How we work — Journey + Process + Platform */}
      <section id="how-we-work" className="scroll-mt-24 bg-surface">
        <div className="container-tight pt-20 lg:pt-24 pb-4 max-w-3xl">
          <span className="eyebrow">How We Work</span>
          <h2 className="mt-3 text-3xl font-display font-semibold text-navy">One team, one accountable partner</h2>
          <p className="mt-5 text-navy-soft text-lg leading-relaxed">
            We design and project-manage every system, partnering with accredited MCS, OZEV and DNO specialists for installation. Then we stay involved — monitoring, optimising and reporting for the life of the asset.
          </p>
        </div>
        <Journey />
        <Process />
        <PlatformPreview />
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

      {/* Partner network */}
      <section id="partners" className="py-20 lg:py-24 scroll-mt-24">
        <div className="container-tight grid lg:grid-cols-12 gap-12 items-start">
          <div className="lg:col-span-7">
            <span className="eyebrow"><span className="h-1.5 w-1.5 rounded-full bg-electric" />Our Partner Network</span>
            <h2 className="mt-3 text-3xl lg:text-4xl font-display font-semibold text-navy">
              Working With Trusted Partners
            </h2>
            <p className="mt-5 text-navy-soft text-lg leading-relaxed">
              Clean Energy Gurus works with a national network of trusted installation partners and industry specialists to deliver solar PV, battery storage, EV charging and wider clean energy solutions. Every partner is MCS, OZEV or manufacturer accredited for the technologies they fit — and continually assessed against our quality standards.
            </p>
            <ul className="mt-8 space-y-3">
              {[
                "MCS-certified solar and battery installers",
                "OZEV-approved EV charging engineers",
                "DNO-registered electrical contractors",
                "Manufacturer-accredited battery and inverter specialists",
                "UK-wide coverage, single point of accountability",
              ].map((r) => (
                <li key={r} className="flex gap-3">
                  <CheckCircle2 className="h-5 w-5 text-electric shrink-0 mt-0.5" />
                  <span className="text-navy text-[15px]">{r}</span>
                </li>
              ))}
            </ul>
            <div className="mt-8 flex flex-col sm:flex-row gap-3">
              <Link to="/partners">
                <Button className="rounded-full h-12 px-6 bg-gradient-electric text-white border-0 shadow-glow">
                  Become an Installer Partner <ArrowRight className="ml-1.5 h-4 w-4" />
                </Button>
              </Link>
              <Link to="/knowledge/installer-hub">
                <Button variant="outline" className="rounded-full h-12 px-6 border-navy/15 text-navy hover:bg-navy hover:text-white">
                  Visit the Installer Hub
                </Button>
              </Link>
            </div>
          </div>
          <aside className="lg:col-span-5">
            <div className="rounded-3xl bg-navy text-white p-8 relative overflow-hidden">
              <div className="absolute inset-0 grid-bg opacity-10" />
              <div className="absolute -top-24 -right-24 h-[300px] w-[300px] bg-gradient-electric opacity-25 blur-3xl rounded-full" />
              <div className="relative">
                <div className="h-12 w-12 rounded-xl bg-white/10 grid place-items-center text-electric">
                  <ShieldCheck className="h-5 w-5" />
                </div>
                <h3 className="mt-5 text-xl font-display font-semibold">CEG Accredited</h3>
                <p className="mt-2 text-sm text-white/75 leading-relaxed">
                  Every partner in the network holds CEG Accredited status — a continuously reviewed quality standard covering install workmanship, customer service and aftercare responsiveness.
                </p>
              </div>
            </div>
          </aside>
        </div>
      </section>

      <Trust />
      <FinalCTA />
    </SiteLayout>
  );
};

export default About;
