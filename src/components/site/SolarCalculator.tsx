import { useEffect, useRef, useState } from "react";
import { z } from "zod";
import {
  Search, Pencil, RotateCcw, ArrowRight, ArrowLeft,
  Info, Building2, Tractor, KeyRound, Home as HomeIcon,
  Mail, CheckCircle2, CalendarCheck, User, Phone, Briefcase,
  TrendingUp, Sun, Leaf, ShieldCheck, BadgeCheck,
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

const KWP_PER_M2 = 0.18;          // kWp per m² of usable roof
const USABLE_FACTOR = 0.7;         // % of drawn area that can carry panels
const YIELD_PER_KWP = 900;         // kWh / kWp / yr (UK average)
const PANEL_WATTS = 0.635;         // tier-1 panel rating (kWp)
const UNIT_RATE = 0.25;            // £/kWh assumed retail tariff for headline savings
const CO2_PER_KWH = 0.207;         // kg CO₂ per kWh (UK grid)
const TREE_KG_CO2 = 21;            // kg CO₂ absorbed per tree per year
const SYSTEM_LIFETIME_YRS = 25;

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
  // Manual drawing state (replaces deprecated DrawingManager)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const drawPolylineRef = useRef<any>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const drawListenersRef = useRef<any[]>([]);
  const drawingActiveRef = useRef(false);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const placesSessionTokenRef = useRef<any>(null);
  const suppressSuggestionsRef = useRef(false);

  // Wizard state. Step 1=postcode, 2=draw, 3=savings, 4=contact CTA
  const totalSteps = 4;
  const [step, setStep] = useState(1);
  const [postcode, setPostcode] = useState("");
  const [address, setAddress] = useState("");
  const [areaM2, setAreaM2] = useState(0);
  const [mapStatus, setMapStatus] = useState<"idle" | "loading" | "ready" | "error">("idle");
  const [mapError, setMapError] = useState("");
  const [contact, setContact] = useState({ business: "", name: "", email: "", phone: "" });
  const [submitted, setSubmitted] = useState(false);
  const [intent, setIntent] = useState<"book" | "email">("book");
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [placeSuggestions, setPlaceSuggestions] = useState<any[]>([]);
  const [suggestionsOpen, setSuggestionsOpen] = useState(false);

  // Init map when its container becomes available
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const googleRef = useRef<any>(null);
  // Load Google Maps script once on mount
  useEffect(() => {
    let cancelled = false;
    if (!GOOGLE_MAPS_API_KEY) {
      setMapStatus("error");
      setMapError("Map preview not configured yet — you can still get an estimate.");
      return;
    }
    setMapStatus("loading");
    // Surface Google Maps auth failures (bad key / referrer / billing) clearly
    (window as unknown as { gm_authFailure?: () => void }).gm_authFailure = () => {
      console.error("[SolarCalculator] Google Maps auth failed — check API key referrer restrictions, billing, and that Maps JavaScript API + Geocoding API are enabled.");
      setMapStatus("error");
      setMapError("Map service rejected this domain. The Google Maps API key needs this published domain added to its referrer allowlist, and Maps JavaScript + Geocoding APIs enabled.");
    };
    loadGoogleMaps()
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .then((google: any) => {
        if (cancelled) return;
        googleRef.current = google;
        setMapStatus("ready");
      })
      .catch((e: Error) => {
        console.error("[SolarCalculator] loadGoogleMaps failed:", e);
        setMapStatus("error");
        setMapError(e.message);
      });
    return () => { cancelled = true; };
  }, []);

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

    // Note: google.maps.drawing.DrawingManager was removed in Maps JS v3.65.
    // We implement click-to-add-vertex drawing manually below via startDrawing().

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

  // Fetch postcode suggestions via Places API (New). Avoid legacy google.maps.places.Autocomplete,
  // which triggers LegacyApiNotActivatedMapError on keys configured only for Places API (New).
  useEffect(() => {
    const query = postcode.trim();
    if (suppressSuggestionsRef.current) {
      suppressSuggestionsRef.current = false;
      return;
    }
    if (mapStatus !== "ready" || query.length < 3) {
      setPlaceSuggestions([]);
      setSuggestionsOpen(false);
      return;
    }

    let cancelled = false;
    const timer = window.setTimeout(async () => {
      try {
        const g = (window as unknown as { google?: any }).google;
        if (!g?.maps?.importLibrary) return;
        const places = await g.maps.importLibrary("places");
        const { AutocompleteSuggestion, AutocompleteSessionToken } = places;
        if (!AutocompleteSuggestion || !AutocompleteSessionToken) return;
        if (!placesSessionTokenRef.current) {
          placesSessionTokenRef.current = new AutocompleteSessionToken();
        }
        const { suggestions = [] } = await AutocompleteSuggestion.fetchAutocompleteSuggestions({
          input: query,
          includedRegionCodes: ["gb"],
          language: "en-GB",
          sessionToken: placesSessionTokenRef.current,
        });
        if (!cancelled) {
          setPlaceSuggestions(suggestions.slice(0, 5));
          setSuggestionsOpen(suggestions.length > 0);
        }
      } catch (e) {
        if (!cancelled) {
          console.warn("[SolarCalculator] Places API (New) suggestions unavailable:", e);
          setPlaceSuggestions([]);
          setSuggestionsOpen(false);
        }
      }
    }, 250);

    return () => {
      cancelled = true;
      window.clearTimeout(timer);
    };
  }, [postcode, mapStatus]);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleSuggestionSelect = async (suggestion: any) => {
    const placePrediction = suggestion?.placePrediction;
    if (!placePrediction) return;
    try {
      const place = placePrediction.toPlace();
      await place.fetchFields({ fields: ["formattedAddress", "location"] });
      const label = place.formattedAddress || getSuggestionLabel(suggestion) || postcode;
      suppressSuggestionsRef.current = true;
      setPostcode(label);
      setAddress(label);
      setPlaceSuggestions([]);
      setSuggestionsOpen(false);
      placesSessionTokenRef.current = null;
      if (place.location && mapRef.current) {
        mapRef.current.setCenter(place.location);
        mapRef.current.setZoom(20);
        mapRef.current.setMapTypeId("satellite");
      }
      setStep(2);
    } catch (e) {
      console.warn("[SolarCalculator] Place details unavailable:", e);
      toast({ title: "Couldn't select that address", description: "Please try the search button instead." });
    }
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const getSuggestionLabel = (suggestion: any) => {
    const text = suggestion?.placePrediction?.text;
    if (typeof text === "string") return text;
    if (typeof text?.text === "string") return text.text;
    const asString = text?.toString?.();
    return asString && asString !== "[object Object]" ? asString : "";
  };

  // Cancel any in-progress click-to-draw session and clean up listeners + preview line.
  const cancelDrawingSession = () => {
    drawingActiveRef.current = false;
    drawListenersRef.current.forEach((l) => {
      try { l.remove?.(); } catch { /* noop */ }
    });
    drawListenersRef.current = [];
    if (drawPolylineRef.current) {
      drawPolylineRef.current.setMap(null);
      drawPolylineRef.current = null;
    }
    if (mapRef.current) mapRef.current.setOptions({ draggableCursor: null });
  };

  const startDrawing = () => {
    const g = (window as unknown as { google?: any }).google;
    const map = mapRef.current;
    if (!g || !map) return;

    // Clear existing polygon + any prior session
    if (polygonRef.current) {
      polygonRef.current.setMap(null);
      polygonRef.current = null;
      setAreaM2(0);
    }
    cancelDrawingSession();

    drawingActiveRef.current = true;
    map.setOptions({ draggableCursor: "crosshair" });

    const polyline = new g.maps.Polyline({
      map,
      path: [],
      strokeColor: "#22d3ee",
      strokeWeight: 2,
      clickable: false,
    });
    drawPolylineRef.current = polyline;

    const finish = () => {
      if (!drawingActiveRef.current) return;
      const path = polyline.getPath();
      if (path.getLength() < 3) {
        // Need at least 3 points; otherwise just cancel.
        cancelDrawingSession();
        return;
      }
      const coords = path.getArray();
      cancelDrawingSession();

      const polygon = new g.maps.Polygon({
        map,
        paths: coords,
        fillColor: "#3b82f6",
        fillOpacity: 0.35,
        strokeColor: "#22d3ee",
        strokeWeight: 2,
        editable: true,
        clickable: true,
      });
      polygonRef.current = polygon;

      const update = () => {
        const a = g.maps.geometry.spherical.computeArea(polygon.getPath());
        setAreaM2(a);
      };
      update();
      const pPath = polygon.getPath();
      pPath.addListener("set_at", update);
      pPath.addListener("insert_at", update);
      pPath.addListener("remove_at", update);
    };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const clickL = map.addListener("click", (e: any) => {
      if (!drawingActiveRef.current || !e.latLng) return;
      polyline.getPath().push(e.latLng);
    });
    const dblL = map.addListener("dblclick", () => finish());

    drawListenersRef.current = [clickL, dblL];
  };

  const resetDrawing = () => {
    cancelDrawingSession();
    if (polygonRef.current) {
      polygonRef.current.setMap(null);
      polygonRef.current = null;
    }
    setAreaM2(0);
  };

  const handlePostcodeSearch = async () => {
    const g = (window as unknown as { google?: any }).google;
    if (!g || !mapRef.current || !postcode.trim()) return;
    const geocoder = new g.maps.Geocoder();
    geocoder.geocode(
      { address: postcode, componentRestrictions: { country: "GB" } },
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (results: any, status: string) => {
        if (status !== "OK" || !results?.[0]) {
          console.warn("[SolarCalculator] Geocoder status:", status, "for postcode:", postcode);
          const friendly =
            status === "REQUEST_DENIED"
              ? "Map service denied the request — the Google Maps API key likely needs the Geocoding API enabled and this domain whitelisted."
              : status === "OVER_QUERY_LIMIT"
              ? "Map service is over its quota — please try again later."
              : "Please check the postcode and try again.";
          toast({ title: "Couldn't find that postcode", description: friendly });
          return;
        }
        const loc = results[0].geometry.location;
        mapRef.current.setCenter(loc);
        mapRef.current.setZoom(19);
        mapRef.current.setMapTypeId("satellite");
        setAddress(results[0].formatted_address);
        setStep(2);
      },
    );
  };

  const fmt = (n: number, d = 0) =>
    n.toLocaleString("en-GB", { minimumFractionDigits: d, maximumFractionDigits: d });

  // Solar specification estimate from drawn area
  const usableM2 = areaM2 * USABLE_FACTOR;
  const kWp = usableM2 * KWP_PER_M2;
  const annualKwh = kWp * YIELD_PER_KWP;
  const cfg = segmentDefaults[segment];
  const annualSavings =
    annualKwh * cfg.selfUse * UNIT_RATE +
    annualKwh * (1 - cfg.selfUse) * cfg.exportRate;
  const panels = Math.max(0, Math.round(kWp / PANEL_WATTS));
  const lifetimeCo2Kg = annualKwh * CO2_PER_KWH * SYSTEM_LIFETIME_YRS;
  const treesEquivalent = Math.round(lifetimeCo2Kg / TREE_KG_CO2);
  const savingsHeadline = (() => {
    const v = annualSavings;
    if (v >= 1000) return `£${(v / 1000).toFixed(v >= 10000 ? 0 : 1)}k`;
    return `£${fmt(v)}`;
  })();

  const visibleSteps = [1, 2, 3, 4];
  const currentVisibleIndex = visibleSteps.indexOf(step) + 1;

  const goNextSkipping = () => setStep((s) => Math.min(s + 1, totalSteps));
  const goBackSkipping = () => {
    setStep((s) => {
      const next = Math.max(s - 1, 1);
      // When returning to step 1, reset the map back to the Arundel default
      // and clear any drawn polygon / search state so the user can start over.
      if (next === 1) {
        if (polygonRef.current) {
          polygonRef.current.setMap(null);
          polygonRef.current = null;
        }
        setAreaM2(0);
        setAddress("");
        setPostcode("");
        cancelDrawingSession();
        if (mapRef.current) {
          mapRef.current.setCenter({ lat: 50.854, lng: -0.554 });
          mapRef.current.setZoom(14);
          mapRef.current.setMapTypeId("roadmap");
        }
      }
      return next;
    });
  };

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
                      onFocus={() => setSuggestionsOpen(placeSuggestions.length > 0)}
                      onBlur={() => window.setTimeout(() => setSuggestionsOpen(false), 150)}
                      onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); handlePostcodeSearch(); } }}
                      placeholder="e.g. RH2 9AR"
                      className="pl-9 h-12 rounded-full text-base"
                      maxLength={120}
                    />
                    {suggestionsOpen && placeSuggestions.length > 0 && (
                      <div className="absolute left-0 right-0 top-[calc(100%+0.5rem)] z-20 overflow-hidden rounded-2xl border border-border bg-background shadow-card">
                        {placeSuggestions.map((suggestion, index) => {
                          const label = getSuggestionLabel(suggestion);
                          if (!label) return null;
                          return (
                            <button
                              key={suggestion.placePrediction?.placeId ?? `${label}-${index}`}
                              type="button"
                              onMouseDown={(event) => event.preventDefault()}
                              onClick={() => handleSuggestionSelect(suggestion)}
                              className="block w-full px-4 py-3 text-left text-sm text-foreground transition-colors hover:bg-muted focus:bg-muted focus:outline-none"
                            >
                              {label}
                            </button>
                          );
                        })}
                      </div>
                    )}
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
                    Enter a UK postcode and hit search to find the property.
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

              {/* STEP 3 — Savings detail */}
              {step === 3 && (
                <div className="mt-5">
                  <div className="rounded-2xl bg-navy text-white p-5 sm:p-6 relative overflow-hidden">
                    <div className="absolute -top-16 -right-16 h-44 w-44 rounded-full bg-gradient-electric opacity-30 blur-3xl pointer-events-none" />
                    <div className="relative">
                      <div className="text-sm font-display text-white/80">
                        Cut your electricity bill {segment === "home" ? "at home" : "on site"}
                      </div>
                      <div className="mt-3 flex items-end gap-2">
                        <div className="text-6xl sm:text-7xl font-display font-semibold leading-none tracking-tight text-electric">
                          {savingsHeadline}
                        </div>
                        <TrendingUp className="h-6 w-6 text-electric mb-2" />
                      </div>
                      <div className="mt-2 text-sm text-white/70">per year</div>
                      <p className="mt-5 text-xs text-white/65 leading-relaxed">
                        No obligation — survey → tailored design → quote.
                      </p>
                    </div>
                  </div>

                  <div className="mt-5 rounded-2xl bg-card border border-border p-5 sm:p-6">
                    <h3 className="text-lg font-display font-semibold text-navy">
                      Your estimated solar specification
                    </h3>
                    <ul className="mt-4 space-y-4">
                      <li>
                        <div className="text-electric font-display font-semibold text-xl">
                          £{fmt(annualSavings)}
                        </div>
                        <div className="text-sm text-navy">Your year 1 potential bill savings</div>
                        <div className="text-[11px] text-muted-foreground mt-0.5">
                          (assuming a unit rate of {Math.round(UNIT_RATE * 100)}p/kWh)
                        </div>
                      </li>
                      <li>
                        <div className="text-electric font-display font-semibold text-xl flex items-center gap-1.5">
                          <Sun className="h-4 w-4" /> System size: {fmt(kWp, 1)} kWp
                        </div>
                        <div className="text-sm text-navy">Estimated system size based upon roof area</div>
                      </li>
                      <li>
                        <div className="text-electric font-display font-semibold text-xl">
                          {panels} solar panels
                        </div>
                        <div className="text-sm text-navy">
                          Our recommended tier 1 solar panels{" "}
                          <span className="text-muted-foreground">({Math.round(PANEL_WATTS * 1000)}W each)</span>
                        </div>
                      </li>
                      <li>
                        <div className="text-electric font-display font-semibold text-xl flex items-center gap-1.5">
                          <Leaf className="h-4 w-4" /> {fmt(treesEquivalent)} trees planted
                        </div>
                        <div className="text-sm text-navy">CO₂e impact over the lifetime of your solar system</div>
                      </li>
                    </ul>

                    {/* Accreditations */}
                    <div className="mt-6 pt-5 border-t border-border">
                      <div className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground font-semibold">
                        Accredited
                      </div>
                      <div className="mt-3 flex flex-wrap gap-2">
                        {[
                          { icon: ShieldCheck, label: "MCS certified" },
                          { icon: BadgeCheck, label: "RECC" },
                          { icon: BadgeCheck, label: "OZEV partner" },
                        ].map(({ icon: I, label }) => (
                          <div
                            key={label}
                            className="inline-flex items-center gap-1.5 rounded-full border border-border bg-accent/40 px-3 py-1.5 text-xs font-semibold text-navy"
                          >
                            <I className="h-3.5 w-3.5 text-electric" />
                            {label}
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Disclaimer */}
                    <p className="mt-5 text-[11px] text-muted-foreground leading-relaxed">
                      Indicative estimate only. Figures are based on your drawn roof
                      area ({fmt(areaM2)} m² · {Math.round(USABLE_FACTOR * 100)}% usable),
                      a UK average yield of {YIELD_PER_KWP} kWh/kWp/yr, an assumed
                      unit rate of {Math.round(UNIT_RATE * 100)}p/kWh and{" "}
                      {Math.round(cfg.selfUse * 100)}% self-consumption. A site
                      survey will confirm pitch, orientation, shading, DNO capacity
                      and the final design. Savings are not guaranteed.
                    </p>
                  </div>

                  <div className="mt-6 flex flex-col gap-2">
                    <Button
                      type="button"
                      onClick={() => { setIntent("book"); goNextSkipping(); }}
                      className="w-full rounded-full h-11 bg-gradient-electric text-white border-0 shadow-glow"
                    >
                      <CalendarCheck className="h-4 w-4 mr-1.5" />
                      Book my free review <ArrowRight className="h-4 w-4 ml-1.5" />
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => { setIntent("email"); goNextSkipping(); }}
                      className="w-full rounded-full h-11"
                    >
                      <Mail className="h-4 w-4 mr-1.5" />
                      Email me a copy
                    </Button>
                    <Button type="button" variant="ghost" onClick={goBackSkipping} className="rounded-full h-10 px-4 self-start text-muted-foreground">
                      <ArrowLeft className="h-4 w-4 mr-1.5" /> Back
                    </Button>
                  </div>
                </div>
              )}

              {/* STEP 4 — Book a call CTA */}
              {step === 4 && (
                <div className="mt-5">
                  {!submitted ? (
                    <>
                      <div className="rounded-2xl bg-navy text-white p-5 sm:p-6 relative overflow-hidden mb-5">
                        <div className="absolute -top-16 -right-16 h-44 w-44 rounded-full bg-gradient-electric opacity-30 blur-3xl pointer-events-none" />
                        <div className="relative">
                          <div className="text-[11px] uppercase tracking-[0.18em] text-white/60 font-semibold flex items-center gap-1.5">
                            {intent === "email" ? <Mail className="h-3.5 w-3.5 text-electric" /> : <CalendarCheck className="h-3.5 w-3.5 text-electric" />}
                            {intent === "email" ? "Email me my solar estimate" : "Book your free energy review"}
                          </div>
                          <div className="mt-2 text-2xl sm:text-3xl font-display font-semibold leading-tight">
                            {intent === "email" ? "A few details and your copy is on its way." : "A quick call. A clear plan. No pressure."}
                          </div>
                          <p className="mt-2 text-sm text-white/70 leading-relaxed">
                            {intent === "email"
                              ? <>We'll email your tailored estimate ({fmt(areaM2)} m² · ~{fmt(kWp, 1)} kWp · est. {savingsHeadline}/yr) and a specialist will follow up within one UK business day.</>
                              : <>We'll review your roof outline ({fmt(areaM2)} m² · ~{fmt(kWp, 1)} kWp · est. {savingsHeadline}/yr) and call you back within one UK business day with next steps.</>}
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
                          {intent === "email" ? <Mail className="h-4 w-4 mr-1.5" /> : <CalendarCheck className="h-4 w-4 mr-1.5" />}
                          {intent === "email" ? "Email me my estimate" : "Book my free review"}
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
