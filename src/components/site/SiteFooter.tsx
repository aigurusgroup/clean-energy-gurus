import { Link } from "react-router-dom";
import logo from "@/assets/logo.png";

const cols = [
  {
    title: "Solutions",
    links: [
      ["Business Energy", "/business"],
      ["Farm Energy", "/farms"],
      ["Landlord Upgrade", "/landlords"],
      ["Home Energy", "/homes"],
    ],
  },
  {
    title: "Services",
    links: [
      ["Solar PV", "/services/solar-pv"],
      ["Battery Storage", "/services/battery-storage"],
      ["EV Charging", "/services/ev-charging"],
      ["Monitoring & Maintenance", "/services/monitoring"],
      ["Tariff & Export", "/services/tariff-optimisation"],
    ],
  },
  {
    title: "Company",
    links: [
      ["Platform", "/platform"],
      ["About", "/about"],
      ["Insights", "/insights"],
      ["Contact", "/contact"],
    ],
  },
  {
    title: "Compliance",
    links: [
      ["Terms", "#"],
      ["Privacy", "#"],
      ["Complaints", "#"],
      ["Finance Information", "#"],
      ["Quality Policy", "#"],
      ["Environmental Policy", "#"],
    ],
  },
];

export const SiteFooter = () => (
  <footer className="border-t border-border bg-surface mt-24">
    <div className="container-tight py-16">
      <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-6">
        <div className="lg:col-span-2">
          <Link to="/" className="flex items-center" aria-label="Clean Energy Gurus home">
            <img src={logo} alt="Clean Energy Gurus" className="h-12 w-auto object-contain" width={1240} height={1240} />
          </Link>
          <p className="mt-5 text-sm text-muted-foreground max-w-sm leading-relaxed">
            We help homes, businesses, farms and landlords across the UK reduce energy
            costs and turn their property into a managed energy asset.
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
                  <Link to={href} className="text-sm text-muted-foreground hover:text-electric transition-colors">{label}</Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="mt-14 pt-8 border-t border-border flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <p className="text-xs text-muted-foreground">© {new Date().getFullYear()} Clean Energy Gurus Ltd. Registered in England & Wales.</p>
        <p className="text-xs text-muted-foreground">Authorised installation routes via accredited partners.</p>
      </div>
    </div>
  </footer>
);
