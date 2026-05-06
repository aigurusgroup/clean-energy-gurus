import { useEffect } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight, Activity, BarChart3, Zap, Battery, Plug, Wrench, Upload, Sparkles,
  Home, Briefcase, Tractor, Building, Check, AlertTriangle, TrendingUp, Sun, Gauge,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { SiteLayout } from "@/components/site/SiteLayout";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const capabilities = [
  { icon: Activity, t: "Monitor system performance", d: "Half-hourly visibility across solar, battery, grid and EV." },
  { icon: TrendingUp, t: "Track savings", d: "See real bill impact, payback progress and lifetime value." },
  { icon: Zap, t: "Review tariff options", d: "Match your tariff to how the system actually performs." },
  { icon: Upload, t: "Review export performance", d: "Make sure you're being paid fairly for what you send back." },
  { icon: Wrench, t: "Coordinate maintenance", d: "Health checks, firmware and rapid response when something drifts." },
  { icon: Battery, t: "Monitor battery behaviour", d: "Cycle health, dispatch logic and state-of-charge over time." },
  { icon: Plug, t: "Track EV infrastructure", d: "Sessions, faults and load balancing — across every charger." },
  { icon: Sparkles, t: "Future flexibility readiness", d: "Set up for export markets and grid-services participation." },
];

const useCases = [
  { icon: Home, title: "Homeowners", desc: "Stay on the right tariff, watch your battery earn its keep, and catch issues before you do." },
  { icon: Briefcase, title: "Businesses", desc: "Operations-grade reporting on generation, self-consumption, EV usage and maintenance." },
  { icon: Tractor, title: "Farms", desc: "Site-wide visibility across high-load assets — from cold stores to dryers and EV fleets." },
  { icon: Building, title: "Landlords", desc: "Portfolio-level dashboards, EV port utilisation and ESG-grade reporting in one view." },
];

const tiers = [
  {
    name: "Basic Monitoring",
    sub: "Stay informed about your system.",
    items: ["Live performance dashboard", "Generation & consumption tracking", "Battery & EV visibility", "Quarterly health summary", "Email alerts"],
    cta: "Best for single-site homes",
  },
  {
    name: "Managed Optimisation",
    sub: "Active management of your energy system.",
    items: ["Everything in Basic Monitoring", "Tariff review & switching guidance", "Export configuration & SEG review", "Battery dispatch optimisation", "Priority maintenance response"],
    cta: "Best for high-usage homes, farms and SMEs",
    featured: true,
  },
  {
    name: "Portfolio Reporting",
    sub: "Multi-site oversight at investor grade.",
    items: ["Multi-site dashboard & roll-up", "Quarterly performance & ESG reports", "Per-site maintenance status", "Dedicated portfolio manager", "API & data export"],
    cta: "Best for landlords, BTR and multi-site operators",
  },
];

const faqs = [
  ["Do I need Gurus Optimise™ if I already have a manufacturer app?", "Manufacturer apps show device data. Gurus Optimise™ adds tariff intelligence, export review, maintenance coordination and — for portfolios — multi-site reporting on top of that data."],
  ["Does this work with systems Clean Energy Gurus didn't install?", "In many cases yes. We support the major inverter, battery and charger brands. We'll confirm compatibility during onboarding."],
  ["What happens when something goes wrong with my system?", "On Managed Optimisation and above, we see the issue first, triage it, and coordinate the fix — often before you've noticed."],
  ["Can I cancel?", "Yes. Plans are monthly with no long lock-ins. You keep your installed equipment and data either way."],
  ["Will you sell my energy data?", "No. Your data is used to operate and improve your system, and to produce your reports. Nothing else."],
  ["What about future flexibility markets?", "We're preparing customers technically and contractually for export and flexibility opportunities as they mature — without overpromising returns that don't yet exist."],
];

