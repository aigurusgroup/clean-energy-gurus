import { useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Snowflake, Droplets, Wrench, Milk, Bird, Wheat, Store, Home, Plug, Sun, Battery, ShieldCheck, Wallet, Activity, Check, Sunrise, Layers, Tractor } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SiteLayout } from "@/components/site/SiteLayout";
import { ReviewForm } from "@/components/site/ReviewForm";
import { SolarCalculator } from "@/components/site/SolarCalculator";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import farmHero from "@/assets/farm-hero.jpg";

const reasons = [
  { icon: Layers, title: "Large unused roof area", desc: "Barns, sheds and outbuildings offer hectares of south-facing capacity." },
  { icon: Sunrise, title: "High daytime load", desc: "Operations run when the sun is shining — perfect for direct self-consumption." },
  { icon: Tractor, title: "Land-side options", desc: "Ground-mount and agri-PV unlock additional capacity beyond the rooftop." },
  { icon: ShieldCheck, title: "Resilience matters", desc: "Refrigeration, milking and security cannot afford a grid outage." },
];

const useCases = [
  { icon: Snowflake, title: "Cold storage" },
  { icon: Droplets, title: "Irrigation" },
  { icon: Wrench, title: "Workshops" },
  { icon: Milk, title: "Dairies" },
  { icon: Bird, title: "Poultry" },
  { icon: Wheat, title: "Grain drying" },
  { icon: Store, title: "Farm shops" },
  { icon: Home, title: "Holiday lets" },
  { icon: Plug, title: "EV fleet charging" },
];

const solutions = [
  { icon: Sun, title: "Farm Solar PV", desc: "Roof and ground-mount arrays designed for working farm conditions." },
  { icon: Battery, title: "Battery Storage", desc: "Cover evening loads and protect critical operations from outages." },
  { icon: Plug, title: "EV Charging", desc: "On-farm charging for vehicles, fleets and visitors." },
  { icon: ShieldCheck, title: "Backup & Resilience", desc: "Site-wide assessment so essential loads keep running." },
  { icon: Wallet, title: "Finance / PPA Routes", desc: "Cash, lease, asset finance or PPA — matched to your accounts." },
  { icon: Activity, title: "Monitoring & Maintenance", desc: "Performance oversight and rapid intervention across all assets." },
];

const process = [
  ["01", "Farm Energy Review", "Free conversation about your site, loads and ambitions."],
  ["02", "Bills & Data", "We collect MPAN data and seasonal usage to model accurately."],
  ["03", "Site Survey", "Roof, ground, structural, electrical and DNO assessment."],
  ["04", "Proposal", "Sized design, ROI and finance options on one page."],
  ["05", "Install", "Accredited MCS partner-led delivery, planned around your season."],
  ["06", "Handover", "Documentation, warranties and platform onboarding."],
  ["07", "Optimisation", "Monitoring, tariff review and continuous improvement."],
];

const packages = [
  {
    name: "Farm Solar Review",
    sub: "Start with a clear-eyed assessment.",
    items: ["Roof & ground-mount review", "Yield and ROI modelling", "DNO and grant-route guidance", "No-obligation written proposal"],
    cta: "Best for farms exploring solar for the first time",
  },
  {
    name: "Farm Solar + Battery",
    sub: "Generate, store and protect operations.",
    items: ["Sized solar PV array", "Battery storage for evening & outage cover", "MCS partner-led install", "Quarterly performance reporting"],
    cta: "Best for farms with critical refrigeration or livestock loads",
    featured: true,
  },
  {
    name: "Farm Energy Platform",
    sub: "A managed energy operation.",
    items: ["Solar + battery + EV charging", "Gurus Optimise™ platform access", "Tariff & export optimisation", "Dedicated farm account manager"],
    cta: "Best for estates and multi-site rural businesses",
  },
];

const tiles = [
  { label: "Today's generation", value: "642 kWh", trend: "Above forecast" },
  { label: "Self-use", value: "81%", trend: "Cold store + workshop" },
  { label: "Battery", value: "74%", trend: "Reserved for evening" },
  { label: "Export", value: "118 kWh", trend: "Sold at peak rate" },
  { label: "Tariff status", value: "Optimised", trend: "Reviewed last week" },
  { label: "Maintenance", value: "All clear", trend: "Next inspection: Aug" },
];

