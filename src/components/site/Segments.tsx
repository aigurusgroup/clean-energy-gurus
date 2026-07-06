import { Link } from "react-router-dom";
import { ArrowUpRight, Building2, Sprout, Home, Key } from "lucide-react";
import segBusiness from "@/assets/segment-business.jpg";
import segFarm from "@/assets/segment-farm.jpg";
import segLandlord from "@/assets/segment-landlord.jpg";
import segHome from "@/assets/segment-home.jpg";

const segments = [
  { icon: Home, title: "Residential", line: "Solar, batteries, EV charging and long-term optimisation for UK homes.", to: "/residential", img: segHome },
  { icon: Building2, title: "Business", line: "Reduce operating costs and improve site resilience across your business.", to: "/business", img: segBusiness },
  { icon: Sprout, title: "Agriculture", line: "Use roofs, land and high daytime load to build energy independence.", to: "/agriculture", img: segFarm },
  { icon: Key, title: "Landlords & Property Portfolios", line: "Part of our Business offering — upgrade assets, support tenants and future-proof portfolios.", to: "/business/landlords", img: segLandlord },
];

export const Segments = () => (
  <section className="py-20 lg:py-28">
    <div className="container-tight">
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-12">
        <div>
          <span className="eyebrow">Built for your property</span>
          <h2 className="mt-3 text-3xl sm:text-4xl lg:text-5xl font-display font-semibold text-navy max-w-2xl">
            Built for your property.
          </h2>
        </div>
        <p className="text-navy-soft max-w-md">
          Whether you own a home, run a business, farm the land or manage a portfolio, we tailor the energy model, finance pathway and ongoing optimisation to fit. Landlords and property portfolios sit within our Business offering.
        </p>
      </div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {segments.map(({ icon: Icon, title, line, to, img }, i) => (
          <Link key={title} to={to} className="card-premium overflow-hidden group flex flex-col">
            <div className="aspect-[4/3] overflow-hidden bg-muted relative">
              <img src={img} alt={title} loading="lazy" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
              <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-background/90 backdrop-blur text-[10px] font-semibold uppercase tracking-[0.16em] text-navy">
                {title === "Landlords & Property Portfolios" ? "Part of Business" : `Pathway 0${i + 1}`}
              </div>
            </div>
            <div className="p-6 flex-1 flex flex-col">
              <div className="flex items-center justify-between">
                <div className="h-10 w-10 rounded-xl bg-accent grid place-items-center text-electric">
                  <Icon className="h-5 w-5" />
                </div>
                <ArrowUpRight className="h-5 w-5 text-muted-foreground group-hover:text-electric transition-colors" />
              </div>
              <h3 className="mt-4 text-xl font-display font-semibold text-navy">{title}</h3>
              <p className="mt-1.5 text-sm text-muted-foreground leading-relaxed flex-1">{line}</p>
              <div className="mt-5 pt-4 border-t border-border/60 text-xs font-semibold uppercase tracking-[0.16em] text-electric">
                Explore pathway →
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  </section>
);
