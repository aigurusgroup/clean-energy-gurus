import { CheckCircle2 } from "lucide-react";

const points = [
  "Performance monitoring across solar, battery, EV and grid",
  "Tariff review and switching guidance as the market evolves",
  "Battery dispatch optimisation for self-use and export",
  "Site-level reporting for finance, ESG and operations teams",
];

export const Optimisation = () => (
  <section className="py-20 lg:py-28">
    <div className="container-tight">
      <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
        <div>
          <span className="eyebrow">Beyond installation</span>
          <h2 className="mt-3 text-3xl sm:text-4xl lg:text-5xl font-display font-semibold text-navy">
            Not just installation. <span className="text-gradient">Ongoing energy optimisation.</span>
          </h2>
          <p className="mt-6 text-navy-soft text-lg leading-relaxed">
            Hardware is the starting point. Long-term value comes from the system
            beneath it — monitoring, maintenance, tariff review and dispatch
            decisions made every day for the next twenty-five years.
          </p>
          <ul className="mt-8 space-y-3.5">
            {points.map((p) => (
              <li key={p} className="flex gap-3 text-navy">
                <CheckCircle2 className="h-5 w-5 text-electric flex-shrink-0 mt-0.5" />
                <span className="text-[15px]">{p}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="relative">
          <div className="absolute -inset-6 bg-gradient-electric rounded-3xl opacity-15 blur-2xl" />
          <div className="relative rounded-3xl border border-border bg-card p-8 shadow-elegant">
            <div className="flex items-center justify-between mb-6">
              <div>
                <div className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">Site overview</div>
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