const Platform = () => {
  useEffect(() => {
    document.title = "Gurus Optimise™ | Clean Energy Gurus";
    const m = document.querySelector('meta[name="description"]') as HTMLMetaElement;
    if (m) m.content = "Gurus Optimise™ helps connected homes, businesses, farms and portfolios monitor performance, review tariffs, optimise export and stay ahead of maintenance.";
  }, []);

  return (
    <SiteLayout>
      {/* HERO */}
      <section className="relative overflow-hidden bg-navy text-white pt-20 pb-24 lg:pt-28 lg:pb-32">
        <div className="absolute inset-0 grid-bg opacity-15" />
        <div className="absolute -top-40 -right-40 h-[600px] w-[600px] rounded-full bg-gradient-electric opacity-30 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-40 -left-40 h-[500px] w-[500px] rounded-full bg-electric/30 opacity-30 blur-3xl pointer-events-none" />
        <div className="container-tight relative">
          <div className="grid lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-6 animate-fade-in-up">
              <span className="eyebrow text-electric">
                <span className="h-1.5 w-1.5 rounded-full bg-electric animate-pulse" />
                Gurus Optimise™ Platform
              </span>
              <h1 className="mt-5 text-4xl sm:text-5xl lg:text-[60px] leading-[1.04] font-display font-semibold text-white">
                Your energy system should keep <span className="text-gradient">improving after installation</span>.
              </h1>
              <p className="mt-6 text-lg text-white/75 max-w-2xl leading-relaxed">
                Gurus Optimise™ helps connected homes, businesses, farms and
                property portfolios monitor performance, review tariffs, optimise
                export value and stay ahead of maintenance issues.
              </p>
              <div className="mt-9 flex flex-col sm:flex-row gap-3">
                <Link to="/contact">
                  <Button size="lg" className="bg-gradient-electric text-white border-0 rounded-full px-7 h-12 shadow-glow">
                    Connect My Site <ArrowRight className="ml-1.5 h-4 w-4" />
                  </Button>
                </Link>
                <Link to="/services">
                  <Button size="lg" variant="outline" className="rounded-full px-7 h-12 border-white/20 text-white bg-white/5 hover:bg-white hover:text-navy">
                    See What It Does
                  </Button>
                </Link>
              </div>
            </div>

            {/* HERO DASHBOARD */}
            <div className="lg:col-span-6 animate-scale-in">
              <div className="rounded-3xl border border-white/10 bg-white/[0.04] backdrop-blur-xl p-5 sm:p-6 shadow-2xl">
                <div className="flex items-center justify-between pb-4 mb-5 border-b border-white/10">
                  <div className="text-xs text-white/60 font-mono">gurus-optimise.io</div>
                  <div className="flex items-center gap-2 text-[11px] text-white/60">
                    <span className="h-1.5 w-1.5 rounded-full bg-electric animate-pulse" /> Live
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { l: "Generation", v: "5.8 kW", s: "↑ peak" },
                    { l: "Self-use", v: "82%", s: "today" },
                    { l: "Battery", v: "86%", s: "holding" },
                    { l: "Export", v: "1.2 kW", s: "@ 18p" },
                    { l: "EV", v: "Charging", s: "on solar" },
                    { l: "Saving", v: "£4.20", s: "today" },
                  ].map((t) => (
                    <div key={t.l} className="rounded-xl bg-white/[0.04] border border-white/10 p-4">
                      <div className="text-[9px] uppercase tracking-[0.16em] text-white/55">{t.l}</div>
                      <div className="mt-2 text-lg font-display font-semibold text-white">{t.v}</div>
                      <div className="text-[10px] text-electric mt-0.5">{t.s}</div>
                    </div>
                  ))}
                </div>
                <div className="mt-4 rounded-xl bg-white/[0.04] border border-white/10 p-4 flex items-end gap-1.5 h-24">
                  {[20, 28, 36, 48, 62, 78, 92, 86, 70, 54, 40, 26].map((h, i) => (
                    <div key={i} className="flex-1 rounded-sm bg-gradient-to-t from-electric/40 to-electric" style={{ height: `${h}%` }} />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* PROBLEM */}
      <section className="py-20 lg:py-28">
        <div className="container-tight grid lg:grid-cols-12 gap-12 items-start">
          <div className="lg:col-span-5">
            <span className="eyebrow">The problem</span>
            <h2 className="mt-3 text-3xl sm:text-4xl lg:text-5xl font-display font-semibold text-navy">
              Most systems are installed and <span className="text-gradient">forgotten</span>.
            </h2>
          </div>
          <div className="lg:col-span-7 space-y-4">
            {[
              { icon: AlertTriangle, t: "Performance drifts silently", d: "Panels get dirty. Inverters fault. Batteries cycle inefficiently. You won't see it on a bill until it's too late." },
              { icon: AlertTriangle, t: "Tariffs go stale", d: "The market shifts every quarter. Most homeowners and businesses are still on the tariff they signed up to two years ago." },
              { icon: AlertTriangle, t: "Export value is left on the table", d: "Without active export configuration, systems give energy away cheaply that could be earning twice as much." },
              { icon: AlertTriangle, t: "No one is watching", d: "When something fails, the customer is the alarm. By then, weeks of generation are already gone." },
            ].map(({ icon: Icon, t, d }) => (
              <div key={t} className="rounded-2xl border border-border bg-card p-6 flex gap-5">
                <div className="h-10 w-10 rounded-xl bg-destructive/10 grid place-items-center text-destructive flex-shrink-0">
                  <Icon className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-base font-display font-semibold text-navy">{t}</h3>
                  <p className="mt-1.5 text-sm text-muted-foreground leading-relaxed">{d}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CAPABILITIES */}
      <section className="py-20 lg:py-28 bg-surface">
        <div className="container-tight">
          <div className="max-w-3xl mb-14">
            <span className="eyebrow">The platform</span>
            <h2 className="mt-3 text-3xl sm:text-4xl lg:text-5xl font-display font-semibold text-navy">
              One operating layer for <span className="text-gradient">everything you've installed</span>.
            </h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
            {capabilities.map(({ icon: Icon, t, d }) => (
              <div key={t} className="card-premium p-7">
                <div className="h-11 w-11 rounded-xl bg-gradient-electric grid place-items-center text-white shadow-glow">
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="mt-5 text-base font-display font-semibold text-navy">{t}</h3>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* DASHBOARD MOCK */}
      <section className="py-20 lg:py-28 bg-navy text-white relative overflow-hidden">
        <div className="absolute inset-0 grid-bg opacity-10" />
        <div className="absolute -top-40 right-0 h-[500px] w-[700px] bg-gradient-electric opacity-25 blur-3xl rounded-full" />
        <div className="container-tight relative">
          <div className="max-w-3xl mb-12">
            <span className="eyebrow text-electric">Inside Gurus Optimise™</span>
            <h2 className="mt-3 text-3xl sm:text-4xl lg:text-5xl font-display font-semibold text-white">
              Live operational control of your energy estate.
            </h2>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/[0.04] backdrop-blur-xl p-6 sm:p-8 shadow-2xl">
            <div className="flex items-center justify-between pb-5 mb-6 border-b border-white/10">
              <div className="text-xs text-white/60 font-mono">gurus-optimise.io / overview</div>
              <div className="flex items-center gap-2 text-[11px] text-white/60">
                <span className="h-1.5 w-1.5 rounded-full bg-electric animate-pulse" /> Live · last sync 12s ago
              </div>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { icon: Building, label: "Sites connected", value: "247", trend: "+12 this quarter" },
                { icon: Sun, label: "kW managed", value: "8.4 MW", trend: "live capacity" },
                { icon: Battery, label: "Batteries active", value: "184", trend: "78% avg SoC" },
                { icon: Plug, label: "EV ports managed", value: "612", trend: "94 active now" },
                { icon: Upload, label: "Export performance", value: "+18%", trend: "vs default tariff" },
                { icon: Wrench, label: "Maintenance alerts", value: "3", trend: "all triaged" },
                { icon: TrendingUp, label: "Estimated savings", value: "£1.42M", trend: "YTD across estate" },
                { icon: Gauge, label: "Uptime", value: "99.6%", trend: "rolling 90 days" },
              ].map(({ icon: Icon, label, value, trend }) => (
                <div key={label} className="rounded-2xl bg-white/[0.04] border border-white/10 p-5 hover:border-electric/30 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="text-[10px] font-semibold uppercase tracking-[0.16em] text-white/55">{label}</div>
                    <Icon className="h-4 w-4 text-electric" />
                  </div>
                  <div className="mt-3 text-2xl font-display font-semibold">{value}</div>
                  <div className="mt-1 text-xs text-white/55">{trend}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* USE CASES */}
      <section className="py-20 lg:py-28">
        <div className="container-tight">
          <div className="max-w-3xl mb-14">
            <span className="eyebrow">Who it's for</span>
            <h2 className="mt-3 text-3xl sm:text-4xl lg:text-5xl font-display font-semibold text-navy">
              Built for every kind of energy customer.
            </h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
            {useCases.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="card-premium p-7">
                <div className="h-12 w-12 rounded-xl bg-accent grid place-items-center text-electric">
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="mt-5 text-lg font-display font-semibold text-navy">{title}</h3>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PRICING */}
      <section className="py-20 lg:py-28 bg-surface">
        <div className="container-tight">
          <div className="text-center max-w-3xl mx-auto mb-14">
            <span className="eyebrow justify-center">Plans</span>
            <h2 className="mt-3 text-3xl sm:text-4xl lg:text-5xl font-display font-semibold text-navy">
              Three tiers. Single home to national portfolio.
            </h2>
            <p className="mt-5 text-navy-soft">Indicative tiers — confirmed during onboarding based on your assets.</p>
          </div>
          <div className="grid lg:grid-cols-3 gap-6">
            {tiers.map((p) => (
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
                    Talk to us
                  </Button>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FUTURE LAYER */}
      <section className="py-20 lg:py-28">
        <div className="container-tight grid lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-5">
            <span className="eyebrow">The future energy layer</span>
            <h2 className="mt-3 text-3xl sm:text-4xl lg:text-5xl font-display font-semibold text-navy">
              Ready for what's <span className="text-gradient">coming next</span>.
            </h2>
            <p className="mt-6 text-navy-soft text-lg leading-relaxed">
              Energy markets are opening up. Export pricing, flexibility services
              and managed energy partnerships will reward sites that are
              technically ready, well-monitored and properly contracted.
            </p>
            <p className="mt-4 text-navy-soft leading-relaxed">
              We won't promise returns that don't yet exist — but we'll make sure
              your site is positioned to participate when they do.
            </p>
          </div>
          <div className="lg:col-span-7 grid sm:grid-cols-2 gap-4">
            {[
              { icon: Upload, t: "Export optimisation", d: "Configured to capture the best export rates available to your meter." },
              { icon: BarChart3, t: "Flexibility participation", d: "Technical readiness for DSR, balancing and capacity programmes." },
              { icon: Sparkles, t: "Managed energy partnerships", d: "Aggregator and supplier partnerships that may unlock additional value." },
              { icon: Sun, t: "VPP-ready architecture", d: "Battery and inverter set-ups designed to plug into virtual power plants." },
            ].map(({ icon: Icon, t, d }) => (
              <div key={t} className="rounded-2xl border border-border bg-card p-6">
                <div className="h-10 w-10 rounded-xl bg-gradient-electric grid place-items-center text-white shadow-glow">
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="mt-4 text-base font-display font-semibold text-navy">{t}</h3>
                <p className="mt-1.5 text-sm text-muted-foreground leading-relaxed">{d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 lg:py-28 bg-surface">
        <div className="container-tight grid lg:grid-cols-12 gap-12">
          <div className="lg:col-span-4">
            <span className="eyebrow">FAQ</span>
            <h2 className="mt-3 text-3xl sm:text-4xl font-display font-semibold text-navy">
              Common questions about Gurus Optimise™.
            </h2>
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

      {/* CTA */}
      <section className="py-20">
        <div className="container-tight">
          <div className="relative overflow-hidden rounded-3xl bg-navy text-white p-10 sm:p-16 lg:p-20 text-center">
            <div className="absolute inset-0 grid-bg opacity-10" />
            <div className="absolute -top-32 -right-32 h-[400px] w-[400px] bg-gradient-electric opacity-30 blur-3xl rounded-full" />
            <div className="absolute -bottom-32 -left-32 h-[400px] w-[400px] bg-electric/30 opacity-30 blur-3xl rounded-full" />
            <div className="relative max-w-2xl mx-auto">
              <span className="eyebrow justify-center text-electric">Get connected</span>
              <h2 className="mt-3 text-3xl sm:text-4xl lg:text-5xl font-display font-semibold text-white">
                Connect your site to <span className="text-gradient">Gurus Optimise™</span>.
              </h2>
              <p className="mt-5 text-white/75 text-lg leading-relaxed">
                Tell us about your system. We'll confirm compatibility and get
                you connected — usually within a week.
              </p>
              <div className="mt-9 flex flex-col sm:flex-row gap-3 justify-center">
                <Link to="/contact">
                  <Button size="lg" className="bg-gradient-electric text-white border-0 rounded-full px-8 h-12 shadow-glow">
                    Connect My Site <ArrowRight className="ml-1.5 h-4 w-4" />
                  </Button>
                </Link>
                <Link to="/services">
                  <Button size="lg" variant="outline" className="rounded-full px-8 h-12 border-white/20 text-white bg-white/5 hover:bg-white hover:text-navy">
                    Talk to us first
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </SiteLayout>
  );
};

export default Platform;
