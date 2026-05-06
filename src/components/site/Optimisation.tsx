import { CheckCircle2, Activity, Wrench, LineChart, Battery, Zap } from "lucide-react";

const points = [
  { icon: Activity, label: "Continuous monitoring across solar, battery, EV and grid" },
  { icon: Wrench, label: "Maintenance and rapid intervention when performance dips" },
  { icon: LineChart, label: "Tariff review as the UK energy market evolves" },
  { icon: Battery, label: "Battery dispatch behaviour tuned to your real load" },
  { icon: Zap, label: "Export optimisation and future flexibility opportunities" },
];

export const Optimisation = () => (
  <section className="py-20 lg:py-32 relative overflow-hidden">
    <div className="absolute inset-0 grid-bg-fine pointer-events-none opacity-60" />
    <div className="container-tight relative">
      <div className="max-w-4xl">
        <span className="eyebrow">The business model</span>
        <h2 className="mt-3 text-3xl sm:text-4xl lg:text-[56px] leading-[1.05] font-display font-semibold text-navy">
          Installation is the start. <br className="hidden sm:block" />
          <span className="text-gradient">Optimisation is the business model.</span>
        </h2>
        <p className="mt-7 text-lg text-navy-soft leading-relaxed max-w-3xl">
          Most providers stop when the system is installed. Clean Energy Gurus is
          built around the connected-site relationship: monitoring, maintenance,
          tariff review, export optimisation, battery behaviour and future
          flexibility opportunities.
        </p>
      </div>

      <div className="mt-14 grid lg:grid-cols-2 gap-10 lg:gap-16 items-start">
        <ul className="space-y-3">
          {points.map(({ icon: Icon, label }) => (
            <li key={label} className="flex items-start gap-4 p-5 rounded-2xl border border-border/60 bg-card hover:border-electric/30 hover:shadow-card transition-all">
              <div className="h-10 w-10 rounded-xl bg-gradient-electric grid place-items-center text-white shadow-glow flex-shrink-0">
                <Icon className="h-4.5 w-4.5" />
              </div>
              <div className="pt-1.5 text-[15px] text-navy font-medium">{label}</div>
              <CheckCircle2 className="h-5 w-5 text-electric ml-auto flex-shrink-0 mt-2" />
            </li>
          ))}
        </ul>

        <div className="relative lg:sticky lg:top-28">
          <div className="absolute -inset-6 bg-gradient-electric rounded-3xl opacity-15 blur-2xl" />
          <div className="relative rounded-3xl border border-border bg-card p-8 shadow-elegant">
            <div className="flex items-center justify-between mb-6">
              <div>
                <div className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">Connected site</div>
                <div className="text-lg font-display font-semibold text-navy mt-1">Northgate Distribution</div>
              </div>
              <div className="px-2.5 py-1 rounded-full bg-accent text-electric text-[10px] font-semibold uppercase tracking-wider">Optimised</div>
            </div>
            <div className="grid grid-cols-3 gap-3 mb-6">
              {[["Today", "412 kWh"], ["Self-use", "78%"], ["Export", "92 kWh"]].map(([l, v]) => (
                <div key={l} className="rounded-xl bg-surface p-3">
                  <div className="text-[10px] uppercase tracking-wider text-muted-foreground">{l}</div>
                  <div className="text-lg font-display font-semibold text-navy mt-0.5">{v}</div>
                </div>
              ))}
            </div>
            <div className="rounded-xl bg-surface p-4">
              <div className="flex items-end justify-between gap-1.5 h-24">
                {[40, 55, 38, 62, 78, 92, 85, 70, 88, 95, 80, 65].map((h, i) => (
                  <div key={i} className="flex-1 rounded-t-md bg-gradient-electric opacity-80" style={{ height: `${h}%` }} />
                ))}
              </div>
              <div className="mt-3 flex justify-between text-[10px] text-muted-foreground">
                <span>06:00</span><span>12:00</span><span>18:00</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
);
