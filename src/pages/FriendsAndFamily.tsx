import { useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SiteLayout } from "@/components/site/SiteLayout";
import wattson from "@/assets/wattson-avatar.png";

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
      <section className="relative overflow-hidden bg-gradient-soft pt-16 pb-20 lg:pt-24 lg:pb-28">
        <div className="absolute inset-0 grid-bg pointer-events-none" />
        <div className="absolute -top-32 -right-32 h-[400px] w-[400px] bg-gradient-electric opacity-15 blur-3xl rounded-full" />
        <div className="container-tight relative">
          <div className="grid gap-12 lg:grid-cols-12 lg:gap-16 items-center">
            <div className="lg:col-span-7">
              <span className="eyebrow inline-flex items-center gap-2">
                <Sparkles className="h-3.5 w-3.5" /> A private invitation
              </span>
              <h1 className="mt-4 text-4xl sm:text-5xl lg:text-[54px] leading-[1.06] font-display font-semibold text-navy">
                You're one of our <span className="text-gradient">Founding Friends</span>.
              </h1>
              <div className="mt-6 space-y-5 text-lg text-navy-soft leading-relaxed max-w-2xl">
                <p>
                  As someone close to Clean Energy Gurus, we'd love you to be one of the first
                  people to experience Energy IQ.
                </p>
                <p>
                  We're building Energy IQ to give homeowners a clearer understanding of their
                  home, how it uses energy, and where smarter energy choices could potentially
                  be made.
                </p>
                <p className="text-navy font-medium">
                  Our ask is simple: try it, and tell us what you think.
                </p>
              </div>
              <div className="mt-9">
                <Link to="/energy-iq">
                  <Button size="lg" className="bg-gradient-electric text-primary-foreground border-0 rounded-full px-8 h-12 shadow-glow">
                    Start My Energy IQ <ArrowRight className="ml-1.5 h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </div>

            {/* Wattson — subtle personal welcome */}
            <div className="lg:col-span-5">
              <div className="relative mx-auto max-w-sm">
                <div className="absolute -inset-6 bg-gradient-electric opacity-10 blur-3xl rounded-full" />
                <div className="relative card-premium p-7 sm:p-8 text-center">
                  <img
                    src={wattson}
                    alt="Wattson, the Clean Energy Gurus guide"
                    className="mx-auto h-28 w-28 sm:h-32 sm:w-32 rounded-full object-cover ring-4 ring-background shadow-elegant"
                    width={512}
                    height={512}
                    loading="lazy"
                  />
                  <p className="mt-5 text-[17px] font-display font-medium text-navy leading-snug">
                    “You bring the feedback. I'll bring the Watts.”
                  </p>
                  <p className="mt-2.5 text-xs uppercase tracking-widest text-muted-foreground">
                    Wattson — your energy guide
                  </p>
                </div>
              </div>
            </div>
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
