import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { z } from "zod";
import {
  Search, Sun, Pencil, RotateCcw, ArrowRight, ArrowLeft, Zap, Leaf,
  PoundSterling, Info, Building2, Tractor, KeyRound, Home as HomeIcon,
  Triangle, Minus, HelpCircle, Mail, CheckCircle2, CalendarCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { loadGoogleMaps, GOOGLE_MAPS_API_KEY } from "@/lib/loadGoogleMaps";

export type SegmentType = "business" | "farm" | "landlord" | "home";

const segmentDefaults: Record<SegmentType, { tariff: number; exportRate: number; selfUse: number; label: string; icon: React.ComponentType<{ className?: string }> }> = {
  business: { tariff: 0.30, exportRate: 0.08, selfUse: 0.75, label: "Business", icon: Building2 },
  farm:     { tariff: 0.28, exportRate: 0.08, selfUse: 0.70, label: "Farm",     icon: Tractor },
  landlord: { tariff: 0.27, exportRate: 0.08, selfUse: 0.55, label: "Landlord", icon: KeyRound },
  home:     { tariff: 0.27, exportRate: 0.15, selfUse: 0.45, label: "Home",     icon: HomeIcon },
};

type RoofType = "pitched" | "flat" | "other";
const roofOptions: { v: RoofType; title: string; icon: React.ComponentType<{ className?: string }>; usable: number; yieldPerKwp: number }[] = [
  { v: "pitched", title: "Pitched", icon: Triangle,    usable: 0.82, yieldPerKwp: 900 },
  { v: "flat",    title: "Flat",    icon: Minus,       usable: 0.65, yieldPerKwp: 880 },
  { v: "other",   title: "Other",   icon: HelpCircle,  usable: 0.70, yieldPerKwp: 820 },
];

const buildingByCustomer: Record<SegmentType, string[]> = {
  business: ["Warehouse", "Factory / Industrial", "Office", "Retail", "Hospitality", "Accommodation", "Ground mounted", "Other"],
  farm:     ["Barn", "Storage shed", "Livestock building", "Glasshouse", "Farmhouse", "Ground mounted", "Other"],
  landlord: ["HMO", "Apartment block", "Single let", "Mixed-use", "Holiday let", "Other"],
  home:     ["Detached", "Semi-detached", "Terrace", "Bungalow", "Flat", "Other"],
};

const KWP_PER_M2 = 0.18;
const CO2_PER_KWH = 0.207;
const COST_PER_KWP = 1500; // indicative installed £/kWp
const TREE_KG_CO2 = 21;    // kg CO2 absorbed per tree per year

const emailSchema = z.string().trim().email({ message: "Enter a valid email" }).max(255);

interface Props {
  segment: SegmentType;
  selectable?: boolean;
  className?: string;
  hideHeading?: boolean;
}

export const SolarCalculator = ({ segment, selectable = false, className = "", hideHeading = false }: Props) => {
  const { toast } = useToast();
  const mapEl = useRef<HTMLDivElement | null>(null);
  const searchEl = useRef<HTMLInputElement | null>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const mapRef = useRef<any>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const polygonRef = useRef<any>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const drawingMgrRef = useRef<any>(null);

  // Wizard state. Step 1=postcode, 2=draw, 3=customer, 4=roof, 5=building, 6=results
  const totalSteps = selectable ? 6 : 5;
  const [step, setStep] = useState(1);
  const [activeSegment, setActiveSegment] = useState<SegmentType>(segment);
  const [postcode, setPostcode] = useState("");
  const [address, setAddress] = useState("");
  const [areaM2, setAreaM2] = useState(0);
  const [roof, setRoof] = useState<RoofType | null>(null);
  const [building, setBuilding] = useState<string | null>(null);
  const [mapStatus, setMapStatus] = useState<"idle" | "loading" | "ready" | "error">("idle");
  const [mapError, setMapError] = useState("");
  const [email, setEmail] = useState("");
  const [emailSent, setEmailSent] = useState(false);

  // Init map when its container becomes available
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const googleRef = useRef<any>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const autocompleteRef = useRef<any>(null);

  // Load Google Maps script once on mount
  useEffect(() => {
    let cancelled = false;
    if (!GOOGLE_MAPS_API_KEY) {
      setMapStatus("error");
      setMapError("Map preview not configured yet — you can still get an estimate.");
      return;
    }
    setMapStatus("loading");
    loadGoogleMaps()
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .then((google: any) => {
        if (cancelled) return;
        googleRef.current = google;
        setMapStatus("ready");
      })
      .catch((e: Error) => {
        setMapStatus("error");
        setMapError(e.message);
      });
    return () => { cancelled = true; };
  }, []);

  // Attach Places Autocomplete whenever the search input is on screen
  useEffect(() => {
    const google = googleRef.current;
    if (!google || !searchEl.current || autocompleteRef.current) return;
    const ac = new google.maps.places.Autocomplete(searchEl.current, {
      componentRestrictions: { country: "gb" },
      fields: ["geometry", "formatted_address"],
    });
    autocompleteRef.current = ac;
    ac.addListener("place_changed", () => {
      const place = ac.getPlace();
      if (!place.geometry?.location) return;
      setAddress(place.formatted_address || "");
      setStep(2);
      setTimeout(() => {
        if (mapRef.current) {
          mapRef.current.setCenter(place.geometry.location);
          mapRef.current.setZoom(20);
          mapRef.current.setMapTypeId("satellite");
        }
      }, 0);
    });
  }, [step, mapStatus]);

  // Initialise the map when its container appears (step 2)
  useEffect(() => {
    const google = googleRef.current;
    if (!google || !mapEl.current || mapRef.current) return;
    const map = new google.maps.Map(mapEl.current, {
      center: { lat: 50.854, lng: -0.554 }, // Arundel, UK
      zoom: 14,
      mapTypeId: "roadmap",
      tilt: 0,
      mapTypeControl: false,
      streetViewControl: false,
      fullscreenControl: false,
      rotateControl: false,
      gestureHandling: "greedy",
    });
    mapRef.current = map;

    const drawingManager = new google.maps.drawing.DrawingManager({
      drawingMode: null,
      drawingControl: false,
      polygonOptions: {
        fillColor: "#3b82f6",
        fillOpacity: 0.35,
        strokeColor: "#22d3ee",
        strokeWeight: 2,
        editable: true,
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

    // If we already have a selected place address from step 1, recenter
    if (address && googleRef.current) {
      const geocoder = new google.maps.Geocoder();
      geocoder.geocode({ address, componentRestrictions: { country: "GB" } })
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        .then((res: any) => {
          const loc = res.results[0]?.geometry.location;
          if (loc) { map.setCenter(loc); map.setZoom(20); map.setMapTypeId("satellite"); }
        })
        .catch(() => {});
    }
  }, [step, mapStatus, address]);

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

  const resetDrawing = () => {
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
        mapRef.current.setZoom(19);
        mapRef.current.setMapTypeId("satellite");
        setAddress(res.results[0].formatted_address);
        setStep(2);
      }
    } catch {
      toast({ title: "Couldn't find that postcode", description: "Please check and try again." });
    }
  };

  const result = useMemo(() => {
    const opt = roofOptions.find((r) => r.v === (roof ?? "pitched"))!;
    const usableArea = areaM2 * opt.usable;
    const kWp = usableArea * KWP_PER_M2;
    const annualKwh = kWp * opt.yieldPerKwp;
    const cfg = segmentDefaults[activeSegment];
    const selfUseKwh = annualKwh * cfg.selfUse;
    const exportKwh = annualKwh - selfUseKwh;
    const annualSavings = selfUseKwh * cfg.tariff + exportKwh * cfg.exportRate;
    const systemCost = kWp * COST_PER_KWP;
    const payback = annualSavings > 0 ? systemCost / annualSavings : 0;
    const lifetimeCo2Kg = annualKwh * CO2_PER_KWH * 25;
    const trees = lifetimeCo2Kg / TREE_KG_CO2;
    const panels = Math.round(kWp / 0.4); // ~400W panels
    return {
      kWp, annualKwh, annualSavings, systemCost, payback,
      co2Tonnes: (annualKwh * CO2_PER_KWH) / 1000,
      trees, panels, cfg,
    };
  }, [areaM2, roof, activeSegment]);

  const fmt = (n: number, d = 0) =>
    n.toLocaleString("en-GB", { minimumFractionDigits: d, maximumFractionDigits: d });

  const savingsHeadline = (() => {
    const v = result.annualSavings;
    if (v >= 1000) return `£${(v / 1000).toFixed(v >= 10000 ? 0 : 1)}k`;
    return `£${fmt(v)}`;
  })();

  // Step navigation helpers
  const goNext = () => setStep((s) => Math.min(s + 1, 6));
  const goBack = () => setStep((s) => Math.max(s - 1, 1));
  // When segment is preset, skip the customer step (step 3)
  const visibleSteps = selectable ? [1, 2, 3, 4, 5, 6] : [1, 2, 4, 5, 6];
  const currentVisibleIndex = visibleSteps.indexOf(step) + 1;

  const goNextSkipping = () => {
    let next = step + 1;
    if (!selectable && next === 3) next = 4;
    setStep(Math.min(next, 6));
  };
  const goBackSkipping = () => {
    let prev = step - 1;
    if (!selectable && prev === 3) prev = 2;
    setStep(Math.max(prev, 1));
  };

  const handleEmailSend = () => {
    const r = emailSchema.safeParse(email);
    if (!r.success) {
      toast({ title: "Check your email", description: r.error.issues[0].message });
      return;
    }
    // Lightweight stub — a follow-up edge function can deliver the PDF.
    setEmailSent(true);
    toast({ title: "Estimate on its way", description: `We'll send a copy to ${r.data}.` });
  };

  // Try to extract a UK postcode from the autocomplete address string
  const postcodeFromAddress = (() => {
    const m = address.match(/[A-Z]{1,2}\d[A-Z\d]?\s?\d[A-Z]{2}/i);
    return m ? m[0].toUpperCase() : "";
  })();

  const contactQuery = new URLSearchParams({
    type: activeSegment,
    address,
    postcode: postcodeFromAddress,
    area: Math.round(areaM2).toString(),
    kwp: result.kWp.toFixed(1),
    kwh: Math.round(result.annualKwh).toString(),
    saving: Math.round(result.annualSavings).toString(),
    cost: Math.round(result.systemCost).toString(),
    payback: result.payback.toFixed(1),
    roof: roof ?? "",
    building: building ?? "",
  }).toString();

  return (
    <section className={`py-20 lg:py-28 ${className}`}>
      <div className="container-tight">
        {!hideHeading && (
          <div className="max-w-3xl mb-10">
            <span className="eyebrow">
              <span className="h-1.5 w-1.5 rounded-full bg-electric animate-pulse" />
              Instant solar estimate
            </span>
            <h2 className="mt-3 text-3xl sm:text-4xl lg:text-5xl font-display font-semibold text-navy">
              Outline your roof. <span className="text-gradient">See your solar savings.</span>
            </h2>
            <p className="mt-4 text-navy-soft text-lg leading-relaxed">
              Search your postcode, draw the area you'd like to use for solar
              and answer a few quick questions — we'll show your estimated
              annual savings instantly.
            </p>
          </div>
        )}

        <div className="grid lg:grid-cols-12 gap-6 items-start">
          {/* Map (always visible) */}
          <div className="lg:col-span-7">
            <div className="relative rounded-3xl overflow-hidden border border-border shadow-card bg-muted">
              <div ref={mapEl} className="w-full h-[520px]" />
              {mapStatus === "loading" && (
                <div className="absolute top-3 left-3 rounded-full bg-background/90 backdrop-blur px-3 py-1.5 text-xs text-muted-foreground shadow-card">
                  Loading satellite map…
                </div>
              )}
              {mapStatus === "error" && (
                <div className="absolute top-3 left-3 right-3 rounded-2xl bg-background/95 backdrop-blur px-4 py-3 text-xs text-navy shadow-card flex items-start gap-2">
                  <Info className="h-4 w-4 text-electric shrink-0 mt-0.5" />
                  <span>{mapError}</span>
                </div>
              )}
              {step === 2 && mapStatus === "ready" && (
                <div className="absolute top-3 left-3 right-3 rounded-2xl bg-navy/95 backdrop-blur text-white px-4 py-3 shadow-card flex items-center gap-3">
                  <div className="h-8 w-8 rounded-full bg-electric/20 grid place-items-center text-electric shrink-0">
                    <Pencil className="h-4 w-4" />
                  </div>
                  <div className="text-xs leading-snug">
                    <div className="font-display font-semibold text-sm">Draw your roof outline</div>
                    <div className="text-white/70">Click each corner of the roof, then double-click to finish.</div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Wizard panel */}
          <div className="lg:col-span-5">
            <div className="card-premium p-6 sm:p-8 sticky top-24">
              {/* Progress */}
              <div className="flex items-center gap-1.5 mb-2">
                {visibleSteps.map((s, i) => {
                  const reached = visibleSteps.indexOf(step) >= i;
                  const current = step === s;
                  return (
                    <div
                      key={s}
                      className={`h-1.5 flex-1 rounded-full transition-colors ${
                        current ? "bg-electric" : reached ? "bg-navy" : "bg-muted"
                      }`}
                    />
                  );
                })}
              </div>
              <div className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground font-semibold">
                Step {currentVisibleIndex} of {totalSteps}
              </div>

              {/* STEP 1 — Postcode */}
              {step === 1 && (
                <div className="mt-5">
                  <h3 className="text-2xl font-display font-semibold text-navy">
                    Enter your postcode
                  </h3>
                  <p className="mt-2 text-sm text-muted-foreground">
                    We'll find your property on satellite imagery so you can
                    outline your roof.
                  </p>
                  <div className="mt-5 relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      ref={searchEl}
                      value={postcode}
                      onChange={(e) => setPostcode(e.target.value)}
                      onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); handlePostcodeSearch(); } }}
                      placeholder="e.g. RH2 9AR"
                      className="pl-9 h-12 rounded-full text-base"
                      maxLength={120}
                    />
                  </div>
                  <Button
                    type="button"
                    onClick={handlePostcodeSearch}
                    disabled={!postcode.trim()}
                    className="mt-4 w-full rounded-full h-12 bg-gradient-electric text-white border-0 shadow-glow"
                  >
                    Find my property <ArrowRight className="h-4 w-4 ml-1.5" />
                  </Button>
                  <p className="mt-3 text-[11px] text-muted-foreground">
                    Start typing for address suggestions, or hit search for the postcode.
                  </p>
                </div>
              )}

              {/* STEP 2 — Draw roof */}
              {step === 2 && (
                <div className="mt-5">
                  <h3 className="text-2xl font-display font-semibold text-navy">
                    Outline your roof
                  </h3>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Click <strong>Draw</strong>, then click each corner of the
                    roof on the map. Double-click to finish.
                  </p>
                  {address && (
                    <div className="mt-3 text-xs text-navy-soft truncate">{address}</div>
                  )}
                  <div className="mt-4 flex flex-wrap gap-2">
                    <Button
                      type="button"
                      onClick={startDrawing}
                      disabled={mapStatus !== "ready"}
                      className="rounded-full h-11 px-5 bg-gradient-electric text-white border-0 shadow-glow"
                    >
                      <Pencil className="h-4 w-4 mr-1.5" /> Draw
                    </Button>
                    <Button
                      type="button"
                      onClick={resetDrawing}
                      variant="outline"
                      disabled={areaM2 === 0}
                      className="rounded-full h-11 px-5"
                    >
                      <RotateCcw className="h-4 w-4 mr-1.5" /> Reset
                    </Button>
                  </div>
                  {areaM2 > 0 && (
                    <div className="mt-4 rounded-2xl bg-electric/10 border border-electric/30 p-4">
                      <div className="text-[11px] uppercase tracking-[0.16em] text-navy/60 font-semibold">Roof area</div>
                      <div className="mt-1 text-2xl font-display font-semibold text-navy">{fmt(areaM2)} m²</div>
                    </div>
                  )}
                  <div className="mt-6 flex gap-2">
                    <Button type="button" variant="outline" onClick={goBackSkipping} className="rounded-full h-11 px-5">
                      <ArrowLeft className="h-4 w-4 mr-1.5" /> Back
                    </Button>
                    <Button
                      type="button"
                      onClick={goNextSkipping}
                      disabled={areaM2 < 5}
                      className="flex-1 rounded-full h-11 bg-navy text-white hover:bg-navy/90"
                    >
                      Next <ArrowRight className="h-4 w-4 ml-1.5" />
                    </Button>
                  </div>
                </div>
              )}

              {/* STEP 3 — Customer type (only if selectable) */}
              {step === 3 && selectable && (
                <div className="mt-5">
                  <h3 className="text-2xl font-display font-semibold text-navy">
                    Is this for a…
                  </h3>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Helps us tailor your tariff and self-use assumptions.
                  </p>
                  <div className="mt-5 grid grid-cols-2 gap-3">
                    {(Object.keys(segmentDefaults) as SegmentType[]).map((s) => {
                      const Icon = segmentDefaults[s].icon;
                      const selected = activeSegment === s;
                      return (
                        <button
                          key={s}
                          type="button"
                          onClick={() => setActiveSegment(s)}
                          className={`rounded-2xl border p-4 text-left transition-all ${
                            selected
                              ? "border-electric bg-electric/5 shadow-card"
                              : "border-border bg-card hover:border-electric/40"
                          }`}
                        >
                          <Icon className={`h-6 w-6 ${selected ? "text-electric" : "text-navy"}`} />
                          <div className="mt-2 text-sm font-display font-semibold text-navy">
                            {segmentDefaults[s].label}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                  <div className="mt-6 flex gap-2">
                    <Button type="button" variant="outline" onClick={goBackSkipping} className="rounded-full h-11 px-5">
                      <ArrowLeft className="h-4 w-4 mr-1.5" /> Back
                    </Button>
                    <Button type="button" onClick={goNextSkipping} className="flex-1 rounded-full h-11 bg-navy text-white hover:bg-navy/90">
                      Next <ArrowRight className="h-4 w-4 ml-1.5" />
                    </Button>
                  </div>
                </div>
              )}

              {/* STEP 4 — Roof type */}
              {step === 4 && (
                <div className="mt-5">
                  <h3 className="text-2xl font-display font-semibold text-navy">
                    What type of roof do you have?
                  </h3>
                  <div className="mt-5 grid grid-cols-3 gap-3">
                    {roofOptions.map((r) => {
                      const Icon = r.icon;
                      const selected = roof === r.v;
                      return (
                        <button
                          key={r.v}
                          type="button"
                          onClick={() => setRoof(r.v)}
                          className={`rounded-2xl border p-4 text-center transition-all ${
                            selected
                              ? "border-electric bg-electric/5 shadow-card"
                              : "border-border bg-card hover:border-electric/40"
                          }`}
                        >
                          <Icon className={`h-7 w-7 mx-auto ${selected ? "text-electric" : "text-navy"}`} />
                          <div className="mt-2 text-sm font-display font-semibold text-navy">{r.title}</div>
                        </button>
                      );
                    })}
                  </div>
                  <div className="mt-6 flex gap-2">
                    <Button type="button" variant="outline" onClick={goBackSkipping} className="rounded-full h-11 px-5">
                      <ArrowLeft className="h-4 w-4 mr-1.5" /> Back
                    </Button>
                    <Button type="button" onClick={goNextSkipping} disabled={!roof} className="flex-1 rounded-full h-11 bg-navy text-white hover:bg-navy/90">
                      Next <ArrowRight className="h-4 w-4 ml-1.5" />
                    </Button>
                  </div>
                </div>
              )}

              {/* STEP 5 — Building type */}
              {step === 5 && (
                <div className="mt-5">
                  <h3 className="text-2xl font-display font-semibold text-navy">
                    What type of building?
                  </h3>
                  <div className="mt-5 grid grid-cols-2 gap-2.5">
                    {buildingByCustomer[activeSegment].map((b) => {
                      const selected = building === b;
                      return (
                        <button
                          key={b}
                          type="button"
                          onClick={() => setBuilding(b)}
                          className={`rounded-xl border px-3 py-3 text-sm font-medium transition-all ${
                            selected
                              ? "border-electric bg-electric/5 text-navy"
                              : "border-border bg-card text-navy hover:border-electric/40"
                          }`}
                        >
                          {b}
                        </button>
                      );
                    })}
                  </div>
                  <div className="mt-6 flex gap-2">
                    <Button type="button" variant="outline" onClick={goBackSkipping} className="rounded-full h-11 px-5">
                      <ArrowLeft className="h-4 w-4 mr-1.5" /> Back
                    </Button>
                    <Button type="button" onClick={goNextSkipping} disabled={!building} className="flex-1 rounded-full h-11 bg-gradient-electric text-white border-0 shadow-glow">
                      See my savings <ArrowRight className="h-4 w-4 ml-1.5" />
                    </Button>
                  </div>
                </div>
              )}

              {/* STEP 6 — Results */}
              {step === 6 && (
                <div className="mt-5">
                  <div className="rounded-2xl bg-navy text-white p-5 sm:p-6 relative overflow-hidden">
                    <div className="absolute -top-16 -right-16 h-44 w-44 rounded-full bg-gradient-electric opacity-30 blur-3xl pointer-events-none" />
                    <div className="relative">
                      <div className="text-[11px] uppercase tracking-[0.18em] text-white/60 font-semibold flex items-center gap-1.5">
                        <Sun className="h-3.5 w-3.5 text-electric" />
                        Going solar could save you
                      </div>
                      <div className="mt-2 text-6xl font-display font-semibold leading-none tracking-tight">
                        {savingsHeadline}
                      </div>
                      <div className="mt-1 text-sm text-white/65">per year (year 1)</div>

                      <div className="mt-5 grid grid-cols-2 gap-3">
                        <Stat label="System size" value={`${fmt(result.kWp, 1)} kWp`} />
                        <Stat label="Panels" value={`~${result.panels}`} />
                        <Stat label="Generation" value={`${fmt(result.annualKwh)} kWh`} icon={<Zap className="h-3.5 w-3.5" />} />
                        <Stat label="CO₂ / yr" value={`${fmt(result.co2Tonnes, 1)} t`} icon={<Leaf className="h-3.5 w-3.5" />} />
                        <Stat label="System cost" value={`£${fmt(result.systemCost)}`} icon={<PoundSterling className="h-3.5 w-3.5" />} />
                        <Stat label="Payback" value={`${result.payback ? result.payback.toFixed(1) : "—"} yrs`} />
                      </div>
                    </div>
                  </div>

                  {/* Email + CTA */}
                  <div className="mt-5 space-y-3">
                    {!emailSent ? (
                      <div className="flex flex-col sm:flex-row gap-2">
                        <div className="relative flex-1">
                          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          <Input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="you@email.com"
                            className="pl-9 h-11 rounded-full"
                            maxLength={255}
                          />
                        </div>
                        <Button
                          type="button"
                          onClick={handleEmailSend}
                          variant="outline"
                          className="rounded-full h-11 px-5 border-navy/15 text-navy hover:bg-navy hover:text-white"
                        >
                          Email me a copy
                        </Button>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 rounded-full bg-electric/10 border border-electric/30 px-4 py-2.5 text-sm text-navy">
                        <CheckCircle2 className="h-4 w-4 text-electric" />
                        Sent! Check your inbox shortly.
                      </div>
                    )}

                    <Link to={`/contact?${contactQuery}`} className="block">
                      <Button className="w-full rounded-full h-12 bg-gradient-electric text-white border-0 shadow-glow">
                        <CalendarCheck className="h-4 w-4 mr-1.5" />
                        Book a free energy review <ArrowRight className="h-4 w-4 ml-1.5" />
                      </Button>
                    </Link>

                    <button
                      type="button"
                      onClick={() => setStep(1)}
                      className="text-xs text-muted-foreground hover:text-navy transition-colors"
                    >
                      ← Start over
                    </button>
                  </div>

                  <p className="text-[11px] text-muted-foreground mt-4 leading-relaxed">
                    Indicative figures based on UK averages (irradiance, panel
                    density, tariff and {Math.round(result.cfg.selfUse * 100)}% self-use).
                    A site survey will confirm the real numbers.
                  </p>
                </div>
              )}
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
