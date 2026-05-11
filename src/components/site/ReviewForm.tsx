import { useState } from "react";
import { z } from "zod";
import { Check, ArrowRight, ArrowLeft, CheckCircle2, Sparkles, Sun, PoundSterling, Zap, Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";

export type SolarEstimate = {
  address: string;
  postcode: string;
  area: number;
  kWp: number;
  annualKwh: number;
  annualSaving: number;
  systemCost: number;
  payback: number;
  roof: string;
  building: string;
};

// ---------------- Schema ----------------
const schema = z.object({
  // step 1
  customerType: z.string().min(1, "Please select a customer type"),
  // step 2
  postcode: z.string().trim().min(3, "Enter a valid postcode").max(10),
  county: z.string().trim().max(80).optional().or(z.literal("")),
  propertyType: z.string().trim().max(80).optional().or(z.literal("")),
  // step 3
  spend: z.string().min(1, "Select an estimated spend range"),
  hasBills: z.string().min(1),
  hasHHData: z.string().min(1),
  ownsProperty: z.string().min(1),
  hasSolar: z.string().min(1),
  hasEV: z.string().min(1),
  // step 4
  interests: z.array(z.string()).min(1, "Pick at least one area of interest"),
  // step 5
  name: z.string().trim().min(2, "Please enter your name").max(100),
  email: z.string().trim().email("Enter a valid email").max(255),
  phone: z.string().trim().min(7, "Enter a valid phone number").max(30),
  contactMethod: z.string().min(1, "Select a contact method"),
  callTime: z.string().min(1, "Select a preferred time"),
});

type FormData = z.infer<typeof schema>;

const initialData: FormData = {
  customerType: "",
  postcode: "",
  county: "",
  propertyType: "",
  spend: "",
  hasBills: "",
  hasHHData: "",
  ownsProperty: "",
  hasSolar: "",
  hasEV: "",
  interests: [],
  name: "",
  email: "",
  phone: "",
  contactMethod: "",
  callTime: "",
};

const customerTypes = [
  { v: "Business", d: "SME, retail, hospitality, light industrial" },
  { v: "Farm / Agriculture", d: "Farms, estates, rural businesses" },
  { v: "Landlord / Property Portfolio", d: "Residential, commercial, mixed-use, BTR" },
  { v: "Homeowner", d: "Large or high-consumption homes" },
  { v: "Existing Solar Owner", d: "Add storage, upgrade or optimise" },
];

const interestOptions = [
  "Solar PV",
  "Battery Storage",
  "EV Charging",
  "Monitoring / Maintenance",
  "Tariff / Export Optimisation",
  "Existing Solar Upgrade",
  "Heat Pump / Efficiency Referral",
];

const spendRanges = ["Under £2,000", "£2,000–£10,000", "£10,000–£50,000", "£50,000–£250,000", "£250,000+"];
const yesNoUnsure = ["Yes", "No", "Not sure"];
const propertyTypes = ["Detached / Large home", "Block / Flats", "Office", "Warehouse / Industrial", "Retail / Hospitality", "Farm / Agricultural", "Mixed-use", "Other"];
const contactMethods = ["Email", "Phone", "WhatsApp", "Either"];
const callTimes = ["Morning (8–12)", "Afternoon (12–5)", "Evening (5–7)", "Anytime"];

const steps = ["Customer", "Location", "Energy", "Interests", "Contact"];

// ---------------- Field components ----------------
const RadioCard = ({ checked, onClick, title, desc }: { checked: boolean; onClick: () => void; title: string; desc?: string }) => (
  <button
    type="button"
    onClick={onClick}
    className={`text-left rounded-2xl border p-4 transition-all w-full ${
      checked
        ? "border-electric bg-electric/5 shadow-glow/30"
        : "border-border bg-card hover:border-electric/40"
    }`}
  >
    <div className="flex items-start gap-3">
      <div className={`mt-0.5 h-5 w-5 rounded-full border-2 flex-shrink-0 grid place-items-center ${checked ? "border-electric bg-electric" : "border-muted-foreground/30"}`}>
        {checked && <Check className="h-3 w-3 text-white" strokeWidth={3} />}
      </div>
      <div className="min-w-0">
        <div className="text-sm font-display font-semibold text-navy">{title}</div>
        {desc && <div className="text-xs text-muted-foreground mt-0.5">{desc}</div>}
      </div>
    </div>
  </button>
);

const Chip = ({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) => (
  <button
    type="button"
    onClick={onClick}
    className={`px-4 h-10 rounded-full text-sm font-medium border transition-all ${
      active
        ? "bg-navy text-white border-navy"
        : "bg-card text-navy border-border hover:border-electric/50"
    }`}
  >
    {children}
  </button>
);

const FieldError = ({ msg }: { msg?: string }) => msg ? <p className="text-xs text-destructive mt-1.5">{msg}</p> : null;

// ---------------- Main form ----------------
export const ReviewForm = ({
  compact = false,
  prefill,
  estimate,
}: {
  compact?: boolean;
  prefill?: Partial<FormData>;
  estimate?: SolarEstimate;
}) => {
  void compact;
  const [step, setStep] = useState(0);
  const [data, setData] = useState<FormData>({ ...initialData, ...prefill });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);

  const set = <K extends keyof FormData>(k: K, v: FormData[K]) => {
    setData((d) => ({ ...d, [k]: v }));
    setErrors((e) => ({ ...e, [k]: "" }));
  };

  const toggleInterest = (v: string) => {
    const has = data.interests.includes(v);
    set("interests", has ? data.interests.filter((i) => i !== v) : [...data.interests, v]);
  };

  // Validate just the fields visible on the current step
  const validateStep = (): boolean => {
    const stepFields: (keyof FormData)[][] = [
      ["customerType"],
      ["postcode"],
      ["spend", "hasBills", "hasHHData", "ownsProperty", "hasSolar", "hasEV"],
      ["interests"],
      ["name", "email", "phone", "contactMethod", "callTime"],
    ];
    const r = schema.safeParse(data);
    if (r.success) return true;
    const errs: Record<string, string> = {};
    const fields = stepFields[step];
    let hasError = false;
    r.error.issues.forEach((i) => {
      const key = i.path[0] as string;
      if (fields.includes(key as keyof FormData)) {
        errs[key] = i.message;
        hasError = true;
      }
    });
    setErrors(errs);
    return !hasError;
  };

  const next = () => {
    if (!validateStep()) return;
    setStep((s) => Math.min(s + 1, steps.length - 1));
  };
  const back = () => setStep((s) => Math.max(s - 1, 0));

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const r = schema.safeParse(data);
    if (!r.success) {
      const errs: Record<string, string> = {};
      r.error.issues.forEach((i) => { errs[i.path[0] as string] = i.message; });
      setErrors(errs);
      // jump back to first step with an error
      const order: (keyof FormData)[][] = [
        ["customerType"],
        ["postcode"],
        ["spend", "hasBills", "hasHHData", "ownsProperty", "hasSolar", "hasEV"],
        ["interests"],
        ["name", "email", "phone", "contactMethod", "callTime"],
      ];
      const firstBad = order.findIndex((flds) => flds.some((f) => errs[f as string]));
      if (firstBad >= 0) setStep(firstBad);
      return;
    }

    // --- Conversion tracking placeholders ---
    // window.dataLayer?.push({ event: "energy_review_submitted", customerType: r.data.customerType });
    // window.gtag?.("event", "generate_lead", { value: 1, currency: "GBP" });
    // window.fbq?.("track", "Lead");

    toast({ title: "Request received", description: "We'll be in touch within one business day." });
    setSubmitted(true);
  };

  // ---------------- Thank-you state ----------------
  if (submitted) {
    return (
      <div className="text-center py-6">
        <div className="mx-auto h-16 w-16 rounded-full bg-gradient-electric grid place-items-center text-white shadow-glow">
          <CheckCircle2 className="h-8 w-8" />
        </div>
        <h3 className="mt-6 text-2xl sm:text-3xl font-display font-semibold text-navy">
          Your Energy Review Request Has Been Received
        </h3>
        <p className="mt-4 text-navy-soft leading-relaxed max-w-md mx-auto">
          A member of the Clean Energy Gurus team will review your information
          and contact you to discuss your site, usage profile and potential
          options.
        </p>
        <div className="mt-8 grid sm:grid-cols-3 gap-3 text-left max-w-lg mx-auto">
          {[
            ["1", "Review", "We review your details within one business day."],
            ["2", "Discovery call", "A short call to understand your site and goals."],
            ["3", "Proposal", "A clear, no-obligation proposal tailored to you."],
          ].map(([n, t, d]) => (
            <div key={n} className="rounded-2xl border border-border bg-card p-4">
              <div className="text-electric font-display font-semibold">{n}</div>
              <div className="text-sm font-display font-semibold text-navy mt-1">{t}</div>
              <div className="text-xs text-muted-foreground mt-1">{d}</div>
            </div>
          ))}
        </div>
        <div className="mt-8 inline-flex items-center gap-2 text-xs text-muted-foreground">
          <Sparkles className="h-3.5 w-3.5 text-electric" />
          Reference saved. Check your inbox for a confirmation shortly.
        </div>
      </div>
    );
  }

  // ---------------- Stepper UI ----------------
  return (
    <form onSubmit={submit} className="space-y-6" noValidate>
      {estimate && estimate.area > 0 && (
        <div className="rounded-2xl bg-navy text-white p-5 sm:p-6 relative overflow-hidden">
          <div className="absolute -top-16 -right-16 h-40 w-40 rounded-full bg-gradient-electric opacity-30 blur-3xl pointer-events-none" />
          <div className="relative">
            <div className="text-[11px] uppercase tracking-[0.18em] text-white/60 font-semibold flex items-center gap-1.5">
              <Sun className="h-3.5 w-3.5 text-electric" />
              Your solar estimate
            </div>
            {estimate.address && (
              <div className="mt-1 text-sm text-white/80 truncate">{estimate.address}</div>
            )}
            <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-3">
              <EstStat icon={<PoundSterling className="h-3.5 w-3.5" />} label="Saving / yr" value={`£${estimate.annualSaving.toLocaleString("en-GB")}`} />
              <EstStat icon={<Zap className="h-3.5 w-3.5" />} label="System size" value={`${estimate.kWp.toFixed(1)} kWp`} />
              <EstStat icon={<Pencil className="h-3.5 w-3.5" />} label="Roof area" value={`${estimate.area.toLocaleString("en-GB")} m²`} />
              <EstStat label="Payback" value={estimate.payback ? `${estimate.payback.toFixed(1)} yrs` : "—"} />
            </div>
            {(estimate.roof || estimate.building) && (
              <div className="mt-3 flex flex-wrap gap-1.5 text-[11px] text-white/70">
                {estimate.roof && <span className="rounded-full bg-white/10 px-2.5 py-1">Roof: {estimate.roof}</span>}
                {estimate.building && <span className="rounded-full bg-white/10 px-2.5 py-1">{estimate.building}</span>}
              </div>
            )}
            <p className="mt-3 text-[11px] text-white/55">
              We've attached this estimate to your request — just confirm your details below.
            </p>
          </div>
        </div>
      )}
      {/* Progress */}
      <div>
        <div className="flex items-center justify-between text-[11px] uppercase tracking-[0.16em] text-muted-foreground mb-3">
          <span className="font-semibold text-navy">Step {step + 1} of {steps.length}</span>
          <span>{steps[step]}</span>
        </div>
        <div className="h-1.5 w-full rounded-full bg-border overflow-hidden">
          <div
            className="h-full bg-gradient-electric transition-all duration-500"
            style={{ width: `${((step + 1) / steps.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Step 1: Customer type */}
      {step === 0 && (
        <div className="space-y-3 animate-fade-in-up">
          <h3 className="text-lg font-display font-semibold text-navy">What best describes you?</h3>
          <div className="grid sm:grid-cols-2 gap-3">
            {customerTypes.map((c) => (
              <RadioCard
                key={c.v}
                checked={data.customerType === c.v}
                onClick={() => set("customerType", c.v)}
                title={c.v}
                desc={c.d}
              />
            ))}
          </div>
          <FieldError msg={errors.customerType} />
        </div>
      )}

      {/* Step 2: Location */}
      {step === 1 && (
        <div className="space-y-4 animate-fade-in-up">
          <h3 className="text-lg font-display font-semibold text-navy">Where is the site?</h3>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="postcode">Postcode</Label>
              <Input id="postcode" value={data.postcode} onChange={(e) => set("postcode", e.target.value)} className="mt-1.5" placeholder="e.g. SW1A 1AA" maxLength={10} />
              <FieldError msg={errors.postcode} />
            </div>
            <div>
              <Label htmlFor="county">County</Label>
              <Input id="county" value={data.county} onChange={(e) => set("county", e.target.value)} className="mt-1.5" placeholder="e.g. Surrey" maxLength={80} />
            </div>
            <div className="sm:col-span-2">
              <Label>Property type</Label>
              <div className="mt-2 flex flex-wrap gap-2">
                {propertyTypes.map((p) => (
                  <Chip key={p} active={data.propertyType === p} onClick={() => set("propertyType", p)}>{p}</Chip>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Step 3: Energy profile */}
      {step === 2 && (
        <div className="space-y-5 animate-fade-in-up">
          <h3 className="text-lg font-display font-semibold text-navy">Tell us about your energy use.</h3>

          <div>
            <Label>Estimated annual electricity spend</Label>
            <div className="mt-2 flex flex-wrap gap-2">
              {spendRanges.map((s) => (
                <Chip key={s} active={data.spend === s} onClick={() => set("spend", s)}>{s}</Chip>
              ))}
            </div>
            <FieldError msg={errors.spend} />
          </div>

          {[
            ["hasBills", "Do you have electricity bills available?"],
            ["hasHHData", "Do you have half-hourly data?"],
            ["ownsProperty", "Do you own the property?"],
            ["hasSolar", "Do you have existing solar?"],
            ["hasEV", "Do you have an EV or EV fleet?"],
          ].map(([k, q]) => (
            <div key={k}>
              <Label>{q}</Label>
              <div className="mt-2 flex flex-wrap gap-2">
                {yesNoUnsure.map((v) => (
                  <Chip
                    key={v}
                    active={data[k as keyof FormData] === v}
                    onClick={() => set(k as keyof FormData, v as never)}
                  >
                    {v}
                  </Chip>
                ))}
              </div>
              <FieldError msg={errors[k]} />
            </div>
          ))}
        </div>
      )}

      {/* Step 4: Interests */}
      {step === 3 && (
        <div className="space-y-3 animate-fade-in-up">
          <h3 className="text-lg font-display font-semibold text-navy">What are you interested in?</h3>
          <p className="text-sm text-muted-foreground">Select all that apply.</p>
          <div className="grid sm:grid-cols-2 gap-3">
            {interestOptions.map((i) => (
              <RadioCard
                key={i}
                checked={data.interests.includes(i)}
                onClick={() => toggleInterest(i)}
                title={i}
              />
            ))}
          </div>
          <FieldError msg={errors.interests} />
        </div>
      )}

      {/* Step 5: Contact */}
      {step === 4 && (
        <div className="space-y-4 animate-fade-in-up">
          <h3 className="text-lg font-display font-semibold text-navy">How should we contact you?</h3>
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <Label htmlFor="name">Full name</Label>
              <Input id="name" value={data.name} onChange={(e) => set("name", e.target.value)} className="mt-1.5" maxLength={100} />
              <FieldError msg={errors.name} />
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" value={data.email} onChange={(e) => set("email", e.target.value)} className="mt-1.5" maxLength={255} />
              <FieldError msg={errors.email} />
            </div>
            <div>
              <Label htmlFor="phone">Phone</Label>
              <Input id="phone" type="tel" value={data.phone} onChange={(e) => set("phone", e.target.value)} className="mt-1.5" maxLength={30} />
              <FieldError msg={errors.phone} />
            </div>
            <div className="sm:col-span-2">
              <Label>Preferred contact method</Label>
              <div className="mt-2 flex flex-wrap gap-2">
                {contactMethods.map((c) => (
                  <Chip key={c} active={data.contactMethod === c} onClick={() => set("contactMethod", c)}>{c}</Chip>
                ))}
              </div>
              <FieldError msg={errors.contactMethod} />
            </div>
            <div className="sm:col-span-2">
              <Label>Preferred call time</Label>
              <div className="mt-2 flex flex-wrap gap-2">
                {callTimes.map((c) => (
                  <Chip key={c} active={data.callTime === c} onClick={() => set("callTime", c)}>{c}</Chip>
                ))}
              </div>
              <FieldError msg={errors.callTime} />
            </div>
          </div>
        </div>
      )}

      {/* Nav */}
      <div className="flex items-center justify-between gap-3 pt-2">
        {step > 0 ? (
          <Button type="button" variant="outline" onClick={back} className="rounded-full px-5 h-11">
            <ArrowLeft className="h-4 w-4 mr-1.5" /> Back
          </Button>
        ) : <div />}
        {step < steps.length - 1 ? (
          <Button type="button" onClick={next} className="rounded-full px-6 h-11 bg-gradient-electric text-white border-0 shadow-glow ml-auto">
            Continue <ArrowRight className="h-4 w-4 ml-1.5" />
          </Button>
        ) : (
          <Button type="submit" className="rounded-full px-6 h-11 bg-gradient-electric text-white border-0 shadow-glow ml-auto">
            Submit Request <ArrowRight className="h-4 w-4 ml-1.5" />
          </Button>
        )}
      </div>

      <p className="text-[11px] text-muted-foreground text-center pt-1">
        We'll respond within one business day. No obligation. Your data is used only to contact you about your enquiry.
      </p>
    </form>
  );
};

const EstStat = ({ label, value, icon }: { label: string; value: string; icon?: React.ReactNode }) => (
  <div className="rounded-xl bg-white/[0.05] border border-white/10 p-2.5">
    <div className="text-[10px] uppercase tracking-[0.16em] text-white/55 font-semibold flex items-center gap-1.5">
      {icon}
      {label}
    </div>
    <div className="mt-1 text-sm font-display font-semibold text-white">{value}</div>
  </div>
);
