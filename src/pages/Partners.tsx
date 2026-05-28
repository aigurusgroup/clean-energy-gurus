import { useEffect, useState } from "react";
import { z } from "zod";
import { SiteLayout } from "@/components/site/SiteLayout";
import { PageHero } from "@/components/site/PageHero";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import {
  ShieldCheck,
  BadgeCheck,
  Award,
  Sun,
  Battery,
  Zap,
  Gauge,
  PoundSterling,
  CalendarClock,
  PackageCheck,
  FileText,
  Headphones,
  Receipt,
  CheckCircle2,
  ArrowRight,
} from "lucide-react";

const accreditations = [
  {
    icon: ShieldCheck,
    title: "MCS certified",
    body: "All partner installers must hold a valid MCS certification for the technologies they fit, so customers qualify for grants and export tariffs.",
  },
  {
    icon: BadgeCheck,
    title: "Identity & insurance verified",
    body: "We verify company details, public liability insurance and engineer ID before any job is allocated.",
  },
  {
    icon: Award,
    title: "Continuous quality review",
    body: "Workmanship is audited on every install. CEG Accredited status is maintained through ongoing customer feedback and site checks.",
  },
];

const services = [
  { icon: Sun, label: "Solar PV" },
  { icon: Battery, label: "Battery storage" },
  { icon: Zap, label: "EV charging" },
  { icon: Gauge, label: "Monitoring & optimisation" },
];

const benefits = [
  {
    icon: PoundSterling,
    title: "Get paid quickly",
    body: "Jobs are audited and approved by our technical team, with payment typically issued within one week of sign-off.",
  },
  {
    icon: CalendarClock,
    title: "Choose when and where you work",
    body: "Set your availability and coverage area in the partner portal. We allocate jobs that match your skills and calendar.",
  },
  {
    icon: PackageCheck,
    title: "Materials delivered to site",
    body: "Skip the merchants. Panels, inverters, batteries and cabling are picked, packed and delivered ready for install day.",
  },
  {
    icon: FileText,
    title: "Less paperwork",
    body: "Surveys, designs, DNO and grant applications are handled by our central team so you can focus on the install.",
  },
  {
    icon: Headphones,
    title: "Expert support on hand",
    body: "Technical and customer support teams back you up before, during and after every job.",
  },
  {
    icon: Receipt,
    title: "Automated invoicing",
    body: "Once a job is signed off, your invoice is generated automatically and queued for the next payment run.",
  },
];

const expectations = [
  "Deliver excellent customer service in line with the CEG brand promise.",
  "Hold and maintain valid MCS, NICEIC/NAPIT and relevant manufacturer accreditations.",
  "Follow PAS 2030 / PAS 2035 and MCS best-practice guidelines on every install.",
  "Complete handover paperwork, photos and commissioning data via the partner portal within 48 hours of sign-off.",
  "Respond to customer aftercare requests within one UK business day.",
];

const steps = [
  { n: "01", t: "Submit your details", b: "Tell us about your business and MCS coverage using the form below." },
  { n: "02", t: "Verification call", b: "Our partner team reviews your accreditations, insurance and coverage area." },
  { n: "03", t: "Onboarding", b: "Get set up on the CEG partner portal, branded materials and first jobs allocated." },
];

const formSchema = z.object({
  company: z.string().trim().max(120, "Max 120 characters").optional(),
  firstName: z.string().trim().min(1, "First name is required").max(60),
  lastName: z.string().trim().min(1, "Last name is required").max(60),
  email: z.string().trim().email("Enter a valid email").max(255),
  mcs: z.string().trim().min(3, "MCS number is required").max(40),
});

