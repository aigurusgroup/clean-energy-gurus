import { SiteLayout } from "@/components/site/SiteLayout";
import { PageHero } from "@/components/site/PageHero";
import { SolarCalculator } from "@/components/site/SolarCalculator";
import { SolarFundingOptions } from "@/components/site/SolarFundingOptions";
import { Mail, Phone, MapPin } from "lucide-react";

const Contact = () => {
  return (
    <SiteLayout>
      <PageHero
        eyebrow="Contact"
        title={<>Start with a <span className="text-gradient">free energy review</span>.</>}
        lead="Find your property, outline your roof and book a callback — we'll respond within one UK business day."
        cta={false}
      />

      <SolarCalculator segment="home" selectable hideHeading className="bg-surface pt-0 pb-10" />

      <section className="pb-24">
        <div className="container-tight grid lg:grid-cols-3 gap-5">
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
        </div>
      </section>
    </SiteLayout>
  );
};

export default Contact;
