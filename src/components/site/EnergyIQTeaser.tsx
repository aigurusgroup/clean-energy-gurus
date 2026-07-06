import { Sparkles, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

export const EnergyIQTeaser = () => (
  <section className="py-20 lg:py-24">
    <div className="container-tight">
      <div className="relative overflow-hidden rounded-3xl border border-border bg-gradient-to-br from-background to-surface p-10 lg:p-14">
        <div className="absolute -top-20 -right-20 h-64 w-64 rounded-full bg-electric/10 blur-3xl pointer-events-none" />
        <div className="relative max-w-2xl">
          <span className="eyebrow">
            <Sparkles className="h-3.5 w-3.5" /> Energy IQ
          </span>
          <h2 className="mt-4 text-3xl lg:text-4xl font-display font-semibold text-navy">
            A smarter way to understand your property's energy position.
          </h2>
          <p className="mt-5 text-navy-soft leading-relaxed">
            Answer a few simple questions and receive an indicative Energy IQ score with recommended next steps for improving energy performance, reducing costs and gaining greater control.
          </p>
          <div className="mt-8">
            <Link to="/energy-iq">
              <Button className="rounded-full h-12 px-6 bg-gradient-electric text-white border-0 shadow-glow">
                Get Your Energy IQ <ArrowRight className="ml-1.5 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  </section>
);
