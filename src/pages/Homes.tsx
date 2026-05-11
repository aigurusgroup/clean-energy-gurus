import { useEffect } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight, Car, Home, Briefcase, Waves, DoorOpen, Sun, Zap,
  Battery, Plug, RefreshCw, Upload, LineChart, Wrench, Check, Activity, ShieldCheck, BarChart3,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { SiteLayout } from "@/components/site/SiteLayout";
import { FinalCTA } from "@/components/site/FinalCTA";
import { SolarCalculator } from "@/components/site/SolarCalculator";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import homeHero from "@/assets/home-hero.jpg";

const idealFor = [
  { icon: Car, label: "EV households" },
  { icon: Home, label: "Large homes" },
  { icon: Briefcase, label: "Home offices" },
  { icon: Waves, label: "Pools & hot tubs" },
  { icon: DoorOpen, label: "Annexes" },
  { icon: Sun, label: "Existing solar owners" },
  { icon: Zap, label: "High electricity usage" },
];

const solutions = [
  { icon: Sun, title: "Solar PV", desc: "High-output arrays designed around your real consumption — not a generic template." },
  { icon: Battery, title: "Battery storage", desc: "Store daytime solar and cheap-rate import. Dispatch when it matters most." },
  { icon: Plug, title: "EV charger installation", desc: "OZEV partner-led installation, including dual-vehicle and smart-tariff charging." },
  { icon: RefreshCw, title: "Existing solar upgrades", desc: "Add storage, modern inverters and smart controls to systems already on the roof." },
  { icon: Upload, title: "Export readiness", desc: "Set up for SEG, smart export and future flexibility markets." },
  { icon: LineChart, title: "Tariff optimisation", desc: "Match your tariff to how the system actually performs — and revisit as the market shifts." },
  { icon: Wrench, title: "Maintenance plans", desc: "Health checks, firmware, performance monitoring and rapid fault response." },
];

const packages = [
  {
    name: "Solar + Battery",
    sub: "The foundation for a smart home energy system.",
    items: ["Designed-for-you solar array", "Battery storage with smart dispatch", "Smart-tariff configuration", "Monitoring app & dashboard", "MCS-certified installation"],
    cta: "Best for high-usage homes ready to take control",
  },
  {
    name: "Solar + Battery + EV",
    sub: "A fully integrated home energy and mobility system.",
    items: ["Solar + battery system", "OZEV partner-led EV charger", "Solar-aware EV charging logic", "Tariff optimisation across home & car", "Monitoring, alerts and ongoing review"],
    cta: "Best for EV households and modern homes",
    featured: true,
  },
  {
    name: "Existing Solar Upgrade",
    sub: "Bring an older system up to today's standard.",
    items: ["Health check & performance audit", "Battery retrofit options", "Inverter & smart-control upgrades", "Export & SEG enrolment review", "Ongoing maintenance plan"],
    cta: "Best for homes with solar already installed",
  },
];

const process = [
  ["01", "Home Energy Review", "Free initial review of your home, usage and goals."],
  ["02", "Bills & Data", "Share recent bills and any existing system data."],
  ["03", "Site Survey", "Roof, electrics, EV-readiness and battery siting assessment."],
  ["04", "Proposal", "Clear, itemised proposal with savings, payback and finance routes."],
  ["05", "Install", "MCS / OZEV partner-led installation with full sign-off."],
  ["06", "Handover", "Documentation, app set-up, tariff guidance, warranties."],
  ["07", "Optimisation", "Ongoing monitoring, tariff review and maintenance."],
];

const faqs = [
  ["Is my home suitable for solar and battery?", "Most modern UK homes are suitable. The Home Energy Review confirms roof, electrics and consumption profile before any commitment."],
  ["Do I need batteries if I already have solar?", "If you're exporting most of your solar at low rates, a battery and tariff review usually transforms the economics. We'll quantify it for you."],
  ["What about the SEG and export?", "We make sure you're enrolled on the right Smart Export Guarantee tariff and that the system is configured to export when prices are best."],
  ["How long does installation take?", "Solar and battery: typically 1–2 days on site. EV charger: usually half a day. We agree dates upfront and stick to them."],
  ["What ongoing costs should I expect?", "Maintenance plans are optional and transparent. Most equipment carries long manufacturer warranties; we monitor performance throughout."],
  ["Can you upgrade an older solar system?", "Yes. Battery retrofit, inverter upgrades, smart controls and export enrolment are common upgrades for systems installed 5+ years ago."],
];

