// service/maps.ts
let googleMapsScriptLoading: Promise<void> | null = null;

export function loadGoogleMaps(): Promise<void> {
  if (typeof window !== "undefined" && (window as any).google) {
    return Promise.resolve();
  }

  if (!googleMapsScriptLoading) {
    googleMapsScriptLoading = new Promise((resolve, reject) => {
      const script = document.createElement("script");
      script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&libraries=places`;
      script.async = true;
      script.defer = true;
      script.onload = () => resolve();
      script.onerror = (err) => reject(err);
      document.head.appendChild(script);
    });
  }
  return googleMapsScriptLoading;
}

export function createMap(mapContainer: HTMLElement, options: google.maps.MapOptions) {
  return new google.maps.Map(mapContainer, options);
}

export function createMarker(map: google.maps.Map, position: google.maps.LatLngLiteral, options: google.maps.MarkerOptions) {
  return new google.maps.Marker({
    map,
    position,
    ...options,
  });
}
