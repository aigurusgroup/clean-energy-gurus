import { ShieldCheck, Award, FileCheck, Cable, Wallet, ClipboardCheck } from "lucide-react";

const items = [
  { icon: Award, title: "Approved installation partners", desc: "Vetted UK-wide network for high-quality delivery." },
  { icon: ShieldCheck, title: "MCS partner-led route", desc: "Eligibility for grants, SEG and certification." },
  { icon: FileCheck, title: "OZEV partner-led EV installs", desc: "Compliant residential and workplace charging." },
  { icon: Cable, title: "DNO support", desc: "We coordinate G98/G99 and capacity applications." },
  { icon: Wallet, title: "Finance partner pathways", desc: "Cash, lease, PPA and asset-finance options." },
  { icon: ClipboardCheck, title: "Maintenance & handover docs", desc: "Full pack delivered. Nothing falls through the cracks." },
];

export const Trust = () => (
  <section className="py-20 lg:py-28 bg-surface">
    <div className="container-tight">
      <div className="text-center max-w-3xl mx-auto mb-14">
        <span className="eyebrow justify-center">Trust & standards</span>
        <h2 className="mt-3 text-3xl sm:text-4xl lg:text-5xl font-display font-semibold text-navy">
          Industry-grade delivery. End-to-end accountability.
        </h2>
      </div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {items.map(({ icon: Icon, title, desc }) => (
          <div key={title} className="rounded-2xl bg-card p-6 border border-border flex gap-4">
            <div className="h-11 w-11 rounded-xl bg-accent grid place-items-center text-electric flex-shrink-0">
              <Icon className="h-5 w-5" />
            </div>
            <div>
              <div className="font-display font-semibold text-navy">{title}</div>
              <div className="mt-1 text-sm text-muted-foreground">{desc}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
);
