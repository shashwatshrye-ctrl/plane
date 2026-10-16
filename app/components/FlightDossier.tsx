"use client";

import React from "react";
import { Flight, FlightRoute } from "./types";

interface FlightDossierProps {
  selectedFlight: Flight | null;
  flightRoute: FlightRoute | null;
  flightTrackCount: number;
  onClose: () => void;
  onCenterFlight: () => void;
  isFollowing: boolean;
  onToggleFollow: () => void;
  onOpenHud: () => void;
}

export default function FlightDossier({
  selectedFlight,
  flightRoute,
  flightTrackCount,
  onClose,
  onCenterFlight,
  isFollowing,
  onToggleFollow,
  onOpenHud,
}: FlightDossierProps) {
  if (!selectedFlight) {
    return (
      <aside className="absolute right-0 top-0 bottom-0 z-20 flex w-96 flex-col border-l border-neutral-800 bg-[#181b1ff8] shadow-2xl backdrop-blur-xl overflow-y-auto">
        <div className="p-4 flex flex-col gap-4 text-center">
          <div className="rounded-xl border border-neutral-800 bg-neutral-900/60 p-6">
            <div className="text-3xl mb-2">✈</div>
            <h3 className="text-sm font-bold text-white mb-1">Select an aircraft</h3>
            <p className="text-xs text-neutral-400">
              Click any yellow airplane marker on the map to inspect its real OpenSky telemetry, route, and historical flight track.
            </p>
          </div>
        </div>
      </aside>
    );
  }

  return (
    <aside className="absolute right-0 top-0 bottom-0 z-20 flex w-96 flex-col border-l border-neutral-800 bg-[#181b1ff8] shadow-2xl backdrop-blur-xl overflow-y-auto">
      <div className="flex flex-col">
        {/* Header Banner */}
        <div className="relative h-36 w-full bg-gradient-to-br from-neutral-800 via-neutral-900 to-[#181b1f] p-4 flex flex-col justify-between border-b border-neutral-800">
          <div className="flex items-center justify-between text-xs">
            <span className="rounded bg-yellow-400/20 border border-yellow-400/40 px-2 py-0.5 font-bold text-yellow-400">
              {selectedFlight.category}
            </span>
            <button
              onClick={onClose}
              className="flex h-6 w-6 items-center justify-center rounded-full bg-black/60 text-white hover:bg-neutral-800 transition"
            >
              ✕
            </button>
          </div>

          <div>
            <div className="text-[11px] font-semibold tracking-wider text-slate-300 uppercase">
              {selectedFlight.country}
            </div>
            <div className="text-2xl font-black tracking-tight text-white flex items-center gap-2">
              <span>{selectedFlight.callsign}</span>
              <span className="text-xs font-mono font-bold text-yellow-400 bg-neutral-800/80 px-1.5 py-0.5 rounded border border-neutral-700">
                HEX {selectedFlight.id.toUpperCase()}
              </span>
            </div>
          </div>
        </div>

        {/* Route Bar */}
        <div className="border-b border-neutral-800 bg-neutral-900/60 p-4">
          {flightRoute ? (
            <div className="flex items-center justify-between">
              <div className="flex flex-col">
                <span className="text-2xl font-black text-white">{flightRoute.origin}</span>
                <span className="text-xs font-semibold text-slate-200">Origin ICAO</span>
              </div>
              <div className="flex flex-1 flex-col items-center px-4">
                <span className="text-yellow-400 text-lg">✈ ➔</span>
                <span className="text-[10px] font-mono text-neutral-400">
                  {flightRoute.operatorIata ? `FLIGHT ${flightRoute.operatorIata}${flightRoute.flightNumber || ""}` : "ACTIVE ROUTE"}
                </span>
              </div>
              <div className="flex flex-col text-right">
                <span className="text-2xl font-black text-white">{flightRoute.destination}</span>
                <span className="text-xs font-semibold text-slate-200">Destination ICAO</span>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-between">
              <div className="flex flex-col">
                <span className="text-sm font-bold text-slate-200">EN-ROUTE FLIGHT</span>
                <span className="text-[11px] text-neutral-400">{selectedFlight.country} Airspace</span>
              </div>
              <div className="text-right">
                <span className="rounded bg-emerald-500/20 text-emerald-400 px-2 py-0.5 text-[10px] font-bold border border-emerald-500/40">
                  {selectedFlight.positionSource}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Quick Action Bar */}
        <div className="grid grid-cols-4 border-b border-neutral-800 bg-neutral-900/30 text-center">
          <button
            onClick={onCenterFlight}
            className="flex flex-col items-center py-2.5 text-[10px] font-bold text-slate-300 hover:text-yellow-400 hover:bg-neutral-800/40 transition border-r border-neutral-800"
          >
            <span>📍</span>
            <span>CENTER</span>
          </button>
          <button
            onClick={onToggleFollow}
            className={`flex flex-col items-center py-2.5 text-[10px] font-bold transition border-r border-neutral-800 ${
              isFollowing ? "text-yellow-400 bg-neutral-800/80" : "text-slate-300 hover:text-yellow-400 hover:bg-neutral-800/40"
            }`}
          >
            <span>🎯</span>
            <span>{isFollowing ? "FOLLOWING" : "FOLLOW"}</span>
          </button>
          <button
            onClick={onOpenHud}
            className="flex flex-col items-center py-2.5 text-[10px] font-bold text-slate-300 hover:text-yellow-400 hover:bg-neutral-800/40 transition border-r border-neutral-800"
          >
            <span>🛩</span>
            <span>3D HUD</span>
          </button>
          <button
            onClick={() => alert(`OpenSky ID: ${selectedFlight.id}\nCallsign: ${selectedFlight.callsign}\nLat: ${selectedFlight.latitude}\nLng: ${selectedFlight.longitude}`)}
            className="flex flex-col items-center py-2.5 text-[10px] font-bold text-slate-300 hover:text-yellow-400 hover:bg-neutral-800/40 transition"
          >
            <span>📋</span>
            <span>INFO</span>
          </button>
        </div>

        {/* Telemetry Metrics Grid */}
        <div className="p-4 flex flex-col gap-3">
          <div className="text-[10px] font-bold tracking-wider text-neutral-400 uppercase">
            Real-Time Flight Telemetry (OpenSky API)
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs">
            {/* Calibrated Altitude */}
            <div className="rounded-lg border border-neutral-800 bg-neutral-900/70 p-2.5">
              <span className="text-[10px] text-neutral-400 block mb-0.5">BARO ALTITUDE</span>
              <div className="flex items-baseline justify-between">
                <span className="text-base font-black text-white">
                  {selectedFlight.altitudeFt != null ? selectedFlight.altitudeFt.toLocaleString() : "—"}
                </span>
                <span className="text-neutral-400 text-[10px]">ft</span>
              </div>
              <span className="text-[10px] text-neutral-400 font-mono">
                {selectedFlight.baroAltitude != null ? `${selectedFlight.baroAltitude} m` : "—"}
              </span>
            </div>

            {/* Ground Speed */}
            <div className="rounded-lg border border-neutral-800 bg-neutral-900/70 p-2.5">
              <span className="text-[10px] text-neutral-400 block mb-0.5">GROUND SPEED</span>
              <div className="flex items-baseline justify-between">
                <span className="text-base font-black text-white">
                  {selectedFlight.velocityKts != null ? selectedFlight.velocityKts : "—"}
                </span>
                <span className="text-neutral-400 text-[10px]">kts</span>
              </div>
              <span className="text-[10px] text-neutral-400 font-mono">
                {selectedFlight.velocityKmh != null ? `${selectedFlight.velocityKmh} km/h` : "—"}
              </span>
            </div>

            {/* Track / Heading */}
            <div className="rounded-lg border border-neutral-800 bg-neutral-900/70 p-2.5">
              <span className="text-[10px] text-neutral-400 block mb-0.5">TRUE TRACK / HEADING</span>
              <div className="flex items-baseline justify-between">
                <span className="text-base font-black text-white">
                  {selectedFlight.heading != null ? `${selectedFlight.heading}°` : "—"}
                </span>
                <span className="text-yellow-400 font-bold">
                  {selectedFlight.heading != null
                    ? selectedFlight.heading < 45 || selectedFlight.heading > 315
                      ? "N"
                      : selectedFlight.heading < 135
                      ? "E"
                      : selectedFlight.heading < 225
                      ? "S"
                      : "W"
                    : "—"}
                </span>
              </div>
              <span className="text-[10px] text-neutral-400">Magnetic Course</span>
            </div>

            {/* Squawk Code */}
            <div className="rounded-lg border border-neutral-800 bg-neutral-900/70 p-2.5">
              <span className="text-[10px] text-neutral-400 block mb-0.5">SQUAWK CODE</span>
              <div className="flex items-baseline justify-between">
                <span className={`text-base font-black font-mono ${
                  selectedFlight.squawk === "7700" ? "text-red-500 animate-pulse" : "text-amber-400"
                }`}>
                  {selectedFlight.squawk || "—"}
                </span>
                <span className="text-[10px] text-neutral-400">Mode-3/A</span>
              </div>
              <span className="text-[10px] text-neutral-400">
                {selectedFlight.squawk === "7700"
                  ? "EMERGENCY"
                  : selectedFlight.squawk === "7600"
                  ? "RADIO FAIL"
                  : "Transponder"}
              </span>
            </div>
          </div>

          {/* OpenSky Aircraft Details */}
          <div className="rounded-lg border border-neutral-800 bg-neutral-900/70 p-3 text-xs flex flex-col gap-2">
            <div className="flex justify-between border-b border-neutral-800/80 pb-1.5">
              <span className="text-neutral-400">ICAO 24-bit Address</span>
              <span className="font-mono font-bold text-yellow-400">{selectedFlight.id.toUpperCase()}</span>
            </div>
            <div className="flex justify-between border-b border-neutral-800/80 pb-1.5">
              <span className="text-neutral-400">Operator Country</span>
              <span className="font-semibold text-slate-200">{selectedFlight.country}</span>
            </div>
            <div className="flex justify-between border-b border-neutral-800/80 pb-1.5">
              <span className="text-neutral-400">Vertical Rate</span>
              <span className="font-mono text-slate-200">
                {selectedFlight.verticalRateFpm != null
                  ? selectedFlight.verticalRateFpm >= 0
                    ? `↑ +${selectedFlight.verticalRateFpm} fpm`
                    : `↓ ${selectedFlight.verticalRateFpm} fpm`
                  : "Level / 0 fpm"}
              </span>
            </div>
            <div className="flex justify-between border-b border-neutral-800/80 pb-1.5">
              <span className="text-neutral-400">Tracking Source</span>
              <span className="text-emerald-400 font-semibold">{selectedFlight.positionSource}</span>
            </div>
            <div className="flex justify-between border-b border-neutral-800/80 pb-1.5">
              <span className="text-neutral-400">Surface Status</span>
              <span className="text-slate-300 font-semibold">
                {selectedFlight.onGround ? "On Ground" : "Airborne"}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-neutral-400">GPS Coordinates</span>
              <span className="font-mono text-[11px] text-slate-300">
                {selectedFlight.latitude.toFixed(4)}°, {selectedFlight.longitude.toFixed(4)}°
              </span>
            </div>
          </div>

          {/* Historical Track Waypoints Count */}
          <div className="rounded bg-neutral-900/40 border border-neutral-800/60 p-2 text-[11px] text-neutral-400 flex items-center justify-between">
            <span>Recorded GPS Track:</span>
            <span className="font-bold text-yellow-400 font-mono">
              {flightTrackCount} waypoints on map
            </span>
          </div>
        </div>
      </div>
    </aside>
  );
}