const Partners = () => {
  const { toast } = useToast();
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    document.title = "Become a CEG Accredited Installer | Clean Energy Gurus";
    const desc =
      "Join the Clean Energy Gurus partner network. MCS-certified installers get a steady flow of solar, battery and EV jobs, materials delivered to site and fast payment.";
    const meta =
      document.querySelector('meta[name="description"]') ||
      (() => {
        const m = document.createElement("meta");
        m.setAttribute("name", "description");
        document.head.appendChild(m);
        return m;
      })();
    meta.setAttribute("content", desc);
  }, []);

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const data = {
      company: String(fd.get("company") || ""),
      firstName: String(fd.get("firstName") || ""),
      lastName: String(fd.get("lastName") || ""),
      email: String(fd.get("email") || ""),
      mcs: String(fd.get("mcs") || ""),
    };
    const result = formSchema.safeParse(data);
    if (!result.success) {
      toast({
        title: "Please check the form",
        description: result.error.issues[0]?.message ?? "Invalid input",
        variant: "destructive",
      });
      return;
    }
    setSubmitting(true);
    // Simulate submission - wire up to backend / email when ready.
    setTimeout(() => {
      setSubmitting(false);
      setSubmitted(true);
      toast({ title: "Application received", description: "We'll be in touch within one UK business day." });
    }, 600);
  };

  return (
    <SiteLayout>
      <PageHero
        eyebrow="Partners"
        title={
          <>
            Become a <span className="text-gradient">CEG Accredited</span> Installer.
          </>
        }
        lead="Join the Clean Energy Gurus partner network. MCS-certified installers get a steady flow of qualified solar, battery and EV jobs - with surveys, materials and paperwork handled for you."
        cta={false}
      />

      {/* Accreditation */}
      <section className="py-20 lg:py-24">
        <div className="container-tight grid lg:grid-cols-12 gap-12 items-start">
          <div className="lg:col-span-7">
            <span className="eyebrow"><span className="h-1.5 w-1.5 rounded-full bg-electric" />Accreditation</span>
            <h2 className="mt-3 text-3xl lg:text-4xl font-display font-semibold text-navy">CEG Accredited Engineers</h2>
            <p className="mt-4 text-navy-soft leading-relaxed max-w-xl">
              Every partner goes through a rigorous review before their first job and is continually assessed against the
              standards we set at Clean Energy Gurus.
            </p>
            <div className="mt-8 space-y-5">
              {accreditations.map(({ icon: Icon, title, body }) => (
                <div key={title} className="flex gap-4 pb-5 border-b border-border last:border-0">
                  <div className="h-11 w-11 shrink-0 rounded-xl bg-accent grid place-items-center text-electric">
                    <Icon className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="font-semibold text-navy">{title}</div>
                    <p className="text-sm text-muted-foreground mt-1 leading-relaxed">{body}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="lg:col-span-5">
            <div className="aspect-square rounded-3xl bg-gradient-electric grid place-items-center shadow-elegant text-white p-10 text-center">
              <div>
                <div className="mx-auto h-20 w-20 rounded-full bg-white/15 grid place-items-center backdrop-blur">
                  <CheckCircle2 className="h-10 w-10" />
                </div>
                <div className="mt-6 text-4xl sm:text-5xl font-display font-semibold tracking-tight">CEG</div>
                <div className="mt-1 text-xl font-semibold tracking-[0.25em]">ACCREDITED</div>
                <p className="mt-4 text-sm text-white/80">Trusted partner network - UK wide.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Installation services */}
      <section className="py-20 lg:py-24 bg-surface">
        <div className="container-tight grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <span className="eyebrow"><span className="h-1.5 w-1.5 rounded-full bg-electric" />Installation services</span>
            <h2 className="mt-3 text-3xl lg:text-4xl font-display font-semibold text-navy">
              Install solar, batteries, EV chargers and monitoring across the UK.
            </h2>
            <p className="mt-4 text-navy-soft leading-relaxed">
              We're looking for qualified MCS solar installers, battery specialists and EV electricians ready to work
              smarter, not harder. Add your skills and coverage, set your availability, and let the jobs find you.
            </p>
            <p className="mt-3 text-navy-soft leading-relaxed">
              Partner installs cover homes, landlords, farms and commercial sites - all surveyed, designed and customer-approved before they reach you.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {services.map(({ icon: Icon, label }) => (
              <div key={label} className="card-premium p-6 text-center">
                <div className="mx-auto h-12 w-12 rounded-xl bg-accent grid place-items-center text-electric">
                  <Icon className="h-6 w-6" />
                </div>
                <div className="mt-4 font-semibold text-navy">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-20 lg:py-24">
        <div className="container-tight">
          <div className="max-w-2xl">
            <span className="eyebrow"><span className="h-1.5 w-1.5 rounded-full bg-electric" />Why partner with CEG</span>
            <h2 className="mt-3 text-3xl lg:text-4xl font-display font-semibold text-navy">
              Why your business is better working with us
            </h2>
          </div>
          <div className="mt-12 grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {benefits.map(({ icon: Icon, title, body }) => (
              <div key={title} className="card-premium p-6">
                <div className="h-11 w-11 rounded-xl bg-accent grid place-items-center text-electric">
                  <Icon className="h-5 w-5" />
                </div>
                <div className="mt-4 font-semibold text-navy">{title}</div>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Expectations */}
      <section className="py-20 lg:py-24 bg-navy text-white relative overflow-hidden">
        <div className="absolute inset-0 grid-bg opacity-10" />
        <div className="absolute -top-32 -left-32 h-[400px] w-[400px] bg-gradient-electric opacity-25 blur-3xl rounded-full" />
        <div className="container-tight relative grid lg:grid-cols-12 gap-12">
          <div className="lg:col-span-5">
            <span className="eyebrow text-white/70"><span className="h-1.5 w-1.5 rounded-full bg-electric" />Expectations</span>
            <h2 className="mt-3 text-3xl lg:text-4xl font-display font-semibold text-white">
              What we expect from CEG partners
            </h2>
            <p className="mt-4 text-white/75 leading-relaxed">
              Excellent customer service is our highest priority. Partners are expected to reflect those standards in
              both their communication with the customer and the quality of the install.
            </p>
          </div>
          <ul className="lg:col-span-7 space-y-4">
            {expectations.map((e) => (
              <li key={e} className="flex gap-3 rounded-2xl bg-white/[0.06] border border-white/10 p-5 backdrop-blur">
                <CheckCircle2 className="h-5 w-5 text-electric shrink-0 mt-0.5" />
                <span className="text-white/90 text-[15px] leading-relaxed">{e}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Next steps + form */}
      <section id="apply" className="py-20 lg:py-28">
        <div className="container-tight grid lg:grid-cols-12 gap-12">
          <div className="lg:col-span-5">
            <span className="eyebrow"><span className="h-1.5 w-1.5 rounded-full bg-electric" />Next steps</span>
            <h2 className="mt-3 text-3xl lg:text-4xl font-display font-semibold text-navy">
              How to become a CEG partner
            </h2>
            <p className="mt-4 text-navy-soft leading-relaxed">
              Sign up below and our partner team will guide you through verification and onboarding.
            </p>
            <ol className="mt-8 space-y-5">
              {steps.map((s) => (
                <li key={s.n} className="flex gap-4">
                  <div className="h-10 w-10 shrink-0 rounded-full bg-gradient-electric text-white grid place-items-center text-sm font-semibold">
                    {s.n}
                  </div>
                  <div>
                    <div className="font-semibold text-navy">{s.t}</div>
                    <p className="text-sm text-muted-foreground mt-1 leading-relaxed">{s.b}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>

          <div className="lg:col-span-7">
            <div className="card-premium p-7 sm:p-10">
              {submitted ? (
                <div className="text-center py-10">
                  <div className="mx-auto h-14 w-14 rounded-full bg-accent grid place-items-center text-electric">
                    <CheckCircle2 className="h-7 w-7" />
                  </div>
                  <h3 className="mt-5 text-2xl font-display font-semibold text-navy">Application received</h3>
                  <p className="mt-3 text-muted-foreground max-w-sm mx-auto">
                    Thanks for applying to become a CEG Accredited installer. We'll review your details and be in touch
                    within one UK business day.
                  </p>
                </div>
              ) : (
                <>
                  <h3 className="text-2xl font-display font-semibold text-navy">Partner sign-up</h3>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Fields marked with * are required. We'll only use these details to process your application.
                  </p>
                  <form onSubmit={onSubmit} className="mt-6 space-y-4">
                    <div>
                      <Label htmlFor="company">Company name (optional)</Label>
                      <Input id="company" name="company" maxLength={120} className="mt-1.5" />
                    </div>
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="firstName">First name *</Label>
                        <Input id="firstName" name="firstName" required maxLength={60} className="mt-1.5" />
                      </div>
                      <div>
                        <Label htmlFor="lastName">Last name *</Label>
                        <Input id="lastName" name="lastName" required maxLength={60} className="mt-1.5" />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="email">Email address *</Label>
                      <Input id="email" name="email" type="email" required maxLength={255} className="mt-1.5" />
                    </div>
                    <div>
                      <Label htmlFor="mcs">MCS number *</Label>
                      <Input id="mcs" name="mcs" required maxLength={40} placeholder="e.g. MCS-12345" className="mt-1.5" />
                      <p className="mt-1.5 text-xs text-muted-foreground">
                        Your Microgeneration Certification Scheme registration number.
                      </p>
                    </div>
                    <Button
                      type="submit"
                      disabled={submitting}
                      className="w-full h-12 rounded-full bg-gradient-electric text-white border-0 shadow-glow"
                    >
                      {submitting ? "Submitting..." : "Apply to become a CEG partner"}
                      <ArrowRight className="ml-1.5 h-4 w-4" />
                    </Button>
                    <p className="text-[11px] text-muted-foreground leading-relaxed">
                      By submitting you agree to be contacted by Clean Energy Gurus about your partner application.
                    </p>
                  </form>
                </>
              )}
            </div>
          </div>
        </div>
      </section>
    </SiteLayout>
  );
};

export default Partners;
