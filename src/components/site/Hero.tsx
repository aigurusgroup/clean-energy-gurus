import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import heroImg from "@/assets/hero-energy.jpg";

export const Hero = () => (
  <section className="relative overflow-hidden bg-gradient-soft pt-16 pb-24 lg:pt-24 lg:pb-32">
    <div className="absolute inset-0 grid-bg pointer-events-none" />
    <div className="absolute -top-40 -right-40 h-[500px] w-[500px] rounded-full bg-gradient-electric opacity-20 blur-3xl pointer-events-none animate-pulse-glow" />

    <div className="container-tight relative">
      <div className="grid lg:grid-cols-12 gap-12 lg:gap-8 items-center">
        <div className="lg:col-span-7 animate-fade-in-up">
          <span className="eyebrow">
            <span className="h-1.5 w-1.5 rounded-full bg-electric animate-pulse" />
            UK Managed Energy Platform
          </span>
          <h1 className="mt-5 text-[42px] sm:text-5xl lg:text-[64px] leading-[1.05] font-display font-semibold text-navy">
            Turn your property into a <span className="text-gradient">managed energy asset</span>.
          </h1>
          <p className="mt-6 text-lg text-navy-soft max-w-2xl leading-relaxed">
            Clean Energy Gurus helps homes, businesses, farms and landlords reduce
            energy costs, install solar, batteries and EV charging, and optimise
            long-term energy performance.
          </p>
          <div className="mt-9 flex flex-col sm:flex-row gap-3">
            <Link to="/contact">
              <Button size="lg" className="bg-gradient-electric text-white border-0 rounded-full px-7 h-12 shadow-glow hover:shadow-elegant">
                Get a Free Energy Review <ArrowRight className="ml-1.5 h-4 w-4" />
              </Button>
            </Link>
            <Link to="/services">
              <Button size="lg" variant="outline" className="rounded-full px-7 h-12 border-navy/15 text-navy hover:bg-navy hover:text-white">
                Explore Solutions
              </Button>
            </Link>
          </div>
          <div className="mt-10 grid grid-cols-3 gap-6 max-w-lg">
            {[["£8K+", "avg. annual savings"], ["25 yr", "performance horizon"], ["24/7", "remote monitoring"]].map(([n, l]) => (
              <div key={l}>
                <div className="text-2xl font-display font-semibold text-navy">{n}</div>
                <div className="text-xs text-muted-foreground mt-1">{l}</div>
              </div>
            ))}
          </div>
        </div>
        <div className="lg:col-span-5 animate-scale-in">
          <div className="relative rounded-3xl overflow-hidden shadow-elegant border border-border/60">
            <img
              src={heroImg}
              alt="Commercial rooftop with solar PV and connected smart energy network"
              width={1920}
              height={1080}
              className="w-full h-auto object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-tr from-navy/10 via-transparent to-transparent" />
          </div>
          <div className="mt-4 grid grid-cols-2 gap-4">
            <div className="card-premium p-4">
              <div className="text-[10px] font-semibold uppercase tracking-[0.18em] text-electric">Live</div>
              <div className="text-sm font-medium text-navy mt-1">Solar generating 14.2 kW</div>
            </div>
            <div className="card-premium p-4">
              <div className="text-[10px] font-semibold uppercase tracking-[0.18em] text-electric">Battery</div>
              <div className="text-sm font-medium text-navy mt-1">86% — exporting at peak</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
);
