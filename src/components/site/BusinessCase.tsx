import { TrendingDown, Shield, Server, Upload, Plug, BarChart3 } from "lucide-react";

const cases = [
  { icon: TrendingDown, title: "Reduce grid electricity", desc: "Cut bought-in power by up to 70% with sized solar and battery." },
  { icon: Shield, title: "Protect against price volatility", desc: "Insulate operations from market swings and standing charge growth." },
  { icon: Server, title: "Improve site resilience", desc: "Battery backup keeps critical loads running through outages." },
  { icon: Upload, title: "Optimise export", desc: "Time export to peak windows and access flexibility revenue." },
  { icon: Plug, title: "Support EV charging", desc: "Power fleets, customers and tenants without grid bottlenecks." },
  { icon: BarChart3, title: "Recurring site intelligence", desc: "Performance data that informs every future energy decision." },
];

export const BusinessCase = () => (
  <section className="py-20 lg:py-28">
    <div className="container-tight">
      <div className="text-center max-w-3xl mx-auto mb-14">
        <span className="eyebrow justify-center">The business case</span>
        <h2 className="mt-3 text-3xl sm:text-4xl lg:text-5xl font-display font-semibold text-navy">
          Six reasons your property should be earning, not just consuming.
        </h2>
      </div>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
        {cases.map(({ icon: Icon, title, desc }) => (
          <div key={title} className="card-premium p-7">
            <div className="h-11 w-11 rounded-xl bg-accent grid place-items-center text-electric">
              <Icon className="h-5 w-5" />
            </div>
            <h3 className="mt-5 text-lg font-display font-semibold text-navy">{title}</h3>
            <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{desc}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
);
