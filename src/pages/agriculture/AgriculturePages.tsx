import { LayoutGrid, ShieldCheck, ClipboardCheck, CheckCircle2, Sun, BatteryCharging, Layers } from "lucide-react";
import { useEffect } from "react";
import { HubPage } from "@/components/site/HubPage";
import { SimplePage } from "@/components/site/SimplePage";
import { SiteLayout } from "@/components/site/SiteLayout";
import { PageHero } from "@/components/site/PageHero";
import { FinalCTA } from "@/components/site/FinalCTA";

export const AgricultureHub = () => (
  <HubPage
    metaTitle="Agricultural Energy | Clean Energy Gurus"
    metaDesc="Solar, battery storage and resilience solutions for UK farms and rural businesses."
    eyebrow="Agriculture"
    heroTitle={<>Energy independence for <span className="text-gradient">working farms</span>.</>}
    lead="Use your roofs, land and high daytime load to build a resilient, low-cost, revenue-generating farm energy system."
    sectionTitle="Agricultural solutions"
    items={[
      { title: "Farm Solar & Battery", desc: "Rooftop, ground-mount and storage — designed together.", to: "/agriculture/solar", icon: LayoutGrid },
      { title: "Farm Energy Resilience", desc: "Keep critical loads running through grid outages.", to: "/agriculture/resilience", icon: ShieldCheck },
      { title: "Farm Energy Review", desc: "A clear read of your farm's energy position — free.", to: "/contact?type=agriculture", icon: ClipboardCheck },
    ]}
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

export const FarmSolar = () => {
  useMeta(
    "Farm Solar & Battery UK | Clean Energy Gurus",
    "Farm-grade solar PV and battery storage for UK agricultural sites — rooftop, ground-mount, resilience and practical daily use cases."
  );
  return (
    <SiteLayout>
      <PageHero
        eyebrow="Farm Solar & Battery"
        title={<>Farm solar and storage built for <span className="text-gradient">real daytime load</span>.</>}
        lead="Barn roofs, unproductive land and machinery sheds turned into long-term energy assets — with battery storage to power the night, protect critical systems and unlock export revenue."
      />

      <section className="py-20 lg:py-24">
        <div className="container-tight grid lg:grid-cols-3 gap-8">
          <div className="card-premium p-7">
            <div className="h-11 w-11 rounded-xl bg-gradient-electric grid place-items-center text-white shadow-glow"><Sun className="h-5 w-5" /></div>
            <h3 className="mt-5 text-xl font-display font-semibold text-navy">Farm Solar</h3>
            <p className="mt-2 text-sm text-muted-foreground leading-relaxed">Rooftop, ground-mount and carport solar designed around the actual farm load profile.</p>
            <BulletList items={["Rooftop, ground-mount and carport options", "Farm consumption profile modelling", "Grant and finance route support", "MCS partner installation", "DNO coordination and long-term monitoring"]} />
          </div>
          <div className="card-premium p-7">
            <div className="h-11 w-11 rounded-xl bg-gradient-electric grid place-items-center text-white shadow-glow"><BatteryCharging className="h-5 w-5" /></div>
            <h3 className="mt-5 text-xl font-display font-semibold text-navy">Battery Storage for Farms</h3>
            <p className="mt-2 text-sm text-muted-foreground leading-relaxed">Store the day, power the night — steady, controllable farm energy.</p>
            <BulletList items={["Daytime solar capture", "Night-time and peak dispatch", "Backup for critical farm loads", "Tariff and export optimisation", "Warranty-backed cycles and remote monitoring"]} />
          </div>
          <div className="card-premium p-7">
            <div className="h-11 w-11 rounded-xl bg-gradient-electric grid place-items-center text-white shadow-glow"><Layers className="h-5 w-5" /></div>
            <h3 className="mt-5 text-xl font-display font-semibold text-navy">Solar + Battery Together</h3>
            <p className="mt-2 text-sm text-muted-foreground leading-relaxed">Designed as one integrated farm energy system — one team, one platform.</p>
            <BulletList items={["Single integrated design and controls", "Combined DNO and metering strategy", "One monitoring dashboard for the whole site", "Coordinated grant and finance package", "One accountable partner across the lifecycle"]} />
          </div>
        </div>
      </section>

      <section className="py-16 bg-surface">
        <div className="container-tight grid lg:grid-cols-2 gap-10">
          <div className="card-premium p-7">
            <h3 className="text-lg font-display font-semibold text-navy">Farm energy resilience</h3>
            <p className="mt-3 text-sm text-navy leading-relaxed">Grid outages can stop a working farm in its tracks. Integrated solar and storage keeps the critical stuff running.</p>
            <BulletList items={["Critical load audit (milking, ventilation, refrigeration, pumping)", "Backup-capable inverters and batteries", "Automatic islanding where suitable", "Generator and hybrid integration", "Test-and-verify commissioning"]} />
          </div>
          <div className="card-premium p-7">
            <h3 className="text-lg font-display font-semibold text-navy">Practical agricultural use cases</h3>
            <div className="mt-4 space-y-3 text-sm text-navy leading-relaxed">
              <p><strong>Dairy</strong> — power milking parlours, cooling and refrigeration from solar; batteries keep operations running through outages.</p>
              <p><strong>Poultry & livestock</strong> — protect ventilation and heating; reduce grid dependency during peak demand.</p>
              <p><strong>Arable</strong> — offset grain drying and irrigation loads; export surplus at peak tariff windows.</p>
              <p><strong>Diversified estates</strong> — pair solar with EV charging for farm shops, glamping and holiday lets.</p>
            </div>
          </div>
        </div>
      </section>

      <FinalCTA />
    </SiteLayout>
  );
};

export const FarmResilience = () => (
  <SimplePage
    metaTitle="Farm Energy Resilience | Clean Energy Gurus"
    metaDesc="Keep critical farm systems running through grid outages with integrated solar, battery and backup design."
    eyebrow="Energy Resilience"
    heroTitle={<>Keep critical loads <span className="text-gradient">running through outages</span>.</>}
    lead="Milking, ventilation, refrigeration and pumping — protected by integrated solar, storage and backup design."
    bullets={[
      "Critical load audit",
      "Backup-capable inverters and batteries",
      "Automatic islanding where suitable",
      "Generator and hybrid integration",
      "Monitoring and alerting",
      "Test-and-verify commissioning",
    ]}
    sections={[{ title: "Beyond a backup box", body: "Resilience is a system design — batteries, inverters, loads and controls working together." }]}
  />
);
