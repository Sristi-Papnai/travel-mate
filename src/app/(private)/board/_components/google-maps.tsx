"use client";

import { saveLocationAction } from "@/app/actions/trip-actions";
import { createMap, createMarker, loadGoogleMaps } from "@/app/services/google-maps/maps";
import { useEffect, useRef, useState } from "react";

interface SavedLocation {
  id: number;
  name: string;
  latitude: string;
  longitude: string;
}

export default function GoogleMaps({
  tripId,
  userId,
  initialLocations,
}: {
  tripId: number;
  userId: number;
  initialLocations: SavedLocation[];
}) {
  const mapRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [searchMarker, setSearchMarker] = useState<google.maps.Marker | null>(null);
  const [searchPlace, setSearchPlace] = useState<{ name: string; lat: number; lng: number } | null>(null);

  // ✅ Load map
  useEffect(() => {
    console.log("here for load mMApa")
    loadGoogleMaps().then(() => {
      if (mapRef.current) {
        const m = createMap(mapRef.current, {
          center: { lat: 28.6139, lng: 77.2090 }, 
          zoom: 5,
        });
        setMap(m);

        // render initial saved markers
        initialLocations.forEach(loc => {
          const marker = createMarker(m, {
            lat: parseFloat(loc.latitude),
            lng: parseFloat(loc.longitude),
          }, { icon: "http://maps.google.com/mapfiles/ms/icons/red-dot.png"  });

          const infowindow = new google.maps.InfoWindow({
            content: `<div>${loc.name}</div>`,
          });

          marker.addListener("click", () => infowindow.open(m, marker));
        });
      }
    });
  }, [initialLocations]);

  // ✅ Handle search
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!map) return;

    const input = (e.target as HTMLFormElement).querySelector("input")!;
    const query = input.value;
    if (!query) return;

    const service = new google.maps.places.PlacesService(map);
    const request = { query, fields: ["name", "geometry"] };

    service.findPlaceFromQuery(request, (results, status) => {
      if (status === google.maps.places.PlacesServiceStatus.OK && results && results[0].geometry?.location) {
        const loc = results[0].geometry.location;
        const name = results[0].name || query;
        const coords = { lat: loc.lat(), lng: loc.lng() };

        // Clear old blue marker
        if (searchMarker) searchMarker.setMap(null);

        const marker = createMarker(map, coords, {
          icon: "http://maps.google.com/mapfiles/ms/icons/blue-dot.png",
        });
        setSearchMarker(marker);
        setSearchPlace({ name, lat: coords.lat, lng: coords.lng });
        map.setCenter(coords);
      }
    });
  };

  // ✅ Handle Add
  const handleAdd = async () => {
    if (!searchPlace || !map) return;

    const saved = await saveLocationAction({
      tripId,
      userId,
      name: searchPlace.name,
      latitude: String(searchPlace.lat),
      longitude: String(searchPlace.lng),
    });

    // Remove blue marker
    if (searchMarker) searchMarker.setMap(null);

    // Add red marker
    const marker = createMarker(map, { lat: searchPlace.lat, lng: searchPlace.lng }, {
      icon: "http://maps.google.com/mapfiles/ms/icons/red-dot.png" ,
    });

    const infowindow = new google.maps.InfoWindow({
      content: `<div>${saved.name}</div>`,
    });
    marker.addListener("click", () => infowindow.open(map, marker));

    setSearchMarker(null);
    setSearchPlace(null);
  };

  return (
    <div>
      {/* Search bar */}
      <form onSubmit={handleSearch} className="flex gap-2 mb-3">
        <input
          type="text"
          placeholder="Find a place..."
          className="flex-1 text-black pl-3 pr-3 py-2 border border-purple-300 rounded-md focus:ring-2 focus:ring-purple-800 focus:border-transparent"
        />
        <button
          type="submit"
          className="px-3 py-2 bg-[#5A2D82] text-white rounded-md hover:bg-purple-800"
        >
          Search
        </button>
        <button
          type="button"
          onClick={handleAdd}
          className="px-3 py-2 bg-green-600 text-white rounded-md hover:bg-green-800"
        >
          Add
        </button>
      </form>

      {/* Map */}
      <div ref={mapRef} className="h-200 w-full rounded-md border border-gray-200" />
    </div>
  );
}
