import { Link } from "react-router-dom";
import { Home, Building2, Sprout, Activity, BookOpen } from "lucide-react";

const services = [
  { icon: Home, title: "Residential Energy Solutions", desc: "Solar, batteries, EV charging and long-term optimisation for UK homes.", to: "/residential" },
  { icon: Building2, title: "Business Energy Solutions", desc: "Commercial solar, workplace EV and landlord portfolio upgrades.", to: "/business" },
  { icon: Sprout, title: "Agricultural Energy Solutions", desc: "Farm solar, storage and resilience — built for working farms.", to: "/agriculture" },
  { icon: Activity, title: "Energy Optimisation", desc: "Monitoring, maintenance, tariff and battery optimisation post-install.", to: "/energy-optimisation" },
  { icon: BookOpen, title: "Knowledge Centre", desc: "Guides, videos and case studies on UK clean energy.", to: "/knowledge" },
];

export const Services = () => (
  <section className="py-20 lg:py-28 bg-surface">
    <div className="container-tight">
      <div className="text-center max-w-3xl mx-auto mb-14">
        <span className="eyebrow justify-center">Explore the platform</span>
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
