import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, ArrowLeft, CheckCircle2, Gauge, Sparkles, ShieldCheck } from "lucide-react";
import { SiteLayout } from "@/components/site/SiteLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "@/hooks/use-toast";
import { PropertyIntake } from "@/components/site/PropertyIntake";
import { PropertyIntelligencePanel } from "@/components/site/PropertyIntelligencePanel";
import { PersonalisedRoadmap } from "@/components/site/PersonalisedRoadmap";
import type { PropertyIntelligence } from "@/lib/propertyIntelligence";
import { supabase } from "@/integrations/supabase/client";

const QUESTIONNAIRE_VERSION = "v1";
const CALCULATION_VERSION = "v1";

function createAssessmentId() {
  const random =
    typeof crypto !== "undefined" && "randomUUID" in crypto
      ? crypto.randomUUID().replace(/-/g, "")
      : Math.random().toString(36).slice(2) + Date.now().toString(36);

  return `EIQ-${random.slice(0, 10).toUpperCase()}`;
}

function inferFailingField(message?: string | null, details?: string | null) {
  const text = `${message ?? ""} ${details ?? ""}`;
  return (
    text.match(/column "([^"]+)"/)?.[1] ??
    text.match(/null value in column "([^"]+)"/)?.[1] ??
    text.match(/invalid input syntax for type [^:]+: "?([a-zA-Z0-9_]+)"?/)?.[1] ??
    "not identified"
  );
}

type Option = { value: string; label: string; points?: number };
type Question = {
  id: string;
  category: "property" | "usage" | "tech" | "control" | "readiness";
  label: string;
  help?: string;
  options: Option[];
};

// 12 questions across 5 scoring categories (each category worth 20 pts)
const QUESTIONS: Question[] = [
  {
    id: "propertyType",
    category: "property",
    label: "What best describes your property?",
    options: [
      { value: "detached", label: "Detached house", points: 10 },
      { value: "semi", label: "Semi-detached / terraced", points: 8 },
      { value: "flat", label: "Flat / apartment", points: 3 },
      { value: "commercial", label: "Commercial / industrial building", points: 9 },
      { value: "agri", label: "Farm / agricultural site", points: 10 },
    ],
  },
  {
    id: "userType",
    category: "readiness",
    label: "Which best describes you?",
    options: [
      { value: "homeowner", label: "Homeowner", points: 4 },
      { value: "business", label: "Business owner / operator", points: 5 },
      { value: "landlord", label: "Landlord / portfolio owner", points: 5 },
      { value: "agri", label: "Farmer / agricultural site owner", points: 5 },
    ],
  },
  {
    id: "spaceSuitability",
    category: "property",
    label: "Do you have suitable roof space, land or parking?",
    help: "Roof for solar, land for ground-mount, or off-street parking for EV charging.",
    options: [
      { value: "plenty", label: "Yes — plenty of suitable space", points: 10 },
      { value: "some", label: "Some — likely workable", points: 7 },
      { value: "limited", label: "Limited space", points: 3 },
      { value: "unsure", label: "Not sure", points: 5 },
    ],
  },
  {
    id: "billBand",
    category: "usage",
    label: "Annual electricity usage",
    help: "Enter your annual electricity usage (kWh) if you know it. If not, choose the option that best matches your electricity bill.",
    options: [
      { value: "low", label: "Under £100/month (typically under 3,000 kWh/year)", points: 6 },
      { value: "mid", label: "£100–£250/month (typically 3,000–6,000 kWh/year)", points: 12 },
      { value: "high", label: "£250–£800/month (typically 6,000–15,000 kWh/year)", points: 17 },
      { value: "vhigh", label: "Over £800/month (typically 15,000+ kWh/year)", points: 20 },
    ],
  },
  {
    id: "heating",
    category: "usage",
    label: "Current main heating type",
    options: [
      { value: "gas", label: "Mains gas boiler", points: 0 },
      { value: "oil", label: "Oil / LPG boiler", points: 0 },
      { value: "electric", label: "Direct electric / storage heaters", points: 0 },
      { value: "heatpump", label: "Heat pump already installed", points: 0 },
      { value: "biomass", label: "Biomass / other", points: 0 },
    ],
  },
  {
    id: "solar",
    category: "tech",
    label: "Do you already have solar PV?",
    options: [
      { value: "yes", label: "Yes", points: 8 },
      { value: "no", label: "No", points: 0 },
      { value: "planning", label: "Planning / quoted", points: 4 },
    ],
  },
  {
    id: "battery",
    category: "tech",
    label: "Do you have battery storage?",
    options: [
      { value: "yes", label: "Yes", points: 7 },
      { value: "no", label: "No", points: 0 },
      { value: "considering", label: "Considering it", points: 3 },
    ],
  },
  {
    id: "ev",
    category: "tech",
    label: "EV charging position",
    options: [
      { value: "have", label: "Already have a charger installed", points: 5 },
      { value: "need", label: "Need one / planning EV soon", points: 3 },
      { value: "none", label: "No EV planned", points: 2 },
    ],
  },
  {
    id: "monitoring",
    category: "control",
    label: "Do you monitor, maintain or optimise your energy system?",
    options: [
      { value: "active", label: "Yes — actively monitored and optimised", points: 20 },
      { value: "basic", label: "Basic app / occasional check", points: 12 },
      { value: "interested", label: "Not yet, but interested", points: 8 },
      { value: "no", label: "No — I don't have visibility", points: 2 },
    ],
  },
  {
    id: "goal",
    category: "readiness",
    label: "Main energy goal",
    options: [
      { value: "cost", label: "Lower costs", points: 7 },
      { value: "independence", label: "Greater independence", points: 8 },
      { value: "ev", label: "EV charging", points: 6 },
      { value: "resilience", label: "Resilience / backup power", points: 8 },
      { value: "sustainability", label: "Sustainability", points: 7 },
      { value: "improvement", label: "Property improvement / asset value", points: 7 },
    ],
  },
  {
    id: "timeline",
    category: "readiness",
    label: "Timeline for making changes",
    options: [
      { value: "now", label: "Ready now — within 3 months", points: 10 },
      { value: "soon", label: "3–6 months", points: 8 },
      { value: "year", label: "6–12 months", points: 5 },
      { value: "explore", label: "Just exploring", points: 3 },
    ],
  },
  {
    id: "postcode",
    category: "readiness",
    label: "Postcode area",
    help: "First half of your postcode (e.g. SW1 or M14).",
    options: [], // free text; no scoring
  },
];

const CATEGORY_LABEL: Record<Question["category"], string> = {
  property: "Property suitability",
  usage: "Energy usage profile",
  tech: "Current technology position",
  control: "Control & optimisation",
  readiness: "Readiness & goals",
};

const CATEGORY_MAX = 20;

type Answers = Record<string, string>;

function kwhToBillBand(kwhStr: string | undefined): string | null {
  if (!kwhStr) return null;
  const n = parseInt(String(kwhStr).replace(/[^0-9]/g, ""), 10);
  if (!Number.isFinite(n) || n <= 0) return null;
  if (n < 3000) return "low";
  if (n < 6000) return "mid";
  if (n < 15000) return "high";
  return "vhigh";
}

