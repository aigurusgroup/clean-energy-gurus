import { ReactNode, useEffect } from "react";
import { Play } from "lucide-react";
import { SiteLayout } from "@/components/site/SiteLayout";
import { PageHero } from "@/components/site/PageHero";
import { FinalCTA } from "@/components/site/FinalCTA";

// -------- Generic small article/list template --------

interface ListPageProps {
  metaTitle: string;
  metaDesc: string;
  eyebrow: string;
  heroTitle: ReactNode;
  lead: string;
  items: { tag: string; title: string; summary: string }[];
}

const ListPage = ({ metaTitle, metaDesc, eyebrow, heroTitle, lead, items }: ListPageProps) => {
  useEffect(() => {
    document.title = metaTitle;
    const m = document.querySelector('meta[name="description"]') as HTMLMetaElement;
    if (m) m.content = metaDesc;
  }, [metaTitle, metaDesc]);
  return (
    <SiteLayout>
      <PageHero eyebrow={eyebrow} title={heroTitle} lead={lead} />
      <section className="py-20">
        <div className="container-tight grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((p) => (
            <article key={p.title} className="card-premium p-7">
              <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-electric">
                {p.tag}
              </div>
              <h3 className="mt-3 text-lg font-display font-semibold text-navy leading-snug">
                {p.title}
              </h3>
              <p className="mt-3 text-sm text-muted-foreground leading-relaxed">{p.summary}</p>
              <div className="mt-5 text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                Coming soon
              </div>
            </article>
          ))}
        </div>
      </section>
      <FinalCTA />
    </SiteLayout>
  );
};

// -------- Articles & Guides --------

export const KnowledgeArticles = () => (
  <ListPage
    metaTitle="Clean Energy Articles & Guides | Clean Energy Gurus"
    metaDesc="Educational written content on clean energy, solar, batteries, EV charging, savings and energy optimisation."
    eyebrow="Articles & Guides"
    heroTitle={<>Written guides on <span className="text-gradient">UK clean energy</span>.</>}
    lead="Independent, practical articles to help you make good decisions about solar, batteries, EV charging and long-term energy performance."
    items={[
      { tag: "Guide", title: "How to think about solar payback in 2026", summary: "Why payback maths are shifting and how to model them honestly." },
      { tag: "Guide", title: "Battery sizing: load-led, not solar-led", summary: "How to size storage against how you actually use energy." },
      { tag: "Guide", title: "SEG and dynamic export explained", summary: "The tariffs that make export revenue meaningful — and how to qualify." },
      { tag: "Guide", title: "Landlord energy upgrades before MEES 2030", summary: "A practical portfolio-level roadmap." },
      { tag: "Guide", title: "Farm energy independence: what it really takes", summary: "Solar, storage, resilience and the load profile of a working farm." },
      { tag: "Guide", title: "Choosing a managed energy partner vs. an installer", summary: "What changes when you buy a system as a managed service." },
    ]}
  />
);

export const KnowledgeSolar = () => (
  <ListPage
    metaTitle="Solar Education | Clean Energy Gurus"
    metaDesc="Everything UK property owners should understand about solar PV — sizing, yield, payback and integration."
    eyebrow="Solar Education"
    heroTitle={<>Solar, <span className="text-gradient">honestly explained</span>.</>}
    lead="How solar PV really works in the UK, what drives payback, and what to watch out for."
    items={[
      { tag: "Basics", title: "How solar PV actually generates electricity", summary: "A plain-English explanation of panels, inverters and export." },
      { tag: "Sizing", title: "Sizing an array to your consumption", summary: "Why bigger isn't always better." },
      { tag: "Yield", title: "What UK yield really looks like", summary: "Realistic annual output and seasonality." },
      { tag: "Payback", title: "What drives solar payback", summary: "Consumption, tariff, export price, degradation, maintenance." },
      { tag: "Roofs", title: "Roof suitability and shading", summary: "The site factors we assess before quoting." },
      { tag: "Integration", title: "Solar as part of a wider energy system", summary: "How solar interacts with batteries, EVs and tariffs." },
    ]}
  />
);

export const KnowledgeBattery = () => (
  <ListPage
    metaTitle="Battery Storage Education | Clean Energy Gurus"
    metaDesc="Home and commercial battery storage explained — sizing, dispatch, warranties and payback."
    eyebrow="Battery Education"
    heroTitle={<>Batteries, <span className="text-gradient">without the sales pitch</span>.</>}
    lead="How storage works, when it pays and how to avoid the most common mistakes."
    items={[
      { tag: "Basics", title: "How home batteries actually work", summary: "Chemistry, capacity, usable capacity and cycles." },
      { tag: "Sizing", title: "Sizing a battery to load and tariff", summary: "Why the tariff often matters more than solar." },
      { tag: "Dispatch", title: "Self-consumption vs trading dispatch", summary: "Different strategies for different homes and sites." },
      { tag: "Warranty", title: "Reading a battery warranty properly", summary: "Cycles, throughput and residual capacity clauses." },
      { tag: "Backup", title: "Backup power: what a battery really does", summary: "What islanding is, and what it isn't." },
      { tag: "Commercial", title: "Commercial storage revenue stacks", summary: "Peak-shaving, resilience, export and flexibility." },
    ]}
  />
);

export const KnowledgeEV = () => (
  <ListPage
    metaTitle="EV Charging Education | Clean Energy Gurus"
    metaDesc="Home, workplace and fleet EV charging explained — hardware, tariffs and integration with solar and storage."
    eyebrow="EV Charging Education"
    heroTitle={<>EV charging, <span className="text-gradient">integrated by default</span>.</>}
    lead="Everything UK homes, businesses and fleets should know about installing and running EV chargers well."
    items={[
      { tag: "Home", title: "Home EV charging explained", summary: "Hardware, tariffs and solar-aware charging." },
      { tag: "Workplace", title: "Planning workplace charging that scales", summary: "Grid capacity, load balancing and access control." },
      { tag: "Fleet", title: "Fleet charging fundamentals", summary: "Depot design, duty cycles and OZEV routes." },
      { tag: "Tariffs", title: "EV tariffs that actually save money", summary: "What to look for and what to avoid." },
      { tag: "Solar", title: "Charging an EV from your own solar", summary: "How solar-aware charging logic really works." },
      { tag: "V2G", title: "V2G and what it means for you", summary: "Vehicle-to-grid explained without the hype." },
    ]}
  />
);
