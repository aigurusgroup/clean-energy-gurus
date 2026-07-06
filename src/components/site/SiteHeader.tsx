import { Link, NavLink, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { Menu, X, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import logo from "@/assets/logo.png";

type NavItem = {
  label: string;
  to: string;
  children?: { label: string; to: string; desc?: string }[];
};

const nav: NavItem[] = [
  { label: "Home", to: "/" },
  {
    label: "Residential",
    to: "/residential",
    children: [
      { label: "Solar PV", to: "/residential/solar-pv", desc: "Rooftop solar designed around your home." },
      { label: "Battery Storage", to: "/residential/battery-storage", desc: "Store solar and cheap-rate import." },
      { label: "EV Charging", to: "/residential/ev-charging", desc: "Smart, solar-aware home charging." },
      { label: "Solar + Battery", to: "/residential/solar-battery", desc: "The complete home energy package." },
      { label: "Residential Energy Review", to: "/contact?type=residential", desc: "Start your free home review." },
    ],
  },
  {
    label: "Business",
    to: "/business",
    children: [
      { label: "Commercial Solar", to: "/business/commercial-solar", desc: "Rooftop and ground-mount for sites." },
      { label: "Workplace EV Charging", to: "/business/workplace-ev", desc: "Fleet and staff charging that scales." },
      { label: "Commercial Battery Storage", to: "/business/commercial-battery", desc: "Peak-shaving and resilience." },
      { label: "Landlords & Property Portfolios", to: "/business/landlords", desc: "Upgrade assets, protect tenants." },
      { label: "Business Energy Review", to: "/contact?type=business", desc: "Start a commercial review." },
    ],
  },
  {
    label: "Agriculture",
    to: "/agriculture",
    children: [
      { label: "Farm Solar", to: "/agriculture/solar", desc: "Rooftop, ground-mount and carport." },
      { label: "Battery Storage for Farms", to: "/agriculture/battery", desc: "Daytime capture, night-time use." },
      { label: "Energy Resilience", to: "/agriculture/resilience", desc: "Keep critical loads running." },
      { label: "Agricultural Energy Solutions", to: "/agriculture/solutions", desc: "The full farm energy stack." },
      { label: "Farm Energy Review", to: "/contact?type=agriculture", desc: "Start a farm review." },
    ],
  },
  {
    label: "Energy Optimisation",
    to: "/energy-optimisation",
    children: [
      { label: "Monitoring", to: "/energy-optimisation/monitoring" },
      { label: "Maintenance", to: "/energy-optimisation/maintenance" },
      { label: "Tariff Optimisation", to: "/energy-optimisation/tariff" },
      { label: "Export Optimisation", to: "/energy-optimisation/export" },
      { label: "Battery Optimisation", to: "/energy-optimisation/battery" },
      { label: "Energy Performance Reporting", to: "/energy-optimisation/reporting" },
    ],
  },
  {
    label: "Knowledge Centre",
    to: "/knowledge",
    children: [
      { label: "Articles & Guides", to: "/knowledge/articles" },
      { label: "Solar Education", to: "/knowledge/solar" },
      { label: "Battery Education", to: "/knowledge/battery" },
      { label: "EV Charging Education", to: "/knowledge/ev-charging" },
      { label: "Video Library", to: "/knowledge/videos" },
      { label: "Case Studies", to: "/knowledge/case-studies" },
      { label: "Installer Partner Hub", to: "/knowledge/installer-hub" },
    ],
  },
  {
    label: "About",
    to: "/about",
    children: [
      { label: "About Clean Energy Gurus", to: "/about" },
      { label: "Our Mission", to: "/about#mission" },
      { label: "Our Values", to: "/about#values" },
      { label: "How We Work", to: "/about#how-we-work" },
      { label: "Our Partner Network", to: "/about#partners" },
    ],
  },
];

export const SiteHeader = () => {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { pathname } = useLocation();

  useEffect(() => {
    setOpen(false);
  }, [pathname]);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 w-full transition-all duration-300 ${
        scrolled
          ? "bg-background/85 backdrop-blur-xl border-b border-border/60"
          : "bg-background/40 backdrop-blur-sm"
      }`}
    >
      <div className="container-tight flex h-18 items-center justify-between py-4 gap-4">
        <Link to="/" className="flex items-center group shrink-0" aria-label="Clean Energy Gurus home">
          <img
            src={logo}
            alt="Clean Energy Gurus"
            className="h-14 sm:h-16 lg:h-20 w-auto object-contain"
            width={1165}
            height={306}
          />
        </Link>

        <nav className="hidden xl:flex items-center gap-0.5 ml-4">
          {nav.map((n) =>
            n.children ? (
              <div key={n.to} className="relative group">
                <button
                  className="flex items-center gap-1 px-3 py-2 text-sm font-medium rounded-md text-navy-soft hover:text-navy transition-colors"
                  aria-haspopup="true"
                >
                  {n.label}
                  <ChevronDown className="h-3.5 w-3.5 opacity-60 group-hover:opacity-100 transition-opacity" />
                </button>
                <div className="absolute left-0 top-full pt-3 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                  <div className="min-w-[280px] rounded-2xl border border-border bg-background/95 backdrop-blur-xl shadow-elegant p-2">
                    <Link
                      to={n.to}
                      className="block px-4 py-2.5 rounded-lg text-sm font-semibold text-navy hover:bg-accent"
                    >
                      {n.label} overview →
                    </Link>
                    <div className="my-1 border-t border-border/60" />
                    {n.children.map((c) => (
                      <Link
                        key={c.to}
                        to={c.to}
                        className="block px-4 py-2.5 rounded-lg hover:bg-accent transition-colors"
                      >
                        <div className="text-sm font-medium text-navy">{c.label}</div>
                        {c.desc && (
                          <div className="text-xs text-muted-foreground mt-0.5 leading-relaxed">
                            {c.desc}
                          </div>
                        )}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <NavLink
                key={n.to}
                to={n.to}
                end={n.to === "/"}
                className={({ isActive }) =>
                  `px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                    isActive ? "text-electric" : "text-navy-soft hover:text-navy"
                  }`
                }
              >
                {n.label}
              </NavLink>
            ),
          )}
        </nav>

        <div className="hidden md:flex items-center gap-3 ml-auto">
          <Link to="/contact">
            <Button className="bg-gradient-electric text-white border-0 shadow-glow hover:opacity-95 hover:shadow-elegant rounded-full px-5">
              Start Your Energy Review
            </Button>
          </Link>
        </div>

        <button
          className="xl:hidden md:hidden p-2 text-navy"
          onClick={() => setOpen(!open)}
          aria-label="Menu"
        >
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {open && (
        <div className="xl:hidden border-t border-border bg-background animate-fade-in max-h-[80vh] overflow-y-auto">
          <div className="container-tight py-4 flex flex-col gap-1">
            {nav.map((n) =>
              n.children ? (
                <Collapsible key={n.to}>
                  <CollapsibleTrigger className="w-full flex items-center justify-between px-3 py-3 rounded-lg text-sm font-medium text-navy hover:bg-accent [&[data-state=open]>svg]:rotate-180">
                    {n.label}
                    <ChevronDown className="h-4 w-4 transition-transform" />
                  </CollapsibleTrigger>
                  <CollapsibleContent className="pl-3">
                    <Link
                      to={n.to}
                      className="block px-3 py-2 text-sm text-electric font-medium"
                    >
                      {n.label} overview →
                    </Link>
                    {n.children.map((c) => (
                      <Link
                        key={c.to}
                        to={c.to}
                        className="block px-3 py-2 text-sm text-navy-soft hover:text-navy"
                      >
                        {c.label}
                      </Link>
                    ))}
                  </CollapsibleContent>
                </Collapsible>
              ) : (
                <NavLink
                  key={n.to}
                  to={n.to}
                  end={n.to === "/"}
                  className={({ isActive }) =>
                    `px-3 py-3 rounded-lg text-sm font-medium ${
                      isActive ? "bg-accent text-electric" : "text-navy-soft"
                    }`
                  }
                >
                  {n.label}
                </NavLink>
              ),
            )}
            <Link to="/contact" className="mt-3">
              <Button className="w-full bg-gradient-electric text-white border-0 rounded-full">
                Start Your Energy Review
              </Button>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};
