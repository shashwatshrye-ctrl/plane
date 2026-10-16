"use client";

import React, { useEffect, useRef } from "react";
import { Flight, MapType } from "./types";

interface FlightMapProps {
  flights: Flight[];
  selectedFlightId: string | null;
  onSelectFlightId: (id: string) => void;
  flightTrack: [number, number][];
  mapType: MapType;
  isFollowing: boolean;
  showWeatherOverlay: boolean;
}

// SVG Plane Marker generator in iconic FR24 Golden Yellow (#f7ce00)
function createPlaneMarkerSvg(heading: number, isSelected: boolean) {
  const fillColor = isSelected ? "#ef4444" : "#f7ce00";
  const strokeColor = isSelected ? "#ffffff" : "#181b1f";
  return `
    <div style="width: 28px; height: 28px; display: flex; align-items: center; justify-content: center; transform: rotate(${heading}deg); transition: transform 0.3s ease;">
      <svg width="24" height="24" viewBox="0 0 24 24" fill="${fillColor}" stroke="${strokeColor}" stroke-width="0.8" style="filter: drop-shadow(0 1px 3px rgba(0,0,0,0.8));">
        <path d="M12 2L13.5 9L21 13V15.5L13.5 13.5L13 19.5L16 21.5V23L12 22L8 23V21.5L11 19.5L10.5 13.5L3 15.5V13L10.5 9L12 2Z" />
      </svg>
    </div>
  `;
}

