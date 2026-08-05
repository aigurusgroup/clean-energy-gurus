import { useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SiteLayout } from "@/components/site/SiteLayout";

/**
 * Private, unlisted page for Clean Energy Gurus "Founding Friends".
 * Intentionally NOT linked from the header, footer, sitemap or any menu.
 * Reachable only via the direct URL /friendsandfamily.
 */
const FriendsAndFamily = () => {
  useEffect(() => {
    const prevTitle = document.title;
    document.title = "Founding Friends | Clean Energy Gurus";

    const robots = document.createElement("meta");
    robots.setAttribute("name", "robots");
    robots.setAttribute("content", "noindex, nofollow, noarchive");
    document.head.appendChild(robots);

    return () => {
      document.title = prevTitle;
      robots.remove();
    };
  }, []);

  return (
    <SiteLayout>
      {/* ── Section 1: Personal invitation hero ───────────────────────── */}
      <section className="relative overflow-hidden bg-gradient-soft pt-16 pb-20 lg:pt-24 lg:pb-24">
        <div className="absolute inset-0 grid-bg pointer-events-none" />
        <div className="absolute -top-32 -right-32 h-[400px] w-[400px] bg-gradient-electric opacity-15 blur-3xl rounded-full" />
        <div className="container-tight relative max-w-3xl">
          <span className="eyebrow inline-flex items-center gap-2">
            <Sparkles className="h-3.5 w-3.5" /> By invitation only
          </span>
          <h1 className="mt-4 text-4xl sm:text-5xl lg:text-[56px] leading-[1.05] font-display font-semibold text-navy">
            An invitation to our <span className="text-gradient">Founding Friends</span>.
          </h1>
          <p className="mt-6 text-lg text-navy-soft leading-relaxed">
            A small group of the people closest to us — invited to be among the very first
            to experience Energy IQ, and to help us shape what Clean Energy Gurus becomes.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link to="/energy-iq">
              <Button size="lg" className="bg-gradient-electric text-white border-0 rounded-full px-7 h-12 shadow-glow">
                Start My Energy IQ <ArrowRight className="ml-1.5 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* ── Section 2: Why we're asking (to be written) ───────────────── */}
      <section id="why" className="py-20 lg:py-24 scroll-mt-24">
        <div className="container-tight max-w-3xl">
          <span className="eyebrow">Why we're asking you</span>
          <h2 className="mt-3 text-3xl lg:text-4xl font-display font-semibold text-navy">
            Section placeholder — content to follow.
          </h2>
        </div>
      </section>

      {/* ── Section 3: What Energy IQ gives you (to be written) ───────── */}
      <section id="what-you-get" className="py-20 lg:py-24 bg-gradient-soft scroll-mt-24">
        <div className="container-tight max-w-3xl">
          <span className="eyebrow">What you'll receive</span>
          <h2 className="mt-3 text-3xl lg:text-4xl font-display font-semibold text-navy">
            Section placeholder — content to follow.
          </h2>
        </div>
      </section>

      {/* ── Section 4: Value anchor ───────────────────────────────────── */}
      <section id="value" className="py-20 lg:py-24 scroll-mt-24">
        <div className="container-tight">
          <div className="relative overflow-hidden rounded-3xl bg-navy text-white p-8 sm:p-12 lg:p-16">
            <div className="absolute inset-0 grid-bg opacity-10" />
            <div className="absolute -bottom-32 -left-32 h-[380px] w-[380px] bg-gradient-electric opacity-25 blur-3xl rounded-full" />
            <div className="relative grid gap-8 sm:grid-cols-2 items-center max-w-3xl mx-auto text-center sm:text-left">
              <div>
                <p className="text-sm uppercase tracking-widest text-white/55">Complete Energy IQ service</p>
                <p className="mt-3 text-2xl sm:text-3xl font-display font-semibold text-white/70 line-through decoration-white/30">
                  Typically £629 + VAT
                </p>
              </div>
              <div className="sm:border-l sm:border-white/15 sm:pl-8">
                <p className="text-sm uppercase tracking-widest text-electric">Founding Friends</p>
                <p className="mt-3 text-3xl sm:text-4xl font-display font-semibold text-white">
                  Complimentary
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Section 5: What we ask in return (to be written) ──────────── */}
      <section id="feedback" className="py-20 lg:py-24 scroll-mt-24">
        <div className="container-tight max-w-3xl">
          <span className="eyebrow">All we ask in return</span>
          <h2 className="mt-3 text-3xl lg:text-4xl font-display font-semibold text-navy">
            Section placeholder — content to follow.
          </h2>
        </div>
      </section>

      {/* ── Section 6: No obligation / optional next step ─────────────── */}
      <section id="next-step" className="py-20 lg:py-24 bg-gradient-soft scroll-mt-24">
        <div className="container-tight max-w-3xl">
          <span className="eyebrow">No obligation</span>
          <h2 className="mt-3 text-3xl lg:text-4xl font-display font-semibold text-navy">
            Section placeholder — content to follow.
          </h2>
        </div>
      </section>

      {/* ── Section 7: Closing invitation CTA (to be written) ─────────── */}
      <section id="closing" className="py-20 lg:py-24 scroll-mt-24">
        <div className="container-tight max-w-3xl text-center">
          <h2 className="text-3xl lg:text-4xl font-display font-semibold text-navy">
            Section placeholder — closing invitation.
          </h2>
          <div className="mt-8 flex justify-center">
            <Link to="/energy-iq">
              <Button size="lg" className="bg-gradient-electric text-white border-0 rounded-full px-7 h-12 shadow-glow">
                Start My Energy IQ <ArrowRight className="ml-1.5 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </SiteLayout>
  );
};

export default FriendsAndFamily;
