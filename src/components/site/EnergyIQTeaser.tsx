import { Sparkles } from "lucide-react";

export const EnergyIQTeaser = () => (
  <section className="py-20 lg:py-24">
    <div className="container-tight">
      <div className="relative overflow-hidden rounded-3xl border border-border bg-gradient-to-br from-background to-surface p-10 lg:p-14">
        <div className="absolute -top-20 -right-20 h-64 w-64 rounded-full bg-electric/10 blur-3xl pointer-events-none" />
        <div className="relative max-w-2xl">
          <span className="eyebrow">
            <span className="h-1.5 w-1.5 rounded-full bg-electric animate-pulse" />
            Coming soon — Energy IQ
          </span>
          <h2 className="mt-4 text-3xl lg:text-4xl font-display font-semibold text-navy">
            A smarter way to understand your property's energy position.
          </h2>
          <p className="mt-5 text-navy-soft leading-relaxed">
            We are developing a clearer way to help property owners understand performance, identify opportunities and make more confident energy decisions. More details soon.
          </p>
          <div className="mt-6 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-electric">
            <Sparkles className="h-3.5 w-3.5" /> In development
          </div>
        </div>
      </div>
    </div>
  </section>
);
