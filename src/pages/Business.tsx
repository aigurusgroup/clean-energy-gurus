import { useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, TrendingUp, Shield, Plug, Leaf, Wallet, Activity, AlertTriangle, Eye, Sun, Battery, BarChart3, Check, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SiteLayout } from "@/components/site/SiteLayout";
import { FinalCTA } from "@/components/site/FinalCTA";
import { SolarCalculator } from "@/components/site/SolarCalculator";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import bizHero from "@/assets/business-hero.jpg";

const problems = [
  { icon: TrendingUp, title: "Rising energy costs", desc: "Unit rates and standing charges keep climbing — squeezing operating margins." },
  { icon: AlertTriangle, title: "Price volatility", desc: "Wholesale shocks now translate into business bills within months." },
  { icon: Sun, title: "Underused roof space", desc: "Most commercial roofs are an unmonetised energy asset sitting idle." },
  { icon: Plug, title: "EV charging demand", desc: "Staff, fleets and customers expect charging — without tripping your supply." },
  { icon: Eye, title: "No performance visibility", desc: "Bills arrive monthly. Decisions need half-hourly data, not guesses." },
];

const solutions = [
  { icon: Sun, title: "Commercial Solar PV", desc: "Roof, ground-mount and carport arrays sized to your operational load." },
  { icon: Battery, title: "Battery Storage", desc: "Self-consume, peak-shave and trade your surplus on dynamic tariffs." },
  { icon: Plug, title: "Workplace EV Charging", desc: "OZEV partner-led AC and DC chargers with load balancing." },
  { icon: Wallet, title: "Finance & PPA Routes", desc: "Capex, lease, asset finance or zero-capex PPA — whatever fits the business case." },
  { icon: Activity, title: "Monitoring & Maintenance", desc: "Half-hourly oversight, fault detection and rapid intervention." },
  { icon: BarChart3, title: "Tariff & Export Strategy", desc: "Match the right tariff and earn from peak-window export." },
];

const cases = [
  { icon: TrendingUp, title: "Lower grid electricity usage", desc: "Cut bought-in power by 40–70% with sized solar and battery." },
  { icon: Shield, title: "Improve energy resilience", desc: "Battery backup keeps critical loads running through outages." },
  { icon: Plug, title: "Support EV transition", desc: "Future-proof for staff, fleet and visitor electric vehicles." },
  { icon: Leaf, title: "Strengthen ESG profile", desc: "Auditable Scope 2 reductions for sustainability disclosures." },
  { icon: Wallet, title: "Use finance / PPA routes", desc: "Match cash, lease, asset finance or PPA to your treasury position." },
  { icon: Activity, title: "Track post-install performance", desc: "Half-hourly data, quarterly reports and ongoing optimisation." },
];

const process = [
  ["01", "Energy Review", "Free initial review of your site, load and goals."],
  ["02", "Bill & Data Collection", "We collect MPAN data and historic bills to model accurately."],
  ["03", "Site Survey", "Detailed structural, electrical and DNO assessment."],
  ["04", "Proposal", "Transparent design, ROI and finance options on one page."],
  ["05", "Install", "Accredited MCS partner-led delivery."],
  ["06", "Handover", "Documentation, warranties and platform onboarding."],
  ["07", "Optimisation", "Monitoring, tariff review and continuous improvement."],
];

const packages = [
  {
    name: "Business Solar Starter",
    sub: "Right-sized rooftop solar.",
    items: ["Site survey & yield modelling", "Tier-1 panels & inverter", "MCS partner-led install", "12-month performance check-in"],
    cta: "Best for SMEs starting their energy transition",
  },
  {
    name: "Business Solar Plus",
    sub: "Solar + battery + EV ready.",
    items: ["Everything in Starter", "Battery storage sized to load", "EV charging-ready infrastructure", "Quarterly performance reporting"],
    cta: "Best for growing businesses with EV demand",
    featured: true,
  },
  {
    name: "Business Energy Platform",
    sub: "Fully managed energy operation.",
    items: ["Everything in Plus", "Gurus Optimise™ platform access", "Tariff & export optimisation", "Dedicated account manager"],
    cta: "Best for multi-site and high-consumption operators",
  },
];

