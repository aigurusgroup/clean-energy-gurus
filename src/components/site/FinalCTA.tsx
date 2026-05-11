import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, MapPin, CalendarCheck } from "lucide-react";

export const FinalCTA = () => (
  <section className="py-20 lg:py-28">
    <div className="container-tight">
      <div className="relative overflow-hidden rounded-3xl bg-navy text-white p-8 sm:p-14 lg:p-20">
        <div className="absolute inset-0 grid-bg opacity-10" />
        <div className="absolute -top-32 -right-32 h-[400px] w-[400px] bg-gradient-electric opacity-30 blur-3xl rounded-full" />
        <div className="relative grid lg:grid-cols-2 gap-10 items-center">
          <div>
            <span className="eyebrow">Start here</span>
            <h2 className="mt-3 text-3xl sm:text-4xl lg:text-5xl font-display font-semibold text-white">
              Start with a Free Energy Review.
            </h2>
            <p className="mt-5 text-white/75 text-lg leading-relaxed max-w-md">
              Find your property on the map, sketch your roof and book a
              callback in under a minute — no obligation.
            </p>
          </div>
          <div className="lg:justify-self-end w-full max-w-md">
            <div className="rounded-2xl bg-white/[0.06] border border-white/10 p-6 sm:p-7 backdrop-blur">
              <div className="flex items-center gap-3 text-sm text-white/80">
                <div className="h-9 w-9 rounded-full bg-electric/15 grid place-items-center text-electric">
                  <MapPin className="h-4 w-4" />
                </div>
                Step 1 — find your property on satellite
              </div>
              <div className="mt-3 flex items-center gap-3 text-sm text-white/80">
                <div className="h-9 w-9 rounded-full bg-electric/15 grid place-items-center text-electric">
                  <CalendarCheck className="h-4 w-4" />
                </div>
                Step 2 — share your details and we'll call you back
              </div>
              <Link to="/contact" className="block mt-6">
                <Button className="w-full rounded-full h-12 bg-gradient-electric text-white border-0 shadow-glow">
                  Start my free review <ArrowRight className="h-4 w-4 ml-1.5" />
                </Button>
              </Link>
              <p className="mt-3 text-[11px] text-white/55 leading-relaxed">
                We respond within one UK business day.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
);
