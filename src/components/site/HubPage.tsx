import { ReactNode, useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowUpRight, LucideIcon } from "lucide-react";
import { SiteLayout } from "@/components/site/SiteLayout";
import { PageHero } from "@/components/site/PageHero";
import { FinalCTA } from "@/components/site/FinalCTA";

export interface HubItem {
  title: string;
  desc: string;
  to: string;
  icon?: LucideIcon;
}

interface Props {
  metaTitle: string;
  metaDesc: string;
  eyebrow: string;
  heroTitle: ReactNode;
  lead: string;
  sectionEyebrow?: string;
  sectionTitle?: string;
  items: HubItem[];
  extra?: ReactNode;
}

export const HubPage = ({
  metaTitle,
  metaDesc,
  eyebrow,
  heroTitle,
  lead,
  sectionEyebrow = "What's inside",
  sectionTitle = "Explore the section",
  items,
  extra,
}: Props) => {
  useEffect(() => {
    document.title = metaTitle;
    const meta =
      document.querySelector('meta[name="description"]') ||
      (() => {
        const m = document.createElement("meta");
        m.setAttribute("name", "description");
        document.head.appendChild(m);
        return m;
      })();
    meta.setAttribute("content", metaDesc);
  }, [metaTitle, metaDesc]);

  return (
    <SiteLayout>
      <PageHero eyebrow={eyebrow} title={heroTitle} lead={lead} />
      <section className="py-20 lg:py-24">
        <div className="container-tight">
          <div className="max-w-2xl mb-12">
            <span className="eyebrow">{sectionEyebrow}</span>
            <h2 className="mt-3 text-3xl sm:text-4xl font-display font-semibold text-navy">
              {sectionTitle}
            </h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {items.map(({ title, desc, to, icon: Icon }) => (
              <Link key={title} to={to} className="card-premium p-7 group flex flex-col">
                <div className="flex items-start justify-between">
                  {Icon ? (
                    <div className="h-12 w-12 rounded-xl bg-gradient-electric grid place-items-center text-white shadow-glow">
                      <Icon className="h-5 w-5" />
                    </div>
                  ) : (
                    <div className="h-12 w-12 rounded-xl bg-accent grid place-items-center text-electric font-display font-semibold" />
                  )}
                  <ArrowUpRight className="h-5 w-5 text-muted-foreground group-hover:text-electric transition-colors" />
                </div>
                <h3 className="mt-5 text-lg font-display font-semibold text-navy">{title}</h3>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed flex-1">{desc}</p>
                <div className="mt-5 text-xs font-semibold uppercase tracking-[0.18em] text-electric group-hover:translate-x-1 transition-transform">
                  Learn more →
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
      {extra}
      <FinalCTA />
    </SiteLayout>
  );
};
