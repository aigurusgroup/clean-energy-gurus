const steps = [
  ["01", "Free Energy Review", "We assess your site, load profile and goals — no obligation."],
  ["02", "Site Assessment", "Detailed survey, structural checks and DNO considerations."],
  ["03", "Proposal & Payment Options", "Transparent quote with finance and ownership pathways."],
  ["04", "Installation", "Accredited installation partners deliver to MCS standards."],
  ["05", "Handover", "Documentation, warranties and platform onboarding."],
  ["06", "Ongoing Optimisation", "Monitoring, tariff reviews and continuous improvement."],
];

export const Process = () => (
  <section className="py-20 lg:py-28">
    <div className="container-tight">
      <div className="max-w-3xl mb-14">
        <span className="eyebrow">How it works</span>
        <h2 className="mt-3 text-3xl sm:text-4xl lg:text-5xl font-display font-semibold text-navy">
          A clear process. From first call to long-term performance.
        </h2>
      </div>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-px bg-border rounded-3xl overflow-hidden border border-border">
        {steps.map(([n, t, d]) => (
          <div key={n} className="bg-card p-8 hover:bg-surface transition-colors">
            <div className="text-electric font-display text-2xl font-semibold">{n}</div>
            <h3 className="mt-3 text-lg font-display font-semibold text-navy">{t}</h3>
            <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{d}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
);
