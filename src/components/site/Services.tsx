import { Link } from "react-router-dom";
import { Sun, BatteryCharging, Plug, Activity, LineChart, Flame } from "lucide-react";

const services = [
  { icon: Sun, title: "Solar PV", desc: "Commercial-grade rooftop and ground-mount design built for performance and longevity.", to: "/services/solar-pv" },
  { icon: BatteryCharging, title: "Battery Storage", desc: "Store, time-shift and trade energy. Maximise self-consumption and resilience.", to: "/services/battery-storage" },
  { icon: Plug, title: "EV Charging", desc: "OZEV partner-led AC and DC chargers for sites, fleets, homes and tenants.", to: "/services/ev-charging" },
  { icon: Activity, title: "Monitoring & Maintenance", desc: "Continuous performance oversight, reporting and rapid intervention.", to: "/services/monitoring" },
  { icon: LineChart, title: "Tariff & Export Optimisation", desc: "Match the right tariff, optimise export windows and unlock new revenue.", to: "/services/tariff-optimisation" },
  { icon: Flame, title: "Heat Pumps & Efficiency", desc: "Partner-led heat pumps and energy-efficiency upgrades to complete the system.", to: "/services" },
];

export const Services = () => (
  <section className="py-20 lg:py-28 bg-surface">
    <div className="container-tight">
      <div className="text-center max-w-3xl mx-auto mb-14">
        <span className="eyebrow justify-center">Core services</span>
        <h2 className="mt-3 text-3xl sm:text-4xl lg:text-5xl font-display font-semibold text-navy">
          A complete energy stack — installed, connected and managed.
        </h2>
      </div>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
        {services.map(({ icon: Icon, title, desc, to }) => (
          <Link to={to} key={title} className="card-premium p-7 group">
            <div className="h-12 w-12 rounded-xl bg-gradient-electric grid place-items-center text-white shadow-glow">
              <Icon className="h-5 w-5" />
            </div>
            <h3 className="mt-5 text-xl font-display font-semibold text-navy">{title}</h3>
            <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{desc}</p>
            <div className="mt-5 text-xs font-semibold uppercase tracking-[0.18em] text-electric group-hover:translate-x-1 transition-transform">
              Learn more →
            </div>
          </Link>
        ))}
      </div>
    </div>
  </section>
);
