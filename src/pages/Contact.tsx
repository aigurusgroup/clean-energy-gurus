import { useSearchParams } from "react-router-dom";
import { SiteLayout } from "@/components/site/SiteLayout";
import { PageHero } from "@/components/site/PageHero";
import { ReviewForm, type SolarEstimate } from "@/components/site/ReviewForm";
import { SolarCalculator } from "@/components/site/SolarCalculator";
import { Mail, Phone, MapPin } from "lucide-react";

const segmentToCustomerType: Record<string, string> = {
  business: "Business",
  farm: "Farm / Agriculture",
  landlord: "Landlord / Property Portfolio",
  home: "Homeowner",
};

const buildingToPropertyType: Record<string, string> = {
  "Warehouse": "Warehouse / Industrial",
  "Factory / Industrial": "Warehouse / Industrial",
  "Office": "Office",
  "Retail": "Retail / Hospitality",
  "Hospitality": "Retail / Hospitality",
  "Accommodation": "Mixed-use",
  "Ground mounted": "Other",
  "Barn": "Farm / Agricultural",
  "Storage shed": "Farm / Agricultural",
  "Livestock building": "Farm / Agricultural",
  "Glasshouse": "Farm / Agricultural",
  "Farmhouse": "Farm / Agricultural",
  "HMO": "Block / Flats",
  "Apartment block": "Block / Flats",
  "Single let": "Detached / Large home",
  "Mixed-use": "Mixed-use",
  "Holiday let": "Mixed-use",
  "Detached": "Detached / Large home",
  "Semi-detached": "Detached / Large home",
  "Terrace": "Detached / Large home",
  "Bungalow": "Detached / Large home",
  "Flat": "Block / Flats",
  "Other": "Other",
};

const Contact = () => {
  const [params] = useSearchParams();

  const segment = params.get("type") ?? "";
  const building = params.get("building") ?? "";
  const area = Number(params.get("area") || 0);

  const estimate: SolarEstimate | undefined = area > 0 ? {
    address: params.get("address") ?? "",
    postcode: params.get("postcode") ?? "",
    area,
    kWp: Number(params.get("kwp") || 0),
    annualKwh: Number(params.get("kwh") || 0),
    annualSaving: Number(params.get("saving") || 0),
    systemCost: Number(params.get("cost") || 0),
    payback: Number(params.get("payback") || 0),
    roof: params.get("roof") ?? "",
    building,
  } : undefined;

  const prefill = {
    customerType: segmentToCustomerType[segment] ?? "",
    postcode: estimate?.postcode ?? "",
    propertyType: buildingToPropertyType[building] ?? "",
    interests: estimate ? ["Solar PV"] : [],
  };

  return (
    <SiteLayout>
      <PageHero
        eyebrow="Contact"
        title={<>Start with a <span className="text-gradient">free energy review</span>.</>}
        lead="Tell us about your property. We'll respond within one business day and outline the next steps — no obligation, no sales pressure."
        cta={false}
      />
      {!estimate && <SolarCalculator segment="home" selectable hideHeading className="bg-surface pt-0 pb-10" />}
      <section className="pb-24">
        <div className="container-tight grid lg:grid-cols-5 gap-10">
          <div className="lg:col-span-3 card-premium p-8 sm:p-10">
            <h2 className="text-2xl font-display font-semibold text-navy">Free Energy Review</h2>
            <p className="mt-2 text-muted-foreground">It takes about a minute.</p>
            <div className="mt-8"><ReviewForm prefill={prefill} estimate={estimate} /></div>
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
};

export default Contact;