const platformTiles = [
  { label: "Site generation", value: "1.42 MWh", trend: "Today" },
  { label: "Self-use", value: "78%", trend: "Above forecast" },
  { label: "Battery", value: "82%", trend: "Discharging — peak" },
  { label: "EV sessions", value: "14", trend: "Active" },
  { label: "Estimated saving", value: "£312", trend: "Today" },
  { label: "Maintenance", value: "All clear", trend: "0 alerts" },
];

const faqs = [
  ["What size businesses do you work with?", "From single-site SMEs through to multi-site operators with portfolios of properties. We size every system to actual half-hourly load."],
  ["Do we need capex to get started?", "No. Cash, lease, asset finance and PPA routes are available — including zero-capex options where the business case supports it."],
  ["How long does installation take?", "Most commercial systems are surveyed in 1–2 weeks and installed within 6–12 weeks of proposal acceptance, depending on DNO timelines."],
  ["Will it disrupt operations?", "Installations are planned around your operating hours. Rooftop work is typically external and self-contained."],
  ["What happens after handover?", "You're onboarded onto Gurus Optimise™ for monitoring, reporting, tariff review and ongoing optimisation."],
  ["Are you MCS and OZEV accredited?", "We deliver via accredited MCS, OZEV and DNO partners — preserving eligibility for grants, SEG and standards."],
];

