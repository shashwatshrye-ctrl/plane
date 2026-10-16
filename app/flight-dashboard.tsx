"use client";

import React, { useEffect, useState, useMemo, useCallback } from "react";
import { Flight, FlightRoute, MapType, parseOpenSkyState } from "./components/types";
import TopNavBar from "./components/TopNavBar";
import FlightMap from "./components/FlightMap";
import LeftWidgets from "./components/LeftWidgets";
import FlightDossier from "./components/FlightDossier";
import BottomToolbar from "./components/BottomToolbar";
import CockpitHudModal from "./components/CockpitHudModal";

export default function FlightDashboard() {
  const [flights, setFlights] = useState<Flight[]>([]);
  const [totalLivePlanes, setTotalLivePlanes] = useState<number>(0);
  const [selectedFlightId, setSelectedFlightId] = useState<string | null>(null);
  const [flightRoute, setFlightRoute] = useState<FlightRoute | null>(null);
  const [flightTrack, setFlightTrack] = useState<[number, number][]>([]);

  const [searchQuery, setSearchQuery] = useState("");
  const [searchFocused, setSearchFocused] = useState(false);
  const [utcTime, setUtcTime] = useState("");
  const [mapType, setMapType] = useState<MapType>("dark");
  const [showWeatherOverlay, setShowWeatherOverlay] = useState(false);
  const [showCockpitHud, setShowCockpitHud] = useState(false);
  const [altitudeRange, setAltitudeRange] = useState<number>(45000);
  const [speedRange, setSpeedRange] = useState<number>(650);
  const [isFollowing, setIsFollowing] = useState(false);
  const [rightPanelOpen, setRightPanelOpen] = useState(true);
  const [isFetchingLive, setIsFetchingLive] = useState(false);

  const selectedFlight = useMemo(
    () => flights.find((f) => f.id === selectedFlightId) || null,
    [flights, selectedFlightId]
  );

  useEffect(() => {
    const updateTime = () => {
      setUtcTime(
        new Date().toLocaleTimeString("en-GB", {
          timeZone: "UTC",
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        })
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const fetchLiveAircraft = useCallback(async () => {
    try {
      setIsFetchingLive(true);
      const res = await fetch("/api/aircraft", { cache: "no-store" });
      if (!res.ok) throw new Error(`HTTP error ${res.status}`);
      const data = await res.json();
      if (!data.states || !Array.isArray(data.states)) return;

      setTotalLivePlanes(data.states.length);

      const parsedFlights: Flight[] = [];
      let count = 0;
      for (let i = 0; i < data.states.length; i++) {
        const parsed = parseOpenSkyState(data.states[i]);
        if (parsed && !parsed.onGround && parsed.altitudeFt != null) {
          parsedFlights.push(parsed);
          count++;
          if (count >= 500) break;
        }
      }

      setFlights(parsedFlights);

      setSelectedFlightId((current) => {
        if (current && parsedFlights.some((f) => f.id === current)) return current;
        return parsedFlights[0]?.id || null;
      });
    } catch (err) {
      console.error("Failed to fetch OpenSky aircraft feed:", err);
    } finally {
      setIsFetchingLive(false);
    }
  }, []);

  useEffect(() => {
    fetchLiveAircraft();
    const interval = setInterval(fetchLiveAircraft, 12000);
    return () => clearInterval(interval);
  }, [fetchLiveAircraft]);

  useEffect(() => {
    if (!selectedFlightId) {
      setFlightRoute(null);
      setFlightTrack([]);
      return;
    }

    const flight = flights.find((f) => f.id === selectedFlightId);
    if (!flight) return;

    fetch(`/api/aircraft?track=${encodeURIComponent(flight.id)}`, { cache: "no-store" })
      .then((r) => r.json())
      .then((trackData) => {
        if (trackData && Array.isArray(trackData.path) && trackData.path.length > 0) {
          const points = trackData.path
            .filter((p: any) => p[1] != null && p[2] != null)
            .map((p: any) => [p[1], p[2]] as [number, number]);
          setFlightTrack(points);
        } else {
          setFlightTrack([[flight.latitude, flight.longitude]]);
        }
      })
      .catch(() => setFlightTrack([[flight.latitude, flight.longitude]]));

    if (flight.callsign && flight.callsign.length >= 3) {
      fetch(`/api/aircraft?callsign=${encodeURIComponent(flight.callsign)}`, { cache: "no-store" })
        .then((r) => r.json())
        .then((routeData) => {
          if (routeData && Array.isArray(routeData.route) && routeData.route.length >= 2) {
            setFlightRoute({
              origin: routeData.route[0],
              destination: routeData.route[routeData.route.length - 1],
              operatorIata: routeData.operatorIata,
              flightNumber: routeData.flightNumber,
            });
          } else {
            setFlightRoute(null);
          }
        })
        .catch(() => setFlightRoute(null));
    } else {
      setFlightRoute(null);
    }
  }, [selectedFlightId, flights]);

  const handleSelectFlight = useCallback((flight: Flight) => {
    setSelectedFlightId(flight.id);
    setRightPanelOpen(true);
  }, []);

  const filteredFlights = useMemo(() => {
    return flights.filter((f) => {
      const query = searchQuery.toLowerCase();
      const matchSearch =
        !query ||
        f.callsign.toLowerCase().includes(query) ||
        f.country.toLowerCase().includes(query) ||
        f.id.toLowerCase().includes(query);
      const alt = f.altitudeFt ?? 0;
      const spd = f.velocityKts ?? 0;
      return matchSearch && alt <= altitudeRange && spd <= speedRange;
    });
  }, [flights, searchQuery, altitudeRange, speedRange]);

  const airspaceStats = useMemo(() => {
    if (!flights.length) return null;
    const total = flights.length;
    const sumAlt = flights.reduce((acc, f) => acc + (f.altitudeFt ?? 0), 0);
    const avgAlt = Math.round(sumAlt / total);
    const sumSpd = flights.reduce((acc, f) => acc + (f.velocityKts ?? 0), 0);
    const avgSpd = Math.round(sumSpd / total);

    const countryCounts: Record<string, number> = {};
    flights.forEach((f) => {
      countryCounts[f.country] = (countryCounts[f.country] || 0) + 1;
    });
    const topCountries = Object.entries(countryCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 4);

    return {
      totalTracked: total,
      avgAlt,
      avgSpd,
      topCountries,
    };
  }, [flights]);

  return (
    <div className="relative flex h-screen w-screen flex-col overflow-hidden bg-[#181b1f] text-slate-100 select-none">
      <TopNavBar
        mapType={mapType}
        setMapType={setMapType}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        searchFocused={searchFocused}
        setSearchFocused={setSearchFocused}
        filteredFlights={filteredFlights}
        onSelectFlight={handleSelectFlight}
        totalLivePlanes={totalLivePlanes}
        utcTime={utcTime}
        rightPanelOpen={rightPanelOpen}
        setRightPanelOpen={setRightPanelOpen}
        onResetLocation={() => {
          setSelectedFlightId(null);
        }}
      />

      <div className="relative flex flex-1 w-full h-[calc(100vh-62px)] overflow-hidden">
        <FlightMap
          flights={filteredFlights}
          selectedFlightId={selectedFlightId}
          onSelectFlightId={(id) => {
            setSelectedFlightId(id);
            setRightPanelOpen(true);
          }}
          flightTrack={flightTrack}
          mapType={mapType}
          isFollowing={isFollowing}
          showWeatherOverlay={showWeatherOverlay}
        />

        <LeftWidgets
          flights={filteredFlights}
          selectedFlightId={selectedFlightId}
          onSelectFlight={handleSelectFlight}
          airspaceStats={airspaceStats}
        />

        <BottomToolbar
          mapType={mapType}
          setMapType={setMapType}
          showWeatherOverlay={showWeatherOverlay}
          setShowWeatherOverlay={setShowWeatherOverlay}
          altitudeRange={altitudeRange}
          setAltitudeRange={setAltitudeRange}
          speedRange={speedRange}
          setSpeedRange={setSpeedRange}
          onRefresh={fetchLiveAircraft}
          isFetchingLive={isFetchingLive}
        />

        {showCockpitHud && selectedFlight && (
          <CockpitHudModal
            flight={selectedFlight}
            onClose={() => setShowCockpitHud(false)}
          />
        )}

        {rightPanelOpen && (
          <FlightDossier
            selectedFlight={selectedFlight}
            flightRoute={flightRoute}
            flightTrackCount={flightTrack.length}
            onClose={() => setSelectedFlightId(null)}
            onCenterFlight={() => {
              if (selectedFlight) {
              }
            }}
            isFollowing={isFollowing}
            onToggleFollow={() => setIsFollowing(!isFollowing)}
            onOpenHud={() => setShowCockpitHud(true)}
          />
        )}
      </div>
    </div>
  );
}