function scoreAnswers(answers: Answers) {
  const raw: Record<Question["category"], number> = {
    property: 0, usage: 0, tech: 0, control: 0, readiness: 0,
  };
  const maxRaw: Record<Question["category"], number> = {
    property: 0, usage: 0, tech: 0, control: 0, readiness: 0,
  };
  const derivedBand = kwhToBillBand(answers.annualKwh);
  for (const q of QUESTIONS) {
    if (!q.options.length) continue;
    const maxQ = Math.max(...q.options.map((o) => o.points ?? 0));
    maxRaw[q.category] += maxQ;
    const ans = q.id === "billBand" && derivedBand ? derivedBand : answers[q.id];
    const opt = q.options.find((o) => o.value === ans);
    raw[q.category] += opt?.points ?? 0;
  }
  const perCategory = (Object.keys(raw) as Question["category"][]).map((c) => ({
    category: c,
    score: maxRaw[c] > 0 ? Math.round((raw[c] / maxRaw[c]) * CATEGORY_MAX) : 0,
  }));
  const total = perCategory.reduce((s, x) => s + x.score, 0);
  return { total, perCategory };
}

function categoryBand(total: number) {
  if (total >= 80) return { name: "High Performing Property", tone: "Your property is well set up. Focus on fine-tuning and long-term optimisation." };
  if (total >= 60) return { name: "Strong Opportunity", tone: "You have a strong base. Targeted upgrades and better control could unlock more value." };
  if (total >= 40) return { name: "Developing Potential", tone: "Good foundations — with the right sequence of upgrades, meaningful improvement is likely." };
  return { name: "Early Opportunity", tone: "You're at the start of the journey. A clear, staged plan can make the biggest difference." };
}

function recommend(answers: Answers) {
  const recs: string[] = [];
  if (answers.solar !== "yes") recs.push("Solar PV feasibility review");
  if (answers.battery !== "yes") recs.push("Battery storage sizing");
  if (answers.ev === "need") recs.push("EV charge point planning");
  if (answers.monitoring === "no" || answers.monitoring === "interested")
    recs.push("Energy monitoring & optimisation");
  if (answers.heating === "gas" || answers.heating === "oil")
    recs.push("Air source heat pump suitability (subject to survey)");
  if (answers.solar === "yes" && answers.battery === "yes")
    recs.push("Tariff & export optimisation review");
  if (!recs.length) recs.push("Ongoing monitoring, maintenance and tariff review");
  return recs.slice(0, 5);
}



// ————— Personalised result helpers —————

type Segment = "home" | "business" | "landlord" | "agri";

function segmentFor(answers: Answers): Segment {
  const u = answers.userType;
  if (u === "business") return "business";
  if (u === "landlord") return "landlord";
  if (u === "agri") return "agri";
  if (answers.propertyType === "commercial") return "business";
  if (answers.propertyType === "agri") return "agri";
  return "home";
}

function propertyNoun(segment: Segment) {
  switch (segment) {
    case "business": return "business";
    case "landlord": return "property";
    case "agri": return "site";
    default: return "home";
  }
}

function bandOutcome(score: number): string {
  if (score >= 80) {
    return "Your Energy IQ suggests your property may already have strong clean energy foundations or good optimisation potential. The next opportunity may be less about adding everything at once and more about improving performance, monitoring, maintenance and long-term control.";
  }
  if (score >= 60) {
    return "Your Energy IQ suggests your property may be well placed to benefit from a more joined-up clean energy plan. The priority now is to understand which improvements are most relevant, practical and suitable for your property.";
  }
  if (score >= 40) {
    return "Your Energy IQ suggests your property may already have some useful foundations, but there could still be meaningful opportunities to improve performance, reduce reliance on the grid and make better use of clean energy technologies.";
  }
  return "Your Energy IQ suggests there may be several clear areas to explore. This is not a negative result — it simply means your property may be at an earlier stage in its clean energy journey, with opportunities to improve generation, efficiency, control or long-term planning.";
}

function energyIQStory(answers: Answers): string[] {
  const seg = segmentFor(answers);
  const space = answers.spaceSuitability;
  const goal = answers.goal;
  const heating = answers.heating;
  const solar = answers.solar;
  const battery = answers.battery;
  const ev = answers.ev;
  const monitoring = answers.monitoring;
  const timeline = answers.timeline;
  const postcode = (answers.postcode || "").trim();

  // ————— Paragraph 1: adviser-style opening, tailored to segment + existing tech —————
  const openers: Record<Segment, string> = {
    home:
      "From what you've told us, your home appears to have a practical opportunity to improve energy control and make better use of clean energy technology.",
    business:
      "From what you've told us, energy cost control, resilience and long-term visibility appear to be important considerations for your business.",
    landlord:
      "From what you've told us, the property may benefit from a practical review of energy performance, tenant appeal and future infrastructure needs.",
    agri:
      "From what you've told us, resilience, energy cost control and making better use of available roof or land space may be important priorities for your site.",
  };
  let p1 = openers[seg];
  if (solar === "yes" && battery === "yes") {
    p1 += " With solar and battery already in place, the focus may shift towards how the system is performing day to day and whether tariffs or optimisation could add further value.";
  } else if (solar === "yes") {
    p1 += " With solar already installed, adding storage or better optimisation could be worth exploring to make more of what you generate.";
  } else if (solar === "planning") {
    p1 += " As solar is already on your radar, a closer feasibility review could help confirm sizing, layout and how it fits alongside other opportunities.";
  }

  // ————— Paragraph 2: goal + space + tech mix + timeline + heating/EV/monitoring —————
  const goalPhrase = (() => {
    switch (goal) {
      case "cost": return "Your focus on lowering costs";
      case "independence": return "Your focus on greater energy independence";
      case "resilience": return "Your focus on resilience and backup";
      case "sustainability": return "Your focus on sustainability";
      case "improvement": return "Your focus on improving the property";
      case "ev": return "Your focus on EV charging";
      default: return "The goals you've shared";
    }
  })();
  const spacePhrase =
    space === "plenty" ? "possible roof, land or parking space"
    : space === "some" ? "some workable roof, land or parking space"
    : space === "limited" ? "more limited available space"
    : "space that would need a closer look";
  const timelinePhrase =
    timeline === "now" ? "a relatively short timeline"
    : timeline === "soon" ? "plans to move within the next few months"
    : timeline === "year" ? "a longer planning window"
    : "an exploratory stage of thinking";

  let p2 = `${goalPhrase}, combined with ${spacePhrase} and ${timelinePhrase}, suggests that a joined-up review would be more useful than looking at any single upgrade in isolation.`;

  // Lead technology mention — respects what they already have
  const techMentions: string[] = [];
  if (solar !== "yes") techMentions.push("Solar PV may be worth exploring first");
  if (battery !== "yes") techMentions.push(solar === "yes" ? "battery storage could add flexibility" : "battery storage");
  if (heating === "gas" || heating === "oil" || heating === "electric") techMentions.push("heating efficiency");
  if (ev === "need") techMentions.push("EV charging readiness");
  if (monitoring === "no" || monitoring === "interested" || monitoring === "basic") techMentions.push("monitoring and optimisation");
  if (techMentions.length > 0) {
    const first = techMentions.shift() as string;
    if (techMentions.length > 0) {
      p2 += ` ${first}, with ${techMentions.join(", ")} considered as part of the wider plan.`;
    } else {
      p2 += ` ${first} as part of the wider plan.`;
    }
  }

  // ————— Paragraph 3: local / closing note —————
  let p3: string;
  if (postcode) {
    p3 = `Because your property is in the ${postcode} area, local factors such as roof suitability, planning considerations, installer availability and typical electricity usage patterns should all be reviewed before any recommendation is made.`;
  } else {
    p3 = "Before any recommendation is made, local factors such as property suitability, planning considerations and typical usage patterns would need to be reviewed as part of a closer conversation.";
  }
  if (seg === "landlord") {
    p3 += " It would also help to think about how any changes affect tenant experience and long-term property performance.";
  } else if (seg === "business") {
    p3 += " It would also help to think about operational hours, on-site load profile and any wider sustainability reporting needs.";
  } else if (seg === "agri") {
    p3 += " It would also help to think about how any changes fit around seasonal operations and existing site infrastructure.";
  }

  return [p1, p2, p3];
}



