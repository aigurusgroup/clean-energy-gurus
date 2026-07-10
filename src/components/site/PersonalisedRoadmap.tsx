import { useState } from "react";
import {
  Sparkles,
  Sun,
  BatteryCharging,
  Plug,
  Thermometer,
  Activity,
  Check,
  ChevronDown,
  ArrowRight,
} from "lucide-react";
import { cn } from "@/lib/utils";

type PriorityLevel = "high" | "medium" | "future";

type RatingKey =
  | "Running Costs"
  | "Energy Independence"
  | "Property Appeal"
  | "Future Readiness"
  | "Environmental Impact"
  | "Energy IQ";

type RoadmapItem = {
  id: string;
  technology: string;
  priority: PriorityLevel;
  icon: React.ReactNode;
  whyMatters: string;
  whyHighlighted: string;
  benefits: string[];
  considerations: string;
  ratings: Partial<Record<RatingKey, number>>;
  nextStep: { title: string; body: string };
};

const PRIORITY_META: Record<PriorityLevel, { label: string; dot: string; text: string; ring: string }> = {
  high:   { label: "High Priority",       dot: "bg-emerald-500",  text: "text-emerald-700",  ring: "ring-emerald-500/20" },
  medium: { label: "Medium Priority",     dot: "bg-amber-400",    text: "text-amber-700",    ring: "ring-amber-400/20"   },
  future: { label: "Future Consideration",dot: "bg-slate-300",    text: "text-slate-600",    ring: "ring-slate-300/30"   },
};

const RATING_ORDER: RatingKey[] = [
  "Running Costs",
  "Energy Independence",
  "Property Appeal",
  "Future Readiness",
  "Environmental Impact",
  "Energy IQ",
];

