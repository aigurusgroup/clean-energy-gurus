import { useEffect } from "react";
import { Play, Users, ArrowRight, CheckCircle2 } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { SiteLayout } from "@/components/site/SiteLayout";
import { PageHero } from "@/components/site/PageHero";
import { FinalCTA } from "@/components/site/FinalCTA";

const videoSeries = [
  {
    title: "Energy Made Simple",
    blurb: "Short, plain-English videos on solar, batteries, EV charging and payback for UK homes.",
    episodes: [
      "Solar Panels Explained Simply",
      "Do Solar Panels Work in the UK?",
      "Solar and Battery Storage: When Does It Make Sense?",
      "What Affects Solar Payback?",
      "EV Charging at Home Explained",
      "Common Mistakes When Buying Solar",
    ],
  },
  {
    title: "Installer Partner Series",
    blurb: "Videos for MCS installers exploring the Clean Energy Gurus partner network.",
    episodes: [
      "Why Installers Partner With Clean Energy Gurus",
      "How We Support Installers With Qualified Leads",
      "What Makes a Good Installer Partner?",
      "Our Quality Standards",
      "Protecting the Customer and Installer Relationship",
    ],
  },
  {
    title: "Real Projects / Case Studies",
    blurb: "Real UK projects — what the customer wanted, what we recommended and what happened next.",
    episodes: [
      "Residential Solar and Battery Case Study",
      "Commercial Solar Case Study",
      "Farm Energy Upgrade Case Study",
      "Landlord EV Charging Case Study",
      "What the Customer Wanted, What We Recommended, and What Happened Next",
    ],
  },
];

