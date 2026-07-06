import { Link } from "react-router-dom";
import {
  ArrowRight,
  ShieldCheck,
  PoundSterling,
  SlidersHorizontal,
  Home,
  Leaf,
  SunMedium,
  BatteryCharging,
  Car,
  Clock,
  Check,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import heroBg from "@/assets/hero-bg.png";

// Decorative Energy IQ score gauge
const ScoreGauge = () => {
  const size = 340;
  const r = 150;
  const c = 2 * Math.PI * r;
  const score = 74;
  const pct = score / 100;
  return (
    <div className="relative aspect-square w-full max-w-[420px] mx-auto">
      <svg viewBox="0 0 340 340" className="w-full h-full -rotate-90">
        <defs>
          <linearGradient id="gauge-grad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="hsl(260 85% 62%)" />
            <stop offset="55%" stopColor="hsl(225 95% 60%)" />
            <stop offset="100%" stopColor="hsl(200 100% 60%)" />
          </linearGradient>
        </defs>
        {/* track */}
        <circle
          cx="170"
          cy="170"
          r={r}
          stroke="hsl(var(--navy) / 0.08)"
          strokeWidth="14"
          fill="none"
        />
        {/* progress */}
        <circle
          cx="170"
          cy="170"
          r={r}
          stroke="url(#gauge-grad)"
          strokeWidth="14"
          fill="none"
          strokeLinecap="round"
          strokeDasharray={`${c * pct} ${c}`}
          className="drop-shadow-[0_0_12px_hsl(var(--electric)/0.35)]"
        />
        {/* tick marks (upper right arc, decorative) */}
        {Array.from({ length: 22 }).map((_, i) => {
          const a = (i / 22) * (Math.PI * 0.55) + Math.PI * 0.02;
          const x1 = 170 + Math.cos(a) * (r + 14);
          const y1 = 170 + Math.sin(a) * (r + 14);
          const x2 = 170 + Math.cos(a) * (r + 22);
          const y2 = 170 + Math.sin(a) * (r + 22);
          return (
            <line
              key={i}
              x1={x1}
              y1={y1}
              x2={x2}
              y2={y2}
              stroke="hsl(var(--electric) / 0.5)"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          );
        })}
      </svg>
      {/* center label */}
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
        <div className="text-[10px] font-semibold uppercase tracking-[0.22em] text-navy-soft">
          Energy IQ<sup>®</sup> Score
        </div>
        <div className="mt-1 text-[84px] leading-none font-display font-semibold text-gradient">
          {score}
        </div>
        <div className="mt-2 flex items-center gap-1.5 text-emerald-600 font-medium">
          <span>Good</span>
          <span className="inline-flex h-4 w-4 items-center justify-center rounded-full bg-emerald-100">
            <Check className="h-3 w-3" strokeWidth={3} />
          </span>
        </div>
        <div className="mt-3 px-6 text-xs text-navy-soft leading-snug max-w-[220px]">
          You're performing better than 74% of similar properties
        </div>
      </div>
    </div>
  );
};

type FloatLabelProps = {
  icon: React.ReactNode;
  title: string;
  body: string;
  position: string;
};

const FloatLabel = ({ icon, title, body, position }: FloatLabelProps) => (
  <div
    className={`hidden md:flex absolute ${position} items-start gap-2.5 rounded-2xl border border-navy/10 bg-card/90 backdrop-blur-sm px-3.5 py-2.5 shadow-[0_8px_24px_-12px_hsl(var(--navy)/0.25)] w-[168px] animate-fade-in`}
  >
    <span className="mt-0.5 inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-electric/10 text-electric">
      {icon}
    </span>
    <div>
      <div className="text-[13px] font-semibold text-navy leading-tight">
        {title}
      </div>
      <div className="text-[11px] text-navy-soft leading-tight mt-0.5">
        {body}
      </div>
    </div>
  </div>
);

type StatTileProps = {
  icon: React.ReactNode;
  eyebrow: string;
  value: string;
  sub: string;
};

const StatTile = ({ icon, eyebrow, value, sub }: StatTileProps) => (
  <div className="card-premium p-4 backdrop-blur-sm bg-card/85 flex items-center gap-3">
    <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-electric/10 text-electric">
      {icon}
    </span>
    <div className="min-w-0">
      <div className="text-[10px] font-semibold uppercase tracking-[0.18em] text-electric">
        {eyebrow}
      </div>
      <div className="text-sm text-navy-soft truncate">{sub}</div>
      <div className="text-lg font-display font-semibold text-gradient leading-tight">
        {value}
      </div>
    </div>
  </div>
);

export const Hero = () => (
  <section className="relative overflow-hidden bg-background pt-16 pb-20 lg:pt-24 lg:pb-28">
    {/* background image */}
    <img
      src={heroBg}
      alt=""
      aria-hidden
      className="absolute inset-0 w-full h-full object-cover opacity-10 pointer-events-none"
      style={{ objectPosition: "center 30%" }}
    />
    {/* fine grid */}
    <div className="absolute inset-0 grid-bg-fine pointer-events-none" />
    {/* soft radial glow behind gauge */}
    <div
      aria-hidden
      className="absolute right-0 top-1/4 w-[700px] h-[700px] rounded-full pointer-events-none opacity-60"
      style={{
        background:
          "radial-gradient(circle at center, hsl(var(--electric) / 0.10), transparent 60%)",
      }}
    />

    <div className="container-tight relative">
      <div className="grid lg:grid-cols-2 gap-12 lg:gap-10 items-center">
        {/* Left column */}
        <div className="animate-fade-in-up text-center lg:text-left">
          <span className="eyebrow">
            <span className="h-1.5 w-1.5 rounded-full bg-electric animate-pulse" />
            UK Managed Energy Platform
          </span>
          <h1 className="mt-6 text-[40px] sm:text-5xl lg:text-[64px] leading-[1.03] font-display font-semibold text-navy tracking-tight">
            Lower costs. Greater control.{" "}
            <span className="text-gradient">More energy confidence.</span>
          </h1>
          <p className="mt-6 text-base sm:text-lg text-navy-soft max-w-xl mx-auto lg:mx-0 leading-relaxed">
            We help UK homeowners, businesses, farms and landlords understand
            their property's energy position and make smarter, better-supported
            decisions — with long-term support built in.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center lg:justify-start">
            <Link to="/energy-iq">
              <Button
                size="lg"
                className="bg-gradient-electric text-white border-0 rounded-full px-7 h-12 shadow-glow hover:shadow-elegant"
              >
                Get Your Energy IQ <ArrowRight className="ml-1.5 h-4 w-4" />
              </Button>
            </Link>
            <Link to="/solar-calculator">
              <Button
                size="lg"
                variant="outline"
                className="rounded-full px-7 h-12 border-navy/15 text-navy hover:bg-navy hover:text-white"
              >
                Estimate My Solar
              </Button>
            </Link>
          </div>
          <p className="mt-5 flex items-start gap-2 text-sm text-muted-foreground max-w-xl mx-auto lg:mx-0">
            <ShieldCheck className="h-4 w-4 mt-0.5 shrink-0 text-electric" />
            <span>
              Solar PV, battery storage, EV charging and air source heat pumps —
              chosen to support the outcomes that matter to you, not sold as
              headline products.
            </span>
          </p>
        </div>

        {/* Right column - gauge with floating labels */}
        <div className="relative animate-fade-in">
          <div className="relative mx-auto max-w-[520px] px-6 md:px-12 py-10">
            <ScoreGauge />

            <FloatLabel
              position="top-0 -left-2 md:-left-4"
              icon={<PoundSterling className="h-4 w-4" />}
              title="Save Money"
              body="Lower bills year-round"
            />
            <FloatLabel
              position="top-0 -right-2 md:-right-4"
              icon={<SlidersHorizontal className="h-4 w-4" />}
              title="Gain Control"
              body="Manage your energy with ease"
            />
            <FloatLabel
              position="bottom-0 -left-2 md:-left-4"
              icon={<Home className="h-4 w-4" />}
              title="Increase Value"
              body="Boost property value & appeal"
            />
            <FloatLabel
              position="bottom-0 -right-2 md:-right-4"
              icon={<Leaf className="h-4 w-4" />}
              title="Future-Proof"
              body="Sustainable energy for the long term"
            />
          </div>
        </div>
      </div>

      {/* live tiles */}
      <div className="relative mt-14 grid grid-cols-2 lg:grid-cols-4 gap-3 max-w-5xl mx-auto animate-fade-in">
        <StatTile
          icon={<SunMedium className="h-5 w-5" />}
          eyebrow="Live"
          sub="Solar generating"
          value="14.2 kW"
        />
        <StatTile
          icon={<BatteryCharging className="h-5 w-5" />}
          eyebrow="Battery"
          sub="Exporting at peak"
          value="86%"
        />
        <StatTile
          icon={<Car className="h-5 w-5" />}
          eyebrow="EV"
          sub="Sessions active"
          value="3"
        />
        <StatTile
          icon={<Clock className="h-5 w-5" />}
          eyebrow="Tariff"
          sub="Optimising savings"
          value="On lowest 6h window"
        />
      </div>
    </div>
  </section>
);
