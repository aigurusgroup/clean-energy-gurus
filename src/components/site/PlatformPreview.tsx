import { Link } from "react-router-dom";
import { ArrowRight, Building2, Zap, Battery, Plug, TrendingUp, Upload, Wrench } from "lucide-react";
import { Button } from "@/components/ui/button";

const tiles = [
  { icon: Building2, label: "Sites connected", value: "1,284", trend: "+24 this month", accent: false },
  { icon: Zap, label: "kW managed", value: "48.6 MW", trend: "Peak today 32.1 MW", accent: true },
  { icon: Battery, label: "Battery status", value: "82%", trend: "Discharging — peak window" },
  { icon: Plug, label: "EV ports", value: "2,940", trend: "311 active sessions" },
  { icon: TrendingUp, label: "Estimated savings", value: "£2.41M", trend: "YTD across portfolio", accent: true },
  { icon: Upload, label: "Export performance", value: "94%", trend: "vs. forecast" },
  { icon: Wrench, label: "Maintenance status", value: "All clear", trend: "0 critical alerts" },
];

export const PlatformPreview = () => (
  <section className="py-20 lg:py-28 bg-navy text-white relative overflow-hidden">
    <div className="absolute inset-0 grid-bg opacity-10 pointer-events-none" />
    <div className="absolute -top-40 right-0 h-[500px] w-[800px] bg-gradient-electric opacity-25 blur-3xl rounded-full" />

    <div className="container-tight relative">
      <div className="grid lg:grid-cols-12 gap-10 items-end mb-12">
        <div className="lg:col-span-7">
          <span className="eyebrow">Gurus Optimise™</span>
          <h2 className="mt-3 text-3xl sm:text-4xl lg:text-[52px] leading-[1.05] font-display font-semibold text-white">
            Your portfolio. <span className="text-gradient">One operating layer.</span>
          </h2>
          <p className="mt-5 text-white/75 text-lg leading-relaxed max-w-2xl">
            The dashboard that sits behind every install — bringing visibility,
            control and intelligence to your sites for the long term.
          </p>
        </div>
        <div className="lg:col-span-5 lg:text-right">
          <Link to="/about/how-we-work" className="inline-block">
            <Button className="bg-white text-navy hover:bg-white/90 rounded-full px-6">
              Learn more <ArrowRight className="ml-1.5 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>

      {/* Dashboard mock */}
      <div className="rounded-3xl border border-white/10 bg-white/[0.04] backdrop-blur-xl p-5 sm:p-7 shadow-2xl">
        {/* dashboard chrome */}
        <div className="flex items-center justify-between pb-5 mb-6 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="flex gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full bg-white/20" />
              <span className="h-2.5 w-2.5 rounded-full bg-white/20" />
              <span className="h-2.5 w-2.5 rounded-full bg-electric" />
            </div>
            <div className="text-xs text-white/60 font-mono">gurus-optimise.io / portfolio</div>
          </div>
          <div className="hidden sm:flex items-center gap-2 text-[11px] text-white/60">
            <span className="h-1.5 w-1.5 rounded-full bg-electric animate-pulse" /> Live · UK grid
          </div>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {tiles.map(({ icon: Icon, label, value, trend, accent }) => (
            <div
              key={label}
              className={`rounded-2xl p-5 border transition-all ${
                accent
                  ? "bg-gradient-electric border-transparent text-white shadow-glow"
                  : "bg-white/[0.04] border-white/10 hover:border-electric/40"
              }`}
            >
              <div className="flex items-center justify-between">
                <div className={`text-[10px] font-semibold uppercase tracking-[0.16em] ${accent ? "text-white/80" : "text-white/55"}`}>{label}</div>
                <Icon className={`h-4 w-4 ${accent ? "text-white" : "text-electric"}`} />
              </div>
              <div className="mt-4 text-2xl lg:text-3xl font-display font-semibold tracking-tight">{value}</div>
              <div className={`mt-1.5 text-xs ${accent ? "text-white/85" : "text-white/55"}`}>{trend}</div>
            </div>
          ))}

          {/* large chart tile */}
          <div className="sm:col-span-2 lg:col-span-4 rounded-2xl bg-white/[0.04] border border-white/10 p-6">
            <div className="flex items-center justify-between mb-5">
              <div>
                <div className="text-[10px] font-semibold uppercase tracking-[0.16em] text-white/55">Portfolio performance · 24h</div>
                <div className="text-base font-display font-semibold text-white mt-1">Generation vs. Export · MW</div>
              </div>
              <div className="flex items-center gap-3 text-[11px] text-white/60">
                <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-electric" /> Generation</span>
                <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-white/40" /> Export</span>
              </div>
            </div>
            <svg viewBox="0 0 600 140" className="w-full h-32" preserveAspectRatio="none">
              <defs>
                <linearGradient id="area" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="hsl(220 95% 60%)" stopOpacity="0.55" />
                  <stop offset="100%" stopColor="hsl(220 95% 60%)" stopOpacity="0" />
                </linearGradient>
              </defs>
              <path d="M0,110 C40,108 60,90 100,82 C140,74 170,55 210,42 C250,30 290,18 330,22 C370,26 410,42 450,55 C490,68 520,82 600,70 L600,140 L0,140 Z" fill="url(#area)" />
              <path d="M0,110 C40,108 60,90 100,82 C140,74 170,55 210,42 C250,30 290,18 330,22 C370,26 410,42 450,55 C490,68 520,82 600,70" stroke="hsl(220 95% 65%)" strokeWidth="2" fill="none" />
              <path d="M0,125 C50,122 90,118 140,112 C190,106 230,95 280,90 C330,85 380,90 430,95 C480,100 530,108 600,110" stroke="hsl(0 0% 100% / 0.5)" strokeWidth="1.5" strokeDasharray="4 4" fill="none" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  </section>
);
