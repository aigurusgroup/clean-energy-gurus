import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import heroBg from "@/assets/hero-bg.png";

export const Hero = () => (
  <section className="relative overflow-hidden bg-background pt-20 pb-24 lg:pt-28 lg:pb-32">
    {/* background image */}
    <img src={heroBg} alt="" aria-hidden className="absolute inset-0 w-full h-full object-cover opacity-50 pointer-events-none" style={{ objectPosition: "center 30%" }} />
    {/* fine grid */}
    <div className="absolute inset-0 grid-bg-fine pointer-events-none" />

    {/* G-arc visual */}
    <div className="absolute inset-x-0 bottom-0 h-[640px] pointer-events-none">
      <div className="absolute left-1/2 -translate-x-1/2 bottom-[-260px] arc-glow w-[1200px] h-[700px] animate-pulse-glow" />
      <svg className="absolute left-1/2 -translate-x-1/2 bottom-[-180px] w-[1100px] h-[1100px] opacity-90" viewBox="0 0 800 800" fill="none" aria-hidden>
        <defs>
          <linearGradient id="g1" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="hsl(260 85% 62%)" />
            <stop offset="50%" stopColor="hsl(225 95% 60%)" />
            <stop offset="100%" stopColor="hsl(200 100% 60%)" />
          </linearGradient>
          <linearGradient id="g2" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="hsl(220 95% 60%)" stopOpacity="0" />
            <stop offset="50%" stopColor="hsl(220 95% 60%)" stopOpacity="0.7" />
            <stop offset="100%" stopColor="hsl(220 95% 60%)" stopOpacity="0" />
          </linearGradient>
        </defs>
        {[320, 360, 400].map((r, i) => (
          <circle key={r} cx="400" cy="400" r={r} stroke="url(#g1)" strokeWidth={i === 1 ? 1.5 : 0.8} strokeOpacity={0.5 - i * 0.12} fill="none" />
        ))}
        {/* G-shaped arc */}
        <path d="M 700 400 A 300 300 0 1 1 400 100" stroke="url(#g1)" strokeWidth="2.5" fill="none" strokeLinecap="round" />
        <path d="M 700 400 L 540 400" stroke="url(#g1)" strokeWidth="2.5" fill="none" strokeLinecap="round" />
        <line x1="0" y1="400" x2="800" y2="400" stroke="url(#g2)" strokeWidth="1" />
      </svg>
      {/* connected nodes */}
      <div className="absolute inset-0">
        {[
          [12, 28], [22, 62], [38, 18], [48, 70], [62, 24], [76, 58], [88, 32],
        ].map(([x, y], i) => (
          <span
            key={i}
            className="absolute h-1.5 w-1.5 rounded-full bg-electric shadow-[0_0_12px_hsl(var(--electric))] animate-pulse-glow"
            style={{ left: `${x}%`, top: `${y}%`, animationDelay: `${i * 0.4}s` }}
          />
        ))}
      </div>
    </div>

    <div className="container-tight relative">
      <div className="max-w-4xl mx-auto text-center animate-fade-in-up">
        <span className="eyebrow">
          <span className="h-1.5 w-1.5 rounded-full bg-electric animate-pulse" />
          UK Managed Energy Platform
        </span>
        <h1 className="mt-6 text-[44px] sm:text-6xl lg:text-[76px] leading-[1.02] font-display font-semibold text-navy tracking-tight">
          Turn your property into a <span className="text-gradient">managed energy asset</span>
        </h1>
        <p className="mt-7 text-lg sm:text-xl text-navy-soft max-w-3xl mx-auto leading-relaxed">
          Solar, battery storage, EV charging and ongoing optimisation for homes,
          businesses, farms and landlords across the UK.
        </p>
        <div className="mt-9 flex flex-col sm:flex-row gap-3 justify-center">
          <Link to="/contact">
            <Button size="lg" className="bg-gradient-electric text-white border-0 rounded-full px-7 h-12 shadow-glow hover:shadow-elegant">
              Get a Free Energy Review <ArrowRight className="ml-1.5 h-4 w-4" />
            </Button>
          </Link>
          <Link to="/services">
            <Button size="lg" variant="outline" className="rounded-full px-7 h-12 border-navy/15 text-navy hover:bg-navy hover:text-white">
              Explore Solutions
            </Button>
          </Link>
        </div>
        <p className="mt-6 text-sm text-muted-foreground max-w-2xl mx-auto">
          Designed for lower energy costs, smarter export, stronger resilience and long-term site performance.
        </p>
      </div>

      {/* live tiles */}
      <div className="relative mt-16 grid grid-cols-2 lg:grid-cols-4 gap-3 max-w-5xl mx-auto animate-fade-in">
        {[
          ["Live", "Solar generating 14.2 kW"],
          ["Battery", "86% — exporting at peak"],
          ["EV", "3 sessions active"],
          ["Tariff", "On lowest 6h window"],
        ].map(([k, v]) => (
          <div key={k} className="card-premium p-4 backdrop-blur-sm bg-card/80">
            <div className="text-[10px] font-semibold uppercase tracking-[0.18em] text-electric">{k}</div>
            <div className="text-sm font-medium text-navy mt-1">{v}</div>
          </div>
        ))}
      </div>
    </div>
  </section>
);
