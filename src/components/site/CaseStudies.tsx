import segBusiness from "@/assets/segment-business.jpg";
import segFarm from "@/assets/segment-farm.jpg";
import segHome from "@/assets/segment-home.jpg";

const studies = [
  { img: segBusiness, tag: "Logistics", title: "412 kW rooftop powers daily operations", line: "62% grid offset across a Midlands distribution centre." },
  { img: segFarm, tag: "Agriculture", title: "Dairy farm runs on its own energy", line: "Solar + battery removed exposure to peak-rate spikes." },
  { img: segHome, tag: "Residential", title: "EV-ready home below £400/yr", line: "Solar, battery and smart tariff combined for high-use household." },
];

export const CaseStudies = () => (
  <section className="py-20 lg:py-28">
    <div className="container-tight">
      <div className="flex items-end justify-between mb-12 gap-6 flex-wrap">
        <div>
          <span className="eyebrow">Selected work</span>
          <h2 className="mt-3 text-3xl sm:text-4xl lg:text-5xl font-display font-semibold text-navy max-w-2xl">
            Properties already earning their energy back.
          </h2>
        </div>
      </div>
      <div className="grid md:grid-cols-3 gap-6">
        {studies.map((s) => (
          <article key={s.title} className="card-premium overflow-hidden group">
            <div className="aspect-[4/3] overflow-hidden">
              <img src={s.img} alt={s.title} loading="lazy" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
            </div>
            <div className="p-6">
              <div className="text-[10px] font-semibold uppercase tracking-[0.18em] text-electric">{s.tag}</div>
              <h3 className="mt-2 text-lg font-display font-semibold text-navy">{s.title}</h3>
              <p className="mt-1.5 text-sm text-muted-foreground">{s.line}</p>
            </div>
          </article>
        ))}
      </div>
    </div>
  </section>
);
