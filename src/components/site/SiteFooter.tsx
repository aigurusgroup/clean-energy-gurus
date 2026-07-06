import { Link } from "react-router-dom";
import logo from "@/assets/logo.png";

const cols = [
  {
    title: "Residential",
    links: [
      ["Solar & Battery", "/residential/solar-battery"],
      ["EV Charging", "/residential/ev-charging"],
      ["Residential Energy Review", "/contact?type=residential"],
    ],
  },
  {
    title: "Business",
    links: [
      ["Commercial Solar", "/business/commercial-solar"],
      ["Workplace EV Charging", "/business/workplace-ev"],
      ["Landlords & Portfolios", "/business/landlords"],
    ],
  },
  {
    title: "Agriculture",
    links: [
      ["Farm Solar & Battery", "/agriculture/solar"],
      ["Farm Energy Resilience", "/agriculture/resilience"],
      ["Farm Energy Review", "/contact?type=agriculture"],
    ],
  },
  {
    title: "Energy Optimisation",
    links: [
      ["Monitoring & Maintenance", "/energy-optimisation/monitoring"],
      ["Tariff & Export Optimisation", "/energy-optimisation/tariff"],
      ["Battery Optimisation", "/energy-optimisation/battery"],
    ],
  },
  {
    title: "Knowledge & Company",
    links: [
      ["Articles & Guides", "/knowledge/articles"],
      ["Video Library", "/knowledge/videos"],
      ["Case Studies", "/knowledge/case-studies"],
      ["About Us", "/about"],
      ["Become an Installer Partner", "/partners"],
      ["Contact", "/contact"],
    ],
  },
];

export const SiteFooter = () => (
  <footer className="border-t border-border bg-surface mt-24">
    <div className="container-tight py-16">
      <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-6">
        <div className="lg:col-span-1">
          <Link to="/" className="flex items-center" aria-label="Clean Energy Gurus home">
            <img src={logo} alt="Clean Energy Gurus" className="h-16 w-auto object-contain" width={1165} height={306} />
          </Link>
          <p className="mt-5 text-sm text-muted-foreground leading-relaxed">
            A UK managed energy platform for homes, businesses, farms and landlords.
          </p>
          <p className="mt-5 text-xs text-muted-foreground">
            Installations delivered through accredited MCS, OZEV and DNO partners.
          </p>
        </div>
        {cols.map((c) => (
          <div key={c.title}>
            <div className="text-xs font-semibold uppercase tracking-[0.18em] text-navy mb-4">{c.title}</div>
            <ul className="space-y-2.5">
              {c.links.map(([label, href]) => (
                <li key={label}>
                  <Link to={href} className="text-sm text-muted-foreground hover:text-electric transition-colors">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="mt-14 pt-8 border-t border-border flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <p className="text-xs text-muted-foreground">
          © {new Date().getFullYear()} Clean Energy Gurus Ltd. Registered in England & Wales.
        </p>
        <div className="flex flex-wrap gap-4 text-xs text-muted-foreground">
          <Link to="#" className="hover:text-electric">Terms</Link>
          <Link to="#" className="hover:text-electric">Privacy</Link>
          <Link to="#" className="hover:text-electric">Complaints</Link>
          <Link to="#" className="hover:text-electric">Quality Policy</Link>
        </div>
      </div>
    </div>
  </footer>
);
