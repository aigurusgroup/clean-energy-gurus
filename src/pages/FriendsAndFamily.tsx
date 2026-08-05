import { useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Check, Heart, Lightbulb, MessageCircle, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SiteLayout } from "@/components/site/SiteLayout";
import wattsonImg from "@/assets/wattson-founding-friends.png";

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
              <div className="relative mx-auto max-w-[340px] sm:max-w-[380px]">
                <div className="absolute inset-0 bg-gradient-electric opacity-10 blur-3xl rounded-full" />
                <img
                  src={wattsonImg}
                  alt="Wattson, the Clean Energy Gurus guide, holding an Energy IQ mug"
                  className="relative w-full h-auto object-contain drop-shadow-xl"
                  width={1024}
                  height={1024}
                  loading="lazy"
                />
                <div className="relative -mt-4 mx-auto max-w-xs rounded-2xl border border-border/60 bg-background/85 backdrop-blur px-5 py-4 text-center shadow-elegant">
                  <p className="text-[15px] sm:text-base font-display font-medium text-navy leading-snug">
                    “You bring the feedback. I'll bring the Watts.”
                  </p>
                  <p className="mt-2 text-[11px] uppercase tracking-widest text-muted-foreground">
                    Wattson — your energy guide
                  </p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>


      {/* ── Section 2: What you'll receive ────────────────────────────── */}
      <section id="what-you-get" className="py-20 lg:py-24 scroll-mt-24">
        <div className="container-tight">
          <div className="max-w-3xl">
            <span className="eyebrow">Your invitation</span>
            <h2 className="mt-3 text-3xl lg:text-4xl font-display font-semibold text-navy">
              What you'll receive
            </h2>
            <p className="mt-5 text-lg text-navy-soft leading-relaxed">
              By completing Energy IQ, you'll receive a personalised assessment designed to help
              you better understand your home's energy position — and where opportunities may
              exist to make smarter energy choices.
            </p>
          </div>

          <ul className="mt-12 grid gap-4 sm:grid-cols-2 lg:gap-5">
            {[
              "Your personalised Energy IQ assessment",
              "A clear picture of your home's current energy position",
              "Identification of potential opportunities for improvement",
              "Guidance around technologies that may be relevant to your home",
              "Your personalised Energy IQ report",
              "The option to explore the results further with Clean Energy Gurus, if you choose",
            ].map((item) => (
              <li
                key={item}
                className="flex items-start gap-3.5 rounded-2xl border border-border/60 bg-card p-5 shadow-sm"
              >
                <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-gradient-electric">
                  <Check className="h-4 w-4 text-primary-foreground" strokeWidth={3} />
                </span>
                <span className="text-[15px] leading-relaxed text-navy">{item}</span>
              </li>
            ))}
          </ul>

          {/* Value anchor */}
          <div className="mt-14 lg:mt-16 relative overflow-hidden rounded-3xl bg-navy text-white p-8 sm:p-12">
            <div className="absolute inset-0 grid-bg opacity-10 pointer-events-none" />
            <div className="absolute -bottom-32 -left-32 h-[380px] w-[380px] bg-gradient-electric opacity-20 blur-3xl rounded-full pointer-events-none" />
            <div className="relative mx-auto max-w-3xl">
              <div className="grid gap-8 sm:grid-cols-2 text-center sm:text-left">
                <div>
                  <p className="text-xs sm:text-sm uppercase tracking-[0.18em] text-white/55">
                    Complete Energy IQ service
                  </p>
                  <p className="mt-3 text-2xl sm:text-3xl font-display font-semibold text-white/60">
                    Typically £629 + VAT
                  </p>
                </div>
                <div className="sm:border-l sm:border-white/15 sm:pl-8">
                  <p className="text-xs sm:text-sm uppercase tracking-[0.18em] text-electric">
                    Founding Friends
                  </p>
                  <p className="mt-3 text-3xl sm:text-4xl font-display font-semibold text-white">
                    Complimentary
                  </p>
                </div>
              </div>
              <p className="mt-8 pt-6 border-t border-white/10 text-center sm:text-left text-white/75">
                Your only contribution is your honest feedback.
              </p>
            </div>
          </div>

          {/* Reassurance */}
          <div className="mt-10 grid gap-4 sm:grid-cols-3 max-w-4xl">
            {[
              { title: "No charge", body: "There is nothing to pay at any stage of your Energy IQ assessment." },
              { title: "No obligation", body: "You are under no obligation to purchase anything afterwards." },
              { title: "Why you?", body: "You're helping us test, refine and improve Energy IQ before wider rollout." },
            ].map((c) => (
              <div key={c.title} className="rounded-2xl border border-border/60 bg-background/60 p-5">
                <p className="font-display font-semibold text-navy">{c.title}</p>
                <p className="mt-2 text-sm leading-relaxed text-navy-soft">{c.body}</p>
              </div>
            ))}
          </div>

          <div className="mt-12 flex justify-center sm:justify-start">
            <Link to="/energy-iq">
              <Button size="lg" className="bg-gradient-electric text-primary-foreground border-0 rounded-full px-8 h-12 shadow-glow">
                Start My Energy IQ <ArrowRight className="ml-1.5 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>


      {/* ── Section 3: All we ask is your honest feedback ─────────────── */}
      <section id="feedback" className="py-20 lg:py-24 bg-gradient-soft scroll-mt-24">
        <div className="container-tight">
          <div className="max-w-3xl">
            <span className="eyebrow">All we ask in return</span>
            <h2 className="mt-3 text-3xl lg:text-4xl font-display font-semibold text-navy">
              All we ask is your honest feedback.
            </h2>
            <div className="mt-6 space-y-5 text-lg text-navy-soft leading-relaxed">
              <p>
                Energy IQ is something we're genuinely excited about, but before we introduce it
                to a wider audience, we want to learn from the people experiencing it first.
              </p>
              <p className="text-navy font-medium">That's where you come in.</p>
              <p>
                Once you've completed your Energy IQ journey, we'd simply love to know what you
                thought.
              </p>
            </div>
          </div>

          <div className="mt-12 grid gap-5 md:grid-cols-3">
            {[
              {
                icon: Heart,
                title: "What did you like?",
                body: "What felt useful, clear or genuinely valuable?",
              },
              {
                icon: Lightbulb,
                title: "What could be better?",
                body: "Was anything confusing, unnecessary or missing?",
              },
              {
                icon: MessageCircle,
                title: "Would you recommend it?",
                body: "Did Energy IQ give you a better understanding of your home and its energy potential?",
              },
            ].map(({ icon: Icon, title, body }) => (
              <div
                key={title}
                className="rounded-2xl border border-border/60 bg-card p-6 shadow-sm"
              >
                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-electric/10 text-electric">
                  <Icon className="h-5 w-5" />
                </span>
                <p className="mt-4 font-display text-lg font-semibold text-navy">{title}</p>
                <p className="mt-2 text-[15px] leading-relaxed text-navy-soft">{body}</p>
              </div>
            ))}
          </div>

          <p className="mt-10 max-w-2xl text-[15px] sm:text-base leading-relaxed text-navy-soft border-l-2 border-electric/40 pl-5">
            There are no right answers. Honest feedback — good or bad — is exactly what we're
            looking for.
          </p>
        </div>
      </section>


      {/* ── Section 4: Like what you discover? (optional next step) ───── */}
      <section id="next-step" className="py-20 lg:py-24 scroll-mt-24">
        <div className="container-tight">
          <div className="max-w-3xl">
            <span className="eyebrow">Entirely optional</span>
            <h2 className="mt-3 text-3xl lg:text-4xl font-display font-semibold text-navy">
              Like what you discover?
            </h2>
            <div className="mt-6 space-y-5 text-lg text-navy-soft leading-relaxed">
              <p>
                Energy IQ is designed to give you a clearer picture of your home and its energy
                potential.
              </p>
              <p>
                For some of our Founding Friends, that insight might simply be useful to have.
                For others, it might uncover an opportunity they'd genuinely like to explore
                further.
              </p>
              <p className="text-navy font-medium">If that's you, the next step is entirely optional.</p>
            </div>
          </div>

          <div className="mt-12 rounded-3xl border border-border/60 bg-card p-8 sm:p-10 shadow-elegant">
            <div className="grid gap-8 lg:grid-cols-12 lg:items-center">
              <div className="lg:col-span-8">
                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-electric/10 text-electric">
                  <CalendarCheck className="h-5 w-5" />
                </span>
                <p className="mt-4 font-display text-xl sm:text-2xl font-semibold text-navy">
                  Take the next step
                </p>
                <div className="mt-4 space-y-4 text-[15px] sm:text-base leading-relaxed text-navy-soft">
                  <p>
                    If you'd like to explore any of the recommendations from your Energy IQ
                    report, you can choose to book a home survey with the Clean Energy Gurus team.
                  </p>
                  <p>
                    We can then take a closer look at your property, your energy use and the
                    technologies that could make sense for your home.
                  </p>
                </div>
              </div>
              <div className="lg:col-span-4 lg:border-l lg:border-border/60 lg:pl-8">
                <Link to="/contact" className="block">
                  <Button
                    size="lg"
                    variant="outline"
                    className="w-full rounded-full h-12 border-navy/20 text-navy hover:bg-navy hover:text-white"
                  >
                    Book a Home Survey <ArrowRight className="ml-1.5 h-4 w-4" />
                  </Button>
                </Link>
                <p className="mt-4 text-sm leading-relaxed text-muted-foreground text-center lg:text-left">
                  Completing Energy IQ doesn't commit you to a survey, and a survey doesn't commit
                  you to anything either.
                </p>
              </div>
            </div>
          </div>

          <p className="mt-8 text-center text-[15px] sm:text-base text-navy-soft">
            No pressure. No obligation. Just the option to explore what's possible.
          </p>
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
