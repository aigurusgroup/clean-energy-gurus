import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { Search, Sun, Pencil, RotateCcw, ArrowRight, Zap, Leaf, PoundSterling, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { loadGoogleMaps, GOOGLE_MAPS_API_KEY } from "@/lib/loadGoogleMaps";

export type SegmentType = "business" | "farm" | "landlord" | "home";

// Per-segment defaults (UK assumptions, conservative)
const segmentDefaults: Record<SegmentType, { tariff: number; exportRate: number; selfUse: number; label: string }> = {
  business: { tariff: 0.30, exportRate: 0.08, selfUse: 0.75, label: "Business" },
  farm:     { tariff: 0.28, exportRate: 0.08, selfUse: 0.70, label: "Farm" },
  landlord: { tariff: 0.27, exportRate: 0.08, selfUse: 0.55, label: "Landlord / portfolio" },
  home:     { tariff: 0.27, exportRate: 0.15, selfUse: 0.45, label: "Home" },
};

type RoofType = "pitched-south" | "pitched-ew" | "flat" | "shaded" | "mixed";

const roofOptions: { v: RoofType; title: string; desc: string; usable: number; yieldPerKwp: number }[] = [
  { v: "pitched-south", title: "Pitched – South facing", desc: "Optimal orientation",          usable: 0.85, yieldPerKwp: 950 },
  { v: "pitched-ew",    title: "Pitched – East/West",   desc: "Slightly lower yield",         usable: 0.80, yieldPerKwp: 820 },
  { v: "flat",          title: "Flat roof",             desc: "Tilted frames, wider spacing", usable: 0.65, yieldPerKwp: 880 },
  { v: "shaded",        title: "Partially shaded",      desc: "Trees, chimneys, dormers",     usable: 0.55, yieldPerKwp: 700 },
  { v: "mixed",         title: "Mixed / unsure",        desc: "We'll refine on survey",       usable: 0.75, yieldPerKwp: 850 },
];

const KWP_PER_M2 = 0.18; // ~5.5 m² per kWp with modern modules
const CO2_PER_KWH = 0.207; // kg CO2 per kWh (UK grid 2024)

interface Props {
  segment: SegmentType;
  /** When true (homepage), shows a customer-type selector inside the panel */
  selectable?: boolean;
  className?: string;
}

export const SolarCalculator = ({ segment, selectable = false, className = "" }: Props) => {
  const mapEl = useRef<HTMLDivElement | null>(null);
  const searchEl = useRef<HTMLInputElement | null>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const mapRef = useRef<any>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const polygonRef = useRef<any>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const drawingMgrRef = useRef<any>(null);

  const [activeSegment, setActiveSegment] = useState<SegmentType>(segment);
  const [status, setStatus] = useState<"idle" | "loading" | "ready" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState<string>("");
  const [areaM2, setAreaM2] = useState<number>(0);
  const [roof, setRoof] = useState<RoofType>("pitched-south");
  const [postcode, setPostcode] = useState("");

  // initialise map once
  useEffect(() => {
    let cancelled = false;
    if (!GOOGLE_MAPS_API_KEY) {
      setStatus("error");
      setErrorMsg("Google Maps API key not configured. Set VITE_GOOGLE_MAPS_API_KEY.");
      return;
    }
    setStatus("loading");
    loadGoogleMaps()
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .then((google: any) => {
        if (cancelled || !mapEl.current) return;
        const map = new google.maps.Map(mapEl.current, {
          center: { lat: 54.5, lng: -2.5 }, // UK
          zoom: 6,
          mapTypeId: "satellite",
          tilt: 0,
          mapTypeControl: false,
          streetViewControl: false,
          fullscreenControl: false,
          rotateControl: false,
        });
        mapRef.current = map;

        const drawingManager = new google.maps.drawing.DrawingManager({
          drawingMode: null,
          drawingControl: false,
          polygonOptions: {
            fillColor: "#3b82f6",
            fillOpacity: 0.35,
            strokeColor: "#2563eb",
            strokeWeight: 2,
            editable: true,
            draggable: false,
            clickable: true,
          },
        });
        drawingManager.setMap(map);
        drawingMgrRef.current = drawingManager;

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        google.maps.event.addListener(drawingManager, "polygoncomplete", (poly: any) => {
          if (polygonRef.current) polygonRef.current.setMap(null);
          polygonRef.current = poly;
          drawingManager.setDrawingMode(null);
          const update = () => {
            const a = google.maps.geometry.spherical.computeArea(poly.getPath());
            setAreaM2(a);
          };
          update();
          const path = poly.getPath();
          path.addListener("set_at", update);
          path.addListener("insert_at", update);
          path.addListener("remove_at", update);
        });

        // Places autocomplete on the search input
        if (searchEl.current) {
          const ac = new google.maps.places.Autocomplete(searchEl.current, {
            componentRestrictions: { country: "gb" },
            fields: ["geometry", "formatted_address"],
          });
          ac.bindTo("bounds", map);
          ac.addListener("place_changed", () => {
            const place = ac.getPlace();
            if (!place.geometry?.location) return;
            map.setCenter(place.geometry.location);
            map.setZoom(20);
            setPostcode(place.formatted_address || "");
          });
        }

        setStatus("ready");
      })
      .catch((e: Error) => {
        setStatus("error");
        setErrorMsg(e.message);
      });
    return () => { cancelled = true; };
  }, []);

  const startDrawing = () => {
    const g = (window as unknown as { google?: any }).google;
    if (!drawingMgrRef.current || !g) return;
    if (polygonRef.current) {
      polygonRef.current.setMap(null);
      polygonRef.current = null;
      setAreaM2(0);
    }
    drawingMgrRef.current.setDrawingMode(g.maps.drawing.OverlayType.POLYGON);
  };

  const reset = () => {
    if (polygonRef.current) {
      polygonRef.current.setMap(null);
      polygonRef.current = null;
    }
    setAreaM2(0);
    drawingMgrRef.current?.setDrawingMode(null);
  };

  const handlePostcodeSearch = async () => {
    const g = (window as unknown as { google?: any }).google;
    if (!g || !mapRef.current || !postcode.trim()) return;
    const geocoder = new g.maps.Geocoder();
    try {
      const res = await geocoder.geocode({
        address: postcode,
        componentRestrictions: { country: "GB" },
      });
      const loc = res.results[0]?.geometry.location;
      if (loc) {
        mapRef.current.setCenter(loc);
        mapRef.current.setZoom(20);
      }
    } catch {
      // ignore
    }
  };

  // Calculations
  const result = useMemo(() => {
    const opt = roofOptions.find((r) => r.v === roof)!;
    const usableArea = areaM2 * opt.usable;
    const kWp = usableArea * KWP_PER_M2;
    const annualKwh = kWp * opt.yieldPerKwp;
    const cfg = segmentDefaults[activeSegment];
    const selfUseKwh = annualKwh * cfg.selfUse;
    const exportKwh = annualKwh - selfUseKwh;
    const annualSavings = selfUseKwh * cfg.tariff + exportKwh * cfg.exportRate;
    const co2 = annualKwh * CO2_PER_KWH;
    return {
      kWp,
      annualKwh,
      annualSavings,
      co2Tonnes: co2 / 1000,
      cfg,
    };
  }, [areaM2, roof, activeSegment]);

  const fmtNum = (n: number, d = 0) =>
    n.toLocaleString("en-GB", { minimumFractionDigits: d, maximumFractionDigits: d });

  return (
    <section className={`py-20 lg:py-28 ${className}`}>
      <div className="container-tight">
        <div className="max-w-3xl mb-10">
          <span className="eyebrow">
            <span className="h-1.5 w-1.5 rounded-full bg-electric animate-pulse" />
            Instant solar estimate
          </span>
          <h2 className="mt-3 text-3xl sm:text-4xl lg:text-5xl font-display font-semibold text-navy">
            Outline your roof. <span className="text-gradient">See your solar potential.</span>
          </h2>
          <p className="mt-4 text-navy-soft text-lg leading-relaxed">
            Search your postcode, draw the roof area you'd like to use for solar,
            tell us a little about it and we'll estimate system size, generation
            and annual savings — instantly. Indicative only; we confirm everything on survey.
          </p>
        </div>

        <div className="grid lg:grid-cols-12 gap-6">
          {/* Left: map + controls */}
          <div className="lg:col-span-7 space-y-3">
            {/* Search bar */}
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  ref={searchEl}
                  value={postcode}
                  onChange={(e) => setPostcode(e.target.value)}
                  onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); handlePostcodeSearch(); } }}
                  placeholder="Enter postcode or address (UK)"
                  className="pl-9 h-11 rounded-full"
                  maxLength={120}
                />
              </div>
              <Button
                type="button"
                onClick={handlePostcodeSearch}
                className="rounded-full h-11 px-5 bg-navy text-white hover:bg-navy/90"
                disabled={status !== "ready"}
              >
                Search
              </Button>
            </div>

            {/* Map */}
            <div className="relative rounded-3xl overflow-hidden border border-border shadow-card bg-muted">
              <div ref={mapEl} className="w-full h-[460px]" />
              {status !== "ready" && (
                <div className="absolute inset-0 grid place-items-center bg-background/85 backdrop-blur-sm text-center p-6">
                  {status === "error" ? (
                    <div className="max-w-md">
                      <div className="h-12 w-12 mx-auto rounded-2xl bg-destructive/10 grid place-items-center text-destructive mb-3">
                        <Info className="h-5 w-5" />
                      </div>
                      <p className="text-sm font-display font-semibold text-navy">Map unavailable</p>
                      <p className="text-xs text-muted-foreground mt-1">{errorMsg}</p>
                    </div>
                  ) : (
                    <div className="text-sm text-muted-foreground">Loading satellite map…</div>
                  )}
                </div>
              )}
            </div>

            {/* Drawing controls */}
            <div className="flex flex-wrap gap-2">
              <Button
                type="button"
                onClick={startDrawing}
                disabled={status !== "ready"}
                className="rounded-full h-11 px-5 bg-gradient-electric text-white border-0 shadow-glow"
              >
                <Pencil className="h-4 w-4 mr-1.5" /> Draw roof area
              </Button>
              <Button
                type="button"
                onClick={reset}
                variant="outline"
                disabled={!polygonRef.current && areaM2 === 0}
                className="rounded-full h-11 px-5 border-navy/15 text-navy hover:bg-navy hover:text-white"
              >
                <RotateCcw className="h-4 w-4 mr-1.5" /> Reset
              </Button>
              <div className="ml-auto self-center text-xs text-muted-foreground">
                Tip: zoom into your roof, then click each corner to outline it.
              </div>
            </div>
          </div>

          {/* Right: inputs + result */}
          <div className="lg:col-span-5">
            <div className="card-premium p-6 sm:p-8 sticky top-24">
              {/* Customer type (homepage only) */}
              {selectable && (
                <div className="mb-6">
                  <Label className="text-xs uppercase tracking-[0.16em] text-muted-foreground">I'm a…</Label>
                  <div className="mt-2 grid grid-cols-2 gap-2">
                    {(Object.keys(segmentDefaults) as SegmentType[]).map((s) => (
                      <button
                        key={s}
                        type="button"
                        onClick={() => setActiveSegment(s)}
                        className={`h-10 px-3 rounded-full text-sm font-medium border transition-all ${
                          activeSegment === s
                            ? "bg-navy text-white border-navy"
                            : "bg-card text-navy border-border hover:border-electric/50"
                        }`}
                      >
                        {segmentDefaults[s].label}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <Label className="text-xs uppercase tracking-[0.16em] text-muted-foreground">Roof type</Label>
              <div className="mt-2 space-y-2">
                {roofOptions.map((r) => (
                  <button
                    key={r.v}
                    type="button"
                    onClick={() => setRoof(r.v)}
                    className={`w-full text-left rounded-2xl border p-3.5 transition-all ${
                      roof === r.v
                        ? "border-electric bg-electric/5"
                        : "border-border bg-card hover:border-electric/40"
                    }`}
                  >
                    <div className="text-sm font-display font-semibold text-navy">{r.title}</div>
                    <div className="text-xs text-muted-foreground mt-0.5">{r.desc}</div>
                  </button>
                ))}
              </div>

              {/* Result */}
              <div className="mt-6 rounded-2xl bg-navy text-white p-5 sm:p-6 relative overflow-hidden">
                <div className="absolute -top-16 -right-16 h-40 w-40 rounded-full bg-gradient-electric opacity-30 blur-3xl pointer-events-none" />
                <div className="relative">
                  <div className="text-[11px] uppercase tracking-[0.18em] text-white/60 font-semibold flex items-center gap-1.5">
                    <Sun className="h-3.5 w-3.5 text-electric" />
                    Estimated for {result.cfg.label.toLowerCase()}
                  </div>

                  {areaM2 < 5 ? (
                    <p className="mt-4 text-sm text-white/75 leading-relaxed">
                      Draw a roof outline on the map to see your estimate.
                    </p>
                  ) : (
                    <>
                      <div className="mt-4 grid grid-cols-2 gap-3">
                        <Stat label="Roof area" value={`${fmtNum(areaM2)} m²`} />
                        <Stat label="System size" value={`${fmtNum(result.kWp, 1)} kWp`} />
                        <Stat label="Generation" value={`${fmtNum(result.annualKwh)} kWh/yr`} icon={<Zap className="h-3.5 w-3.5" />} />
                        <Stat label="CO₂ saved" value={`${fmtNum(result.co2Tonnes, 1)} t/yr`} icon={<Leaf className="h-3.5 w-3.5" />} />
                      </div>
                      <div className="mt-5 pt-5 border-t border-white/10">
                        <div className="text-[11px] uppercase tracking-[0.18em] text-white/55 font-semibold flex items-center gap-1.5">
                          <PoundSterling className="h-3.5 w-3.5 text-electric" />
                          Estimated annual savings
                        </div>
                        <div className="mt-1 text-4xl font-display font-semibold text-white">
                          £{fmtNum(result.annualSavings)}
                        </div>
                        <div className="mt-1 text-xs text-white/55">
                          @ {Math.round(result.cfg.selfUse * 100)}% self-use, {result.cfg.tariff.toFixed(2)} £/kWh tariff, {result.cfg.exportRate.toFixed(2)} £/kWh export
                        </div>
                      </div>
                    </>
                  )}

                  <Link to="/contact" className="mt-6 block">
                    <Button className="w-full rounded-full h-11 bg-gradient-electric text-white border-0 shadow-glow">
                      Get a tailored quote <ArrowRight className="h-4 w-4 ml-1.5" />
                    </Button>
                  </Link>
                </div>
              </div>

              <p className="text-[11px] text-muted-foreground mt-3 leading-relaxed">
                Indicative figures only, based on UK averages (irradiance, panel density, tariff).
                A site survey will refine all numbers.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

const Stat = ({ label, value, icon }: { label: string; value: string; icon?: React.ReactNode }) => (
  <div className="rounded-xl bg-white/[0.05] border border-white/10 p-3">
    <div className="text-[10px] uppercase tracking-[0.16em] text-white/55 font-semibold flex items-center gap-1.5">
      {icon}
      {label}
    </div>
    <div className="mt-1 text-base font-display font-semibold text-white">{value}</div>
  </div>
);
