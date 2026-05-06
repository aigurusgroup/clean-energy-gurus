import { Link, NavLink, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { Menu, X, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";

const nav = [
  { to: "/", label: "Home" },
  { to: "/business", label: "Business" },
  { to: "/farms", label: "Farms" },
  { to: "/landlords", label: "Landlords" },
  { to: "/homes", label: "Homes" },
  { to: "/services", label: "Services" },
  { to: "/platform", label: "Platform" },
  { to: "/about", label: "About" },
  { to: "/insights", label: "Insights" },
  { to: "/contact", label: "Contact" },
];

export const SiteHeader = () => {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { pathname } = useLocation();

  useEffect(() => { setOpen(false); }, [pathname]);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className={`sticky top-0 z-50 w-full transition-all duration-300 ${scrolled ? "bg-background/85 backdrop-blur-xl border-b border-border/60" : "bg-background/40 backdrop-blur-sm"}`}>
      <div className="container-tight flex h-18 items-center justify-between py-4">
        <Link to="/" className="flex items-center gap-2.5 group" aria-label="Clean Energy Gurus home">
          <div className="relative h-9 w-9 rounded-xl bg-gradient-electric grid place-items-center shadow-glow">
            <Zap className="h-4.5 w-4.5 text-white" strokeWidth={2.5} />
          </div>
          <div className="leading-tight">
            <div className="text-[15px] font-semibold text-navy tracking-tight">Clean Energy Gurus</div>
            <div className="text-[10px] font-medium uppercase tracking-[0.2em] text-muted-foreground">Managed Energy Platform</div>
          </div>
        </Link>

        <nav className="hidden xl:flex items-center gap-1">
          {nav.map((n) => (
            <NavLink
              key={n.to}
              to={n.to}
              end={n.to === "/"}
              className={({ isActive }) =>
                `px-3 py-2 text-sm font-medium rounded-md transition-colors ${isActive ? "text-electric" : "text-navy-soft hover:text-navy"}`
              }
            >
              {n.label}
            </NavLink>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-3">
          <Link to="/contact">
            <Button variant="ghost" className="text-navy hover:text-electric">Talk to us</Button>
          </Link>
          <Link to="/contact">
            <Button className="bg-gradient-electric text-white border-0 shadow-glow hover:opacity-95 hover:shadow-elegant rounded-full px-5">
              Free Energy Review
            </Button>
          </Link>
        </div>

        <button className="xl:hidden md:hidden p-2 text-navy" onClick={() => setOpen(!open)} aria-label="Menu">
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {open && (
        <div className="xl:hidden border-t border-border bg-background animate-fade-in">
          <div className="container-tight py-4 flex flex-col gap-1">
            {nav.map((n) => (
              <NavLink key={n.to} to={n.to} end={n.to === "/"} className={({ isActive }) => `px-3 py-2.5 rounded-lg text-sm font-medium ${isActive ? "bg-accent text-electric" : "text-navy-soft"}`}>
                {n.label}
              </NavLink>
            ))}
            <Link to="/contact" className="mt-2">
              <Button className="w-full bg-gradient-electric text-white border-0 rounded-full">Free Energy Review</Button>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};