function priorityAreas(answers: Answers): string[] {
  const list: string[] = [];
  const seg = segmentFor(answers);

  if (answers.goal === "cost" || answers.billBand === "high" || answers.billBand === "vhigh") {
    list.push("Lower energy costs");
  }
  if (answers.solar !== "yes" && answers.spaceSuitability !== "limited") {
    list.push("On-site generation");
  }
  if (answers.battery !== "yes") {
    list.push("Storage and flexibility");
  }
  if (answers.ev === "need" || answers.ev === "have") {
    list.push("EV charging readiness");
  }
  if (answers.heating === "gas" || answers.heating === "oil" || answers.heating === "electric") {
    list.push("Heating and efficiency");
  }
  if (answers.monitoring === "no" || answers.monitoring === "interested" || answers.monitoring === "basic") {
    list.push("Monitoring and optimisation");
  }
  if (answers.goal === "resilience" || answers.goal === "independence") {
    list.push("Resilience and backup");
  }
  if (answers.spaceSuitability === "unsure" || answers.spaceSuitability === "limited") {
    list.push("Property suitability review");
  }
  if (answers.timeline === "year" || answers.timeline === "explore" || seg === "landlord" || seg === "business") {
    list.push("Long-term energy planning");
  }

  // De-dupe and cap
  return Array.from(new Set(list)).slice(0, 6);
}

type Opportunity = { title: string; body: string };

function opportunities(answers: Answers): Opportunity[] {
  const out: Opportunity[] = [];

  if (answers.solar !== "yes") {
    out.push({
      title: "Solar PV",
      body:
        "Solar PV may be worth exploring if your property has suitable roof or land space. A technical review would help confirm what is realistic and whether it fits your wider goals.",
    });
  }
  if (answers.battery !== "yes") {
    out.push({
      title: "Battery storage",
      body:
        "Battery storage could be relevant if you want to improve flexibility, make better use of solar generation or reduce reliance on peak-rate electricity. Suitability would depend on your usage profile and system design.",
    });
  }
  if (answers.ev === "need" || answers.ev === "have") {
    out.push({
      title: "EV charging",
      body:
        "EV charging could form part of your wider energy plan, especially if you are preparing for home, workplace or tenant charging needs. The next step would be to review parking, electrical capacity and likely usage.",
    });
  }
  if (answers.heating === "gas" || answers.heating === "oil" || answers.heating === "electric") {
    out.push({
      title: "Air source heat pumps",
      body:
        "Air source heat pumps may be worth considering as part of a wider heating and efficiency plan. Property suitability, insulation, hot water demand and system design would all need to be reviewed.",
    });
  }
  if (answers.monitoring !== "active") {
    out.push({
      title: "Monitoring & optimisation",
      body:
        "Monitoring and optimisation could help you better understand how energy is being used, how systems are performing and where improvements may be possible over time.",
    });
  }
  if (answers.goal === "resilience" || answers.goal === "independence") {
    out.push({
      title: "Energy resilience",
      body:
        "Energy resilience may be important if continuity, backup capability or greater independence are priorities for your property or site.",
    });
  }

  return out.slice(0, 6);
}

function nextSteps(answers: Answers): string[] {
  const seg = segmentFor(answers);
  const noun = propertyNoun(seg);
  const steps: string[] = [
    "Review your Energy IQ summary at your own pace.",
    `Look more closely at your ${noun}, current usage and what you'd like to achieve.`,
    "Confirm what is technically suitable through a closer property review.",
    "Prioritise the opportunities that are most relevant to your goals.",
  ];
  if (seg === "business") {
    steps.push("Discuss your Energy IQ with Clean Energy Gurus to shape a practical plan for your business.");
  } else if (seg === "landlord") {
    steps.push("Discuss your Energy IQ with Clean Energy Gurus to see how it could support tenant appeal and long-term property performance.");
  } else if (seg === "agri") {
    steps.push("Discuss your Energy IQ with Clean Energy Gurus to explore what could work as part of a practical farm energy plan.");
  } else {
    steps.push("Discuss your Energy IQ with Clean Energy Gurus to talk through what may be worth prioritising for your home.");
  }
  return steps;
}




const REVEAL_MS = 6000;

const CHECKPOINTS = [
  "Property profile reviewed",
  "Energy use signals assessed",
  "Improvement opportunities mapped",
  "Energy IQ calculated",
];

function bandForScore(score: number) {
  if (score >= 80) return "High Performing Property";
  if (score >= 60) return "Strong Opportunity";
  if (score >= 40) return "Developing Potential";
  return "Early Opportunity";
}

// Positions for the four radial spoke labels (angles in degrees from top)
const SPOKES = [
  { angle: -45, label: "Property" },
  { angle: 45, label: "Energy Use" },
  { angle: 135, label: "Opportunities" },
  { angle: 225, label: "Optimisation" },
];