export default function FlightMap({
  flights,
  selectedFlightId,
  onSelectFlightId,
  flightTrack,
  mapType,
  isFollowing,
  showWeatherOverlay,
}: FlightMapProps) {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const mapRef = useRef<any>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const markersRef = useRef<Map<string, any>>(new Map());
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const trackLineRef = useRef<any>(null);

  const selectedFlight = flights.find((f) => f.id === selectedFlightId);

  // Initialize Leaflet Map
  useEffect(() => {
    if (typeof window === "undefined" || !mapContainerRef.current) return;
    let isMounted = true;

    import("leaflet").then((L) => {
      if (!isMounted || !mapContainerRef.current) return;
      if (mapRef.current) return;

      // Fix default Leaflet icon paths
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      delete (L.Icon.Default.prototype as any)._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
        iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
        shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
      });

      const map = L.map(mapContainerRef.current, {
        center: [32.0, 20.0],
        zoom: 3,
        zoomControl: false,
        attributionControl: true,
        minZoom: 2,
        maxZoom: 18,
      });

      const tileUrl =
        mapType === "satellite"
          ? "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
          : mapType === "light"
          ? "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          : "https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Base/MapServer/tile/{z}/{y}/{x}";

      const baseLayer = L.tileLayer(tileUrl, {
        attribution: '&copy; <a href="https://opensky-network.org">OpenSky Network</a> &copy; Esri',
        maxZoom: 19,
      }).addTo(map);

      let labelsLayer: any = null;
      if (mapType === "dark") {
        labelsLayer = L.tileLayer(
          "https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Reference/MapServer/tile/{z}/{y}/{x}",
          { maxZoom: 19 }
        ).addTo(map);
      }

      (map as any)._baseLayer = baseLayer;
      (map as any)._labelsLayer = labelsLayer;
      mapRef.current = map;
    });

    return () => {
      isMounted = false;
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []);

  // Update Tile Layer on mapType change
  useEffect(() => {
    if (!mapRef.current) return;
    import("leaflet").then((L) => {
      const map = mapRef.current;
      if (map._baseLayer) map.removeLayer(map._baseLayer);
      if (map._labelsLayer) {
        map.removeLayer(map._labelsLayer);
        map._labelsLayer = null;
      }

      const tileUrl =
        mapType === "satellite"
          ? "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
          : mapType === "light"
          ? "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          : "https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Base/MapServer/tile/{z}/{y}/{x}";

      map._baseLayer = L.tileLayer(tileUrl, {
        attribution: '&copy; <a href="https://opensky-network.org">OpenSky Network</a> &copy; Esri',
        maxZoom: 19,
      }).addTo(map);

      if (mapType === "dark") {
        map._labelsLayer = L.tileLayer(
          "https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Reference/MapServer/tile/{z}/{y}/{x}",
          { maxZoom: 19 }
        ).addTo(map);
      }
    });
  }, [mapType]);

  // Update Aircraft Markers
  useEffect(() => {
    if (!mapRef.current) return;
    import("leaflet").then((L) => {
      const map = mapRef.current;
      const currentMarkers = markersRef.current;

      flights.forEach((flight) => {
        const isSelected = flight.id === selectedFlightId;
        const heading = flight.heading ?? 0;
        const iconHtml = createPlaneMarkerSvg(heading, isSelected);

        const customIcon = L.divIcon({
          html: iconHtml,
          className: `fr24-plane-marker ${isSelected ? "selected" : ""}`,
          iconSize: [28, 28],
          iconAnchor: [14, 14],
        });

        if (currentMarkers.has(flight.id)) {
          const marker = currentMarkers.get(flight.id);
          marker.setLatLng([flight.latitude, flight.longitude]);
          marker.setIcon(customIcon);
        } else {
          const marker = L.marker([flight.latitude, flight.longitude], {
            icon: customIcon,
            title: `${flight.callsign} (${flight.country})`,
          }).addTo(map);

          marker.bindTooltip(
            `<div class="flex flex-col gap-0.5">
              <span class="font-bold text-yellow-400 text-xs">${flight.callsign}</span>
              <span class="text-slate-300 text-[10px]">${flight.country}</span>
              <span class="text-slate-400 text-[9px]">${flight.altitudeFt ? `${flight.altitudeFt.toLocaleString()} ft` : "—"} · ${flight.velocityKts ? `${flight.velocityKts} kts` : "—"}</span>
            </div>`,
            {
              className: "fr24-tooltip",
              direction: "top",
              offset: [0, -14],
            }
          );

          marker.on("click", (e) => {
            L.DomEvent.stopPropagation(e);
            onSelectFlightId(flight.id);
          });

          currentMarkers.set(flight.id, marker);
        }
      });
    });
  }, [flights, selectedFlightId, onSelectFlightId]);

  // Draw Real OpenSky Track
  useEffect(() => {
    if (!mapRef.current) return;
    import("leaflet").then((L) => {
      const map = mapRef.current;

      if (trackLineRef.current) {
        map.removeLayer(trackLineRef.current);
        trackLineRef.current = null;
      }

      if (!selectedFlight || flightTrack.length === 0) return;

      const trackGroup = L.featureGroup();

      if (flightTrack.length > 1) {
        const pathLine = L.polyline(flightTrack, {
          color: "#f7ce00",
          weight: 3,
          opacity: 0.9,
        });
        trackGroup.addLayer(pathLine);
      }

      const currentPin = L.circleMarker([selectedFlight.latitude, selectedFlight.longitude], {
        radius: 6,
        color: "#f7ce00",
        fillColor: "#181b1f",
        fillOpacity: 1,
        weight: 2,
      }).bindTooltip(`<b>${selectedFlight.callsign}</b> (${selectedFlight.country})`, {
        permanent: true,
        direction: "bottom",
        className: "fr24-tooltip",
      });

      trackGroup.addLayer(currentPin);
      trackGroup.addTo(map);
      trackLineRef.current = trackGroup;

      if (isFollowing) {
        map.panTo([selectedFlight.latitude, selectedFlight.longitude], { animate: true });
      }
    });
  }, [selectedFlight, flightTrack, isFollowing]);

  const handleZoomIn = () => mapRef.current?.zoomIn();
  const handleZoomOut = () => mapRef.current?.zoomOut();
  const handleResetLocation = () => mapRef.current?.flyTo([32.0, 20.0], 3);
  const handleToggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
  };

  return (
    <div className="relative flex-1 w-full h-full overflow-hidden">
      {/* Leaflet Container */}
      <div ref={mapContainerRef} className="absolute inset-0 h-full w-full z-0" />

      {/* Weather Overlay */}
      {showWeatherOverlay && (
        <div className="pointer-events-none absolute inset-0 z-10 bg-radial from-emerald-500/10 via-blue-500/10 to-transparent mix-blend-screen opacity-70" />
      )}

      {/* Floating Right Map Controls */}
      <div className="absolute right-4 top-4 z-20 flex flex-col gap-1.5">
        <div className="flex flex-col rounded-lg border border-neutral-800 bg-[#181b1fe6] shadow-xl backdrop-blur-md overflow-hidden">
          <button
            onClick={handleZoomIn}
            title="Zoom In"
            className="flex h-9 w-9 items-center justify-center text-lg font-bold text-slate-200 hover:bg-neutral-700/80 hover:text-[#f7ce00] transition border-b border-neutral-800"
          >
            +
          </button>
          <button
            onClick={handleZoomOut}
            title="Zoom Out"
            className="flex h-9 w-9 items-center justify-center text-lg font-bold text-slate-200 hover:bg-neutral-700/80 hover:text-[#f7ce00] transition"
          >
            −
          </button>
        </div>

        <button
          onClick={handleToggleFullscreen}
          title="Toggle Fullscreen"
          className="flex h-9 w-9 items-center justify-center rounded-lg border border-neutral-800 bg-[#181b1fe6] text-slate-200 shadow-xl backdrop-blur-md hover:bg-neutral-700/80 hover:text-[#f7ce00] transition"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-5h-4m4 0v4m0-4l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
          </svg>
        </button>

        <button
          onClick={handleResetLocation}
          title="Recenter Map"
          className="flex h-9 w-9 items-center justify-center rounded-lg border border-neutral-800 bg-[#181b1fe6] text-slate-200 shadow-xl backdrop-blur-md hover:bg-neutral-700/80 hover:text-[#f7ce00] transition"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 2v2m0 16v2M2 12h2m16 0h2m-6 0a4 4 0 11-8 0 4 4 0 018 0z" />
          </svg>
        </button>
      </div>
    </div>
  );
}