const faqs = [
  ["Is my farm too remote for solar?", "Almost never. Most farms have excellent roof and land conditions. We coordinate with your DNO on capacity and connections."],
  ["Will it interfere with farming operations?", "No. Installations are planned around seasonal cycles. Roof work is external; ground-mount uses field margins or low-yield land."],
  ["What grants or schemes are available?", "We assess eligibility for SEG, capital allowances and any current rural energy schemes during the review."],
  ["What about livestock and biosecurity?", "Installations follow strict biosecurity protocols. Battery and electrical equipment is sited away from livestock areas."],
  ["Can I sell surplus energy back to the grid?", "Yes. We size for self-consumption first, then optimise export to peak windows for the best return."],
  ["What ongoing support do we get?", "Continuous monitoring, performance reporting, tariff reviews and rapid maintenance through Gurus Optimise™."],
];

const Farms = () => {
  useEffect(() => {
    document.title = "Farm Energy Independence | Clean Energy Gurus";
    const m = document.querySelector('meta[name="description"]') as HTMLMetaElement;
    if (m) m.content = "Build energy independence for your farm, estate or rural business with solar, battery storage, EV charging and ongoing optimisation.";
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
                Farms & Rural Business
              </span>
              <h1 className="mt-5 text-4xl sm:text-5xl lg:text-[64px] leading-[1.04] font-display font-semibold text-navy">
                Build energy independence for your <span className="text-gradient">farm, estate or rural business</span>.
              </h1>
              <p className="mt-6 text-lg text-navy-soft max-w-2xl leading-relaxed">
                Use roofs, land-side infrastructure and high daytime energy usage
                to reduce costs, improve resilience and create a managed energy asset.
              </p>
              <div className="mt-9 flex flex-col sm:flex-row gap-3">
                <Link to="/contact">
                  <Button size="lg" className="bg-gradient-electric text-white border-0 rounded-full px-7 h-12 shadow-glow">
                    Book a Farm Energy Review <ArrowRight className="ml-1.5 h-4 w-4" />
                  </Button>
                </Link>
                <Link to="/services">
                  <Button size="lg" variant="outline" className="rounded-full px-7 h-12 border-navy/15 text-navy hover:bg-navy hover:text-white">
                    Explore Solutions
                  </Button>
                </Link>
              </div>
              <div className="mt-10 grid grid-cols-3 gap-6 max-w-md">
                {[["80%+", "self-use possible"], ["£/kWh", "stable pricing"], ["25 yr", "asset horizon"]].map(([n, l]) => (
                  <div key={l}>
                    <div className="text-2xl font-display font-semibold text-navy">{n}</div>
                    <div className="text-xs text-muted-foreground mt-1">{l}</div>
                  </div>
                ))}
              </div>
            </div>
            <div className="lg:col-span-5 animate-scale-in">
              <div className="relative rounded-3xl overflow-hidden shadow-elegant border border-border/60">
                <img src={farmHero} alt="UK farm with solar panels on barn rooftops" width={1600} height={1200} className="w-full h-auto object-cover" />
                <div className="absolute inset-0 bg-gradient-to-tr from-navy/15 via-transparent to-transparent" />
                <div className="absolute bottom-4 left-4 right-4 grid grid-cols-2 gap-3">
                  <div className="rounded-xl bg-background/95 backdrop-blur p-3">
                    <div className="text-[10px] uppercase tracking-wider text-electric font-semibold">Cold store</div>
                    <div className="text-sm font-medium text-navy mt-0.5">Running on solar</div>
                  </div>
                  <div className="rounded-xl bg-background/95 backdrop-blur p-3">
                    <div className="text-[10px] uppercase tracking-wider text-electric font-semibold">Today</div>
                    <div className="text-sm font-medium text-navy mt-0.5">£94 saved</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* WHY FARMS */}
      <section className="py-20 lg:py-28">
        <div className="container-tight">
          <div className="max-w-3xl mb-14">
            <span className="eyebrow">Why farms</span>
            <h2 className="mt-3 text-3xl sm:text-4xl lg:text-5xl font-display font-semibold text-navy">
              Farms are some of the strongest sites in the UK for solar and battery storage.
            </h2>
            <p className="mt-5 text-navy-soft text-lg leading-relaxed">
              Big roofs, available land, daylight-heavy operations and critical
              loads that can't afford to fail. The economics tend to stack up
              quickly — and the resilience benefits are immediate.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {reasons.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="card-premium p-7">
                <div className="h-11 w-11 rounded-xl bg-accent grid place-items-center text-electric">
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="mt-5 text-base font-display font-semibold text-navy">{title}</h3>
                <p className="mt-1.5 text-sm text-muted-foreground">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* USE CASES */}
      <section className="py-20 lg:py-28 bg-surface">
        <div className="container-tight">
          <div className="max-w-3xl mb-14">
            <span className="eyebrow">Common farm use cases</span>
            <h2 className="mt-3 text-3xl sm:text-4xl lg:text-5xl font-display font-semibold text-navy">
              From cold store to combine — your daytime load is the opportunity.
            </h2>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 gap-3">
            {useCases.map(({ icon: Icon, title }) => (
              <div key={title} className="rounded-2xl border border-border bg-card p-6 flex items-center gap-4 hover:border-electric/30 hover:shadow-card transition-all">
                <div className="h-11 w-11 rounded-xl bg-gradient-electric grid place-items-center text-white shadow-glow flex-shrink-0">
                  <Icon className="h-5 w-5" />
                </div>
                <div className="text-base font-display font-semibold text-navy">{title}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SOLUTIONS */}
      <section className="py-20 lg:py-28">
        <div className="container-tight">
          <div className="max-w-3xl mb-14">
            <span className="eyebrow">The solution</span>
            <h2 className="mt-3 text-3xl sm:text-4xl lg:text-5xl font-display font-semibold text-navy">
              A complete rural energy stack — <span className="text-gradient">designed for working farms</span>.
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
      <section className="py-20 lg:py-28 bg-surface">
        <div className="container-tight">
          <div className="text-center max-w-3xl mx-auto mb-14">
            <span className="eyebrow justify-center">Farm packages</span>
            <h2 className="mt-3 text-3xl sm:text-4xl lg:text-5xl font-display font-semibold text-navy">
              Three pathways. Sized to your operation.
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
                      <Check className="h-4.5 w-4.5 mt-0.5 flex-shrink-0 text-electric" />
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

      {/* PROCESS */}
      <section className="py-20 lg:py-28">
        <div className="container-tight">
          <div className="max-w-3xl mb-14">
            <span className="eyebrow">How it works</span>
            <h2 className="mt-3 text-3xl sm:text-4xl lg:text-5xl font-display font-semibold text-navy">
              From farm walk to ongoing optimisation.
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

      {/* PLATFORM */}
      <section className="py-20 lg:py-28 bg-navy text-white relative overflow-hidden">
        <div className="absolute inset-0 grid-bg opacity-10" />
        <div className="absolute -top-40 right-0 h-[500px] w-[700px] bg-gradient-electric opacity-25 blur-3xl rounded-full" />
        <div className="container-tight relative">
          <div className="max-w-3xl mb-12">
            <span className="eyebrow">Gurus Optimise™ for farms</span>
            <h2 className="mt-3 text-3xl sm:text-4xl lg:text-5xl font-display font-semibold text-white">
              Your farm's energy, in one calm dashboard.
            </h2>
            <p className="mt-5 text-white/75 text-lg leading-relaxed">
              Performance monitoring, export review, tariff optimisation and
              maintenance alerts — across every barn, store and meter.
            </p>
          </div>
          <div className="rounded-3xl border border-white/10 bg-white/[0.04] backdrop-blur-xl p-6 sm:p-8 shadow-2xl">
            <div className="flex items-center justify-between pb-5 mb-6 border-b border-white/10">
              <div className="text-xs text-white/60 font-mono">gurus-optimise.io / farms / west-barn</div>
              <div className="flex items-center gap-2 text-[11px] text-white/60">
                <span className="h-1.5 w-1.5 rounded-full bg-electric animate-pulse" /> Live
              </div>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {tiles.map((t) => (
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
      <SolarCalculator segment="farm" className="bg-surface" />

      {/* FAQ */}
      <section className="py-20 lg:py-28">
        <div className="container-tight grid lg:grid-cols-12 gap-12">
          <div className="lg:col-span-4">
            <span className="eyebrow">FAQ</span>
            <h2 className="mt-3 text-3xl sm:text-4xl font-display font-semibold text-navy">
              Common questions from farm owners.
            </h2>
            <p className="mt-5 text-navy-soft">If we haven't answered it here, ask us during the review.</p>
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

export default Farms;