const Business = () => {
  useEffect(() => {
    document.title = "Business Energy Optimisation | Clean Energy Gurus";
    const m = document.querySelector('meta[name="description"]') as HTMLMetaElement;
    if (m) m.content = "Reduce operating costs with smarter commercial energy infrastructure: solar PV, battery storage, EV charging and ongoing optimisation across UK businesses.";
  }, []);

  return (
    <SiteLayout>
      {/* HERO */}
      <section className="relative overflow-hidden bg-background pt-16 pb-20 lg:pt-24 lg:pb-28">
        <div className="absolute inset-0 grid-bg-fine pointer-events-none" />
        <div className="absolute -top-40 -right-40 h-[500px] w-[500px] rounded-full bg-gradient-electric opacity-20 blur-3xl pointer-events-none" />
        <div className="container-tight relative">
          <div className="grid lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-7 animate-fade-in-up">
              <span className="eyebrow">
                <span className="h-1.5 w-1.5 rounded-full bg-electric animate-pulse" />
                Commercial Energy
              </span>
              <h1 className="mt-5 text-4xl sm:text-5xl lg:text-[64px] leading-[1.04] font-display font-semibold text-navy">
                Reduce operating costs with smarter <span className="text-gradient">commercial energy infrastructure</span>.
              </h1>
              <p className="mt-6 text-lg text-navy-soft max-w-2xl leading-relaxed">
                Clean Energy Gurus helps businesses install solar PV, battery storage
                and EV charging, then optimise long-term performance through
                monitoring, maintenance, tariff review and export strategy.
              </p>
              <div className="mt-9 flex flex-col sm:flex-row gap-3">
                <Link to="/contact">
                  <Button size="lg" className="bg-gradient-electric text-white border-0 rounded-full px-7 h-12 shadow-glow">
                    Book a Business Energy Review <ArrowRight className="ml-1.5 h-4 w-4" />
                  </Button>
                </Link>
                <Link to="/services">
                  <Button size="lg" variant="outline" className="rounded-full px-7 h-12 border-navy/15 text-navy hover:bg-navy hover:text-white">
                    Explore Commercial Solutions
                  </Button>
                </Link>
              </div>
              <div className="mt-10 grid grid-cols-3 gap-6 max-w-md">
                {[["40–70%", "grid offset"], ["6–12 wk", "typical install"], ["25 yr", "performance horizon"]].map(([n, l]) => (
                  <div key={l}>
                    <div className="text-2xl font-display font-semibold text-navy">{n}</div>
                    <div className="text-xs text-muted-foreground mt-1">{l}</div>
                  </div>
                ))}
              </div>
            </div>
            <div className="lg:col-span-5 animate-scale-in">
              <div className="relative rounded-3xl overflow-hidden shadow-elegant border border-border/60">
                <img src={bizHero} alt="UK commercial warehouse with rooftop solar PV and EV chargers" width={1600} height={1200} className="w-full h-auto object-cover" />
                <div className="absolute inset-0 bg-gradient-to-tr from-navy/15 via-transparent to-transparent" />
                <div className="absolute bottom-4 left-4 right-4 grid grid-cols-2 gap-3">
                  <div className="rounded-xl bg-background/95 backdrop-blur p-3">
                    <div className="text-[10px] uppercase tracking-wider text-electric font-semibold">Live</div>
                    <div className="text-sm font-medium text-navy mt-0.5">412 kW generating</div>
                  </div>
                  <div className="rounded-xl bg-background/95 backdrop-blur p-3">
                    <div className="text-[10px] uppercase tracking-wider text-electric font-semibold">Peak shaved</div>
                    <div className="text-sm font-medium text-navy mt-0.5">£186 today</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* PROBLEM */}
      <section className="py-20 lg:py-28">
        <div className="container-tight">
          <div className="max-w-3xl mb-14">
            <span className="eyebrow">The problem</span>
            <h2 className="mt-3 text-3xl sm:text-4xl lg:text-5xl font-display font-semibold text-navy">
              Energy is no longer a fixed overhead. It's an operational risk.
            </h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {problems.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="rounded-2xl border border-border bg-card p-7 hover:border-electric/30 transition-colors">
                <div className="h-11 w-11 rounded-xl bg-destructive/10 grid place-items-center text-destructive">
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="mt-5 text-lg font-display font-semibold text-navy">{title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SOLUTION */}
      <section className="py-20 lg:py-28 bg-surface">
        <div className="container-tight">
          <div className="max-w-3xl mb-14">
            <span className="eyebrow">The solution</span>
            <h2 className="mt-3 text-3xl sm:text-4xl lg:text-5xl font-display font-semibold text-navy">
              A complete commercial energy stack — <span className="text-gradient">designed, installed and managed</span>.
            </h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {solutions.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="card-premium p-7">
                <div className="h-12 w-12 rounded-xl bg-gradient-electric grid place-items-center text-white shadow-glow">
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="mt-5 text-lg font-display font-semibold text-navy">{title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* BUSINESS CASE */}
      <section className="py-20 lg:py-28">
        <div className="container-tight">
          <div className="text-center max-w-3xl mx-auto mb-14">
            <span className="eyebrow justify-center">The business case</span>
            <h2 className="mt-3 text-3xl sm:text-4xl lg:text-5xl font-display font-semibold text-navy">
              Six reasons your business should be generating its own energy.
            </h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {cases.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="card-premium p-7">
                <div className="h-11 w-11 rounded-xl bg-accent grid place-items-center text-electric">
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="mt-5 text-lg font-display font-semibold text-navy">{title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PROCESS */}
      <section className="py-20 lg:py-28 bg-surface">
        <div className="container-tight">
          <div className="max-w-3xl mb-14">
            <span className="eyebrow">How it works</span>
            <h2 className="mt-3 text-3xl sm:text-4xl lg:text-5xl font-display font-semibold text-navy">
              From first call to ongoing optimisation.
            </h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-px bg-border rounded-3xl overflow-hidden border border-border">
            {process.map(([n, t, d]) => (
              <div key={n} className="bg-card p-7 hover:bg-surface transition-colors">
                <div className="text-electric font-display text-2xl font-semibold">{n}</div>
                <h3 className="mt-3 text-base font-display font-semibold text-navy">{t}</h3>
                <p className="mt-2 text-xs text-muted-foreground leading-relaxed">{d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PACKAGES */}
      <section className="py-20 lg:py-28">
        <div className="container-tight">
          <div className="text-center max-w-3xl mx-auto mb-14">
            <span className="eyebrow justify-center">Commercial packages</span>
            <h2 className="mt-3 text-3xl sm:text-4xl lg:text-5xl font-display font-semibold text-navy">
              Three pathways. One long-term partnership.
            </h2>
          </div>
          <div className="grid lg:grid-cols-3 gap-6">
            {packages.map((p) => (
              <div
                key={p.name}
                className={`relative rounded-3xl p-8 flex flex-col ${
                  p.featured
                    ? "bg-navy text-white border border-navy shadow-elegant scale-[1.02]"
                    : "bg-card border border-border shadow-card"
                }`}
              >
                {p.featured && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-gradient-electric text-white text-[10px] font-semibold uppercase tracking-[0.16em] shadow-glow">
                    Most popular
                  </div>
                )}
                <h3 className={`text-xl font-display font-semibold ${p.featured ? "text-white" : "text-navy"}`}>{p.name}</h3>
                <p className={`mt-1.5 text-sm ${p.featured ? "text-white/70" : "text-muted-foreground"}`}>{p.sub}</p>
                <ul className="mt-6 space-y-2.5 flex-1">
                  {p.items.map((it) => (
                    <li key={it} className={`flex items-start gap-2.5 text-sm ${p.featured ? "text-white/90" : "text-navy"}`}>
                      <Check className={`h-4.5 w-4.5 mt-0.5 flex-shrink-0 ${p.featured ? "text-electric" : "text-electric"}`} />
                      <span>{it}</span>
                    </li>
                  ))}
                </ul>
                <div className={`mt-6 pt-5 border-t text-xs ${p.featured ? "border-white/15 text-white/65" : "border-border text-muted-foreground"}`}>
                  {p.cta}
                </div>
                <Link to="/contact" className="mt-5">
                  <Button className={`w-full rounded-full ${p.featured ? "bg-gradient-electric text-white border-0 shadow-glow" : "bg-navy text-white hover:bg-navy/90"}`}>
                    Request proposal
                  </Button>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PLATFORM */}
      <section className="py-20 lg:py-28 bg-navy text-white relative overflow-hidden">
        <div className="absolute inset-0 grid-bg opacity-10" />
        <div className="absolute -top-40 right-0 h-[500px] w-[700px] bg-gradient-electric opacity-25 blur-3xl rounded-full" />
        <div className="container-tight relative">
          <div className="max-w-3xl mb-12">
            <span className="eyebrow">Gurus Optimise™</span>
            <h2 className="mt-3 text-3xl sm:text-4xl lg:text-5xl font-display font-semibold text-white">
              Your site, in one calm dashboard.
            </h2>
            <p className="mt-5 text-white/75 text-lg leading-relaxed">
              Monitoring, performance reporting, tariff and export review and
              battery optimisation — all in one operating layer.
            </p>
          </div>
          <div className="rounded-3xl border border-white/10 bg-white/[0.04] backdrop-blur-xl p-6 sm:p-8 shadow-2xl">
            <div className="flex items-center justify-between pb-5 mb-6 border-b border-white/10">
              <div className="text-xs text-white/60 font-mono">gurus-optimise.io / sites / hq</div>
              <div className="flex items-center gap-2 text-[11px] text-white/60">
                <span className="h-1.5 w-1.5 rounded-full bg-electric animate-pulse" /> Live
              </div>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {platformTiles.map((t) => (
                <div key={t.label} className="rounded-2xl bg-white/[0.04] border border-white/10 p-5">
                  <div className="text-[10px] font-semibold uppercase tracking-[0.16em] text-white/55">{t.label}</div>
                  <div className="mt-3 text-2xl font-display font-semibold">{t.value}</div>
                  <div className="mt-1 text-xs text-white/55">{t.trend}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* SOLAR CALCULATOR */}
      <SolarCalculator segment="business" className="bg-surface" />

      {/* FAQ */}
      <section className="py-20 lg:py-28">
        <div className="container-tight grid lg:grid-cols-12 gap-12">
          <div className="lg:col-span-4">
            <span className="eyebrow">FAQ</span>
            <h2 className="mt-3 text-3xl sm:text-4xl font-display font-semibold text-navy">
              Common questions from business owners.
            </h2>
            <p className="mt-5 text-navy-soft">Can't find your answer? Book a review and we'll talk it through.</p>
          </div>
          <div className="lg:col-span-8">
            <Accordion type="single" collapsible className="space-y-3">
              {faqs.map(([q, a], i) => (
                <AccordionItem key={i} value={`item-${i}`} className="border border-border rounded-2xl px-6 bg-card">
                  <AccordionTrigger className="text-left text-navy font-display font-semibold hover:no-underline py-5">
                    {q}
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground pb-5">{a}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </section>

      <FinalCTA />
    </SiteLayout>
  );
};

export default Business;
