"use client";

import React, { useState } from "react";
import { Flight } from "./types";

interface LeftWidgetsProps {
  flights: Flight[];
  selectedFlightId: string | null;
  onSelectFlight: (flight: Flight) => void;
  airspaceStats: {
    totalTracked: number;
    avgAlt: number;
    avgSpd: number;
    topCountries: [string, number][];
  } | null;
}

export default function LeftWidgets({
  flights,
  selectedFlightId,
  onSelectFlight,
  airspaceStats,
}: LeftWidgetsProps) {
  const [trackedCardsCollapsed, setTrackedCardsCollapsed] = useState(false);
  const [statsCardCollapsed, setStatsCardCollapsed] = useState(false);

  return (
    <aside className="pointer-events-none absolute top-4 left-4 z-20 flex w-76 flex-col gap-3">
      <div className="pointer-events-auto rounded-lg border border-neutral-800 bg-[#181b1fe8] shadow-2xl backdrop-blur-md overflow-hidden transition-all">
        <button
          type="button"
          onClick={() => setTrackedCardsCollapsed(!trackedCardsCollapsed)}
          aria-expanded={!trackedCardsCollapsed}
          className="group flex w-full cursor-pointer items-center justify-between border-b border-neutral-800/80 px-3 py-2 bg-neutral-900/40 text-left transition duration-150 hover:bg-neutral-800/40 active:scale-[0.99]"
        >
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-100 tracking-tight">Active live flights</span>
            <span className="ui-chip ui-chip-live">
              LIVE
            </span>
            <span className="text-neutral-500 text-xs">ⓘ</span>
          </div>
          <span className="text-neutral-400 transition-colors duration-150 group-hover:text-white">
            <svg
              className={`h-4 w-4 transform transition-transform duration-200 ${trackedCardsCollapsed ? "rotate-180" : ""}`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </span>
        </button>

        {!trackedCardsCollapsed && (
          <div className="divide-y divide-neutral-800/60 max-h-60 overflow-y-auto">
            {flights.slice(0, 5).map((flight, index) => {
              const isSelected = flight.id === selectedFlightId;
              return (
                <div
                  key={flight.id}
                  onClick={() => onSelectFlight(flight)}
                  className={`group flex cursor-pointer items-center justify-between px-3 py-2 transition ${
                    isSelected ? "bg-neutral-800/90 border-l-2 border-[#f7ce00]" : "hover:bg-neutral-800/50"
                  }`}
                >
                  <div className="flex flex-col gap-0.5">
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-black text-slate-200">
                        {index + 1}. {flight.callsign}
                      </span>
                      <span className="ui-chip font-mono">
                        {flight.id.toUpperCase()}
                      </span>
                      {flight.squawk === "7700" && (
                        <span className="ui-chip ui-chip-danger">
                          EMERGENCY
                        </span>
                      )}
                    </div>
                    <div className="text-[11px] text-neutral-400 group-hover:text-neutral-300 transition">
                      {flight.country}
                    </div>
                  </div>

                  <div className="flex flex-col items-end pl-2 text-right">
                    <span className="text-xs font-bold text-yellow-400">
                      {flight.altitudeFt ? `${flight.altitudeFt.toLocaleString()} ft` : "—"}
                    </span>
                    <span className="text-[10px] text-neutral-400">
                      {flight.velocityKts ? `${flight.velocityKts} kts` : "—"}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {airspaceStats && (
        <div className="pointer-events-auto rounded-lg border border-neutral-800 bg-[#181b1fe8] shadow-2xl backdrop-blur-md overflow-hidden transition-all">
          <button
            type="button"
            onClick={() => setStatsCardCollapsed(!statsCardCollapsed)}
            aria-expanded={!statsCardCollapsed}
            className="group flex w-full cursor-pointer items-center justify-between border-b border-neutral-800/80 px-3 py-2 bg-neutral-900/40 text-left transition duration-150 hover:bg-neutral-800/40 active:scale-[0.99]"
          >
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-100 tracking-tight">Airspace metrics</span>
              <span className="ui-chip ui-chip-warning">
                REALTIME
              </span>
            </div>
            <span className="text-neutral-400 transition-colors duration-150 group-hover:text-white">
              <svg
                className={`h-4 w-4 transform transition-transform duration-200 ${statsCardCollapsed ? "rotate-180" : ""}`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </span>
          </button>

          {!statsCardCollapsed && (
            <div className="p-3 flex flex-col gap-2.5 text-xs">
              <div className="grid grid-cols-2 gap-2">
                <div className="rounded bg-neutral-900/80 border border-neutral-800 p-2">
                  <span className="text-[10px] text-neutral-400 block">AVG ALTITUDE</span>
                  <span className="font-bold text-slate-200">{airspaceStats.avgAlt.toLocaleString()} ft</span>
                </div>
                <div className="rounded bg-neutral-900/80 border border-neutral-800 p-2">
                  <span className="text-[10px] text-neutral-400 block">AVG SPEED</span>
                  <span className="font-bold text-slate-200">{airspaceStats.avgSpd} kts</span>
                </div>
              </div>

              <div>
                <span className="text-[10px] font-bold text-neutral-400 tracking-wider uppercase block mb-1">
                  Top Operator Countries
                </span>
                <div className="flex flex-col gap-1">
                  {airspaceStats.topCountries.map(([country, count]) => (
                    <div key={country} className="flex justify-between items-center text-[11px]">
                      <span className="text-slate-300 truncate max-w-[170px]">{country}</span>
                      <span className="font-mono text-yellow-400 font-bold">{count}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </aside>
  );
}