const ITEMS: RoadmapItem[] = [
  {
    id: "solar",
    technology: "Solar PV",
    priority: "high",
    icon: <Sun className="h-5 w-5" />,
    whyMatters:
      "Generating electricity from your own roof can reduce the amount of electricity you purchase from the grid and provide greater long-term control over energy costs.",
    whyHighlighted:
      "Based on your property profile, current EPC information and your Energy IQ assessment, solar generation appears worthy of further investigation.",
    benefits: [
      "Lower running costs",
      "Greater energy independence",
      "Reduced exposure to future energy price rises",
      "Cleaner energy generation",
      "May improve Energy IQ",
      "May improve EPC performance",
      "Could improve future buyer appeal",
    ],
    considerations:
      "Roof orientation, roof condition, shading and electricity usage patterns all influence the suitability and performance of a solar installation.",
    ratings: { "Running Costs": 5, "Energy Independence": 5, "Property Appeal": 4, "Future Readiness": 5, "Environmental Impact": 4, "Energy IQ": 5 },
    nextStep: {
      title: "Arrange a Property Review",
      body: "A detailed assessment would confirm suitability, expected performance and potential financial return.",
    },
  },
  {
    id: "battery",
    technology: "Battery Storage",
    priority: "high",
    icon: <BatteryCharging className="h-5 w-5" />,
    whyMatters:
      "A home battery stores energy you generate or buy at cheaper times, so you can use it later when grid electricity is more expensive.",
    whyHighlighted:
      "Your assessment suggests a battery could meaningfully change how and when your property uses energy, especially alongside solar or a smart tariff.",
    benefits: [
      "Lower running costs",
      "Greater energy independence",
      "Reduced exposure to future energy price rises",
      "May improve Energy IQ",
    ],
    considerations:
      "Battery sizing depends on your typical daily usage, your generation profile and how you'd like to use stored energy across the day.",
    ratings: { "Running Costs": 4, "Energy Independence": 5, "Property Appeal": 3, "Future Readiness": 5, "Environmental Impact": 3, "Energy IQ": 4 },
    nextStep: {
      title: "Arrange a Property Review",
      body: "A closer look at your usage patterns would confirm the right battery size and expected benefit.",
    },
  },
  {
    id: "ev",
    technology: "EV Charging",
    priority: "medium",
    icon: <Plug className="h-5 w-5" />,
    whyMatters:
      "A dedicated home charger lets you fuel a vehicle overnight at lower cost and, in many cases, directly from your own generation.",
    whyHighlighted:
      "Given your property setup and future energy plans, planning for EV charging now can avoid retrofitting cost and complexity later.",
    benefits: [
      "Lower running costs",
      "Greater energy independence",
      "Cleaner energy generation",
      "Could improve future buyer appeal",
    ],
    considerations:
      "Parking arrangement, cable routing, tariff choice and future vehicle plans all shape the right charger and installation approach.",
    ratings: { "Running Costs": 4, "Energy Independence": 4, "Property Appeal": 4, "Future Readiness": 5, "Environmental Impact": 4, "Energy IQ": 3 },
    nextStep: {
      title: "Arrange a Property Review",
      body: "We'd review your parking, electrical setup and tariff options to recommend the most suitable charger.",
    },
  },
  {
    id: "ashp",
    technology: "Air Source Heat Pumps",
    priority: "medium",
    icon: <Thermometer className="h-5 w-5" />,
    whyMatters:
      "A heat pump provides heating and hot water using significantly less energy than a traditional boiler by moving heat rather than burning fuel.",
    whyHighlighted:
      "Your property profile and heating information suggest a heat pump may be worth understanding as part of your longer-term plan.",
    benefits: [
      "Lower running costs",
      "Cleaner energy generation",
      "May improve EPC performance",
      "Could improve future buyer appeal",
      "May improve Energy IQ",
    ],
    considerations:
      "Insulation levels, radiator sizing, hot water demand and available outdoor space all influence heat pump suitability and performance.",
    ratings: { "Running Costs": 4, "Energy Independence": 3, "Property Appeal": 4, "Future Readiness": 5, "Environmental Impact": 5, "Energy IQ": 4 },
    nextStep: {
      title: "Arrange a Property Review",
      body: "A property review would confirm heat loss, radiator suitability and the right specification for your home.",
    },
  },
  {
    id: "monitoring",
    technology: "Monitoring & Optimisation",
    priority: "future",
    icon: <Activity className="h-5 w-5" />,
    whyMatters:
      "Understanding how energy flows through your property is often the fastest way to reduce waste and get more value from anything you already have.",
    whyHighlighted:
      "Once your core setup is in place, monitoring becomes the quiet lever that keeps everything performing at its best over time.",
    benefits: [
      "Lower running costs",
      "Greater energy independence",
      "May improve Energy IQ",
    ],
    considerations:
      "Monitoring works best when paired with generation, storage or a smart tariff — it turns data into small, ongoing improvements.",
    ratings: { "Running Costs": 3, "Energy Independence": 3, "Property Appeal": 2, "Future Readiness": 4, "Environmental Impact": 3, "Energy IQ": 4 },
    nextStep: {
      title: "Arrange a Property Review",
      body: "We'd map out what to monitor first so improvements can be measured, not assumed.",
    },
  },
];

const Stars = ({ value }: { value: number }) => (
  <div className="flex items-center gap-0.5" aria-label={`${value} out of 5`}>
    {[1, 2, 3, 4, 5].map((i) => (
      <span
        key={i}
        className={cn(
          "text-[13px] leading-none",
          i <= value ? "text-navy" : "text-navy/15",
        )}
      >
        ★
      </span>
    ))}
  </div>
);

const PriorityPill = ({ level }: { level: PriorityLevel }) => {
  const meta = PRIORITY_META[level];
  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 rounded-full bg-white/70 backdrop-blur px-3 py-1 text-[11px] font-medium ring-1",
        meta.text,
        meta.ring,
      )}
    >
      <span className={cn("h-1.5 w-1.5 rounded-full", meta.dot)} />
      {meta.label}
    </span>
  );
};

