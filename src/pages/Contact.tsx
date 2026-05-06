import { SiteLayout } from "@/components/site/SiteLayout";
import { PageHero } from "@/components/site/PageHero";
import { ReviewForm } from "@/components/site/ReviewForm";
import { Mail, Phone, MapPin } from "lucide-react";

const Contact = () => (
  <SiteLayout>
    <PageHero
      eyebrow="Contact"
      title={<>Start with a <span className="text-gradient">free energy review</span>.</>}
      lead="Tell us about your property. We'll respond within one business day and outline the next steps — no obligation, no sales pressure."
      cta={false}
    />
    <section className="pb-24">
      <div className="container-tight grid lg:grid-cols-5 gap-10">
        <div className="lg:col-span-3 card-premium p-8 sm:p-10">
          <h2 className="text-2xl font-display font-semibold text-navy">Free Energy Review</h2>
          <p className="mt-2 text-muted-foreground">It takes about a minute.</p>
          <div className="mt-8"><ReviewForm /></div>
        </div>
        <div className="lg:col-span-2 space-y-5">
          {[
            { icon: Mail, t: "Email", d: "hello@cleanenergygurus.co.uk" },
            { icon: Phone, t: "Phone", d: "0800 000 0000" },
            { icon: MapPin, t: "Office", d: "United Kingdom — nationwide delivery" },
          ].map(({ icon: Icon, t, d }) => (
            <div key={t} className="card-premium p-6 flex gap-4 items-start">
              <div className="h-11 w-11 rounded-xl bg-accent grid place-items-center text-electric">
                <Icon className="h-5 w-5" />
              </div>
              <div>
                <div className="text-sm font-semibold text-navy">{t}</div>
                <div className="text-sm text-muted-foreground mt-0.5">{d}</div>
              </div>
            </div>
          ))}
          <div className="rounded-2xl bg-navy text-white p-6">
            <div className="text-xs font-semibold uppercase tracking-[0.18em] text-electric">Response time</div>
            <p className="mt-2 text-white/85 text-sm leading-relaxed">We respond within one UK business day. Urgent commercial enquiries are prioritised.</p>
          </div>
        </div>
      </div>
    </section>
  </SiteLayout>
);

export default Contact;
