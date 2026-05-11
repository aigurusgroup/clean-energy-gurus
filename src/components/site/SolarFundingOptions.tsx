import { Link } from "react-router-dom";
import { Check, ArrowRight } from "lucide-react";

type FundingOption = {
  title: string;
  subtitle: string;
  bullets: string[];
  ctaLabel: string;
  ctaHref: string;
  highlight?: boolean;
  // ascending bar heights (0-100), drives the little visual chart
  bars: number[];
};

const options: FundingOption[] = [
  {
    title: "CAPEX Purchase",
    subtitle: "Pay upfront",
    bullets: [
      "Eligible for Annual Investment Allowance tax benefit",
      "Typical 2.5–5 year return on investment",
      "Best price like-for-like guaranteed",
    ],
    ctaLabel: "Start a CAPEX Purchase enquiry",
    ctaHref: "/contact?funding=capex",
    bars: [6, 4, 5, 3, 8, 12, 18, 24, 30, 38, 46, 56, 66, 76, 86, 96],
  },
  {
    title: "Pay as You Save",
    subtitle: "Leasing options",
    bullets: [
      "Spread the cost of solar for up to 10 years",
      "Typically cashflow positive year 1",
      "97% funding approval rate",
    ],
    ctaLabel: "Start a Pay as You Save enquiry",
    ctaHref: "/contact?funding=lease",
    bars: [10, 14, 18, 22, 26, 30, 35, 40, 46, 52, 58, 64, 70, 78, 86, 94],
  },
  {
    title: "Fully Funded PPA",
    subtitle: "Power Purchase Agreement",
    bullets: [
      "Zero cost to buy",
      "Buy back the energy produced from your rooftop from as little as 10p/kWh",
      "Off balance sheet",
    ],
    ctaLabel: "Start a Fully Funded PPA enquiry",
    ctaHref: "/contact?funding=ppa",
    highlight: true,
    bars: [40, 44, 48, 52, 56, 60, 64, 68, 72, 76, 80, 84, 88, 92, 96, 100],
  },
];

const Bars = ({ values, accent }: { values: number[]; accent: string }) => (
  <div className="flex items-end gap-1 h-32 sm:h-36" aria-hidden="true">
    {values.map((v, i) => (
      <div
        key={i}
        className={`flex-1 rounded-sm ${accent}`}
        style={{ height: `${v}%`, minHeight: 4 }}
      />
    ))}
  </div>
);

export const SolarFundingOptions = ({
  className = "",
  hideHeading = false,
}: {
  className?: string;
  hideHeading?: boolean;
}) => (
  <section className={`py-20 lg:py-28 ${className}`}>
    <div className="container-tight">
      {!hideHeading && (
        <div className="max-w-2xl mx-auto text-center mb-14">
          <span className="eyebrow justify-center">
            <span className="h-1.5 w-1.5 rounded-full bg-electric" />
            Funding
          </span>
          <h2 className="mt-3 text-3xl sm:text-4xl lg:text-5xl font-display font-semibold text-navy">
            Solar Funding <span className="text-gradient">Options</span>
          </h2>
          <p className="mt-4 text-navy-soft text-lg leading-relaxed">
            Choose the funding route that fits your balance sheet — buy outright,
            spread the cost or pay nothing upfront and just buy the power.
          </p>
        </div>
      )}

      <div className="grid md:grid-cols-3 gap-5">
        {options.map((o) => {
          const dark = !!o.highlight;
          return (
            <div
              key={o.title}
              className={`relative rounded-3xl p-6 sm:p-7 flex flex-col ${
                dark
                  ? "bg-navy text-white shadow-elegant"
                  : "bg-card border border-border shadow-card"
              }`}
            >
              <div>
                <h3
                  className={`text-2xl font-display font-semibold ${
                    dark ? "text-white" : "text-navy"
                  }`}
                >
                  {o.title}
                </h3>
                <p
                  className={`mt-1 text-sm ${
                    dark ? "text-white/70" : "text-muted-foreground"
                  }`}
                >
                  {o.subtitle}
                </p>
              </div>

              <div className="mt-6">
                <Bars
                  values={o.bars}
                  accent={dark ? "bg-electric/80" : "bg-electric"}
                />
              </div>

              <ul className="mt-6 space-y-3">
                {o.bullets.map((b) => (
                  <li key={b} className="flex gap-2.5 text-sm leading-snug">
                    <Check
                      className={`h-4 w-4 mt-0.5 shrink-0 ${
                        dark ? "text-electric" : "text-electric"
                      }`}
                    />
                    <span className={dark ? "text-white/90" : "text-navy-soft"}>
                      {b}
                    </span>
                  </li>
                ))}
              </ul>

              <div className="mt-7 pt-5 border-t border-white/10 first:border-0">
                <Link
                  to={o.ctaHref}
                  className={`inline-flex items-center gap-1.5 text-sm font-semibold transition-colors ${
                    dark
                      ? "text-electric hover:text-white"
                      : "text-navy hover:text-electric"
                  }`}
                >
                  {o.ctaLabel} <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          );
        })}
      </div>

      {/* Grants & Support */}
      <div className="mt-5 rounded-3xl bg-card border border-border shadow-card p-6 sm:p-8">
        <div className="grid md:grid-cols-12 gap-6 items-center">
          <div className="md:col-span-3">
            <h3 className="text-xl font-display font-semibold text-navy">
              Grants &amp; Support
            </h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Government funding
            </p>
          </div>
          <ul className="md:col-span-6 grid sm:grid-cols-1 gap-2.5">
            {[
              "Expert advice on available grants",
              "Support in bidding for local authority funding",
              "Access to latest government incentives",
            ].map((b) => (
              <li key={b} className="flex gap-2.5 text-sm text-navy-soft">
                <Check className="h-4 w-4 mt-0.5 shrink-0 text-electric" />
                {b}
              </li>
            ))}
          </ul>
          <div className="md:col-span-3 md:text-right">
            <Link
              to="/contact?funding=grants"
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-navy hover:text-electric transition-colors"
            >
              Start a Grants &amp; Support enquiry <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  </section>
);
