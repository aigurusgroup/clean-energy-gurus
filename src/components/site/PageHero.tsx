import { ReactNode } from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export const PageHero = ({ eyebrow, title, lead, image, cta = true }: { eyebrow: string; title: ReactNode; lead: string; image?: string; cta?: boolean }) => (
  <section className="relative overflow-hidden bg-gradient-soft pt-16 pb-20 lg:pt-24 lg:pb-28">
    <div className="absolute inset-0 grid-bg pointer-events-none" />
    <div className="absolute -top-32 -right-32 h-[400px] w-[400px] bg-gradient-electric opacity-15 blur-3xl rounded-full" />
    <div className="container-tight relative">
      <div className={`grid gap-12 items-center ${image ? "lg:grid-cols-12" : ""}`}>
        <div className={image ? "lg:col-span-7" : "max-w-3xl"}>
          <span className="eyebrow">{eyebrow}</span>
          <h1 className="mt-4 text-4xl sm:text-5xl lg:text-[58px] leading-[1.05] font-display font-semibold text-navy">{title}</h1>
          <p className="mt-6 text-lg text-navy-soft leading-relaxed max-w-2xl">{lead}</p>
          {cta && (
            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/contact">
                <Button size="lg" className="bg-gradient-electric text-white border-0 rounded-full px-7 h-12 shadow-glow">
                  Get a Free Energy Review <ArrowRight className="ml-1.5 h-4 w-4" />
                </Button>
              </Link>
              <Link to="/services">
                <Button size="lg" variant="outline" className="rounded-full px-7 h-12 border-navy/15 text-navy hover:bg-navy hover:text-white">
                  Explore Solutions
                </Button>
              </Link>
            </div>
          )}
        </div>
        {image && (
          <div className="lg:col-span-5">
            <div className="rounded-3xl overflow-hidden shadow-elegant border border-border/60">
              <img src={image} alt="" className="w-full h-auto object-cover" />
            </div>
          </div>
        )}
      </div>
    </div>
  </section>
);
