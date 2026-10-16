"use client";

import React from "react";
import { Flight, MapType } from "./types";

interface TopNavBarProps {
  mapType: MapType;
  setMapType: React.Dispatch<React.SetStateAction<MapType>>;
  searchQuery: string;
  setSearchQuery: (val: string) => void;
  searchFocused: boolean;
  setSearchFocused: (val: boolean) => void;
  filteredFlights: Flight[];
  onSelectFlight: (flight: Flight) => void;
  totalLivePlanes: number;
  isFetchingLive: boolean;
  utcTime: string;
  rightPanelOpen: boolean;
  setRightPanelOpen: (val: boolean) => void;
  onResetLocation: () => void;
}

export default function TopNavBar({
  mapType,
  setMapType,
  searchQuery,
  setSearchQuery,
  searchFocused,
  setSearchFocused,
  filteredFlights,
  onSelectFlight,
  totalLivePlanes,
  isFetchingLive,
  utcTime,
  rightPanelOpen,
  setRightPanelOpen,
  onResetLocation,
}: TopNavBarProps) {
  return (
    <header className="z-30 flex h-14 w-full shrink-0 items-center justify-between border-b border-neutral-800 bg-[#181b1fe6] px-4 backdrop-blur-md">
      {/* Left: FR24 Logo & Live Feed */}
      <div className="flex items-center gap-3">
        <div
          onClick={onResetLocation}
          className="flex cursor-pointer items-center gap-2 transition hover:opacity-90"
        >
          {/* Radar Circle Icon */}
          <div className="relative flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-tr from-amber-500 to-yellow-400 shadow-md shadow-yellow-500/20">
            <svg className="h-5 w-5 text-neutral-950" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z" />
            </svg>
            <div className="animate-radar-pulse absolute inset-0 rounded-full border border-yellow-400 pointer-events-none" />
          </div>

          {/* Logo Typography */}
          <div className="flex flex-col">
            <div className="flex items-center">
              <span className="text-lg font-black tracking-tight text-white">flightradar</span>
              <span className="text-lg font-black tracking-tight text-[#f7ce00]">24</span>
            </div>
            <span className="text-[9px] font-semibold tracking-widest text-slate-400 uppercase -mt-1">
              OPENSKY LIVE AIR TRAFFIC
            </span>
          </div>
        </div>

        {/* Map Layer Switcher */}
        <div className="hidden md:flex items-center ml-4 pl-4 border-l border-neutral-800">
          <button
            onClick={() => setMapType((m) => (m === "dark" ? "satellite" : m === "satellite" ? "light" : "dark"))}
            className="flex items-center gap-1.5 rounded-md bg-neutral-800/80 px-2.5 py-1 text-xs font-semibold text-slate-200 hover:bg-neutral-700/80 transition border border-neutral-700"
          >
            <span className="text-neutral-400">VIEW</span>
            <span className="text-[#f7ce00] capitalize">{mapType}</span>
            <svg className="h-3.5 w-3.5 text-neutral-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        </div>
      </div>

      {/* Center: Search Bar */}
      <div className="relative mx-4 flex max-w-lg flex-1 items-center">
        <div className="relative w-full">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <svg className="h-4 w-4 text-neutral-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => setSearchFocused(true)}
            onBlur={() => setTimeout(() => setSearchFocused(false), 200)}
            placeholder="Search callsign, country, or icao24 hex..."
            className="w-full rounded-md border border-neutral-700 bg-neutral-800/90 py-1.5 pr-8 pl-9 text-xs font-medium text-slate-100 placeholder-neutral-400 shadow-inner focus:border-yellow-400 focus:bg-neutral-900 focus:outline-none transition"
          />
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2.5">
            <span className="rounded bg-neutral-700 px-1.5 py-0.5 text-[10px] font-mono text-neutral-400">/</span>
          </div>
        </div>

        {/* Autocomplete Popup */}
        {searchFocused && (
          <div className="absolute top-11 left-0 right-0 z-50 rounded-lg border border-neutral-700 bg-neutral-900/95 p-2 shadow-2xl backdrop-blur-xl">
            <div className="mb-1 px-2 text-[10px] font-bold tracking-wider text-neutral-400 uppercase">
              Active Live Aircraft
            </div>
            <div className="max-h-60 overflow-y-auto divide-y divide-neutral-800">
              {filteredFlights.slice(0, 8).map((flight) => (
                <div
                  key={flight.id}
                  onMouseDown={() => onSelectFlight(flight)}
                  className="flex cursor-pointer items-center justify-between rounded px-2.5 py-2 hover:bg-neutral-800/80 transition"
                >
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-[#f7ce00] text-xs">{flight.callsign}</span>
                    <span className="rounded bg-neutral-800 px-1.5 py-0.5 text-[10px] font-mono text-slate-300">
                      {flight.id.toUpperCase()}
                    </span>
                    <span className="text-xs text-neutral-400">{flight.country}</span>
                  </div>
                  <div className="text-[11px] font-medium text-slate-300">
                    {flight.altitudeFt ? `${flight.altitudeFt.toLocaleString()} ft` : "—"} · {flight.velocityKts ? `${flight.velocityKts} kts` : "—"}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Right Nav Utilities */}
      <div className="flex items-center gap-2 md:gap-3">
        {/* Live OpenSky Plane Count */}
        <div className="flex items-center gap-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 px-2.5 py-1 text-xs font-bold text-emerald-400">
          <span className={`h-2 w-2 rounded-full ${isFetchingLive ? "bg-yellow-400 animate-spin" : "bg-emerald-400 animate-pulse"}`} />
          <span>{totalLivePlanes > 0 ? `${totalLivePlanes.toLocaleString()} LIVE PLANES` : "CONNECTING OPENSKY…"}</span>
        </div>

        {/* UTC Clock */}
        <div className="hidden lg:flex items-center gap-1.5 rounded bg-neutral-800/60 px-2 py-1 text-xs font-mono text-slate-300 border border-neutral-800">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
          <span>{utcTime}</span>
          <span className="text-[10px] font-sans text-neutral-400">UTC</span>
        </div>

        {/* Right Panel Toggle Button */}
        <button
          onClick={() => setRightPanelOpen(!rightPanelOpen)}
          title="Toggle Flight Dossier"
          className={`rounded-md p-1.5 transition border ${
            rightPanelOpen
              ? "bg-yellow-400 text-neutral-950 border-yellow-400"
              : "bg-neutral-800 text-slate-200 border-neutral-700 hover:bg-neutral-700"
          }`}
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h7" />
          </svg>
        </button>
      </div>
    </header>
  );
}
