// Lightweight on-demand loader for the Google Maps JS API.
// Set VITE_GOOGLE_MAPS_API_KEY in your environment.

let loadingPromise: Promise<typeof google> | null = null;

export const GOOGLE_MAPS_API_KEY: string =
  (import.meta.env.VITE_GOOGLE_MAPS_API_KEY as string | undefined) ?? "";

export const loadGoogleMaps = (): Promise<typeof google> => {
  if (typeof window === "undefined") {
    return Promise.reject(new Error("Google Maps can only load in the browser"));
  }
  if ((window as unknown as { google?: typeof google }).google?.maps) {
    return Promise.resolve((window as unknown as { google: typeof google }).google);
  }
  if (loadingPromise) return loadingPromise;
  if (!GOOGLE_MAPS_API_KEY) {
    return Promise.reject(new Error("Missing VITE_GOOGLE_MAPS_API_KEY"));
  }

  loadingPromise = new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = `https://maps.googleapis.com/maps/api/js?key=${encodeURIComponent(
      GOOGLE_MAPS_API_KEY,
    )}&libraries=drawing,geometry,places&v=weekly&loading=async`;
    script.async = true;
    script.defer = true;
    script.onload = () => {
      const g = (window as unknown as { google?: typeof google }).google;
      if (g?.maps) resolve(g);
      else reject(new Error("Google Maps failed to initialise"));
    };
    script.onerror = () => reject(new Error("Failed to load Google Maps script"));
    document.head.appendChild(script);
  });

  return loadingPromise;
};