const ScoreReveal = ({ target, onDone }: { target: number; onDone: () => void }) => {
  const [display, setDisplay] = useState(0);
  const [done, setDone] = useState(false);
  const [visibleCheckpoints, setVisibleCheckpoints] = useState(0);
  const [visibleSpokes, setVisibleSpokes] = useState(0);
  const startRef = useRef<number | null>(null);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    const prefersReduced =
      typeof window !== "undefined" &&
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) {
      setDisplay(target);
      setVisibleCheckpoints(CHECKPOINTS.length);
      setVisibleSpokes(SPOKES.length);
      setDone(true);
      return;
    }
    const step = (ts: number) => {
      if (startRef.current === null) startRef.current = ts;
      const elapsed = ts - startRef.current;
      const t = Math.min(1, elapsed / REVEAL_MS);
      // easeOutQuint — long approach, gentle land
      const eased = 1 - Math.pow(1 - t, 5);
      setDisplay(Math.round(eased * target));
      if (t < 1) {
        rafRef.current = requestAnimationFrame(step);
      } else {
        setDone(true);
      }
    };
    rafRef.current = requestAnimationFrame(step);

    const timers: number[] = [];
    CHECKPOINTS.forEach((_, i) => {
      timers.push(
        window.setTimeout(
          () => setVisibleCheckpoints((n) => Math.max(n, i + 1)),
          500 + i * ((REVEAL_MS - 800) / CHECKPOINTS.length),
        ),
      );
    });
    SPOKES.forEach((_, i) => {
      timers.push(
        window.setTimeout(
          () => setVisibleSpokes((n) => Math.max(n, i + 1)),
          400 + i * 420,
        ),
      );
    });

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      timers.forEach((id) => clearTimeout(id));
    };
  }, [target]);

  // Ring geometry (SVG viewBox 300x300)
  const VB = 300;
  const cx = VB / 2;
  const cy = VB / 2;
  const rOuter = 140;   // outer tick ring
  const rDashed = 118;  // rotating dashed ring
  const rMain = 96;     // main gradient gauge
  const rInner = 72;    // inner faint ring
  const strokeMain = 10;
  const circMain = 2 * Math.PI * rMain;
  const pct = Math.min(1, display / 100);
  const dashOffsetMain = circMain * (1 - pct);
  const band = bandForScore(target);

  // Outer tick marks (60 marks)
  const ticks = Array.from({ length: 60 }, (_, i) => i);

  return (
    <div
      className="relative overflow-hidden rounded-2xl border border-white/10 shadow-2xl"
      role="status"
      aria-live="polite"
      aria-atomic="true"
      style={{
        background:
          "radial-gradient(ellipse at 50% 20%, hsl(230 60% 22%) 0%, hsl(225 55% 12%) 45%, hsl(222 60% 6%) 100%)",
      }}
    >
      {/* Ambient background glows */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-24 left-1/2 -translate-x-1/2 h-[420px] w-[420px] rounded-full opacity-40 blur-3xl"
        style={{ background: "radial-gradient(circle, hsl(230 95% 60% / 0.55), transparent 60%)" }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-32 -left-20 h-[360px] w-[360px] rounded-full opacity-30 blur-3xl"
        style={{ background: "radial-gradient(circle, hsl(200 100% 55% / 0.5), transparent 60%)" }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.06]"
        style={{
          backgroundImage:
            "linear-gradient(hsl(0 0% 100%) 1px, transparent 1px), linear-gradient(90deg, hsl(0 0% 100%) 1px, transparent 1px)",
          backgroundSize: "44px 44px",
          maskImage: "radial-gradient(ellipse 70% 60% at 50% 45%, black 30%, transparent 85%)",
        }}
      />

      <div className="relative px-5 sm:px-8 lg:px-12 py-10 sm:py-14 text-center">
        {/* Screen-reader-friendly result (always available) */}
        <p className="sr-only">
          Your Energy IQ is {target} out of 100. Category: {band}.
        </p>

        {!done ? (
          <>
            <span className="inline-flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.3em] text-white/60">
              <Gauge className="h-3.5 w-3.5" /> Energy IQ · Activation
            </span>
            <h2 className="mt-4 text-2xl sm:text-3xl lg:text-4xl font-display font-semibold text-white">
              Calculating your Energy IQ…
            </h2>
            <p className="mt-3 text-white/60 max-w-md mx-auto text-sm sm:text-base">
              Reviewing your property profile, energy goals and improvement opportunities.
            </p>
          </>
        ) : (
          <>
            <span className="inline-flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.3em] text-white/70 animate-fade-in">
              <CheckCircle2 className="h-3.5 w-3.5" /> Final Score Lock
            </span>
            <h2 className="mt-4 text-2xl sm:text-3xl lg:text-4xl font-display font-semibold text-white animate-fade-in">
              Your Energy IQ is ready.
            </h2>
          </>
        )}

        {/* Ring assembly */}
        <div className="relative mx-auto mt-10 w-full" style={{ maxWidth: 380 }}>
          <div
            className="relative mx-auto"
            style={{ width: "100%", aspectRatio: "1 / 1", maxWidth: 340 }}
          >
            {/* Soft under-glow */}
            <div
              aria-hidden="true"
              className={`absolute inset-8 rounded-full blur-2xl transition-opacity duration-700 ${
                done ? "opacity-80" : "opacity-50"
              }`}
              style={{
                background:
                  "radial-gradient(circle, hsl(230 95% 60% / 0.55), hsl(200 100% 55% / 0.25) 55%, transparent 75%)",
              }}
            />

            {/* Radial spoke lines + labels (behind main ring) */}
            <svg
              viewBox={`0 0 ${VB} ${VB}`}
              className="absolute inset-0 h-full w-full"
              aria-hidden="true"
            >
              {SPOKES.map((s, i) => {
                const shown = i < visibleSpokes;
                const rad = ((s.angle - 90) * Math.PI) / 180;
                const x1 = cx + Math.cos(rad) * (rMain + 6);
                const y1 = cy + Math.sin(rad) * (rMain + 6);
                const x2 = cx + Math.cos(rad) * (rOuter - 4);
                const y2 = cy + Math.sin(rad) * (rOuter - 4);
                return (
                  <line
                    key={s.label}
                    x1={x1}
                    y1={y1}
                    x2={x2}
                    y2={y2}
                    stroke="hsl(210 80% 70% / 0.5)"
                    strokeWidth={1}
                    style={{
                      opacity: shown ? 1 : 0,
                      transition: "opacity 500ms ease-out",
                    }}
                  />
                );
              })}
            </svg>

            {/* Main SVG rings */}
            <svg
              viewBox={`0 0 ${VB} ${VB}`}
              className={`absolute inset-0 h-full w-full ${done ? "iq-ring-pulse" : ""}`}
            >
              <defs>
                <linearGradient id="iq-main-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="hsl(260 90% 65%)" />
                  <stop offset="50%" stopColor="hsl(225 100% 62%)" />
                  <stop offset="100%" stopColor="hsl(195 100% 60%)" />
                </linearGradient>
                <linearGradient id="iq-inner-grad" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="hsl(200 100% 60% / 0.6)" />
                  <stop offset="100%" stopColor="hsl(260 80% 60% / 0.6)" />
                </linearGradient>
              </defs>

              {/* Outer tick ring */}
              <g>
                {ticks.map((i) => {
                  const angle = (i / ticks.length) * 360;
                  const rad = ((angle - 90) * Math.PI) / 180;
                  const inner = rOuter - (i % 5 === 0 ? 10 : 5);
                  const outer = rOuter;
                  const x1 = cx + Math.cos(rad) * inner;
                  const y1 = cy + Math.sin(rad) * inner;
                  const x2 = cx + Math.cos(rad) * outer;
                  const y2 = cy + Math.sin(rad) * outer;
                  return (
                    <line
                      key={i}
                      x1={x1}
                      y1={y1}
                      x2={x2}
                      y2={y2}
                      stroke="hsl(210 40% 80%)"
                      strokeOpacity={i % 5 === 0 ? 0.55 : 0.25}
                      strokeWidth={1}
                    />
                  );
                })}
              </g>

              {/* Rotating dashed ring */}
              <g className={done ? "" : "iq-spin-slow"} style={{ transformOrigin: `${cx}px ${cy}px` }}>
                <circle
                  cx={cx}
                  cy={cy}
                  r={rDashed}
                  fill="none"
                  stroke="hsl(210 90% 75% / 0.35)"
                  strokeWidth={1}
                  strokeDasharray="2 6"
                />
              </g>

              {/* Counter-rotating faint ring */}
              <g className={done ? "" : "iq-spin-slow-reverse"} style={{ transformOrigin: `${cx}px ${cy}px` }}>
                <circle
                  cx={cx}
                  cy={cy}
                  r={rDashed - 8}
                  fill="none"
                  stroke="hsl(210 90% 75% / 0.15)"
                  strokeWidth={1}
                  strokeDasharray="1 4"
                />
              </g>

              {/* Main gauge track */}
              <circle
                cx={cx}
                cy={cy}
                r={rMain}
                fill="none"
                stroke="hsl(220 40% 30% / 0.6)"
                strokeWidth={strokeMain}
              />

              {/* Animated gauge fill (starts at 12 o'clock) */}
              <g style={{ transform: `rotate(-90deg)`, transformOrigin: `${cx}px ${cy}px` }}>
                <circle
                  cx={cx}
                  cy={cy}
                  r={rMain}
                  fill="none"
                  stroke="url(#iq-main-grad)"
                  strokeWidth={strokeMain}
                  strokeLinecap="round"
                  strokeDasharray={circMain}
                  strokeDashoffset={dashOffsetMain}
                  style={{
                    transition: "stroke-dashoffset 120ms linear",
                    filter: "drop-shadow(0 0 8px hsl(225 100% 62% / 0.6))",
                  }}
                />
              </g>

              {/* Inner faint ring */}
              <circle
                cx={cx}
                cy={cy}
                r={rInner}
                fill="none"
                stroke="url(#iq-inner-grad)"
                strokeOpacity={0.35}
                strokeWidth={1}
              />
            </svg>

            {/* Spoke labels (HTML for accessibility) */}
            {SPOKES.map((s, i) => {
              const shown = i < visibleSpokes;
              const rad = ((s.angle - 90) * Math.PI) / 180;
              const labelR = (rOuter + 12) / VB; // as fraction of viewport
              const x = 50 + Math.cos(rad) * labelR * 100;
              const y = 50 + Math.sin(rad) * labelR * 100;
              return (
                <div
                  key={s.label}
                  className="absolute text-[9px] sm:text-[10px] font-semibold uppercase tracking-[0.2em] text-white/70 whitespace-nowrap pointer-events-none"
                  style={{
                    left: `${x}%`,
                    top: `${y}%`,
                    transform: "translate(-50%, -50%)",
                    opacity: shown ? 1 : 0,
                    transition: "opacity 500ms ease-out 100ms",
                  }}
                >
                  {s.label}
                </div>
              );
            })}

            {/* Centre number */}
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <div className="text-5xl sm:text-6xl font-display font-semibold text-white tabular-nums leading-none">
                {display}
              </div>
              <div className="mt-1 text-[10px] sm:text-xs uppercase tracking-[0.3em] text-white/60">
                / 100
              </div>
              {done && (
                <div className="mt-2 text-[9px] font-semibold uppercase tracking-[0.28em] text-white/50 animate-fade-in">
                  Final score lock
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Checkpoint list — during animation */}
        {!done && (
          <ul className="mt-8 grid gap-2 max-w-sm mx-auto text-sm">
            {CHECKPOINTS.map((c, i) => {
              const shown = i < visibleCheckpoints;
              return (
                <li
                  key={c}
                  className={`flex items-center gap-3 rounded-lg px-3 py-2 border transition-all duration-500 ${
                    shown
                      ? "opacity-100 translate-y-0 border-white/15 bg-white/[0.04] text-white/90"
                      : "opacity-0 translate-y-2 border-transparent"
                  }`}
                  aria-hidden={!shown}
                >
                  <CheckCircle2 className="h-4 w-4 text-white/80 flex-shrink-0" style={{ color: "hsl(195 100% 65%)" }} />
                  <span className="text-left">{c}</span>
                </li>
              );
            })}
          </ul>
        )}

        {/* Final state */}
        {done && (
          <div className="animate-fade-in">
            <div
              className="mt-6 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/[0.06] px-4 py-1.5 text-sm font-semibold text-white backdrop-blur-sm"
              style={{ boxShadow: "0 0 24px hsl(225 100% 62% / 0.25)" }}
            >
              {band}
            </div>
            <p className="mt-4 text-base sm:text-lg text-white/90">
              Your Energy IQ: <strong className="tabular-nums text-white">{target} / 100</strong>
            </p>
            <div className="mt-6 flex justify-center">
              <Button
                onClick={onDone}
                className="rounded-full h-12 px-6 bg-gradient-electric text-white border-0 shadow-glow"
              >
                View my Energy IQ summary <ArrowRight className="ml-1.5 h-4 w-4" />
              </Button>
            </div>
            <p className="mt-6 text-xs text-white/50 max-w-md mx-auto">
              Your Energy IQ is an indicative guide only. It is not a technical design, quote or savings forecast.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};


// Map EPC data into questionnaire answers so we can skip Q1/Q5/Q12.
function inferAnswersFromProperty(p: PropertyIntelligence): Partial<Answers> {
  const pt = p.propertyType.toLowerCase();
  const bf = p.builtForm.toLowerCase();
  let propertyType: string;
  if (pt.includes("flat") || pt.includes("maisonette")) propertyType = "flat";
  else if (bf.includes("detached") && !bf.includes("semi")) propertyType = "detached";
  else propertyType = "semi";

  const heat = p.mainHeating.toLowerCase();
  let heating: string;
  if (heat.includes("heat pump")) heating = "heatpump";
  else if (heat.includes("gas")) heating = "gas";
  else if (heat.includes("oil") || heat.includes("lpg")) heating = "oil";
  else if (heat.includes("electric")) heating = "electric";
  else heating = "biomass";

  const postcode = (p.address.postcode.split(" ")[0] ?? "").slice(0, 5).toUpperCase();

  return { propertyType, heating, postcode };
}

// Question IDs auto-filled from EPC data — skipped from the manual flow.
const EPC_FILLED_IDS = new Set(["propertyType", "heating", "postcode"]);

const EnergyIQ = () => {
  const [step, setStep] = useState(-1); // -1 = intro/property intake, 0..N-1 questions, N = score, N+1 = lead form, N+2 = thanks
  const [revealed, setRevealed] = useState(false);
  const [answers, setAnswers] = useState<Answers>({});
  const [lead, setLead] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    postcode: "",
    privacyConsent: false,
    marketingConsent: false,
  });
  const [saving, setSaving] = useState(false);
  const [savedAssessment, setSavedAssessment] = useState<{
    assessmentId: string;
    answersStored: number;
    epcStored: boolean;
    ghlStatus?: "synced" | "failed" | "pending";
    ghlContactId?: string | null;
    ghlCustomFieldsUpdated?: number;
    ghlMissingCustomFields?: string[];
    ghlError?: string | null;
  } | null>(null);
  const [property, setProperty] = useState<PropertyIntelligence | null>(null);

  // When live EPC data is available, drop the questions it already answers.
  const visibleQuestions = useMemo(
    () => (property ? QUESTIONS.filter((q) => !EPC_FILLED_IDS.has(q.id)) : QUESTIONS),
    [property],
  );

  const total = visibleQuestions.length;
  const currentQ = step >= 0 && step < total ? visibleQuestions[step] : null;
  const result = useMemo(() => scoreAnswers(answers), [answers]);
  const band = categoryBand(result.total);
  const progress = step >= 0 && step < total ? Math.round(((step) / total) * 100) : 0;

  const canAdvance = currentQ
    ? currentQ.id === "postcode"
      ? (answers.postcode ?? "").trim().length >= 2
      : Boolean(answers[currentQ.id])
    : true;


  const submitLead = async (e: React.FormEvent) => {
    e.preventDefault();
    if (
      !lead.firstName.trim() ||
      !lead.lastName.trim() ||
      !lead.email.trim() ||
      !lead.phone.trim() ||
      !lead.privacyConsent
    ) {
      toast({
        title: "Please complete all required fields",
        description: "First name, last name, email, phone and privacy consent are required.",
      });
      return;
    }

    setSaving(true);

    const skippedQuestions = property ? Array.from(EPC_FILLED_IDS) : [];
    const findings = energyIQStory(answers);
    const identifiedOpportunities = opportunities(answers);
    const roadmap = identifiedOpportunities.map((o) => ({
      title: o.title,
      body: o.body,
    }));
    const resultSummary = bandOutcome(result.total);

    const postcodeFinal =
      (lead.postcode || answers.postcode || property?.address.postcode || "").toUpperCase();

    const assessmentId = createAssessmentId();

    const payload = {
      assessment_id: assessmentId,
      first_name: lead.firstName.trim(),
      last_name: lead.lastName.trim(),
      email: lead.email.trim(),
      telephone: lead.phone.trim(),
      marketing_consent: lead.marketingConsent,
      privacy_consent: lead.privacyConsent,
      completed_at: new Date().toISOString(),

      full_address: property
        ? `${property.address.line1}, ${property.address.town}, ${property.address.postcode}`
        : null,
      postcode: postcodeFinal || null,
      epc_identifier: null,
      current_epc_rating: property?.currentRating ?? null,
      current_epc_score: property?.currentScore ?? null,
      potential_epc_rating: property?.potentialRating ?? null,
      potential_epc_score: property?.potentialScore ?? null,
      property_type: property?.propertyType ?? null,
      built_form: property?.builtForm ?? null,
      floor_area: property?.floorAreaSqm ?? null,
      main_heating: property?.mainHeating ?? null,
      epc_recommendations: property?.recommendedImprovements ?? [],
      property_data_found: Boolean(property),

      answers,
      skipped_questions: skippedQuestions,
      questionnaire_version: QUESTIONNAIRE_VERSION,

      energy_iq_score: result.total,
      energy_iq_band: band.name,
      result_summary: resultSummary,
      findings,
      identified_opportunities: identifiedOpportunities,
      personalised_roadmap: roadmap,
      calculation_version: CALCULATION_VERSION,
    };

    if (import.meta.env.DEV) {
      // Developer-only detail; confirms the save path without exposing customer data.
      // eslint-disable-next-line no-console
      console.info("[EnergyIQ] Assessment insert attempted", {
        assessmentId,
        fields: Object.keys(payload),
        answersStored: Object.keys(answers).length,
        epcStored: Boolean(property),
      });
    }

    const { error } = await supabase.from("energy_iq_assessments").insert(payload);

    setSaving(false);

    if (error) {
      if (import.meta.env.DEV) {
        // Developer-only detail; safe (no PII).
        // eslint-disable-next-line no-console
        console.error("[EnergyIQ] Assessment insert failed", {
          code: error.code,
          message: error.message,
          details: error.details,
          hint: error.hint,
          failingField: inferFailingField(error.message, error.details),
        });
      }
      toast({
        title: "We couldn't save your assessment",
        description:
          "Something went wrong on our end. Your answers are safe — please try submitting again in a moment.",
      });
      return;
    }

    if (import.meta.env.DEV) {
      // eslint-disable-next-line no-console
      console.info("[EnergyIQ] Assessment insert succeeded", { assessmentId });
    }

    const savedBase = {
      assessmentId,
      answersStored: Object.keys(answers).length,
      epcStored: Boolean(property),
    };
    setSavedAssessment(savedBase);
    setStep(total + 2);

    // Fire-and-forget GHL sync — never blocks the customer journey.
    try {
      const { data: ghlData, error: ghlError } = await supabase.functions.invoke(
        "ghl-sync-contact",
        {
          body: {
            assessment_id: assessmentId,
            first_name: payload.first_name,
            last_name: payload.last_name,
            email: payload.email,
            telephone: payload.telephone,
            full_address: payload.full_address,
            postcode: payload.postcode,
            energy_iq_score: payload.energy_iq_score,
            energy_iq_band: payload.energy_iq_band,
            completed_at: payload.completed_at,
          },
        },
      );

      if (ghlError || !ghlData?.ok) {
        const details =
          (ghlData && (ghlData.details || ghlData.error)) ||
          ghlError?.message ||
          "Unknown error";
        if (import.meta.env.DEV) {
          // eslint-disable-next-line no-console
          console.error("[EnergyIQ] GHL sync failed", details);
        }
        setSavedAssessment({
          ...savedBase,
          ghlStatus: "failed",
          ghlError: String(details).slice(0, 300),
        });
      } else {
        if (import.meta.env.DEV) {
          // eslint-disable-next-line no-console
          console.info("[EnergyIQ] GHL sync succeeded", {
            contactId: ghlData.contact_id,
            customFieldsUpdated: ghlData.custom_fields_updated,
            missing: ghlData.missing_custom_fields,
          });
        }
        setSavedAssessment({
          ...savedBase,
          ghlStatus: "synced",
          ghlContactId: ghlData.contact_id,
          ghlCustomFieldsUpdated: ghlData.custom_fields_updated,
          ghlMissingCustomFields: ghlData.missing_custom_fields ?? [],
        });
      }
    } catch (err) {
      if (import.meta.env.DEV) {
        // eslint-disable-next-line no-console
        console.error("[EnergyIQ] GHL sync threw", err);
      }
      setSavedAssessment({
        ...savedBase,
        ghlStatus: "failed",
        ghlError: err instanceof Error ? err.message : String(err),
      });
    }
  };


  return (
    <SiteLayout>
      {/* HERO */}
      <section className="relative overflow-hidden bg-gradient-soft pt-16 pb-12 lg:pt-24 lg:pb-16">
        <div className="absolute inset-0 grid-bg pointer-events-none" />
        <div className="absolute -top-32 -right-32 h-[400px] w-[400px] bg-gradient-electric opacity-15 blur-3xl rounded-full" />
        <div className="container-tight relative max-w-3xl">
          <span className="eyebrow">
            <Sparkles className="h-3.5 w-3.5" /> Energy IQ
          </span>
          <h1 className="mt-4 text-4xl sm:text-5xl lg:text-[58px] leading-[1.05] font-display font-semibold text-navy">
            Understand your property's <span className="text-gradient">energy position.</span>
          </h1>
          <p className="mt-6 text-lg text-navy-soft leading-relaxed">
            Energy IQ helps you get a clearer view of where your property stands today — and what could improve it. Answer a few simple questions about your property, energy use and future goals. You'll receive an indicative Energy IQ score, along with practical next steps to help you reduce costs, improve efficiency and make more confident clean energy decisions.
          </p>
          {step === -1 && (
            <div className="mt-6 flex flex-wrap gap-3">
              <span className="inline-flex items-center gap-2 text-xs text-muted-foreground">
                <ShieldCheck className="h-4 w-4 text-electric" /> Takes about 2 minutes · No obligation
              </span>
            </div>
          )}
        </div>
      </section>

      <section className="py-14 lg:py-20">
        <div className="container-tight max-w-3xl">
          {/* PROPERTY INTAKE — additive layer before the existing questionnaire */}
          {step === -1 && (
            <PropertyIntake
              onComplete={(prop, _addr) => {
                setProperty(prop);
                if (prop) {
                  setAnswers((prev) => ({ ...prev, ...inferAnswersFromProperty(prop) }));
                }
                setStep(0);
              }}
              onSkip={() => setStep(0)}
            />
          )}


          {/* QUESTIONNAIRE */}
          {currentQ && (
            <div className="card-premium p-8 lg:p-10">
              <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-[0.18em] text-electric">
                <span>Question {step + 1} of {total}</span>
                <span>{progress}%</span>
              </div>
              <div className="mt-3 h-1.5 w-full rounded-full bg-border overflow-hidden">
                <div className="h-full bg-gradient-electric transition-all" style={{ width: `${progress}%` }} />
              </div>

              <h2 className="mt-8 text-2xl lg:text-3xl font-display font-semibold text-navy">
                {currentQ.label}
              </h2>
              {currentQ.help && (
                <p className="mt-2 text-sm text-muted-foreground">{currentQ.help}</p>
              )}

              <div className="mt-8">
                {currentQ.id === "postcode" ? (
                  <Input
                    value={answers.postcode ?? ""}
                    onChange={(e) =>
                      setAnswers({ ...answers, postcode: e.target.value.toUpperCase().slice(0, 5) })
                    }
                    placeholder="e.g. SW1 or M14"
                    className="max-w-xs"
                    maxLength={5}
                  />
                ) : (
                  <RadioGroup
                    value={answers[currentQ.id] ?? ""}
                    onValueChange={(v) => setAnswers({ ...answers, [currentQ.id]: v })}
                    className="grid gap-3"
                  >
                    {currentQ.options.map((o) => {
                      const active = answers[currentQ.id] === o.value;
                      return (
                        <label
                          key={o.value}
                          className={`flex items-center gap-3 rounded-xl border px-4 py-3.5 cursor-pointer transition-all ${
                            active
                              ? "border-electric bg-electric/5 shadow-glow"
                              : "border-border hover:border-electric/50 hover:bg-accent"
                          }`}
                        >
                          <RadioGroupItem value={o.value} id={`${currentQ.id}-${o.value}`} />
                          <span className="text-sm font-medium text-navy">{o.label}</span>
                        </label>
                      );
                    })}
                  </RadioGroup>
                )}
              </div>

              <div className="mt-10 flex items-center justify-between">
                <Button
                  variant="outline"
                  onClick={() => setStep(Math.max(-1, step - 1))}
                  className="rounded-full"
                >
                  <ArrowLeft className="mr-1.5 h-4 w-4" /> Back
                </Button>
                <Button
                  disabled={!canAdvance}
                  onClick={() => setStep(step + 1)}
                  className="rounded-full h-12 px-6 bg-gradient-electric text-white border-0 shadow-glow"
                >
                  {step === total - 1 ? "See my score" : "Next"} <ArrowRight className="ml-1.5 h-4 w-4" />
                </Button>
              </div>
            </div>
          )}

          {/* SCORE REVEAL ANIMATION */}
          {step === total && !revealed && (
            <ScoreReveal target={result.total} onDone={() => setRevealed(true)} />
          )}

          {/* SCORE */}
          {step === total && revealed && (() => {
            const outcome = bandOutcome(result.total);
            const priorities = priorityAreas(answers);
            const opps = opportunities(answers);
            const steps = nextSteps(answers);
            return (
            <div className="card-premium p-8 lg:p-10 animate-fade-in">
              <span className="eyebrow"><Gauge className="h-3.5 w-3.5" /> Your indicative Energy IQ</span>
              <div className="mt-6 flex flex-col sm:flex-row items-start sm:items-end gap-6">
                <div>
                  <div className="text-6xl lg:text-7xl font-display font-semibold text-navy">
                    {result.total}<span className="text-navy-soft text-3xl">/100</span>
                  </div>
                  <div className="mt-2 text-lg font-semibold text-electric">{band.name}</div>
                </div>
                <p className="text-navy-soft leading-relaxed sm:pb-2">{band.tone}</p>
              </div>

              {/* Score-band-specific outcome — appears before the story */}
              <p className="mt-6 text-navy-soft leading-relaxed">
                {outcome}
              </p>

              <div className="mt-8 grid gap-3 sm:grid-cols-2">
                {result.perCategory.map((c) => (
                  <div key={c.category} className="rounded-xl border border-border p-4">
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-medium text-navy">{CATEGORY_LABEL[c.category]}</span>
                      <span className="text-navy-soft">{c.score}/{CATEGORY_MAX}</span>
                    </div>
                    <div className="mt-2 h-1.5 rounded-full bg-border overflow-hidden">
                      <div className="h-full bg-gradient-electric" style={{ width: `${(c.score / CATEGORY_MAX) * 100}%` }} />
                    </div>
                  </div>
                ))}
              </div>

              {/* Your Energy IQ story */}
              <section className="mt-10">
                <h3 className="text-lg font-display font-semibold text-navy">Your Energy IQ story</h3>
                <div className="mt-3 space-y-3">
                  <p className="text-navy-soft leading-relaxed">
                    From what you’ve told us, your property appears to have clear opportunities worth exploring. The aim now is not to look at one technology in isolation, but to understand how your property, energy use and future goals fit together.
                  </p>
                  <p className="text-navy-soft leading-relaxed">
                    Your answers suggest that a practical, prioritised review would be more useful than jumping straight to a single recommendation. Depending on your property suitability, this could include areas such as on-site generation, storage, EV charging, heating efficiency, monitoring or long-term optimisation.
                  </p>
                  <p className="text-navy-soft leading-relaxed">
                    A closer review with Clean Energy Gurus would help confirm what is realistic, what should be prioritised first and which improvements could form part of a sensible energy plan.
                  </p>
                </div>
              </section>


              {/* Your priority areas */}
              {priorities.length > 0 && (
                <section className="mt-10">
                  <h3 className="text-lg font-display font-semibold text-navy">Your priority areas</h3>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Areas that stood out from your Energy IQ and could be worth a closer look.
                  </p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {priorities.map((p) => (
                      <span
                        key={p}
                        className="inline-flex items-center gap-1.5 rounded-full border border-electric/30 bg-electric/5 px-3 py-1.5 text-xs font-medium text-navy"
                      >
                        <span className="h-1.5 w-1.5 rounded-full bg-electric" />
                        {p}
                      </span>
                    ))}
                  </div>
                </section>
              )}

              {/* Property Intelligence — additive, only shown when property data is present */}
              {property && <PropertyIntelligencePanel property={property} />}

              {/* Your Personalised Roadmap — replaces the old Key opportunities list */}
              <PersonalisedRoadmap />

              {/* Suggested next steps */}
              <section className="mt-10">
                <h3 className="text-lg font-display font-semibold text-navy">Suggested next steps</h3>
                <ol className="mt-4 space-y-3">
                  {steps.map((s, i) => (
                    <li key={s} className="flex items-start gap-3 text-sm text-navy">
                      <span className="mt-0.5 grid h-6 w-6 flex-shrink-0 place-items-center rounded-full bg-electric/10 text-electric text-xs font-semibold">
                        {i + 1}
                      </span>
                      <span className="leading-relaxed">{s}</span>
                    </li>
                  ))}
                </ol>
              </section>

              <div className="mt-8 rounded-xl bg-surface border border-border p-4 text-xs text-muted-foreground leading-relaxed">
                Your Energy IQ score is an indicative guide based on the information provided. It is not a technical design, EPC rating, financial forecast, savings calculation or installation recommendation. Any proposal, projected saving or installation decision would require a full property review, technical assessment and confirmation of suitability.
              </div>

              <div className="mt-8 flex flex-wrap gap-3">
                <Button
                  onClick={() => setStep(total + 1)}
                  className="rounded-full h-12 px-6 bg-gradient-electric text-white border-0 shadow-glow"
                >
                  Get my full summary <ArrowRight className="ml-1.5 h-4 w-4" />
                </Button>
                <Button variant="outline" className="rounded-full h-12" onClick={() => { setAnswers({}); setRevealed(false); setProperty(null); setStep(-1); }}>
                  Start again
                </Button>
              </div>
            </div>
            );
          })()}


          {/* LEAD CAPTURE */}
          {step === total + 1 && (
            <form onSubmit={submitLead} className="card-premium p-8 lg:p-10">
              <span className="eyebrow">Almost there</span>
              <h2 className="mt-3 text-2xl lg:text-3xl font-display font-semibold text-navy">
                Receive your Energy IQ summary
              </h2>
              <p className="mt-4 text-navy-soft leading-relaxed">
                Enter your details and we'll send you your Energy IQ summary, including your indicative score, key opportunities and suggested next steps. A member of the Clean Energy Gurus team may also contact you to discuss your property and answer any questions.
              </p>
              <div className="mt-8 grid gap-4 sm:grid-cols-2">
                <div>
                  <Label htmlFor="iq-first">First name</Label>
                  <Input id="iq-first" value={lead.firstName} onChange={(e) => setLead({ ...lead, firstName: e.target.value })} maxLength={80} required />
                </div>
                <div>
                  <Label htmlFor="iq-last">Last name</Label>
                  <Input id="iq-last" value={lead.lastName} onChange={(e) => setLead({ ...lead, lastName: e.target.value })} maxLength={80} required />
                </div>
                <div>
                  <Label htmlFor="iq-email">Email</Label>
                  <Input id="iq-email" type="email" value={lead.email} onChange={(e) => setLead({ ...lead, email: e.target.value })} maxLength={255} required />
                </div>
                <div>
                  <Label htmlFor="iq-phone">Telephone</Label>
                  <Input id="iq-phone" type="tel" value={lead.phone} onChange={(e) => setLead({ ...lead, phone: e.target.value })} maxLength={30} required />
                </div>
                <div className="sm:col-span-2">
                  <Label htmlFor="iq-postcode">Postcode</Label>
                  <Input
                    id="iq-postcode"
                    value={lead.postcode || (answers.postcode ?? "")}
                    onChange={(e) => setLead({ ...lead, postcode: e.target.value.toUpperCase() })}
                    maxLength={10}
                    required
                  />
                </div>
                <label className="sm:col-span-2 flex items-start gap-3 text-sm text-navy-soft">
                  <Checkbox
                    checked={lead.privacyConsent}
                    onCheckedChange={(v) => setLead({ ...lead, privacyConsent: Boolean(v) })}
                    className="mt-0.5"
                  />
                  <span>
                    I agree that Clean Energy Gurus may store the details I've provided and contact me about my Energy IQ summary and next steps, in line with their privacy notice. I understand this is not a quotation or installation recommendation. <span className="text-electric">(required)</span>
                  </span>
                </label>
                <label className="sm:col-span-2 flex items-start gap-3 text-sm text-navy-soft">
                  <Checkbox
                    checked={lead.marketingConsent}
                    onCheckedChange={(v) => setLead({ ...lead, marketingConsent: Boolean(v) })}
                    className="mt-0.5"
                  />
                  <span>
                    Optional: I'd also like to receive occasional updates, guides and clean energy insights from Clean Energy Gurus. I can unsubscribe at any time.
                  </span>
                </label>
              </div>
              <div className="mt-8 flex flex-wrap gap-3">
                <Button type="submit" disabled={saving} className="rounded-full h-12 px-6 bg-gradient-electric text-white border-0 shadow-glow">
                  {saving ? "Saving…" : "Send my Energy IQ summary"} <ArrowRight className="ml-1.5 h-4 w-4" />
                </Button>
                <Button type="button" variant="outline" className="rounded-full h-12" onClick={() => setStep(total)} disabled={saving}>
                  Back to score
                </Button>
              </div>
            </form>
          )}

          {/* THANK YOU */}
          {step === total + 2 && (
            <div className="mx-auto max-w-2xl">
              <div className="card-premium p-10 lg:p-14 text-center relative overflow-hidden">
                <div className="pointer-events-none absolute inset-x-0 -top-24 h-48 arc-glow opacity-70" />
                <div className="relative mx-auto h-16 w-16 rounded-full bg-gradient-electric grid place-items-center text-white shadow-glow">
                  <CheckCircle2 className="h-8 w-8" strokeWidth={2.25} />
                </div>
                <span className="mt-8 inline-flex eyebrow">Assessment complete</span>
                <h2 className="mt-3 text-3xl lg:text-4xl font-display font-semibold text-navy">
                  Your Energy IQ has been created.
                </h2>
                <p className="mt-5 text-navy-soft leading-relaxed max-w-lg mx-auto">
                  Thank you for completing your Energy IQ assessment. Your personalised results have been securely saved and are now being prepared by the Clean Energy Gurus platform.
                </p>

                {savedAssessment && (
                  <div className="mt-10 mx-auto max-w-sm rounded-2xl border border-border/70 bg-surface/60 px-6 py-6">
                    <div className="text-xs font-semibold uppercase tracking-[0.22em] text-navy-soft">
                      Assessment Reference
                    </div>
                    <div className="mt-2 font-mono text-lg lg:text-xl text-navy tracking-wide break-all">
                      {savedAssessment.assessmentId}
                    </div>
                    <div className="mt-3 text-xs text-muted-foreground leading-relaxed">
                      Please keep this reference for future enquiries about your assessment.
                    </div>
                  </div>
                )}
              </div>

              <div className="card-premium mt-6 p-8 lg:p-10 text-left">
                <h3 className="text-lg font-display font-semibold text-navy">What happens next</h3>
                <ul className="mt-5 space-y-3.5">
                  {[
                    "Securely save your assessment",
                    "Prepare your personalised Energy IQ report",
                    "Send your results to the email address you provided",
                    "Contact you if you've requested further guidance",
                  ].map((item) => (
                    <li key={item} className="flex gap-3 text-navy">
                      <CheckCircle2 className="h-5 w-5 text-electric flex-shrink-0 mt-0.5" />
                      <span className="text-[15px] leading-relaxed">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-6 rounded-2xl border border-border/60 bg-accent/40 p-6 lg:p-7 text-sm text-navy-soft leading-relaxed">
                Your Energy IQ assessment provides an indicative view of your property's current position. Any technical recommendations or installation proposals will always be confirmed through a full property review.
              </div>

              <div className="mt-10 flex flex-wrap gap-3 justify-center">
                <Link to="/">
                  <Button className="rounded-full h-12 px-6 bg-gradient-electric text-white border-0 shadow-glow">
                    Return to Home <ArrowRight className="ml-1.5 h-4 w-4" />
                  </Button>
                </Link>
                <Link to="/knowledge">
                  <Button variant="outline" className="rounded-full h-12 px-6">
                    Explore the Knowledge Centre
                  </Button>
                </Link>
              </div>

              {import.meta.env.DEV && savedAssessment && (
                <details className="mt-10 mx-auto max-w-md rounded-xl border border-dashed border-electric/40 bg-electric/5 p-4 text-left text-xs text-navy-soft">
                  <summary className="cursor-pointer font-semibold uppercase tracking-[0.18em] text-electric">
                    Developer Information
                  </summary>
                  <ul className="mt-3 space-y-1 font-mono">
                    <li>✓ Assessment saved: <span className="text-navy">{savedAssessment.assessmentId}</span></li>
                    <li>Answers stored: <span className="text-navy">{savedAssessment.answersStored}</span></li>
                    <li>Live EPC data stored: <span className="text-navy">{savedAssessment.epcStored ? "Yes" : "No"}</span></li>
                    {savedAssessment.ghlStatus === "synced" && (
                      <>
                        <li>✓ GHL contact synced: <span className="text-navy">{savedAssessment.ghlContactId}</span></li>
                        <li>✓ Custom fields updated: <span className="text-navy">{savedAssessment.ghlCustomFieldsUpdated}</span></li>
                        {savedAssessment.ghlMissingCustomFields && savedAssessment.ghlMissingCustomFields.length > 0 && (
                          <li className="text-amber-700">Missing custom fields in GHL: {savedAssessment.ghlMissingCustomFields.join(", ")}</li>
                        )}
                      </>
                    )}
                    {savedAssessment.ghlStatus === "failed" && (
                      <li className="text-red-600">GHL sync failed: {savedAssessment.ghlError}</li>
                    )}
                    {!savedAssessment.ghlStatus && (
                      <li className="text-navy-soft">GHL sync: in progress…</li>
                    )}
                  </ul>
                </details>
              )}
            </div>
          )}
        </div>
      </section>
    </SiteLayout>
  );
};

export default EnergyIQ;
