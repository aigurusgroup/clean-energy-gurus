import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, ArrowLeft, CheckCircle2, Gauge, Sparkles, ShieldCheck } from "lucide-react";
import { SiteLayout } from "@/components/site/SiteLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "@/hooks/use-toast";

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
    label: "What type of property is this?",
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
    label: "Approximate energy spend",
    help: "Use whichever you know — monthly bill or annual electricity.",
    options: [
      { value: "low", label: "Under £100/month or under 3,000 kWh/year", points: 6 },
      { value: "mid", label: "£100–£250/month or 3,000–6,000 kWh/year", points: 12 },
      { value: "high", label: "£250–£800/month or 6,000–15,000 kWh/year", points: 17 },
      { value: "vhigh", label: "£800+/month or 15,000+ kWh/year", points: 20 },
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

function scoreAnswers(answers: Answers) {
  const raw: Record<Question["category"], number> = {
    property: 0, usage: 0, tech: 0, control: 0, readiness: 0,
  };
  const maxRaw: Record<Question["category"], number> = {
    property: 0, usage: 0, tech: 0, control: 0, readiness: 0,
  };
  for (const q of QUESTIONS) {
    if (!q.options.length) continue;
    const maxQ = Math.max(...q.options.map((o) => o.points ?? 0));
    maxRaw[q.category] += maxQ;
    const ans = answers[q.id];
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

const STORAGE_KEY = "energyIQ.submissions";

const EnergyIQ = () => {
  const [step, setStep] = useState(-1); // -1 = intro, 0..N-1 questions, N = score, N+1 = lead form, N+2 = thanks
  const [answers, setAnswers] = useState<Answers>({});
  const [lead, setLead] = useState({ name: "", email: "", phone: "", postcode: "", consent: false });

  const total = QUESTIONS.length;
  const currentQ = step >= 0 && step < total ? QUESTIONS[step] : null;
  const result = useMemo(() => scoreAnswers(answers), [answers]);
  const band = categoryBand(result.total);
  const recommendations = useMemo(() => recommend(answers), [answers]);
  const progress = step >= 0 && step < total ? Math.round(((step) / total) * 100) : 0;

  const canAdvance = currentQ
    ? currentQ.id === "postcode"
      ? (answers.postcode ?? "").trim().length >= 2
      : Boolean(answers[currentQ.id])
    : true;

  const submitLead = (e: React.FormEvent) => {
    e.preventDefault();
    if (!lead.name.trim() || !lead.email.trim() || !lead.phone.trim() || !lead.consent) {
      toast({ title: "Please complete all fields", description: "Name, email, phone and consent are required." });
      return;
    }
    const record = {
      submittedAt: new Date().toISOString(),
      answers,
      score: result.total,
      band: band.name,
      lead,
    };
    try {
      const prior = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
      prior.push(record);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(prior));
    } catch {}
    setStep(total + 2);
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
            <div className="mt-8 flex flex-wrap gap-3">
              <Button
                size="lg"
                onClick={() => setStep(0)}
                className="bg-gradient-electric text-white border-0 rounded-full px-7 h-12 shadow-glow"
              >
                Start Energy IQ Assessment <ArrowRight className="ml-1.5 h-4 w-4" />
              </Button>
              <span className="inline-flex items-center gap-2 text-xs text-muted-foreground">
                <ShieldCheck className="h-4 w-4 text-electric" /> Takes about 2 minutes · No obligation
              </span>
            </div>
          )}
        </div>
      </section>

      <section className="py-14 lg:py-20">
        <div className="container-tight max-w-3xl">
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

          {/* SCORE */}
          {step === total && (
            <div className="card-premium p-8 lg:p-10">
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

              <div className="mt-8">
                <h3 className="text-lg font-display font-semibold text-navy">Recommended next steps</h3>
                <ul className="mt-3 space-y-2">
                  {recommendations.map((r) => (
                    <li key={r} className="flex items-start gap-2 text-sm text-navy">
                      <CheckCircle2 className="h-5 w-5 text-electric flex-shrink-0 mt-0.5" />
                      <span>{r}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-8 rounded-xl bg-surface border border-border p-4 text-xs text-muted-foreground leading-relaxed">
                Your Energy IQ score is an indicative guide based on the answers provided. It is not a technical design, EPC rating, financial forecast, savings calculation or installation recommendation. A full property review and technical survey would be required before any proposal or installation decision.
              </div>

              <div className="mt-8 flex flex-wrap gap-3">
                <Button
                  onClick={() => setStep(total + 1)}
                  className="rounded-full h-12 px-6 bg-gradient-electric text-white border-0 shadow-glow"
                >
                  Get my full summary <ArrowRight className="ml-1.5 h-4 w-4" />
                </Button>
                <Button variant="outline" className="rounded-full h-12" onClick={() => { setAnswers({}); setStep(-1); }}>
                  Start again
                </Button>
              </div>
            </div>
          )}

          {/* LEAD CAPTURE */}
          {step === total + 1 && (
            <form onSubmit={submitLead} className="card-premium p-8 lg:p-10">
              <span className="eyebrow">Almost there</span>
              <h2 className="mt-3 text-2xl lg:text-3xl font-display font-semibold text-navy">
                Enter your details to receive your full Energy IQ summary and next steps.
              </h2>
              <div className="mt-8 grid gap-4 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <Label htmlFor="iq-name">Name</Label>
                  <Input id="iq-name" value={lead.name} onChange={(e) => setLead({ ...lead, name: e.target.value })} maxLength={100} required />
                </div>
                <div>
                  <Label htmlFor="iq-email">Email</Label>
                  <Input id="iq-email" type="email" value={lead.email} onChange={(e) => setLead({ ...lead, email: e.target.value })} maxLength={255} required />
                </div>
                <div>
                  <Label htmlFor="iq-phone">Phone</Label>
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
                    checked={lead.consent}
                    onCheckedChange={(v) => setLead({ ...lead, consent: Boolean(v) })}
                    className="mt-0.5"
                  />
                  <span>
                    I consent to Clean Energy Gurus contacting me about my Energy IQ summary and next steps. I understand this is not a quotation or installation recommendation.
                  </span>
                </label>
              </div>
              <div className="mt-8 flex flex-wrap gap-3">
                <Button type="submit" className="rounded-full h-12 px-6 bg-gradient-electric text-white border-0 shadow-glow">
                  Send my Energy IQ summary <ArrowRight className="ml-1.5 h-4 w-4" />
                </Button>
                <Button type="button" variant="outline" className="rounded-full h-12" onClick={() => setStep(total)}>
                  Back to score
                </Button>
              </div>
            </form>
          )}

          {/* THANK YOU */}
          {step === total + 2 && (
            <div className="card-premium p-10 text-center">
              <div className="mx-auto h-14 w-14 rounded-full bg-electric/10 grid place-items-center text-electric">
                <CheckCircle2 className="h-7 w-7" />
              </div>
              <h2 className="mt-6 text-2xl lg:text-3xl font-display font-semibold text-navy">
                Thanks {lead.name.split(" ")[0] || "there"} — your Energy IQ is on its way.
              </h2>
              <p className="mt-4 text-navy-soft leading-relaxed max-w-xl mx-auto">
                Your indicative score of <strong className="text-navy">{result.total}/100 ({band.name})</strong> has been saved. A member of the Clean Energy Gurus team will be in touch with your full summary and recommended next steps.
              </p>
              <div className="mt-8 flex flex-wrap gap-3 justify-center">
                <Link to="/">
                  <Button variant="outline" className="rounded-full h-12">Back to home</Button>
                </Link>
                <Link to="/knowledge">
                  <Button className="rounded-full h-12 px-6 bg-gradient-electric text-white border-0 shadow-glow">
                    Explore the Knowledge Centre <ArrowRight className="ml-1.5 h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </div>
          )}
        </div>
      </section>
    </SiteLayout>
  );
};

export default EnergyIQ;
