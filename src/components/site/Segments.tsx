import { Link } from "react-router-dom";
import { ArrowUpRight, Building2, Sprout, Home, Key } from "lucide-react";
import segBusiness from "@/assets/segment-business.jpg";
import segFarm from "@/assets/segment-farm.jpg";
import segLandlord from "@/assets/segment-landlord.jpg";
import segHome from "@/assets/segment-home.jpg";

const segments = [
  { icon: Building2, title: "Businesses", line: "Cut grid costs and protect against price volatility.", to: "/business", img: segBusiness },
  { icon: Sprout, title: "Farms", line: "Power barns, irrigation and operations year-round.", to: "/farms", img: segFarm },
  { icon: Key, title: "Landlords", line: "Upgrade portfolios, improve EPC and tenant value.", to: "/landlords", img: segLandlord },
  { icon: Home, title: "Homes", line: "High-consumption homes that demand more.", to: "/homes", img: segHome },
];

export const Segments = () => (
  <section className="py-20 lg:py-28">
    <div className="container-tight">
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-12">
        <div>
          <span className="eyebrow">Built for your property</span>
          <h2 className="mt-3 text-3xl sm:text-4xl lg:text-5xl font-display font-semibold text-navy max-w-2xl">
            One platform. Four segments. Tailored economics.
          </h2>
        </div>
        <p className="text-navy-soft max-w-md">
          Choose your context — we'll tailor the energy model, finance pathway and ongoing optimisation strategy to fit.
        </p>
      </div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {segments.map(({ icon: Icon, title, line, to, img }) => (
          <Link key={title} to={to} className="card-premium overflow-hidden group">
            <div className="aspect-[4/3] overflow-hidden bg-muted">
              <img src={img} alt={title} loading="lazy" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
            </div>
            <div className="p-6">
              <div className="flex items-center justify-between">
                <div className="h-10 w-10 rounded-xl bg-accent grid place-items-center text-electric">
                  <Icon className="h-5 w-5" />
                </div>
                <ArrowUpRight className="h-5 w-5 text-muted-foreground group-hover:text-electric transition-colors" />
              </div>
              <h3 className="mt-4 text-xl font-display font-semibold text-navy">{title}</h3>
              <p className="mt-1.5 text-sm text-muted-foreground leading-relaxed">{line}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  </section>
);
