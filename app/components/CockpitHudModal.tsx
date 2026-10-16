"use client";

import React from "react";
import { Flight } from "./types";

interface CockpitHudModalProps {
  flight: Flight;
  onClose: () => void;
}

export default function CockpitHudModal({ flight, onClose }: CockpitHudModalProps) {
  return (
    <div className="absolute inset-4 z-40 flex flex-col rounded-2xl border border-yellow-500/40 bg-neutral-950/95 p-4 shadow-2xl backdrop-blur-2xl">
      <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
        <div className="flex items-center gap-3">
          <span className="rounded bg-yellow-400/20 px-2 py-0.5 text-xs font-bold text-yellow-400 border border-yellow-400/40">
            COCKPIT HUD VIEW
          </span>
          <span className="font-black text-white">{flight.callsign}</span>
          <span className="text-neutral-400 text-xs">{flight.country}</span>
        </div>
        <button
          onClick={onClose}
          className="rounded-lg bg-neutral-800 px-3 py-1 text-xs font-bold text-white hover:bg-neutral-700"
        >
          Exit HUD
        </button>
      </div>

      <div className="relative flex-1 flex items-center justify-center overflow-hidden">
        {/* Artificial Horizon Pitch Ladder */}
        <div className="absolute inset-0 flex items-center justify-center opacity-70">
          <div className="w-80 h-0.5 bg-emerald-400 shadow-[0_0_8px_#34d399]" />
          <div className="absolute w-40 h-28 border-x border-emerald-400/50 flex flex-col justify-between items-center py-2 text-[10px] text-emerald-400 font-mono">
            <span>+10</span>
            <span>+5</span>
            <span className="w-12 h-0.5 bg-emerald-400" />
            <span>-5</span>
            <span>-10</span>
          </div>
        </div>

        {/* Speed Tape */}
        <div className="absolute left-10 flex flex-col items-center bg-neutral-900/80 border border-emerald-400/40 rounded p-2 text-emerald-400 font-mono text-xs">
          <span className="text-[10px] text-neutral-400">GROUND SPEED</span>
          <span className="text-base font-bold">{flight.velocityKts ?? "—"}</span>
          <span>KTS</span>
        </div>

        {/* Altimeter Tape */}
        <div className="absolute right-10 flex flex-col items-center bg-neutral-900/80 border border-emerald-400/40 rounded p-2 text-emerald-400 font-mono text-xs">
          <span className="text-[10px] text-neutral-400">BARO ALT</span>
          <span className="text-base font-bold">
            {flight.altitudeFt ? flight.altitudeFt.toLocaleString() : "—"}
          </span>
          <span>FT</span>
        </div>

        {/* Compass Heading Tape */}
        <div className="absolute top-4 flex items-center gap-4 bg-neutral-900/80 border border-emerald-400/40 rounded px-4 py-1 text-emerald-400 font-mono text-sm">
          <span>
            HDG: <b className="text-white">{flight.heading != null ? `${flight.heading}°` : "—"}</b>
          </span>
          <span>LAT: {flight.latitude.toFixed(3)}°</span>
          <span>LON: {flight.longitude.toFixed(3)}°</span>
        </div>
      </div>
    </div>
  );
}
