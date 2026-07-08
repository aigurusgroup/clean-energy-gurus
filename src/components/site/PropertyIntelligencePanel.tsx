import { Sparkles, Home, Ruler, Flame, TrendingUp, Building2, Layers, Wrench, Clock } from "lucide-react";
import type { PropertyIntelligence as PropertyIntelligenceData, EpcRating } from "@/lib/propertyIntelligence";

const RATING_COLOR: Record<EpcRating, string> = {
  A: "hsl(140 65% 40%)",
  B: "hsl(95 60% 42%)",
  C: "hsl(70 70% 45%)",
  D: "hsl(45 90% 50%)",
  E: "hsl(30 90% 55%)",
  F: "hsl(15 85% 55%)",
  G: "hsl(0 75% 55%)",
};

const RatingBadge = ({ rating, score, label }: { rating: EpcRating; score: number; label: string }) => (
  <div className="rounded-2xl border border-border bg-card p-5">
    <div className="text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
      {label}
    </div>
    <div className="mt-3 flex items-center gap-3">
      <div
        className="h-14 w-14 rounded-xl grid place-items-center text-white font-display text-2xl font-semibold shadow-md"
        style={{ background: RATING_COLOR[rating] }}
        aria-label={`Rating ${rating}`}
      >
        {rating}
      </div>
      <div>
        <div className="text-3xl font-display font-semibold text-navy tabular-nums leading-none">
          {score}
        </div>
        <div className="mt-1 text-xs text-muted-foreground">Energy score</div>
      </div>
    </div>
  </div>
);

const FactCard = ({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: React.ReactNode;
}) => (
  <div className="rounded-2xl border border-border bg-card p-5">
    <div className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
      <span className="text-electric">{icon}</span>
      {label}
    </div>
    <div className="mt-3 text-lg font-display font-semibold text-navy leading-tight">
      {value}
    </div>
  </div>
);

/**
 * Renders the Property Intelligence dashboard + Property Benchmark teaser
 * on the Energy IQ report. Additive — does not replace any existing
 * assessment output. Hidden entirely if no property data was found.
 */
export const PropertyIntelligencePanel = ({
  property,
}: {
  property: PropertyIntelligenceData;
}) => {
  return (
    <>
      <section className="mt-10">
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-electric">
          <Sparkles className="h-3.5 w-3.5" />
          Property Intelligence
        </div>
        <h3 className="mt-2 text-xl sm:text-2xl font-display font-semibold text-navy">
          What we've learned about your property
        </h3>
        <p className="mt-2 text-sm text-navy-soft max-w-2xl leading-relaxed">
          We've combined available property information with your assessment
          answers to help build your personalised Energy IQ.
        </p>

        <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <RatingBadge label="Current rating" rating={property.currentRating} score={property.currentScore} />
          <RatingBadge label="Potential rating" rating={property.potentialRating} score={property.potentialScore} />
          <FactCard
            icon={<Home className="h-3.5 w-3.5" />}
            label="Property type"
            value={property.propertyType}
          />
          <FactCard
            icon={<Building2 className="h-3.5 w-3.5" />}
            label="Built form"
            value={property.builtForm}
          />
          <FactCard
            icon={<Ruler className="h-3.5 w-3.5" />}
            label="Floor area"
            value={
              <>
                {property.floorAreaSqm}
                <span className="text-navy-soft text-sm font-normal ml-1">m²</span>
              </>
            }
          />
          <FactCard
            icon={<Flame className="h-3.5 w-3.5" />}
            label="Main heating"
            value={property.mainHeating}
          />
          <FactCard
            icon={<TrendingUp className="h-3.5 w-3.5" />}
            label="Improvement headroom"
            value={
              <>
                +{Math.max(0, property.potentialScore - property.currentScore)}
                <span className="text-navy-soft text-sm font-normal ml-1">points</span>
              </>
            }
          />
          <div className="rounded-2xl border border-border bg-card p-5 sm:col-span-2 lg:col-span-1">
            <div className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
              <Layers className="h-3.5 w-3.5 text-electric" />
              Address
            </div>
            <div className="mt-3 text-sm font-display font-semibold text-navy leading-snug">
              {property.address.line1}
              <div className="text-navy-soft font-normal">
                {property.address.town} · {property.address.postcode}
              </div>
            </div>
          </div>
        </div>

        {property.recommendedImprovements.length > 0 && (
          <div className="mt-6 rounded-2xl border border-electric/20 bg-electric/5 p-5">
            <div className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-electric">
              <Wrench className="h-3.5 w-3.5" />
              Recommended improvements for this property
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              {property.recommendedImprovements.map((r) => (
                <span
                  key={r}
                  className="inline-flex items-center gap-1.5 rounded-full bg-white border border-electric/30 px-3 py-1.5 text-xs font-medium text-navy"
                >
                  <span className="h-1.5 w-1.5 rounded-full bg-electric" />
                  {r}
                </span>
              ))}
            </div>
          </div>
        )}
      </section>

      <section className="mt-10">
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-electric">
          <TrendingUp className="h-3.5 w-3.5" />
          Property Benchmark
        </div>

        <div
          className="relative overflow-hidden rounded-2xl mt-3 border border-white/10 shadow-2xl"
          style={{
            background:
              "radial-gradient(ellipse at 20% 0%, hsl(230 55% 22%) 0%, hsl(225 55% 12%) 50%, hsl(222 60% 6%) 100%)",
          }}
        >
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -top-24 -right-16 h-[320px] w-[320px] rounded-full opacity-40 blur-3xl"
            style={{ background: "radial-gradient(circle, hsl(200 100% 55% / 0.55), transparent 60%)" }}
          />
          <div className="relative p-7 sm:p-9">
            <div className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.3em] text-white/70">
              <Clock className="h-3.5 w-3.5" />
              Coming soon
            </div>
            <h4 className="mt-3 text-xl sm:text-2xl font-display font-semibold text-white">
              Comparable Property Benchmark
            </h4>
            <p className="mt-3 text-sm sm:text-base text-white/70 leading-relaxed max-w-2xl">
              Future versions of Energy IQ will compare your property with
              thousands of similar homes to help you see exactly where you
              stand and where the biggest gains may be.
            </p>
            <ul className="mt-5 grid gap-2 sm:grid-cols-2 max-w-xl text-sm">
              {[
                "Property type",
                "Construction age",
                "Floor area",
                "Region",
                "Heating type",
                "Energy performance",
              ].map((s) => (
                <li key={s} className="flex items-center gap-2 text-white/80">
                  <span className="h-1.5 w-1.5 rounded-full bg-electric" />
                  {s}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>
    </>
  );
};
