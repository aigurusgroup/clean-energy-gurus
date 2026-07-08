import { useEffect, useState } from "react";
import { ArrowRight, CheckCircle2, Home, Sparkles, MapPin, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  searchAddresses,
  fetchPropertyByAddress,
  type AddressCandidate,
  type PropertyIntelligence,
} from "@/lib/propertyIntelligence";

type Phase = "postcode" | "addresses" | "analysing" | "confirmed" | "not_found";

const STAGES = [
  "Locating your property",
  "Understanding your home",
  "Analysing available property information",
  "Preparing your personalised Energy IQ",
];

const TOTAL_ANALYSIS_MS = 4200;
const STAGE_STEP_MS = TOTAL_ANALYSIS_MS / STAGES.length;

const UK_POSTCODE =
  /^([A-PR-UWYZ][A-HK-Y]?[0-9][0-9A-HJKPS-UW]?\s*[0-9][ABD-HJLNP-UW-Z]{2})$/i;

const normalisePostcode = (raw: string) =>
  raw.trim().toUpperCase().replace(/\s+/g, "").replace(/^(.*)(\d[A-Z]{2})$/, "$1 $2");

/**
 * Premium postcode → address selection → analysing → confirmation flow.
 * Uses the secure `property-analysis` edge function for live EPC data,
 * with mock fallback (and a dev-only banner) if the API is unavailable.
 */
