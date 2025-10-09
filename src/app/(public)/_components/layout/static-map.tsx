"use client";

import { useEffect, useRef, useState } from "react";
import { loadGoogleMaps, createMap, createMarker } from "@/app/services/google-maps/maps";

export default function StaticMap() {
  const mapRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<google.maps.Map | null>(null);

  useEffect(() => {
    loadGoogleMaps().then(() => {
      if (mapRef.current) {
        // Center at Bangalore
        const bangalore = { lat: 12.9716, lng: 77.5946 };

        const m = createMap(mapRef.current, {
          center: bangalore,
          zoom: 12, // city-level zoom
          disableDefaultUI: true, // optional, removes map controls
        });
        setMap(m);

        // Add marker at Bangalore
        createMarker(m, bangalore, {
          icon: "http://maps.google.com/mapfiles/ms/icons/red-dot.png",
        });
      }
    });
  }, []);

  return (
    <div className="mt-8 md:mt-0 md:ml-12 w-full md:w-150 h-90 rounded-md overflow-hidden border border-gray-200">
      <div ref={mapRef} className="w-full h-full" />
    </div>
  );
}
