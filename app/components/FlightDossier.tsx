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
            <div className="mb-2 flex justify-center text-neutral-400">
              <svg aria-hidden="true" className="h-8 w-8" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2 14 9l7 4v2l-7-2-1 6 3 2v1l-4-1-4 1v-1l3-2-1-6-7 2v-2l7-4 2-7Z" />
              </svg>
            </div>
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
        <div className="relative h-36 w-full bg-gradient-to-br from-neutral-800 via-neutral-900 to-[#181b1f] p-4 flex flex-col justify-between border-b border-neutral-800">
          <div className="flex items-center justify-between text-xs">
            <span className="ui-chip ui-chip-accent">
              {selectedFlight.category}
            </span>
            <button
              onClick={onClose}
              className="flex h-6 w-6 items-center justify-center rounded-full bg-black/60 text-white hover:bg-neutral-800 transition"
              aria-label="Close flight dossier"
            >
              <svg aria-hidden="true" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" d="m6 6 12 12M18 6 6 18" />
              </svg>
            </button>
          </div>

          <div>
            <div className="text-[11px] font-semibold tracking-wider text-slate-300 uppercase">
              {selectedFlight.country}
            </div>
            <div className="text-2xl font-black tracking-tight text-white flex items-center gap-2">
              <span>{selectedFlight.callsign}</span>
              <span className="ui-chip ui-chip-accent font-mono">
                HEX {selectedFlight.id.toUpperCase()}
              </span>
            </div>
          </div>
        </div>

        <div className="border-b border-neutral-800 bg-neutral-900/60 p-4">
          {flightRoute ? (
            <div className="flex items-center justify-between">
              <div className="flex flex-col">
                <span className="text-2xl font-black text-white">{flightRoute.origin}</span>
                <span className="text-xs font-semibold text-slate-200">Origin ICAO</span>
              </div>
              <div className="flex flex-1 flex-col items-center px-4">
                <span className="flex items-center text-yellow-400">
                  <svg aria-hidden="true" className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2 14 9l7 4v2l-7-2-1 6 3 2v1l-4-1-4 1v-1l3-2-1-6-7 2v-2l7-4 2-7Z" />
                  </svg>
                  <svg aria-hidden="true" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14m-6-6 6 6-6 6" />
                  </svg>
                </span>
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
                <span className="ui-chip ui-chip-live uppercase">
                  {selectedFlight.positionSource}
                </span>
              </div>
            </div>
          )}
        </div>

        <div className="grid grid-cols-4 border-b border-neutral-800 bg-neutral-900/30 text-center">
          <button
            onClick={onCenterFlight}
            className="flex flex-col items-center py-2.5 text-[10px] font-bold text-slate-300 hover:text-yellow-400 hover:bg-neutral-800/40 transition border-r border-neutral-800"
          >
            <svg aria-hidden="true" className="mb-1 h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M20 10c0 5-8 12-8 12S4 15 4 10a8 8 0 1 1 16 0Z" />
              <circle cx="12" cy="10" r="2.5" />
            </svg>
            <span>CENTER</span>
          </button>
          <button
            onClick={onToggleFollow}
            className={`flex flex-col items-center py-2.5 text-[10px] font-bold transition border-r border-neutral-800 ${
              isFollowing ? "text-yellow-400 bg-neutral-800/80" : "text-slate-300 hover:text-yellow-400 hover:bg-neutral-800/40"
            }`}
          >
            <svg aria-hidden="true" className="mb-1 h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="9" />
              <circle cx="12" cy="12" r="5" />
              <circle cx="12" cy="12" r="1" />
            </svg>
            <span>{isFollowing ? "FOLLOWING" : "FOLLOW"}</span>
          </button>
          <button
            onClick={onOpenHud}
            className="flex flex-col items-center py-2.5 text-[10px] font-bold text-slate-300 hover:text-yellow-400 hover:bg-neutral-800/40 transition border-r border-neutral-800"
          >
            <svg aria-hidden="true" className="mb-1 h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2 14 9l7 4v2l-7-2-1 6 3 2v1l-4-1-4 1v-1l3-2-1-6-7 2v-2l7-4 2-7Z" />
            </svg>
            <span>3D HUD</span>
          </button>
          <button
            onClick={() => alert(`OpenSky ID: ${selectedFlight.id}\nCallsign: ${selectedFlight.callsign}\nLat: ${selectedFlight.latitude}\nLng: ${selectedFlight.longitude}`)}
            className="flex flex-col items-center py-2.5 text-[10px] font-bold text-slate-300 hover:text-yellow-400 hover:bg-neutral-800/40 transition"
          >
            <svg aria-hidden="true" className="mb-1 h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M8 5H6a2 2 0 0 0-2 2v13h16V7a2 2 0 0 0-2-2h-2M8 3h8v4H8zM8 12h8m-8 4h8" />
            </svg>
            <span>INFO</span>
          </button>
        </div>

        <div className="p-4 flex flex-col gap-3">
          <div className="text-[10px] font-bold tracking-wider text-neutral-400 uppercase">
            Real-Time Flight Telemetry (OpenSky API)
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs">
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
