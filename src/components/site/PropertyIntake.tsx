import { useEffect, useState } from "react";
import { ArrowRight, CheckCircle2, Home, Sparkles, MapPin, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  lookupProperty,
  type LookupResult,
  type PropertyIntelligence,
} from "@/lib/propertyIntelligence";

type Phase = "address" | "analysing" | "confirmed" | "not_found";

const STAGES = [
  "Locating your property",
  "Understanding your home",
  "Analysing available property information",
  "Preparing your personalised Energy IQ",
];

const TOTAL_ANALYSIS_MS = 4200;
const STAGE_STEP_MS = TOTAL_ANALYSIS_MS / STAGES.length;

/**
 * Premium address intake + analysing + confirmation flow shown BEFORE the
 * existing Energy IQ questionnaire. Never surfaces raw data at this stage —
 * the customer only sees anticipation and a clean confirmation. Property data
 * is passed back to the parent via `onComplete` and surfaced later on the
 * report page.
 */
export const PropertyIntake = ({
  onComplete,
  onSkip,
}: {
  onComplete: (property: PropertyIntelligence | null, addressUsed: string) => void;
  onSkip?: () => void;
}) => {
  const [phase, setPhase] = useState<Phase>("address");
  const [address, setAddress] = useState("");
  const [stage, setStage] = useState(0);
  const [result, setResult] = useState<LookupResult | null>(null);

  const canSubmit = address.trim().length >= 3;

  const beginAnalysis = async () => {
    if (!canSubmit) return;
    setPhase("analysing");
    setStage(0);

    // Kick off the lookup and the visual staging in parallel; we always wait
    // for the full stage animation before revealing so the UX feels
    // deliberate, not laggy.
    const lookupPromise = lookupProperty(address, { minDelayMs: 0 });

    for (let i = 0; i < STAGES.length; i++) {
      await new Promise((r) => setTimeout(r, STAGE_STEP_MS));
      setStage(i + 1);
    }

    const res = await lookupPromise;
    setResult(res);
    setPhase(res.status === "found" ? "confirmed" : "not_found");
  };

  // Auto-focus the input on mount for a snappy premium feel.
  useEffect(() => {
    if (phase !== "address") return;
    const el = document.getElementById("pi-address") as HTMLInputElement | null;
    el?.focus();
  }, [phase]);

  // ---------------- ADDRESS ----------------
  if (phase === "address") {
    return (
      <div className="card-premium p-8 lg:p-10">
        <span className="eyebrow">
          <Sparkles className="h-3.5 w-3.5" /> Energy IQ · Property Intake
        </span>
        <h2 className="mt-4 text-2xl sm:text-3xl lg:text-4xl font-display font-semibold text-navy leading-[1.1]">
          Let's start with your property.
        </h2>
        <p className="mt-4 text-navy-soft leading-relaxed max-w-xl">
          Tell us where your property is located and we'll begin building your
          personalised Energy IQ profile.
        </p>

        <div className="mt-8 max-w-xl">
          <Label htmlFor="pi-address" className="text-xs font-semibold uppercase tracking-[0.16em] text-navy">
            Property address
          </Label>
          <div className="mt-2 relative">
            <MapPin className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-electric" />
            <Input
              id="pi-address"
              value={address}
              onChange={(e) => setAddress(e.target.value.slice(0, 200))}
              onKeyDown={(e) => {
                if (e.key === "Enter" && canSubmit) {
                  e.preventDefault();
                  void beginAnalysis();
                }
              }}
              placeholder="Postcode or full address"
              className="pl-11 h-13 py-3 text-base"
              autoComplete="street-address"
              maxLength={200}
            />
          </div>
          <p className="mt-2 flex items-center gap-1.5 text-xs text-muted-foreground">
            <Info className="h-3 w-3" />
            Start typing a postcode or address. Your information stays private.
          </p>
        </div>

        <div className="mt-8 flex flex-wrap items-center gap-3">
          <Button
            onClick={beginAnalysis}
            disabled={!canSubmit}
            className="rounded-full h-12 px-6 bg-gradient-electric text-white border-0 shadow-glow disabled:opacity-50"
          >
            Analyse My Property <ArrowRight className="ml-1.5 h-4 w-4" />
          </Button>
          {onSkip && (
            <button
              type="button"
              onClick={onSkip}
              className="text-xs text-muted-foreground hover:text-navy transition-colors"
            >
              Skip and go straight to the assessment
            </button>
          )}
        </div>
      </div>
    );
  }

  // ---------------- ANALYSING ----------------
  if (phase === "analysing") {
    const progressPct = Math.min(100, (stage / STAGES.length) * 100);
    return (
      <div
        className="relative overflow-hidden rounded-2xl border border-white/10 shadow-2xl"
        style={{
          background:
            "radial-gradient(ellipse at 50% 20%, hsl(230 60% 22%) 0%, hsl(225 55% 12%) 45%, hsl(222 60% 6%) 100%)",
        }}
        role="status"
        aria-live="polite"
      >
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -top-24 left-1/2 -translate-x-1/2 h-[420px] w-[420px] rounded-full opacity-40 blur-3xl"
          style={{ background: "radial-gradient(circle, hsl(230 95% 60% / 0.55), transparent 60%)" }}
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 opacity-[0.06]"
          style={{
            backgroundImage:
              "linear-gradient(hsl(0 0% 100%) 1px, transparent 1px), linear-gradient(90deg, hsl(0 0% 100%) 1px, transparent 1px)",
            backgroundSize: "44px 44px",
            maskImage: "radial-gradient(ellipse 70% 60% at 50% 45%, black 30%, transparent 85%)",
          }}
        />

        <div className="relative px-6 sm:px-10 py-14 sm:py-16 text-center">
          <span className="inline-flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.3em] text-white/60">
            <Sparkles className="h-3.5 w-3.5" /> Energy IQ
          </span>
          <h2 className="mt-4 text-2xl sm:text-3xl lg:text-4xl font-display font-semibold text-white">
            Building your Energy IQ<span className="opacity-60">...</span>
          </h2>
          <p className="mt-3 text-white/60 max-w-md mx-auto text-sm sm:text-base">
            Intelligently analysing your property to personalise your assessment.
          </p>

          {/* Progress bar */}
          <div className="mt-10 mx-auto max-w-md">
            <div className="h-1 w-full overflow-hidden rounded-full bg-white/10">
              <div
                className="h-full bg-gradient-electric transition-[width] duration-700 ease-out"
                style={{ width: `${progressPct}%` }}
              />
            </div>
          </div>

          <ul className="mt-8 grid gap-2 max-w-md mx-auto text-sm text-left">
            {STAGES.map((label, i) => {
              const done = i < stage;
              const active = i === stage;
              return (
                <li
                  key={label}
                  className={`flex items-center gap-3 rounded-lg px-4 py-2.5 border transition-all duration-500 ${
                    done
                      ? "opacity-100 translate-y-0 border-white/15 bg-white/[0.05] text-white/90"
                      : active
                        ? "opacity-100 translate-y-0 border-white/10 bg-white/[0.03] text-white/80"
                        : "opacity-40 translate-y-1 border-transparent text-white/60"
                  }`}
                >
                  <span className="grid h-5 w-5 flex-shrink-0 place-items-center">
                    {done ? (
                      <CheckCircle2
                        className="h-4 w-4"
                        style={{ color: "hsl(195 100% 65%)" }}
                      />
                    ) : (
                      <span
                        className={`h-2 w-2 rounded-full ${
                          active ? "bg-white/70 animate-pulse" : "bg-white/25"
                        }`}
                      />
                    )}
                  </span>
                  <span className="text-left">{label}</span>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    );
  }

  // ---------------- NOT FOUND ----------------
  if (phase === "not_found") {
    return (
      <div className="card-premium p-8 lg:p-10">
        <div className="h-14 w-14 rounded-full bg-electric/10 grid place-items-center text-electric">
          <Home className="h-6 w-6" />
        </div>
        <h2 className="mt-6 text-2xl sm:text-3xl font-display font-semibold text-navy">
          Property Information Limited
        </h2>
        <p className="mt-4 text-navy-soft leading-relaxed max-w-xl">
          We couldn't locate historic property information for this address.
          Don't worry — you can still complete your Energy IQ assessment and
          receive personalised recommendations.
        </p>
        <div className="mt-8 flex flex-wrap items-center gap-3">
          <Button
            onClick={() => onComplete(null, address)}
            className="rounded-full h-12 px-6 bg-gradient-electric text-white border-0 shadow-glow"
          >
            Continue Assessment <ArrowRight className="ml-1.5 h-4 w-4" />
          </Button>
          <button
            type="button"
            onClick={() => {
              setPhase("address");
              setResult(null);
            }}
            className="text-xs text-muted-foreground hover:text-navy transition-colors"
          >
            Try a different address
          </button>
        </div>
      </div>
    );
  }

  // ---------------- CONFIRMED ----------------
  const found = result?.status === "found" ? result.data : null;
  return (
    <div className="card-premium p-8 lg:p-10 animate-fade-in">
      <div className="flex items-start gap-4">
        <div className="h-12 w-12 rounded-full bg-gradient-electric grid place-items-center text-white shadow-glow flex-shrink-0">
          <CheckCircle2 className="h-6 w-6" />
        </div>
        <div>
          <span className="eyebrow"><Sparkles className="h-3.5 w-3.5" /> Analysis complete</span>
          <h2 className="mt-2 text-2xl sm:text-3xl lg:text-4xl font-display font-semibold text-navy leading-[1.1]">
            Your property has been identified.
          </h2>
        </div>
      </div>

      <p className="mt-6 text-navy-soft leading-relaxed max-w-xl">
        We've successfully analysed available information about your property.
        We'll now personalise your Energy IQ assessment so your final report is
        specific to your property.
      </p>

      {found && (
        <div className="mt-6 rounded-xl border border-border bg-surface/60 px-4 py-3 inline-flex items-center gap-2.5">
          <MapPin className="h-4 w-4 text-electric" />
          <div className="text-sm font-medium text-navy">
            {found.address.line1}
            <span className="text-navy-soft font-normal">
              {" · "}
              {found.address.town} · {found.address.postcode}
            </span>
          </div>
        </div>
      )}

      <p className="mt-6 text-sm text-muted-foreground max-w-xl">
        Some of the information we've found will automatically be included
        within your final report.
      </p>

      <div className="mt-8">
        <Button
          onClick={() => onComplete(found, address)}
          className="rounded-full h-12 px-6 bg-gradient-electric text-white border-0 shadow-glow"
        >
          Continue Assessment <ArrowRight className="ml-1.5 h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};
