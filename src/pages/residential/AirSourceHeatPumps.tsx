import { Link } from "react-router-dom";
import { ArrowRight, CheckCircle2, Thermometer, Sun, BatteryCharging, Home, ClipboardCheck, Handshake } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SiteLayout } from "@/components/site/SiteLayout";
import { PageHero } from "@/components/site/PageHero";
import { FinalCTA } from "@/components/site/FinalCTA";
import { useEffect } from "react";

const cards = [
  { icon: Thermometer, title: "What they are", body: "Air source heat pumps extract heat from the outside air and use it to warm your home and hot water — running on electricity rather than gas or oil." },
  { icon: Home, title: "Why homeowners consider them", body: "As part of a wider plan to move away from fossil-fuel heating, reduce reliance on volatile gas prices and align heating with a lower-carbon electricity grid." },
  { icon: Sun, title: "Works with solar & battery", body: "Where the property supports it, a heat pump can be tuned to run on self-consumed solar or cheap off-peak windows via a smart tariff and battery." },
  { icon: BatteryCharging, title: "Smart tariff compatibility", body: "Time-of-use tariffs and battery storage can shift heating and hot water demand into lower-cost periods where the system is designed for it." },
  { icon: ClipboardCheck, title: "Property suitability matters", body: "Fabric, insulation, radiators, hot water demand and electrical capacity are all assessed. A heat pump is only recommended where the property is genuinely suitable." },
  { icon: Handshake, title: "Trusted installation partners", body: "Delivered through CEG accredited, MCS-registered heat pump partners after a proper survey and design — never a one-size-fits-all quote." },
];

const AirSourceHeatPumps = () => {
  useEffect(() => {
    document.title = "Air Source Heat Pumps for UK Homes | Clean Energy Gurus";
    const m = document.querySelector('meta[name="description"]') as HTMLMetaElement;
    if (m) m.content = "Air source heat pumps as part of a wider home energy plan — delivered through accredited partners after survey, design and property suitability review.";
  }, []);

  return (
    <SiteLayout>
      <PageHero
        eyebrow="Air Source Heat Pumps"
        title={<>Low carbon heating, <span className="text-gradient">designed into your whole home plan</span>.</>}
        lead="Air source heat pumps can play an important role in a home energy improvement plan — but only where the property, heating system and electrical setup are right for it."
      />

      <section className="py-20 lg:py-24">
        <div className="container-tight">
          <div className="max-w-2xl mb-10">
            <span className="eyebrow"><span className="h-1.5 w-1.5 rounded-full bg-electric" />Partner-supported</span>
            <h2 className="mt-3 text-3xl lg:text-4xl font-display font-semibold text-navy">
              A heat pump is a system decision, not a product purchase.
            </h2>
            <p className="mt-4 text-navy-soft leading-relaxed">
              We look at heating in the context of the whole home — insulation, solar PV, battery storage, hot water use and the electricity tariff you're on — before recommending a heat pump. Where it's the right fit, we coordinate the specialist installation partner and integrate it into your ongoing energy plan.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {cards.map(({ icon: Icon, title, body }) => (
              <div key={title} className="card-premium p-6">
                <div className="h-11 w-11 rounded-xl bg-gradient-electric grid place-items-center text-white shadow-glow">
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="mt-4 text-lg font-display font-semibold text-navy">{title}</h3>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-surface">
        <div className="container-tight grid lg:grid-cols-2 gap-10">
          <div className="card-premium p-7">
            <h3 className="text-lg font-display font-semibold text-navy">What we look at on survey</h3>
            <ul className="mt-5 space-y-3">
              {[
                "Heat loss and fabric performance",
                "Existing radiators, pipework and hot water cylinder",
                "Electrical capacity and consumer unit",
                "Space for the outdoor unit and hot water storage",
                "How solar PV, battery and tariff can support running costs",
                "Whether a heat pump is genuinely the right recommendation",
              ].map((b) => (
                <li key={b} className="flex gap-3 text-navy">
                  <CheckCircle2 className="h-5 w-5 text-electric flex-shrink-0 mt-0.5" />
                  <span className="text-[15px]">{b}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="card-premium p-7">
            <h3 className="text-lg font-display font-semibold text-navy">Honest guidance, not a hard sell</h3>
            <p className="mt-3 text-sm text-navy leading-relaxed">
              Heat pumps aren't right for every home. Sometimes the better first step is insulation, controls or a solar and battery upgrade. Where a heat pump does make sense, suitability, performance and any grant eligibility are always confirmed on a case-by-case basis, subject to survey and current scheme availability.
            </p>
            <div className="mt-6">
              <Link to="/contact?type=residential">
                <Button className="rounded-full h-12 px-6 bg-gradient-electric text-white border-0 shadow-glow">
                  Start Your Energy Review <ArrowRight className="ml-1.5 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <FinalCTA />
    </SiteLayout>
  );
};

export default AirSourceHeatPumps;