export const KnowledgeVideos = () => {
  useEffect(() => {
    document.title = "Video Library | Clean Energy Gurus";
    const m = document.querySelector('meta[name="description"]') as HTMLMetaElement;
    if (m) m.content = "Educational mini-series on UK clean energy — solar, batteries, EV charging, installer partnership and real project case studies.";
  }, []);
  return (
    <SiteLayout>
      <PageHero
        eyebrow="Video Library"
        title={<>Short, honest videos on <span className="text-gradient">clean energy</span>.</>}
        lead="Three mini-series designed to make clean energy decisions easier — for homeowners, installers and businesses."
      />
      <section className="py-20">
        <div className="container-tight space-y-14">
          {videoSeries.map((s) => (
            <div key={s.title}>
              <div className="max-w-2xl mb-8">
                <span className="eyebrow">Series</span>
                <h2 className="mt-3 text-2xl sm:text-3xl font-display font-semibold text-navy">{s.title}</h2>
                <p className="mt-3 text-navy-soft leading-relaxed">{s.blurb}</p>
              </div>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {s.episodes.map((ep, i) => (
                  <div key={ep} className="card-premium overflow-hidden group">
                    <div className="aspect-video bg-navy relative grid place-items-center overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-electric opacity-20" />
                      <div className="absolute inset-0 grid-bg opacity-20" />
                      <div className="relative h-14 w-14 rounded-full bg-white/95 grid place-items-center shadow-elegant group-hover:scale-105 transition-transform">
                        <Play className="h-6 w-6 text-navy translate-x-0.5" />
                      </div>
                      <div className="absolute top-3 left-3 px-2 py-0.5 rounded-full bg-background/90 text-[10px] font-semibold uppercase tracking-[0.16em] text-navy">
                        Ep {String(i + 1).padStart(2, "0")}
                      </div>
                    </div>
                    <div className="p-5">
                      <h3 className="text-sm font-display font-semibold text-navy leading-snug">{ep}</h3>
                      <div className="mt-3 text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                        Coming soon
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>
      <FinalCTA />
    </SiteLayout>
  );
};

const cases = [
  { tag: "Residential", title: "Residential Solar and Battery Case Study", summary: "A large UK home cuts imported energy by 70% with integrated solar, storage and tariff optimisation." },
  { tag: "Commercial", title: "Commercial Solar Case Study", summary: "A logistics site turns roof space into meaningful daytime supply and demand-charge savings." },
  { tag: "Agriculture", title: "Farm Energy Upgrade Case Study", summary: "A working farm builds resilience and revenue from ground-mount solar and battery dispatch." },
  { tag: "Landlord", title: "Landlord EV Charging Case Study", summary: "A landlord portfolio adds EV charging tenants can rely on, funded through a managed model." },
  { tag: "Story", title: "What the customer wanted, what we recommended, what happened next", summary: "Three short stories showing how a managed energy approach changes outcomes." },
];

export const KnowledgeCaseStudies = () => {
  useEffect(() => {
    document.title = "Case Studies | Clean Energy Gurus";
    const m = document.querySelector('meta[name="description"]') as HTMLMetaElement;
    if (m) m.content = "Real UK Clean Energy Gurus projects — residential, commercial, agricultural and landlord case studies.";
  }, []);
  return (
    <SiteLayout>
      <PageHero
        eyebrow="Case Studies"
        title={<>Real UK projects. <span className="text-gradient">Real numbers.</span></>}
        lead="What each customer wanted, what we recommended and what actually happened after install."
      />
      <section className="py-20">
        <div className="container-tight grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {cases.map((c) => (
            <article key={c.title} className="card-premium p-7">
              <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-electric">{c.tag}</div>
              <h3 className="mt-3 text-lg font-display font-semibold text-navy leading-snug">{c.title}</h3>
              <p className="mt-3 text-sm text-muted-foreground leading-relaxed">{c.summary}</p>
              <div className="mt-5 text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                Full study coming soon
              </div>
            </article>
          ))}
        </div>
      </section>
      <FinalCTA />
    </SiteLayout>
  );
};

const installerReasons = [
  "Qualified, surveyed jobs — not raw leads",
  "Materials delivered to site",
  "Design, DNO and grant paperwork handled centrally",
  "Fast, predictable payment",
  "Ongoing technical support",
  "A brand customers trust",
];

export const KnowledgeInstallerHub = () => {
  useEffect(() => {
    document.title = "Installer Partner Hub | Clean Energy Gurus";
    const m = document.querySelector('meta[name="description"]') as HTMLMetaElement;
    if (m) m.content = "The Installer Partner Hub — why MCS-accredited installers partner with Clean Energy Gurus and how the network works.";
  }, []);
  return (
    <SiteLayout>
      <PageHero
        eyebrow="Installer Partner Hub"
        title={<>Built <span className="text-gradient">for great installers</span>.</>}
        lead="An education-first hub for MCS-accredited installers who want steady, well-scoped jobs and central support."
      />
      <section className="py-20">
        <div className="container-tight grid lg:grid-cols-12 gap-12 items-start">
          <div className="lg:col-span-7">
            <span className="eyebrow"><span className="h-1.5 w-1.5 rounded-full bg-electric" />Why partner with CEG</span>
            <h2 className="mt-3 text-3xl font-display font-semibold text-navy">
              A different way to run your installation business.
            </h2>
            <p className="mt-4 text-navy-soft leading-relaxed">
              Clean Energy Gurus is a managed energy platform. We survey, design and sell the jobs — our accredited installer partners deliver them. That leaves great installers to do what they're best at.
            </p>
            <ul className="mt-8 space-y-3">
              {installerReasons.map((r) => (
                <li key={r} className="flex gap-3">
                  <CheckCircle2 className="h-5 w-5 text-electric shrink-0 mt-0.5" />
                  <span className="text-navy text-[15px]">{r}</span>
                </li>
              ))}
            </ul>
            <div className="mt-8 flex flex-col sm:flex-row gap-3">
              <Link to="/partners">
                <Button className="rounded-full h-12 px-6 bg-gradient-electric text-white border-0 shadow-glow">
                  Apply to become a partner <ArrowRight className="ml-1.5 h-4 w-4" />
                </Button>
              </Link>
              <Link to="/knowledge/videos">
                <Button variant="outline" className="rounded-full h-12 px-6 border-navy/15 text-navy hover:bg-navy hover:text-white">
                  Watch the installer series
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
                  <Users className="h-5 w-5" />
                </div>
                <h3 className="mt-5 text-xl font-display font-semibold">Installer education series</h3>
                <p className="mt-2 text-sm text-white/75 leading-relaxed">
                  Short videos on how the partnership works, quality standards, protecting the customer relationship and getting the best from our qualified pipeline.
                </p>
                <Link to="/knowledge/videos" className="mt-5 inline-flex items-center gap-2 text-electric text-sm font-semibold">
                  Watch the series <Play className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </aside>
        </div>
      </section>
      <FinalCTA />
    </SiteLayout>
  );
};
