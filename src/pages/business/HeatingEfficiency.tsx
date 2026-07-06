import { Link } from "react-router-dom";
import { ArrowRight, Thermometer, Gauge, LineChart, Layers, Handshake, Building2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SiteLayout } from "@/components/site/SiteLayout";
import { PageHero } from "@/components/site/PageHero";
import { FinalCTA } from "@/components/site/FinalCTA";
import { useEffect } from "react";

const cards = [
  { icon: Thermometer, title: "Air source heat pumps", body: "For suitable commercial premises, air source heat pumps can form part of a lower-carbon heating strategy — delivered through accredited partners after proper survey and design." },
  { icon: Gauge, title: "Heating efficiency", body: "Controls, zoning, flow temperatures and hot water strategy — practical improvements that reduce demand before adding new hardware." },
  { icon: LineChart, title: "Energy cost control", body: "Bringing heating into the same view as electricity, solar generation and tariffs so total energy spend can be understood and managed together." },
  { icon: Layers, title: "Wider clean energy planning", body: "Heating decisions are considered alongside solar PV, battery storage, EV charging and monitoring — as one coordinated plan for the site." },
  { icon: Handshake, title: "Partner-supported delivery", body: "Specialist installation is delivered through CEG accredited heating and HVAC partners. Suitability and any grant eligibility are subject to survey and current scheme availability." },
  { icon: Building2, title: "Property suitability first", body: "Fabric, use pattern, occupancy, existing heating system and electrical capacity all inform whether a heat pump or a different route is the right recommendation." },
];

const HeatingEfficiency = () => {
  useEffect(() => {
    document.title = "Business Heating & Efficiency | Clean Energy Gurus";
    const m = document.querySelector('meta[name="description"]') as HTMLMetaElement;
    if (m) m.content = "Heating and efficiency planning for UK business premises — including partner-supported air source heat pumps, alongside solar, battery and tariff strategy.";
  }, []);

  return (
    <SiteLayout>
      <PageHero
        eyebrow="Heating & Efficiency"
        title={<>Heating brought into your <span className="text-gradient">wider energy plan</span>.</>}
        lead="For many commercial sites, heating is one of the largest energy costs — and one of the last things reviewed. We help bring it into the same view as generation, storage and tariff."
      />

      <section className="py-20 lg:py-24">
        <div className="container-tight">
          <div className="max-w-2xl mb-10">
            <span className="eyebrow"><span className="h-1.5 w-1.5 rounded-full bg-electric" />Partner-supported</span>
            <h2 className="mt-3 text-3xl lg:text-4xl font-display font-semibold text-navy">
              A practical, joined-up approach.
            </h2>
            <p className="mt-4 text-navy-soft leading-relaxed">
              We work with business owners and property teams to look at heating and efficiency alongside the rest of their energy setup — and coordinate specialist partners where a heat pump or wider upgrade is the right fit.
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

          <div className="mt-12">
            <Link to="/energy-iq">
              <Button className="rounded-full h-12 px-6 bg-gradient-electric text-white border-0 shadow-glow">
                Get Your Energy IQ <ArrowRight className="ml-1.5 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <FinalCTA />
    </SiteLayout>
  );
};

export default HeatingEfficiency;
