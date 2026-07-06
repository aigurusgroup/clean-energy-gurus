import { useEffect } from "react";
import { Link } from "react-router-dom";
import {
  ShieldCheck, BadgeCheck, Award, Sun, Battery, Zap, Gauge,
  PoundSterling, CalendarClock, PackageCheck, FileText, Headphones, Receipt,
  CheckCircle2, ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { SiteLayout } from "@/components/site/SiteLayout";
import { PageHero } from "@/components/site/PageHero";
import { FinalCTA } from "@/components/site/FinalCTA";

const accreditations = [
  { icon: ShieldCheck, title: "MCS certified", body: "All partner installers hold valid MCS certification for the technologies they fit, so customers qualify for grants and export tariffs." },
  { icon: BadgeCheck, title: "Identity & insurance verified", body: "We verify company details, public liability insurance and engineer ID before any job is allocated." },
  { icon: Award, title: "Continuous quality review", body: "Workmanship is audited on every install. CEG Accredited status is maintained through ongoing customer feedback and site checks." },
];

const partnerServices = [
  { icon: Sun, label: "Solar PV" },
  { icon: Battery, label: "Battery storage" },
  { icon: Zap, label: "EV charging" },
  { icon: Gauge, label: "Monitoring & optimisation" },
];

const partnerBenefits = [
  { icon: PoundSterling, title: "Get paid quickly", body: "Jobs are audited and approved by our technical team, with payment typically issued within one week of sign-off." },
  { icon: CalendarClock, title: "Choose when and where you work", body: "Set your availability and coverage area in the partner portal. We allocate jobs that match your skills and calendar." },
  { icon: PackageCheck, title: "Materials delivered to site", body: "Skip the merchants. Panels, inverters, batteries and cabling are picked, packed and delivered ready for install day." },
  { icon: FileText, title: "Less paperwork", body: "Surveys, designs, DNO and grant applications are handled by our central team so you can focus on the install." },
  { icon: Headphones, title: "Expert support on hand", body: "Technical and customer support teams back you up before, during and after every job." },
  { icon: Receipt, title: "Automated invoicing", body: "Once a job is signed off, your invoice is generated automatically and queued for the next payment run." },
];

const partnerExpectations = [
  "Deliver excellent customer service in line with the CEG brand promise.",
  "Hold and maintain valid MCS, NICEIC/NAPIT and relevant manufacturer accreditations.",
  "Follow PAS 2030 / PAS 2035 and MCS best-practice guidelines on every install.",
  "Complete handover paperwork, photos and commissioning data via the partner portal within 48 hours of sign-off.",
  "Respond to customer aftercare requests within one UK business day.",
];

const PartnerNetwork = () => {
  useEffect(() => {
    document.title = "Partner Network | Clean Energy Gurus";
    const m = document.querySelector('meta[name="description"]') as HTMLMetaElement;
    if (m) m.content = "The Clean Energy Gurus Partner Network — MCS, OZEV and manufacturer-accredited installers delivering solar, battery and EV projects across the UK.";
  }, []);

  return (
    <SiteLayout>
      <PageHero
        eyebrow="Partner Network"
        title={<>Working with <span className="text-gradient">trusted installers</span>.</>}
        lead="A UK-wide network of MCS, OZEV and manufacturer-accredited installation partners — continually assessed against our quality standards."
      />

      {/* Accreditation */}
      <section className="py-20 lg:py-24">
        <div className="container-tight grid lg:grid-cols-12 gap-12 items-start">
          <div className="lg:col-span-7">
            <span className="eyebrow"><span className="h-1.5 w-1.5 rounded-full bg-electric" />Accreditation</span>
            <h2 className="mt-3 text-3xl lg:text-4xl font-display font-semibold text-navy">CEG Accredited Engineers</h2>
            <p className="mt-4 text-navy-soft leading-relaxed max-w-xl">
              Every partner goes through a rigorous review before their first job and is continually assessed against the standards we set at Clean Energy Gurus.
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
                <p className="mt-4 text-sm text-white/80">Trusted partner network — UK wide.</p>
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
              We're always looking for qualified MCS solar installers, battery specialists and EV electricians who want to work smarter, not harder. Add your skills and coverage, set your availability, and let the jobs find you.
            </p>
            <p className="mt-3 text-navy-soft leading-relaxed">
              Partner installs cover homes, landlords, farms and commercial sites — all surveyed, designed and customer-approved before they reach you.
            </p>
            <p className="mt-3 text-navy-soft leading-relaxed">
              Through our trusted partner network, Clean Energy Gurus can also support wider clean energy and efficiency upgrades such as air source heat pumps, HVAC and other specialist technologies.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {partnerServices.map(({ icon: Icon, label }) => (
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
            {partnerBenefits.map(({ icon: Icon, title, body }) => (
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
              Excellent customer service is our highest priority. Partners are expected to reflect those standards in both their communication with the customer and the quality of the install.
            </p>
          </div>
          <ul className="lg:col-span-7 space-y-4">
            {partnerExpectations.map((e) => (
              <li key={e} className="flex gap-3 rounded-2xl bg-white/[0.06] border border-white/10 p-5 backdrop-blur">
                <CheckCircle2 className="h-5 w-5 text-electric shrink-0 mt-0.5" />
                <span className="text-white/90 text-[15px] leading-relaxed">{e}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* CTA to application */}
      <section className="py-20">
        <div className="container-tight text-center max-w-2xl mx-auto">
          <h2 className="text-3xl font-display font-semibold text-navy">Ready to join the network?</h2>
          <p className="mt-4 text-navy-soft leading-relaxed">
            If you're an MCS-certified installer and want a steady flow of qualified jobs, apply to become a CEG Accredited partner.
          </p>
          <div className="mt-8">
            <Link to="/partners">
              <Button className="rounded-full h-12 px-6 bg-gradient-electric text-white border-0 shadow-glow">
                Become an Installer Partner <ArrowRight className="ml-1.5 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <FinalCTA />
    </SiteLayout>
  );
};

export default PartnerNetwork;
