"use client";

import { saveLocationAction } from "@/app/actions/trip-actions";
import { createMap, createMarker, loadGoogleMaps } from "@/app/services/google-maps/maps";
// import type { Trip } from "@/interfaces/openapi";
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
  // setFormData
}: {
  tripId: number;
  userId: number;
  initialLocations: SavedLocation[];
  // setFormData:(data: Trip) => void;
}) {
  const mapRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [searchMarker, setSearchMarker] = useState<google.maps.Marker | null>(null);
  const [searchPlace, setSearchPlace] = useState<{ name: string; lat: number; lng: number } | null>(null);

  const [pinnedMarker, setPinnedMarker] = useState<google.maps.Marker | null>(null);
  const [pinnedCoords, setPinnedCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [pinnedLabel, setPinnedLabel] = useState<string>("");

  useEffect(() => {
    console.log("initial locations")
    console.log(initialLocations);
  }, [initialLocations])

  // ✅ Load map + Autocomplete
  useEffect(() => {
    loadGoogleMaps().then(() => {
      if (mapRef.current) {
          const m = createMap(mapRef.current, {
            center: { lat: 28.6139, lng: 77.209 }, // fallback
            zoom: 5,
          });
          setMap(m);
        
          const bounds = new google.maps.LatLngBounds();
        
          // render initial saved markers
          initialLocations.forEach((loc) => {
            const position = { lat: parseFloat(loc.latitude), lng: parseFloat(loc.longitude) };
        
            const marker = createMarker(
              m,
              position,
              { icon: "http://maps.google.com/mapfiles/ms/icons/red-dot.png" }
            );
        
            const infowindow = new google.maps.InfoWindow({
              content: `<div class="text-black font-bold">${loc.name}</div>`,
            });
            marker.addListener("mouseover", () => {
              infowindow.open(m, marker);
            });
            marker.addListener("mouseout", () => {
              infowindow.close();
            });
        
            bounds.extend(position); // ✅ include this marker in bounds
          });
        
          // ✅ Adjust map to fit all markers
          if (!bounds.isEmpty()) {
            m.fitBounds(bounds);
          }
        

        // ✅ Add autocomplete to input
        if (inputRef.current) {
          const autocomplete = new google.maps.places.Autocomplete(inputRef.current, {
            fields: ["name", "geometry"],
          });

          autocomplete.addListener("place_changed", () => {
            const place = autocomplete.getPlace();
            if (place.geometry?.location) {
              const coords = {
                lat: place.geometry.location.lat(),
                lng: place.geometry.location.lng(),
              };
              const name = place.name || inputRef.current?.value || "";

              // Clear old blue marker
              if (searchMarker) searchMarker.setMap(null);

              const marker = createMarker(m, coords, {
                icon: "http://maps.google.com/mapfiles/ms/icons/blue-dot.png",
              });
              setSearchMarker(marker);
              setSearchPlace({ name, lat: coords.lat, lng: coords.lng });
              m.setCenter(coords);
            }
          });
        }

        // ✅ Click-to-pin functionality
        m.addListener("click", (e: google.maps.MapMouseEvent) => {
          if (!e.latLng) return;

          // Clear previous pinned marker
          if (pinnedMarker) pinnedMarker.setMap(null);

          const coords = { lat: e.latLng.lat(), lng: e.latLng.lng() };

          const marker = createMarker(m, coords, {
            icon: "http://maps.google.com/mapfiles/ms/icons/yellow-dot.png",
            draggable: true,
          });

          setPinnedMarker(marker);
          setPinnedCoords(coords);

          marker.addListener("dragend", (event: google.maps.MapMouseEvent) => {
            if (event.latLng) {
              setPinnedCoords({ lat: event.latLng.lat(), lng: event.latLng.lng() });
            }
          });
          
        });
      }
    });
  }, [initialLocations]);

  // ✅ Handle Add (from search suggestion)
  const handleAddSearchPlace = async () => {
    if (!searchPlace || !map) return;

    const saved = await saveLocationAction({
      tripId,
      userId,
      name: searchPlace.name,
      latitude: String(searchPlace.lat),
      longitude: String(searchPlace.lng),
    });

    if(saved.success && saved.new_location){
      // setFormData((prev) => {
      //   if (!prev) return prev; // do nothing if prev is null
      //   return {
      //     ...prev,
      //     locations: [...(prev.locations || []), saved.new_location],
      //   };
      // });
      
      

      console.log("saved location setfordata")
      console.log(saved)
      // Remove blue marker
      if (searchMarker) searchMarker.setMap(null);
  
      // Add red marker
      const marker = createMarker(map, { lat: searchPlace.lat, lng: searchPlace.lng }, {
        icon: "http://maps.google.com/mapfiles/ms/icons/red-dot.png",
      });
  
      const infowindow = new google.maps.InfoWindow({
        content: `<div>${saved.new_location.name}</div>`,
      });
      marker.addListener("click", () => infowindow.open(map, marker));
  
      marker.addListener("mouseover", () => {
        infowindow.open(map, marker);
      });
      marker.addListener("mouseout", () => {
        infowindow.close();
      });
  
      setSearchMarker(null);
      setSearchPlace(null);
      if (inputRef.current) inputRef.current.value = "";
    }

  };

  // ✅ Handle Save pinned marker
  const handleSavePinned = async () => {
    if (!pinnedCoords || !pinnedLabel || !map) return;

    const saved = await saveLocationAction({
      tripId,
      userId,
      name: pinnedLabel,
      latitude: String(pinnedCoords.lat),
      longitude: String(pinnedCoords.lng),
    });
    if (saved.success && saved.new_location) {
      // setFormData((prev) => {
      //   if (!prev) return prev; // handle null safely
      //   return {
      //     ...prev,
      //     locations: [...(prev.locations || []), saved.new_location],
      //   };
      // });
      // Add permanent red marker
      const marker = createMarker(map, pinnedCoords, {
        icon: "http://maps.google.com/mapfiles/ms/icons/red-dot.png",
      });
  
      const infowindow = new google.maps.InfoWindow({
        content: `<div>${saved.new_location.name}</div>`,
      });
      marker.addListener("click", () => infowindow.open(map, marker));
  
      marker.addListener("mouseover", () => {
        infowindow.open(map, marker);
      });
      marker.addListener("mouseout", () => {
        infowindow.close();
      });
  
      // Clear pinned state
      if (pinnedMarker) pinnedMarker.setMap(null);
      setPinnedMarker(null);
      setPinnedCoords(null);
      setPinnedLabel("");
     }

  };

  return (
    <div>
      {/* Search bar */}
      <div className="flex gap-2 mb-3">
        <input
          ref={inputRef}
          type="text"
          placeholder="Find a place..."
          className="flex-1 text-black pl-3 pr-3 py-2 border border-purple-300 rounded-md focus:ring-2 focus:ring-purple-800 focus:border-transparent"
          onFocus={(e) => e.stopPropagation()}
          onMouseDown={(e) => e.stopPropagation()}
        />
        <button
          type="button"
          onClick={handleAddSearchPlace}
          className="px-3 py-2 bg-green-600 text-white rounded-md hover:bg-green-800"
        >
          Add
        </button>
      </div>

      {/* Pinned marker input */}
      {pinnedCoords && (
        <div className="flex gap-2 mb-3">
          <input
            type="text"
            placeholder="Enter label for pinned location"
            value={pinnedLabel}
            onChange={(e) => setPinnedLabel(e.target.value)}
            className="flex-1 text-black pl-3 pr-3 py-2 border border-purple-300 rounded-md focus:ring-2 focus:ring-purple-800 focus:border-transparent"
          />
          <button
            type="button"
            onClick={handleSavePinned}
            className="px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-800"
          >
            Save
          </button>
        </div>
      )}

      {/* Map */}
      <div ref={mapRef} className="h-200 w-full rounded-md border border-gray-200" />
    </div>
  );
}
