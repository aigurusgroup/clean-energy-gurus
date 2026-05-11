import { useEffect, useRef, useState } from "react";
import { z } from "zod";
import {
  Search, Pencil, RotateCcw, ArrowRight, ArrowLeft,
  Info, Building2, Tractor, KeyRound, Home as HomeIcon,
  Mail, CheckCircle2, CalendarCheck, User, Phone, Briefcase,
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

const KWP_PER_M2 = 0.18;

const contactSchema = z.object({
  name: z.string().trim().min(2, { message: "Please enter your name" }).max(100),
  email: z.string().trim().email({ message: "Enter a valid email" }).max(255),
  phone: z.string().trim().min(7, { message: "Enter a valid phone number" }).max(30),
  business: z.string().trim().max(120).optional().or(z.literal("")),
});

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

  // Wizard state. Step 1=postcode, 2=draw, 3=contact CTA
  const totalSteps = 3;
  const [step, setStep] = useState(1);
  const [postcode, setPostcode] = useState("");
  const [address, setAddress] = useState("");
  const [areaM2, setAreaM2] = useState(0);
  const [mapStatus, setMapStatus] = useState<"idle" | "loading" | "ready" | "error">("idle");
  const [mapError, setMapError] = useState("");
  const [contact, setContact] = useState({ business: "", name: "", email: "", phone: "" });
  const [submitted, setSubmitted] = useState(false);

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

  const fmt = (n: number, d = 0) =>
    n.toLocaleString("en-GB", { minimumFractionDigits: d, maximumFractionDigits: d });

  // Indicative system size from drawn area (used in the contact handoff only)
  const estKwp = areaM2 * 0.7 * KWP_PER_M2;

  const visibleSteps = [1, 2, 3];
  const currentVisibleIndex = visibleSteps.indexOf(step) + 1;

  const goNextSkipping = () => setStep((s) => Math.min(s + 1, totalSteps));
  const goBackSkipping = () => setStep((s) => Math.max(s - 1, 1));

  // Try to extract a UK postcode from the autocomplete address string
  const postcodeFromAddress = (() => {
    const m = address.match(/[A-Z]{1,2}\d[A-Z\d]?\s?\d[A-Z]{2}/i);
    return m ? m[0].toUpperCase() : "";
  })();

  const handleContactSubmit = () => {
    const r = contactSchema.safeParse(contact);
    if (!r.success) {
      toast({ title: "Please check your details", description: r.error.issues[0].message });
      return;
    }
    // Lightweight stub — a Lovable Cloud edge function can deliver this to your inbox / CRM later.
    setSubmitted(true);
    toast({
      title: "Thanks — we'll be in touch",
      description: `We've received your request${r.data.business ? ` for ${r.data.business}` : ""} and will call ${r.data.name.split(" ")[0]} within one UK business day.`,
    });
  };

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

              {/* STEP 3 — Book a call CTA */}
              {step === 3 && (
                <div className="mt-5">
                  {!submitted ? (
                    <>
                      <div className="rounded-2xl bg-navy text-white p-5 sm:p-6 relative overflow-hidden mb-5">
                        <div className="absolute -top-16 -right-16 h-44 w-44 rounded-full bg-gradient-electric opacity-30 blur-3xl pointer-events-none" />
                        <div className="relative">
                          <div className="text-[11px] uppercase tracking-[0.18em] text-white/60 font-semibold flex items-center gap-1.5">
                            <CalendarCheck className="h-3.5 w-3.5 text-electric" />
                            Book your free energy review
                          </div>
                          <div className="mt-2 text-2xl sm:text-3xl font-display font-semibold leading-tight">
                            A quick call. A clear plan. No pressure.
                          </div>
                          <p className="mt-2 text-sm text-white/70 leading-relaxed">
                            We'll review your roof outline ({fmt(areaM2)} m² · ~{fmt(estKwp, 1)} kWp indicative)
                            and call you back within one UK business day with next steps.
                          </p>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <div>
                          <Label htmlFor="solar-business" className="text-xs font-semibold text-navy">
                            Business name <span className="text-muted-foreground font-normal">(if applicable)</span>
                          </Label>
                          <div className="relative mt-1.5">
                            <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                              id="solar-business"
                              value={contact.business}
                              onChange={(e) => setContact((c) => ({ ...c, business: e.target.value }))}
                              placeholder="Acme Ltd"
                              className="pl-9 h-11 rounded-full"
                              maxLength={120}
                            />
                          </div>
                        </div>
                        <div>
                          <Label htmlFor="solar-name" className="text-xs font-semibold text-navy">Your name</Label>
                          <div className="relative mt-1.5">
                            <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                              id="solar-name"
                              value={contact.name}
                              onChange={(e) => setContact((c) => ({ ...c, name: e.target.value }))}
                              placeholder="Jane Smith"
                              className="pl-9 h-11 rounded-full"
                              maxLength={100}
                              required
                            />
                          </div>
                        </div>
                        <div className="grid sm:grid-cols-2 gap-3">
                          <div>
                            <Label htmlFor="solar-email" className="text-xs font-semibold text-navy">Email</Label>
                            <div className="relative mt-1.5">
                              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                              <Input
                                id="solar-email"
                                type="email"
                                value={contact.email}
                                onChange={(e) => setContact((c) => ({ ...c, email: e.target.value }))}
                                placeholder="you@email.com"
                                className="pl-9 h-11 rounded-full"
                                maxLength={255}
                                required
                              />
                            </div>
                          </div>
                          <div>
                            <Label htmlFor="solar-phone" className="text-xs font-semibold text-navy">Phone</Label>
                            <div className="relative mt-1.5">
                              <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                              <Input
                                id="solar-phone"
                                type="tel"
                                value={contact.phone}
                                onChange={(e) => setContact((c) => ({ ...c, phone: e.target.value }))}
                                placeholder="07000 000000"
                                className="pl-9 h-11 rounded-full"
                                maxLength={30}
                                required
                              />
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="mt-6 flex gap-2">
                        <Button type="button" variant="outline" onClick={goBackSkipping} className="rounded-full h-11 px-5">
                          <ArrowLeft className="h-4 w-4 mr-1.5" /> Back
                        </Button>
                        <Button
                          type="button"
                          onClick={handleContactSubmit}
                          className="flex-1 rounded-full h-11 bg-gradient-electric text-white border-0 shadow-glow"
                        >
                          <CalendarCheck className="h-4 w-4 mr-1.5" />
                          Book my free review
                        </Button>
                      </div>
                      <p className="mt-3 text-[11px] text-muted-foreground leading-relaxed">
                        We'll only use these details to contact you about your enquiry.
                        Address {postcodeFromAddress ? `(${postcodeFromAddress}) ` : ""}and roof outline are
                        included automatically.
                      </p>
                    </>
                  ) : (
                    <div className="rounded-2xl bg-electric/5 border border-electric/30 p-6 text-center">
                      <div className="mx-auto h-12 w-12 rounded-full bg-electric/15 grid place-items-center text-electric">
                        <CheckCircle2 className="h-6 w-6" />
                      </div>
                      <h3 className="mt-3 text-xl font-display font-semibold text-navy">Request received</h3>
                      <p className="mt-2 text-sm text-navy-soft">
                        Thanks {contact.name.split(" ")[0]} — we'll be in touch within one UK business day
                        to schedule your free energy review.
                      </p>
                      <button
                        type="button"
                        onClick={() => { setStep(1); setSubmitted(false); }}
                        className="mt-4 text-xs text-muted-foreground hover:text-navy transition-colors"
                      >
                        ← Start a new estimate
                      </button>
                    </div>
                  )}
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
