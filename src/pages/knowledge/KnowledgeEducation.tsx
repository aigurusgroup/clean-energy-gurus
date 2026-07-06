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

interface Group {
  heading: string;
  eyebrow: string;
  items: { tag: string; title: string; summary: string }[];
}

const GroupedListPage = ({ metaTitle, metaDesc, eyebrow, heroTitle, lead, groups }: {
  metaTitle: string; metaDesc: string; eyebrow: string; heroTitle: ReactNode; lead: string; groups: Group[];
}) => {
  useEffect(() => {
    document.title = metaTitle;
    const m = document.querySelector('meta[name="description"]') as HTMLMetaElement;
    if (m) m.content = metaDesc;
  }, [metaTitle, metaDesc]);
  return (
    <SiteLayout>
      <PageHero eyebrow={eyebrow} title={heroTitle} lead={lead} />
      <section className="py-20">
        <div className="container-tight space-y-16">
          {groups.map((g) => (
            <div key={g.heading} id={g.eyebrow.toLowerCase().replace(/\s+/g, "-")} className="scroll-mt-24">
              <div className="mb-6">
                <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-electric">{g.eyebrow}</div>
                <h2 className="mt-2 text-2xl lg:text-3xl font-display font-semibold text-navy">{g.heading}</h2>
              </div>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {g.items.map((p) => (
                  <article key={p.title} className="card-premium p-7">
                    <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-electric">{p.tag}</div>
                    <h3 className="mt-3 text-lg font-display font-semibold text-navy leading-snug">{p.title}</h3>
                    <p className="mt-3 text-sm text-muted-foreground leading-relaxed">{p.summary}</p>
                    <div className="mt-5 text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">Coming soon</div>
                  </article>
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

export const KnowledgeArticles = () => (
  <GroupedListPage
    metaTitle="Clean Energy Articles & Guides | Clean Energy Gurus"
    metaDesc="Educational written content on clean energy, solar, batteries, EV charging and energy optimisation."
    eyebrow="Articles & Guides"
    heroTitle={<>Written guides on <span className="text-gradient">UK clean energy</span>.</>}
    lead="Independent, practical articles to help you make good decisions about solar, batteries, EV charging and long-term energy performance."
    groups={[
      {
        eyebrow: "Solar",
        heading: "Solar Guides",
        items: [
          { tag: "Basics", title: "How solar PV actually generates electricity", summary: "A plain-English explanation of panels, inverters and export." },
          { tag: "Sizing", title: "Sizing an array to your consumption", summary: "Why bigger isn't always better." },
          { tag: "Yield", title: "What UK yield really looks like", summary: "Realistic annual output and seasonality." },
          { tag: "Payback", title: "How to think about solar payback in 2026", summary: "Why payback maths are shifting and how to model them honestly." },
          { tag: "Roofs", title: "Roof suitability and shading", summary: "The site factors we assess before quoting." },
          { tag: "Integration", title: "Solar as part of a wider energy system", summary: "How solar interacts with batteries, EVs and tariffs." },
        ],
      },
      {
        eyebrow: "Battery Storage",
        heading: "Battery Storage Guides",
        items: [
          { tag: "Basics", title: "How home batteries actually work", summary: "Chemistry, capacity, usable capacity and cycles." },
          { tag: "Sizing", title: "Battery sizing: load-led, not solar-led", summary: "Why the tariff often matters more than solar." },
          { tag: "Dispatch", title: "Self-consumption vs trading dispatch", summary: "Different strategies for different homes and sites." },
          { tag: "Warranty", title: "Reading a battery warranty properly", summary: "Cycles, throughput and residual capacity clauses." },
          { tag: "Backup", title: "Backup power: what a battery really does", summary: "What islanding is, and what it isn't." },
          { tag: "Commercial", title: "Commercial storage revenue stacks", summary: "Peak-shaving, resilience, export and flexibility." },
        ],
      },
      {
        eyebrow: "EV Charging",
        heading: "EV Charging Guides",
        items: [
          { tag: "Home", title: "Home EV charging explained", summary: "Hardware, tariffs and solar-aware charging." },
          { tag: "Workplace", title: "Planning workplace charging that scales", summary: "Grid capacity, load balancing and access control." },
          { tag: "Fleet", title: "Fleet charging fundamentals", summary: "Depot design, duty cycles and OZEV routes." },
          { tag: "Tariffs", title: "EV tariffs that actually save money", summary: "What to look for and what to avoid." },
          { tag: "Solar", title: "Charging an EV from your own solar", summary: "How solar-aware charging logic really works." },
          { tag: "V2G", title: "V2G and what it means for you", summary: "Vehicle-to-grid explained without the hype." },
        ],
      },
      {
        eyebrow: "Energy Optimisation",
        heading: "Energy Optimisation Guides",
        items: [
          { tag: "Tariffs", title: "SEG and dynamic export explained", summary: "The tariffs that make export revenue meaningful — and how to qualify." },
          { tag: "Monitoring", title: "Why monitoring is the foundation of savings", summary: "A system isn't earning if it isn't performing." },
          { tag: "Reporting", title: "What good energy performance reporting looks like", summary: "Savings, revenue and ESG in one clear picture." },
          { tag: "Portfolio", title: "Landlord energy upgrades before MEES 2030", summary: "A practical portfolio-level roadmap." },
          { tag: "Farm", title: "Farm energy independence: what it really takes", summary: "Solar, storage, resilience and the load profile of a working farm." },
          { tag: "Service", title: "Choosing a managed energy partner vs. an installer", summary: "What changes when you buy a system as a managed service." },
        ],
      },
      {
        eyebrow: "Heat Pumps",
        heading: "Heat Pump Guides",
        items: [
          { tag: "Basics", title: "What Is an Air Source Heat Pump?", summary: "How the technology works and where it fits in a UK home." },
          { tag: "UK Homes", title: "Do Heat Pumps Work in UK Homes?", summary: "Performance in a UK climate and typical property types." },
          { tag: "Integration", title: "Heat Pumps and Solar Panels", summary: "How a heat pump can be paired with solar PV, battery storage and smart tariffs." },
          { tag: "Planning", title: "What to Consider Before Installing a Heat Pump", summary: "Radiators, hot water, electrical capacity and controls." },
          { tag: "Suitability", title: "Heat Pumps, Insulation and Property Suitability", summary: "Why fabric-first matters and how suitability is assessed on survey." },
        ],
      },
    ]}
  />
);