export const PropertyIntake = ({
  onComplete,
  onSkip,
}: {
  onComplete: (property: PropertyIntelligence | null, addressUsed: string) => void;
  onSkip?: () => void;
}) => {
  const [phase, setPhase] = useState<Phase>("postcode");
  const [postcode, setPostcode] = useState("");
  const [addresses, setAddresses] = useState<AddressCandidate[]>([]);
  const [selectedKey, setSelectedKey] = useState<string>("");
  const [stage, setStage] = useState(0);
  const [property, setProperty] = useState<PropertyIntelligence | null>(null);
  const [searching, setSearching] = useState(false);
  const [devMessage, setDevMessage] = useState<string | null>(null);

  const postcodeValid = UK_POSTCODE.test(postcode.trim());
  const selectedAddress = addresses.find((a) => a.lmkKey === selectedKey) ?? null;
  const isDev = import.meta.env.DEV;

  const findAddresses = async () => {
    if (!postcodeValid || searching) return;
    setSearching(true);
    setDevMessage(null);
    const pc = normalisePostcode(postcode);
    try {
      const res = await searchAddresses(pc);
      if (res.status === "empty") {
        // Genuinely no EPC records — skip straight to manual questionnaire.
        setPhase("not_found");
        setSearching(false);
        return;
      }
      setAddresses(res.addresses);
      setSelectedKey("");
      if (res.status === "fallback") setDevMessage(res.devMessage);
      setPhase("addresses");
    } finally {
      setSearching(false);
    }
  };

  const beginAnalysis = async () => {
    if (!selectedAddress) return;
    setPhase("analysing");
    setStage(0);

    const lookupPromise = fetchPropertyByAddress(selectedAddress);
    for (let i = 0; i < STAGES.length; i++) {
      await new Promise((r) => setTimeout(r, STAGE_STEP_MS));
      setStage(i + 1);
    }

    const res = await lookupPromise;
    if (res.status === "found") {
      setProperty(res.data);
      if ((res as { devMessage?: string }).devMessage) {
        setDevMessage((res as { devMessage?: string }).devMessage!);
      }
      setPhase("confirmed");
    } else {
      setPhase("not_found");
    }
  };

  useEffect(() => {
    if (phase !== "postcode") return;
    const el = document.getElementById("pi-postcode") as HTMLInputElement | null;
    el?.focus();
  }, [phase]);

  // ---------------- POSTCODE ----------------
  if (phase === "postcode") {
    return (
      <div className="card-premium p-8 lg:p-10">
        <span className="eyebrow">
          <Sparkles className="h-3.5 w-3.5" /> Energy IQ · Property Intake
        </span>
        <h2 className="mt-4 text-2xl sm:text-3xl lg:text-4xl font-display font-semibold text-navy leading-[1.1]">
          Let's start with your postcode.
        </h2>
        <p className="mt-4 text-navy-soft leading-relaxed max-w-xl">
          Enter your postcode and we'll find your property so we can build your
          personalised Energy IQ profile.
        </p>

        <div className="mt-8 max-w-md">
          <Label htmlFor="pi-postcode" className="text-xs font-semibold uppercase tracking-[0.16em] text-navy">
            Postcode
          </Label>
          <div className="mt-2 relative">
            <MapPin className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-electric" />
            <Input
              id="pi-postcode"
              value={postcode}
              onChange={(e) => setPostcode(e.target.value.slice(0, 12).toUpperCase())}
              onKeyDown={(e) => {
                if (e.key === "Enter" && postcodeValid && !searching) {
                  e.preventDefault();
                  void findAddresses();
                }
              }}
              placeholder="e.g. BN18 9AA"
              className="pl-11 h-12 py-3 text-base tracking-wide"
              autoComplete="postal-code"
              maxLength={12}
            />
          </div>
          <p className="mt-2 flex items-center gap-1.5 text-xs text-muted-foreground">
            <Info className="h-3 w-3" />
            Your information stays private.
          </p>
        </div>

        <div className="mt-8 flex flex-wrap items-center gap-3">
          <Button
            onClick={() => void findAddresses()}
            disabled={!postcodeValid || searching}
            className="rounded-full h-12 px-6 bg-gradient-electric text-white border-0 shadow-glow disabled:opacity-50"
          >
            {searching ? "Searching…" : "Find My Address"}
            <ArrowRight className="ml-1.5 h-4 w-4" />
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

  // ---------------- ADDRESS SELECTION ----------------
  if (phase === "addresses") {
    return (
      <div className="card-premium p-8 lg:p-10">
        <span className="eyebrow">
          <Sparkles className="h-3.5 w-3.5" /> Energy IQ · Select your property
        </span>
        <h2 className="mt-4 text-2xl sm:text-3xl lg:text-4xl font-display font-semibold text-navy leading-[1.1]">
          Select your address.
        </h2>
        <p className="mt-4 text-navy-soft leading-relaxed max-w-xl">
          We found {addresses.length} {addresses.length === 1 ? "address" : "addresses"} for{" "}
          <span className="font-semibold text-navy">{normalisePostcode(postcode)}</span>.
          Choose yours to continue.
        </p>

        {isDev && devMessage && (
          <div className="mt-4 rounded-lg border border-amber-300 bg-amber-50 px-4 py-2.5 text-xs text-amber-900">
            <strong className="font-semibold">Dev:</strong> {devMessage}
          </div>
        )}

        <ul className="mt-8 grid gap-2 max-w-xl" role="radiogroup" aria-label="Select your address">
          {addresses.map((a) => {
            const selected = selectedKey === a.lmkKey;
            return (
              <li key={a.lmkKey}>
                <button
                  type="button"
                  role="radio"
                  aria-checked={selected}
                  onClick={() => setSelectedKey(a.lmkKey)}
                  className={`w-full text-left flex items-center gap-3 rounded-xl border px-4 py-3.5 transition-all ${
                    selected
                      ? "border-electric bg-electric/5 shadow-glow"
                      : "border-border bg-surface/60 hover:border-electric/60 hover:bg-electric/[0.03]"
                  }`}
                >
                  <span
                    className={`grid h-5 w-5 flex-shrink-0 place-items-center rounded-full border ${
                      selected ? "border-electric bg-electric text-white" : "border-border"
                    }`}
                  >
                    {selected && <CheckCircle2 className="h-4 w-4" />}
                  </span>
                  <span className="text-sm font-medium text-navy">{a.label}</span>
                </button>
              </li>
            );
          })}
        </ul>

        <div className="mt-8 flex flex-wrap items-center gap-3">
          <Button
            onClick={() => void beginAnalysis()}
            disabled={!selectedAddress}
            className="rounded-full h-12 px-6 bg-gradient-electric text-white border-0 shadow-glow disabled:opacity-50"
          >
            Analyse My Property <ArrowRight className="ml-1.5 h-4 w-4" />
          </Button>
          <button
            type="button"
            onClick={() => {
              setPhase("postcode");
              setAddresses([]);
              setSelectedKey("");
              setDevMessage(null);
            }}
            className="text-xs text-muted-foreground hover:text-navy transition-colors"
          >
            Change postcode
          </button>
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
                      <CheckCircle2 className="h-4 w-4" style={{ color: "hsl(195 100% 65%)" }} />
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
            onClick={() => onComplete(null, selectedAddress?.label ?? postcode)}
            className="rounded-full h-12 px-6 bg-gradient-electric text-white border-0 shadow-glow"
          >
            Continue Assessment <ArrowRight className="ml-1.5 h-4 w-4" />
          </Button>
          <button
            type="button"
            onClick={() => {
              setPhase("postcode");
              setProperty(null);
            }}
            className="text-xs text-muted-foreground hover:text-navy transition-colors"
          >
            Try a different postcode
          </button>
        </div>
      </div>
    );
  }

  // ---------------- CONFIRMED ----------------
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

      {isDev && devMessage && (
        <div className="mt-4 rounded-lg border border-amber-300 bg-amber-50 px-4 py-2.5 text-xs text-amber-900">
          <strong className="font-semibold">Dev:</strong> {devMessage}
        </div>
      )}

      {property && (
        <div className="mt-6 rounded-xl border border-border bg-surface/60 px-4 py-3 inline-flex items-center gap-2.5">
          <MapPin className="h-4 w-4 text-electric" />
          <div className="text-sm font-medium text-navy">
            {property.address.line1}
            <span className="text-navy-soft font-normal">
              {" · "}
              {property.address.town} · {property.address.postcode}
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
          onClick={() => onComplete(property, selectedAddress?.label ?? "")}
          className="rounded-full h-12 px-6 bg-gradient-electric text-white border-0 shadow-glow"
        >
          Continue Assessment <ArrowRight className="ml-1.5 h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};
