import { Search, PencilRuler, Wrench, Cable, Activity, TrendingUp } from "lucide-react";

const steps = [
  { icon: Search, title: "Review", desc: "Energy audit and modelling." },
  { icon: PencilRuler, title: "Design", desc: "System sized to your load." },
  { icon: Wrench, title: "Install", desc: "Accredited partner-led delivery." },
  { icon: Cable, title: "Connect", desc: "DNO and metering coordinated." },
  { icon: Activity, title: "Monitor", desc: "24/7 performance oversight." },
  { icon: TrendingUp, title: "Optimise", desc: "Tariffs, export and dispatch." },
];

export const Journey = () => (
  <section className="py-20 lg:py-28 bg-navy text-white relative overflow-hidden">
    <div className="absolute inset-0 grid-bg opacity-10 pointer-events-none" />
    <div className="absolute -top-40 left-1/2 -translate-x-1/2 h-[500px] w-[800px] bg-gradient-electric opacity-20 blur-3xl rounded-full" />
    <div className="container-tight relative">
      <div className="text-center max-w-3xl mx-auto mb-16">
        <span className="eyebrow">The Managed Energy Asset Model</span>
        <h2 className="mt-3 text-3xl sm:text-4xl lg:text-5xl font-display font-semibold text-white">
          Six stages. One long-term system.
        </h2>
        <p className="mt-5 text-white/70 text-lg">
          From the first review to lifetime optimisation — we own the full journey
          so your property keeps performing.
        </p>
      </div>

      <div className="relative">
        <div className="hidden lg:block absolute top-12 left-[8%] right-[8%] h-px bg-gradient-to-r from-transparent via-electric to-transparent" />
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 relative">
          {steps.map(({ icon: Icon, title, desc }, i) => (
            <div key={title} className="text-center group">
              <div className="relative mx-auto h-16 w-16 rounded-2xl bg-white/5 border border-white/10 grid place-items-center backdrop-blur-sm group-hover:bg-gradient-electric transition-all duration-500">
                <Icon className="h-6 w-6 text-electric group-hover:text-white transition-colors" />
                <div className="absolute -top-2 -right-2 h-6 w-6 rounded-full bg-white text-navy text-xs font-semibold grid place-items-center">{i + 1}</div>
              </div>
              <h3 className="mt-4 text-base font-display font-semibold text-white">{title}</h3>
              <p className="mt-1 text-xs text-white/60">{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  </section>
);