const RoadmapCard = ({ item, index }: { item: RoadmapItem; index: number }) => {
  const [open, setOpen] = useState(index === 0);

  return (
    <article
      className={cn(
        "group rounded-3xl border border-border/70 bg-card/80 backdrop-blur-sm transition-all duration-500",
        "hover:border-border hover:shadow-elegant",
        open && "shadow-elegant",
      )}
    >
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="w-full flex items-center gap-5 p-6 sm:p-7 text-left"
      >
        <div className="grid h-12 w-12 flex-shrink-0 place-items-center rounded-2xl bg-surface text-navy">
          {item.icon}
        </div>
        <div className="flex-1 min-w-0">
          <PriorityPill level={item.priority} />
          <h4 className="mt-2 text-lg sm:text-xl font-display font-semibold text-navy tracking-tight">
            {item.technology}
          </h4>
        </div>
        <ChevronDown
          className={cn(
            "h-5 w-5 text-navy-soft transition-transform duration-300",
            open && "rotate-180",
          )}
        />
      </button>

      <div
        className={cn(
          "grid transition-all duration-500 ease-out",
          open ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0",
        )}
      >
        <div className="overflow-hidden">
          <div className="px-6 sm:px-7 pb-8 pt-1 space-y-8">
            <div className="h-px bg-border/70" />

            <div className="grid gap-8 lg:grid-cols-2">
              <div>
                <div className="text-[10px] font-semibold uppercase tracking-[0.18em] text-electric">
                  Why this matters
                </div>
                <p className="mt-2 text-[15px] leading-relaxed text-navy-soft">
                  {item.whyMatters}
                </p>
              </div>
              <div>
                <div className="text-[10px] font-semibold uppercase tracking-[0.18em] text-electric">
                  Why we've highlighted this
                </div>
                <p className="mt-2 text-[15px] leading-relaxed text-navy-soft">
                  {item.whyHighlighted}
                </p>
              </div>
            </div>

            <div>
              <div className="text-[10px] font-semibold uppercase tracking-[0.18em] text-electric">
                Potential benefits
              </div>
              <ul className="mt-3 grid gap-2 sm:grid-cols-2">
                {item.benefits.map((b) => (
                  <li key={b} className="flex items-start gap-2.5 text-sm text-navy">
                    <span className="mt-0.5 grid h-4 w-4 flex-shrink-0 place-items-center rounded-full bg-electric/10 text-electric">
                      <Check className="h-2.5 w-2.5" strokeWidth={3} />
                    </span>
                    <span className="leading-relaxed">{b}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <div className="text-[10px] font-semibold uppercase tracking-[0.18em] text-electric">
                Things to consider
              </div>
              <p className="mt-2 text-[15px] leading-relaxed text-navy-soft">
                {item.considerations}
              </p>
            </div>

            <div>
              <div className="text-[10px] font-semibold uppercase tracking-[0.18em] text-electric">
                What this could improve
              </div>
              <div className="mt-4 grid gap-x-8 gap-y-3 sm:grid-cols-2">
                {RATING_ORDER.filter((k) => item.ratings[k] !== undefined).map((k) => (
                  <div key={k} className="flex items-center justify-between border-b border-border/60 pb-2">
                    <span className="text-sm text-navy-soft">{k}</span>
                    <Stars value={item.ratings[k] as number} />
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-2xl bg-surface/70 border border-border/70 p-5 sm:p-6">
              <div className="text-[10px] font-semibold uppercase tracking-[0.18em] text-electric">
                Recommended next step
              </div>
              <div className="mt-2 flex flex-wrap items-start justify-between gap-4">
                <div className="max-w-xl">
                  <h5 className="text-base font-display font-semibold text-navy">
                    {item.nextStep.title}
                  </h5>
                  <p className="mt-1 text-sm text-navy-soft leading-relaxed">
                    {item.nextStep.body}
                  </p>
                </div>
                <ArrowRight className="h-4 w-4 text-electric mt-1" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
};

export const PersonalisedRoadmap = () => {
  return (
    <section className="mt-14">
      <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-electric">
        <Sparkles className="h-3.5 w-3.5" />
        Personalised for your property
      </div>
      <h3 className="mt-3 text-2xl sm:text-3xl font-display font-semibold text-navy tracking-tight">
        Your Personalised Roadmap
      </h3>
      <div className="mt-3 max-w-2xl space-y-3 text-[15px] text-navy-soft leading-relaxed">
        <p>
          Based on your property, your Energy IQ assessment and your stated
          goals, these are the areas most likely to improve your property's
          long-term energy performance.
        </p>
        <p>
          This is not a product recommendation. It is a prioritised roadmap to
          help you understand where the greatest opportunities may exist.
        </p>
      </div>

      <div className="mt-8 space-y-4">
        {ITEMS.map((item, i) => (
          <RoadmapCard key={item.id} item={item} index={i} />
        ))}
      </div>
    </section>
  );
};

export default PersonalisedRoadmap;
