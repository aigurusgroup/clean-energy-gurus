import { SiteLayout } from "@/components/site/SiteLayout";
import { PageHero } from "@/components/site/PageHero";
import { FinalCTA } from "@/components/site/FinalCTA";

const posts = [
  { tag: "Market", title: "Why dynamic export tariffs are reshaping payback maths", date: "May 2026" },
  { tag: "Battery", title: "Sizing batteries for trading — not just self-consumption", date: "Apr 2026" },
  { tag: "Compliance", title: "What MEES 2030 means for landlord portfolios", date: "Mar 2026" },
  { tag: "Farm", title: "Five questions to ask before going off-grid on a working farm", date: "Feb 2026" },
  { tag: "Business", title: "The hidden ESG value of half-hourly performance data", date: "Jan 2026" },
  { tag: "Home", title: "When a heat pump pays back faster than a battery", date: "Dec 2025" },
];

const Insights = () => (
  <SiteLayout>
    <PageHero
      eyebrow="Insights"
      title={<>Clear thinking on the <span className="text-gradient">UK energy transition</span>.</>}
      lead="Notes, market reads and field observations from the Clean Energy Gurus team."
    />
    <section className="py-20">
      <div className="container-tight grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {posts.map((p) => (
          <article key={p.title} className="card-premium p-7">
            <div className="flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.18em]">
              <span className="text-electric">{p.tag}</span>
              <span className="text-muted-foreground">{p.date}</span>
            </div>
            <h3 className="mt-4 text-lg font-display font-semibold text-navy leading-snug">{p.title}</h3>
            <p className="mt-3 text-sm text-muted-foreground">A short summary of the article will appear here as we publish it.</p>
          </article>
        ))}
      </div>
    </section>
    <FinalCTA />
  </SiteLayout>
);

export default Insights;
