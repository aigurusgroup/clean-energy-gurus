import { SiteLayout } from "@/components/site/SiteLayout";
import { PageHero } from "@/components/site/PageHero";
import { FinalCTA } from "@/components/site/FinalCTA";
import { CheckCircle2 } from "lucide-react";
import { useEffect } from "react";

interface Props {
  title: string;
  metaTitle: string;
  metaDesc: string;
  eyebrow: string;
  heroTitle: React.ReactNode;
  lead: string;
  image?: string;
  bullets: string[];
  sections?: { title: string; body: string }[];
}

export const SimplePage = ({ metaTitle, metaDesc, eyebrow, heroTitle, lead, image, bullets, sections = [] }: Props) => {
  useEffect(() => {
    document.title = metaTitle;
    const meta = document.querySelector('meta[name="description"]') || (() => {
      const m = document.createElement("meta"); m.setAttribute("name", "description"); document.head.appendChild(m); return m;
    })();
    meta.setAttribute("content", metaDesc);
  }, [metaTitle, metaDesc]);

  return (
    <SiteLayout>
      <PageHero eyebrow={eyebrow} title={heroTitle} lead={lead} image={image} />
      <section className="py-20 lg:py-24">
        <div className="container-tight grid lg:grid-cols-2 gap-12 lg:gap-20">
          <div>
            <h2 className="text-3xl lg:text-4xl font-display font-semibold text-navy">What's included</h2>
            <ul className="mt-6 space-y-3.5">
              {bullets.map((b) => (
                <li key={b} className="flex gap-3 text-navy">
                  <CheckCircle2 className="h-5 w-5 text-electric flex-shrink-0 mt-0.5" />
                  <span className="text-[15px]">{b}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="space-y-6">
            {sections.map((s) => (
              <div key={s.title} className="card-premium p-7">
                <h3 className="text-lg font-display font-semibold text-navy">{s.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{s.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      <FinalCTA />
    </SiteLayout>
  );
};