const Homes = () => {
  useEffect(() => {
    document.title = "Home Energy Optimisation | Clean Energy Gurus";
    const m = document.querySelector('meta[name="description"]') as HTMLMetaElement;
    if (m) m.content = "Solar, battery storage, EV charging and ongoing optimisation for homes that want lower bills, smarter export and better long-term performance.";
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
                For Homes
              </span>
              <h1 className="mt-5 text-4xl sm:text-5xl lg:text-[60px] leading-[1.04] font-display font-semibold text-navy">
                Take control of <span className="text-gradient">your home energy</span>.
              </h1>
              <p className="mt-6 text-lg text-navy-soft max-w-2xl leading-relaxed">
                Solar panels, battery storage, EV charging and ongoing
                optimisation for homes that want lower bills, smarter export and
                better long-term performance.
              </p>
              <div className="mt-9 flex flex-col sm:flex-row gap-3">
                <Link to="/contact">
                  <Button size="lg" className="bg-gradient-electric text-white border-0 rounded-full px-7 h-12 shadow-glow">
                    Get a Home Energy Review <ArrowRight className="ml-1.5 h-4 w-4" />
                  </Button>
                </Link>
                <Link to="/services">
                  <Button size="lg" variant="outline" className="rounded-full px-7 h-12 border-navy/15 text-navy hover:bg-navy hover:text-white">
                    Explore Solutions
                  </Button>
                </Link>
              </div>
              <div className="mt-10 grid grid-cols-3 gap-6 max-w-md">
                {[["MCS", "certified install"], ["OZEV", "EV partners"], ["25-yr", "horizon"]].map(([n, l]) => (
                  <div key={l}>
                    <div className="text-2xl font-display font-semibold text-navy">{n}</div>
                    <div className="text-xs text-muted-foreground mt-1">{l}</div>
                  </div>
                ))}
              </div>
            </div>
            <div className="lg:col-span-5 animate-scale-in">
              <div className="relative rounded-3xl overflow-hidden shadow-elegant border border-border/60">
                <img src={homeHero} alt="Modern UK home with rooftop solar panels and EV charging at dusk" width={1600} height={1200} className="w-full h-auto object-cover" />
                <div className="absolute inset-0 bg-gradient-to-tr from-navy/15 via-transparent to-transparent" />
                <div className="absolute bottom-4 left-4 right-4 grid grid-cols-2 gap-3">
                  <div className="rounded-xl bg-background/95 backdrop-blur p-3">
                    <div className="text-[10px] uppercase tracking-wider text-electric font-semibold">Battery</div>
                    <div className="text-sm font-medium text-navy mt-0.5">86% · holding</div>
                  </div>
                  <div className="rounded-xl bg-background/95 backdrop-blur p-3">
                    <div className="text-[10px] uppercase tracking-wider text-electric font-semibold">EV</div>
                    <div className="text-sm font-medium text-navy mt-0.5">Charging on solar</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* IDEAL FOR */}
      <section className="py-20 lg:py-28">
        <div className="container-tight">
          <div className="max-w-3xl mb-14">
            <span className="eyebrow">Ideal for</span>
            <h2 className="mt-3 text-3xl sm:text-4xl lg:text-5xl font-display font-semibold text-navy">
              Built for homes with <span className="text-gradient">real energy demand</span>.
            </h2>
            <p className="mt-5 text-navy-soft text-lg leading-relaxed">
              We focus on homes where the numbers genuinely add up — large
              properties, EV households, home offices and existing solar owners
              ready for the next step.
            </p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {idealFor.map(({ icon: Icon, label }) => (
              <div key={label} className="rounded-2xl border border-border bg-card p-6 flex items-center gap-4 hover:border-electric/30 hover:shadow-card transition-all">
                <div className="h-11 w-11 rounded-xl bg-accent grid place-items-center text-electric flex-shrink-0">
                  <Icon className="h-5 w-5" />
                </div>
                <div className="text-sm font-display font-semibold text-navy">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SOLUTIONS */}
      <section className="py-20 lg:py-28 bg-surface">
        <div className="container-tight">
          <div className="max-w-3xl mb-14">
            <span className="eyebrow">Home solutions</span>
            <h2 className="mt-3 text-3xl sm:text-4xl lg:text-5xl font-display font-semibold text-navy">
              A complete home energy stack — <span className="text-gradient">designed and managed for you</span>.
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

      {/* PACKAGES */}
      <section className="py-20 lg:py-28">
        <div className="container-tight">
          <div className="text-center max-w-3xl mx-auto mb-14">
            <span className="eyebrow justify-center">Home packages</span>
            <h2 className="mt-3 text-3xl sm:text-4xl lg:text-5xl font-display font-semibold text-navy">
              Three ways in. All built around your home.
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
                      <Check className="h-4 w-4 mt-0.5 flex-shrink-0 text-electric" />
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

      {/* SMARTER THAN INSTALLATION */}
      <section className="py-20 lg:py-28 bg-navy text-white relative overflow-hidden">
        <div className="absolute inset-0 grid-bg opacity-10" />
        <div className="absolute -top-40 right-0 h-[500px] w-[700px] bg-gradient-electric opacity-25 blur-3xl rounded-full" />
        <div className="container-tight relative">
          <div className="grid lg:grid-cols-12 gap-12 items-start">
            <div className="lg:col-span-5">
              <span className="eyebrow">Smarter than installation</span>
              <h2 className="mt-3 text-3xl sm:text-4xl lg:text-5xl font-display font-semibold text-white">
                Most installers walk away. <span className="text-gradient">We stay connected.</span>
              </h2>
              <p className="mt-6 text-white/75 text-lg leading-relaxed">
                A great install is just the start. The savings come from how the
                system is monitored, tuned and matched to the right tariff over
                the next 25 years.
              </p>
            </div>
            <div className="lg:col-span-7 grid sm:grid-cols-2 gap-4">
              {[
                { icon: Activity, title: "Performance monitoring", desc: "We watch generation, consumption and battery behaviour in real time." },
                { icon: Wrench, title: "Maintenance", desc: "Health checks, firmware updates and rapid response when something drifts." },
                { icon: BarChart3, title: "Tariff review", desc: "We revisit your tariff as the market shifts — not just once at install." },
                { icon: Upload, title: "Export optimisation", desc: "Configured to sell back when prices are highest and store when they're not." },
              ].map(({ icon: Icon, title, desc }) => (
                <div key={title} className="rounded-2xl border border-white/10 bg-white/[0.04] backdrop-blur p-6">
                  <div className="h-10 w-10 rounded-xl bg-electric/15 grid place-items-center text-electric">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="mt-4 text-base font-display font-semibold text-white">{title}</h3>
                  <p className="mt-1.5 text-sm text-white/70 leading-relaxed">{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* PROCESS */}
      <section className="py-20 lg:py-28">
        <div className="container-tight">
          <div className="max-w-3xl mb-14">
            <span className="eyebrow">How it works</span>
            <h2 className="mt-3 text-3xl sm:text-4xl lg:text-5xl font-display font-semibold text-navy">
              From first call to long-term optimisation.
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

      {/* SOLAR CALCULATOR */}
      <SolarCalculator segment="home" />

      {/* FAQ */}
      <section className="py-20 lg:py-28 bg-surface">
        <div className="container-tight grid lg:grid-cols-12 gap-12">
          <div className="lg:col-span-4">
            <span className="eyebrow">FAQ</span>
            <h2 className="mt-3 text-3xl sm:text-4xl font-display font-semibold text-navy">
              Common questions from homeowners.
            </h2>
            <p className="mt-5 text-navy-soft">If your question isn't here, ask during your Home Energy Review.</p>
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

export default Homes;
