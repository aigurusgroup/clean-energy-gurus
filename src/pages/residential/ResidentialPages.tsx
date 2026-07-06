import { LayoutGrid, Plug, ClipboardCheck, CheckCircle2, Sun, BatteryCharging, Layers, Thermometer, ArrowRight } from "lucide-react";
import { useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { HubPage } from "@/components/site/HubPage";
import { SiteLayout } from "@/components/site/SiteLayout";
import { PageHero } from "@/components/site/PageHero";
import { FinalCTA } from "@/components/site/FinalCTA";

const HeatPumpSection = () => (
  <section className="py-20 lg:py-24 bg-surface">
    <div className="container-tight grid lg:grid-cols-12 gap-12 items-start">
      <div className="lg:col-span-7">
        <span className="eyebrow"><span className="h-1.5 w-1.5 rounded-full bg-electric" />Partner-supported</span>
        <h2 className="mt-3 text-3xl lg:text-4xl font-display font-semibold text-navy">Air Source Heat Pumps</h2>
        <p className="mt-4 text-navy-soft leading-relaxed max-w-xl">
          Air source heat pumps can form part of a wider home energy improvement plan — alongside insulation, solar PV, battery storage and a smart tariff — where the property is suitable.
        </p>
        <p className="mt-3 text-navy-soft leading-relaxed max-w-xl">
          Delivered through our accredited partner network, a heat pump is only recommended after a proper survey of your heating system, hot water use, insulation and electrical capacity. Suitability, performance and any grant eligibility are always confirmed on a case-by-case basis.
        </p>
        <ul className="mt-6 space-y-3">
          {[
            "Works well alongside solar PV, battery storage and time-of-use tariffs",
            "Assessed against your property fabric, radiators and hot water demand",
            "Installed through MCS-accredited heat pump partners",
            "Subject to survey, property suitability and current scheme availability",
          ].map((b) => (
            <li key={b} className="flex gap-3 text-navy">
              <CheckCircle2 className="h-5 w-5 text-electric flex-shrink-0 mt-0.5" />
              <span className="text-[15px]">{b}</span>
            </li>
          ))}
        </ul>
        <div className="mt-8">
          <Link to="/energy-iq">
            <Button className="rounded-full h-12 px-6 bg-gradient-electric text-white border-0 shadow-glow">
              Get Your Energy IQ <ArrowRight className="ml-1.5 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>
      <div className="lg:col-span-5">
        <div className="card-premium p-8">
          <div className="h-12 w-12 rounded-xl bg-gradient-electric grid place-items-center text-white shadow-glow">
            <Thermometer className="h-6 w-6" />
          </div>
          <h3 className="mt-5 text-lg font-display font-semibold text-navy">Part of a whole-home plan</h3>
          <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
            We look at your home as a system — generation, storage, heating and tariff — not a stack of separate products. Where a heat pump is the right fit, we coordinate the installer partner and integrate it into your ongoing energy plan.
          </p>
        </div>
      </div>
    </div>
  </section>
);

export const ResidentialHub = () => (
  <HubPage
    metaTitle="Residential Energy | Clean Energy Gurus"
    metaDesc="Solar, battery storage, EV charging and ongoing optimisation for UK homes — with partner-supported air source heat pumps."
    eyebrow="Residential"
    heroTitle={<>Home energy, <span className="text-gradient">designed and managed</span> for you.</>}
    lead="Solar, batteries, EV charging and long-term monitoring — one team taking care of your home energy position."
    sectionTitle="Residential solutions"
    items={[
      { title: "Solar & Battery", desc: "Rooftop solar and matched storage, tuned to your tariff and load.", to: "/residential/solar-battery", icon: LayoutGrid },
      { title: "EV Charging", desc: "OZEV partner-led home chargers, solar-aware by default.", to: "/residential/ev-charging", icon: Plug },
      { title: "Residential Energy Review", desc: "A clear read of your home's energy position — free.", to: "/contact?type=residential", icon: ClipboardCheck },
    ]}
    extra={<HeatPumpSection />}
  />
);

const useMeta = (title: string, desc: string) => {
  useEffect(() => {
    document.title = title;
    const meta = document.querySelector('meta[name="description"]') || (() => {
      const m = document.createElement("meta"); m.setAttribute("name", "description"); document.head.appendChild(m); return m;
    })();
    meta.setAttribute("content", desc);
  }, [title, desc]);
};

const BulletList = ({ items }: { items: string[] }) => (
  <ul className="mt-6 space-y-3.5">
    {items.map((b) => (
      <li key={b} className="flex gap-3 text-navy">
        <CheckCircle2 className="h-5 w-5 text-electric flex-shrink-0 mt-0.5" />
        <span className="text-[15px]">{b}</span>
      </li>
    ))}
  </ul>
);

export const ResidentialSolarBattery = () => {
  useMeta(
    "Solar & Battery for Homes | Clean Energy Gurus",
    "Home solar PV, battery storage and integrated solar + battery systems — sized to your load, tariff and how you actually live."
  );
  return (
    <SiteLayout>
      <PageHero
        eyebrow="Solar & Battery"
        title={<>Solar and batteries, <span className="text-gradient">designed as one system</span>.</>}
        lead="The complete home package — panels, storage, smart dispatch and tariff optimisation from day one. Choose solar, choose storage, or take both as a single integrated system."
      />

      <section className="py-20 lg:py-24">
        <div className="container-tight grid lg:grid-cols-3 gap-8">
          <div className="card-premium p-7">
            <div className="h-11 w-11 rounded-xl bg-gradient-electric grid place-items-center text-white shadow-glow"><Sun className="h-5 w-5" /></div>
            <h3 className="mt-5 text-xl font-display font-semibold text-navy">Solar PV</h3>
            <p className="mt-2 text-sm text-muted-foreground leading-relaxed">Design-led rooftop solar sized to your actual consumption profile, installed by accredited MCS partners.</p>
            <BulletList items={["Site survey and yield modelling", "Tier-1 panels and inverters", "Roof, ground-mount and carport options", "DNO and metering coordination", "25-year performance horizon"]} />
          </div>
          <div className="card-premium p-7">
            <div className="h-11 w-11 rounded-xl bg-gradient-electric grid place-items-center text-white shadow-glow"><BatteryCharging className="h-5 w-5" /></div>
            <h3 className="mt-5 text-xl font-display font-semibold text-navy">Battery Storage</h3>
            <p className="mt-2 text-sm text-muted-foreground leading-relaxed">Capture surplus solar, time-shift load to the cheapest hours, and earn from export at peak windows.</p>
            <BulletList items={["AC and DC-coupled architectures", "Sized to load and tariff profile", "Smart dispatch via Gurus Optimise™", "Backup power for critical loads", "Warranty-backed cycles"]} />
          </div>
          <div className="card-premium p-7">
            <div className="h-11 w-11 rounded-xl bg-gradient-electric grid place-items-center text-white shadow-glow"><Layers className="h-5 w-5" /></div>
            <h3 className="mt-5 text-xl font-display font-semibold text-navy">Solar + Battery Together</h3>
            <p className="mt-2 text-sm text-muted-foreground leading-relaxed">One system, not two products — sized together to consistently outperform devices bought separately.</p>
            <BulletList items={["Solar and battery sized as one system", "Smart dispatch: self-consume, shift, export", "Single monitoring app and dashboard", "Long-term tariff review and optimisation", "One team, one point of accountability"]} />
          </div>
        </div>
      </section>

      <section className="py-16 bg-surface">
        <div className="container-tight grid lg:grid-cols-2 gap-10">
          <div className="card-premium p-7">
            <h3 className="text-lg font-display font-semibold text-navy">Benefits for your home</h3>
            <BulletList items={["Lower running costs from day one", "Protection against tariff price shocks", "Cleaner, lower-carbon energy", "Solar-aware EV charging when combined", "Resilience during outages (with battery backup)", "Long-term asset value on your property"]} />
          </div>
          <div className="card-premium p-7">
            <h3 className="text-lg font-display font-semibold text-navy">When each option makes sense</h3>
            <div className="mt-4 space-y-4 text-sm text-navy leading-relaxed">
              <p><strong>Solar only</strong> — best for homes with high daytime consumption (home working, heat pumps, pools) where surplus is naturally self-consumed.</p>
              <p><strong>Battery only</strong> — best for homes on a smart tariff wanting to charge from cheap off-peak windows, or as a retrofit to an existing solar system.</p>
              <p><strong>Solar + battery together</strong> — best for most UK homes: captures midday generation, powers evenings, and unlocks export revenue at peak windows.</p>
            </div>
          </div>
        </div>
      </section>

      <FinalCTA />
    </SiteLayout>
  );
};
