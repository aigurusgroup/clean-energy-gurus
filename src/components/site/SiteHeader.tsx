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
      { label: "Solar & Battery", to: "/residential/solar-battery", desc: "The complete home solar and storage package." },
      { label: "EV Charging", to: "/residential/ev-charging", desc: "Smart, solar-aware home charging." },
      { label: "Residential Energy Review", to: "/contact?type=residential", desc: "Start your free home energy review." },
    ],
  },
  {
    label: "Business",
    to: "/business",
    children: [
      { label: "Commercial Solar", to: "/business/commercial-solar", desc: "Rooftop, ground-mount and commercial battery." },
      { label: "Workplace EV Charging", to: "/business/workplace-ev", desc: "Fleet and staff charging that scales." },
      { label: "Landlords & Property Portfolios", to: "/business/landlords", desc: "Upgrade assets, protect tenants." },
    ],
  },
  {
    label: "Agriculture",
    to: "/agriculture",
    children: [
      { label: "Farm Solar & Battery", to: "/agriculture/solar", desc: "Integrated solar and storage for farms." },
      { label: "Farm Energy Resilience", to: "/agriculture/resilience", desc: "Keep critical loads running." },
      { label: "Farm Energy Review", to: "/contact?type=agriculture", desc: "Start a farm energy review." },
    ],
  },
  {
    label: "Energy Optimisation",
    to: "/energy-optimisation",
    children: [
      { label: "Monitoring & Maintenance", to: "/energy-optimisation/monitoring", desc: "Continuous performance oversight." },
      { label: "Tariff & Export Optimisation", to: "/energy-optimisation/tariff", desc: "The right tariff, reviewed as the market shifts." },
      { label: "Battery Optimisation", to: "/energy-optimisation/battery", desc: "Dispatch tuned to load, solar and prices." },
    ],
  },
  {
    label: "Knowledge Centre",
    to: "/knowledge",
    children: [
      { label: "Articles & Guides", to: "/knowledge/articles", desc: "Educational guides on solar, battery and EV." },
      { label: "Video Library", to: "/knowledge/videos", desc: "Short, honest video series." },
      { label: "Case Studies", to: "/knowledge/case-studies", desc: "Real UK projects and outcomes." },
    ],
  },
  {
    label: "About",
    to: "/about",
    children: [
      { label: "About Us", to: "/about", desc: "Who we are and what we do." },
      { label: "How We Work", to: "/about#how-we-work", desc: "The managed energy platform model." },
      { label: "Partner Network", to: "/about#partners", desc: "Our accredited installer network." },
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
