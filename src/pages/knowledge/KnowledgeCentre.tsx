import { useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowUpRight, BookOpen, Sun, Battery, Plug, Film, FolderOpen, Users } from "lucide-react";
import { SiteLayout } from "@/components/site/SiteLayout";
import { PageHero } from "@/components/site/PageHero";
import { FinalCTA } from "@/components/site/FinalCTA";

const sections = [
  { icon: BookOpen, title: "Articles & Guides", desc: "Educational articles on clean energy, solar, batteries, EV charging, savings and optimisation.", to: "/knowledge/articles" },
  { icon: Sun, title: "Solar Education", desc: "How solar works, sizing, payback and what UK homes and businesses should know.", to: "/knowledge/solar" },
  { icon: Battery, title: "Battery Education", desc: "Battery sizing, dispatch modes, warranties and when storage actually pays.", to: "/knowledge/battery" },
  { icon: Plug, title: "EV Charging Education", desc: "Home, workplace and fleet charging explained — hardware, tariffs and integration.", to: "/knowledge/ev-charging" },
  { icon: Film, title: "Video Library", desc: "Short, honest video series that make energy decisions easier.", to: "/knowledge/videos" },
  { icon: FolderOpen, title: "Case Studies", desc: "Real UK projects — what the customer wanted, what we recommended, what happened.", to: "/knowledge/case-studies" },
  { icon: Users, title: "Installer Partner Hub", desc: "For installers exploring the Clean Energy Gurus partner network.", to: "/knowledge/installer-hub" },
];

const KnowledgeCentre = () => {
  useEffect(() => {
    document.title = "Knowledge Centre | Clean Energy Gurus";
    const m = document.querySelector('meta[name="description"]') as HTMLMetaElement;
    if (m) m.content = "The Clean Energy Gurus Knowledge Centre — articles, guides, videos, case studies and installer education on UK clean energy.";
  }, []);

  return (
    <SiteLayout>
      <PageHero
        eyebrow="Knowledge Centre"
        title={<>Clear thinking on <span className="text-gradient">clean energy</span>.</>}
        lead="Articles, guides, videos and case studies to help UK property owners understand solar, batteries, EV charging and long-term energy performance."
      />

      <section className="py-20 lg:py-24">
        <div className="container-tight">
          <div className="max-w-2xl mb-12">
            <span className="eyebrow">Explore the Knowledge Centre</span>
            <h2 className="mt-3 text-3xl sm:text-4xl font-display font-semibold text-navy">
              Seven ways in.
            </h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {sections.map(({ icon: Icon, title, desc, to }) => (
              <Link key={to} to={to} className="card-premium p-7 group flex flex-col">
                <div className="flex items-start justify-between">
                  <div className="h-12 w-12 rounded-xl bg-gradient-electric grid place-items-center text-white shadow-glow">
                    <Icon className="h-5 w-5" />
                  </div>
                  <ArrowUpRight className="h-5 w-5 text-muted-foreground group-hover:text-electric transition-colors" />
                </div>
                <h3 className="mt-5 text-lg font-display font-semibold text-navy">{title}</h3>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed flex-1">{desc}</p>
                <div className="mt-5 text-xs font-semibold uppercase tracking-[0.18em] text-electric group-hover:translate-x-1 transition-transform">
                  Open →
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <FinalCTA />
    </SiteLayout>
  );
};

export default KnowledgeCentre;
