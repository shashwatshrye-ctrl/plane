"use client";

import React, { useState } from "react";
import { MapType } from "./types";

interface BottomToolbarProps {
  mapType: MapType;
  setMapType: React.Dispatch<React.SetStateAction<MapType>>;
  showWeatherOverlay: boolean;
  setShowWeatherOverlay: React.Dispatch<React.SetStateAction<boolean>>;
  altitudeRange: number;
  setAltitudeRange: (val: number) => void;
  speedRange: number;
  setSpeedRange: (val: number) => void;
  onRefresh: () => void;
  isFetchingLive: boolean;
}

export default function BottomToolbar({
  mapType,
  setMapType,
  showWeatherOverlay,
  setShowWeatherOverlay,
  altitudeRange,
  setAltitudeRange,
  speedRange,
  setSpeedRange,
  onRefresh,
  isFetchingLive,
}: BottomToolbarProps) {
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [showFilterModal, setShowFilterModal] = useState(false);

  return (
    <>
      {/* Floating Pill Toolbar */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex items-center gap-1 rounded-full border border-neutral-800 bg-[#181b1fec] p-1.5 shadow-2xl backdrop-blur-lg">
        <button
          onClick={() => setShowSettingsModal(!showSettingsModal)}
          className="flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold text-slate-200 hover:bg-neutral-800 hover:text-[#f7ce00] transition"
        >
          <svg className="h-4 w-4 text-neutral-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <span>Settings</span>
        </button>

        <button
          onClick={() => setShowWeatherOverlay(!showWeatherOverlay)}
          className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold transition ${
            showWeatherOverlay ? "bg-amber-500/20 text-[#f7ce00]" : "text-slate-200 hover:bg-neutral-800"
          }`}
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 00-9.78 2.096A4.001 4.001 0 003 15z" />
          </svg>
          <span>Radar Layer</span>
        </button>

        <button
          onClick={() => setShowFilterModal(!showFilterModal)}
          className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold transition ${
            showFilterModal ? "bg-yellow-400 text-neutral-950 font-bold" : "text-slate-200 hover:bg-neutral-800"
          }`}
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
          </svg>
          <span>Filters</span>
        </button>

        <button
          onClick={onRefresh}
          className="flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold text-slate-200 hover:bg-neutral-800 hover:text-[#f7ce00] transition"
        >
          <svg className={`h-4 w-4 text-neutral-400 ${isFetchingLive ? "animate-spin" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          <span>Refresh</span>
        </button>
      </div>

      {/* Filter Modal */}
      {showFilterModal && (
        <div className="absolute bottom-20 left-1/2 -translate-x-1/2 z-30 w-80 rounded-xl border border-neutral-700 bg-neutral-900/95 p-4 shadow-2xl backdrop-blur-xl">
          <div className="flex items-center justify-between border-b border-neutral-800 pb-2 mb-3">
            <span className="font-bold text-sm text-white">Live OpenSky Filters</span>
            <button onClick={() => setShowFilterModal(false)} className="text-neutral-400 hover:text-white">✕</button>
          </div>
          <div className="flex flex-col gap-3 text-xs">
            <div>
              <div className="flex justify-between text-neutral-300 mb-1">
                <span>Max Altitude</span>
                <span className="font-bold text-yellow-400">{altitudeRange.toLocaleString()} ft</span>
              </div>
              <input
                type="range"
                min="3000"
                max="45000"
                step="1000"
                value={altitudeRange}
                onChange={(e) => setAltitudeRange(Number(e.target.value))}
                className="w-full accent-yellow-400 cursor-pointer"
              />
            </div>

            <div>
              <div className="flex justify-between text-neutral-300 mb-1">
                <span>Max Ground Speed</span>
                <span className="font-bold text-yellow-400">{speedRange} kts</span>
              </div>
              <input
                type="range"
                min="100"
                max="650"
                step="25"
                value={speedRange}
                onChange={(e) => setSpeedRange(Number(e.target.value))}
                className="w-full accent-yellow-400 cursor-pointer"
              />
            </div>

            <div className="flex justify-between pt-2">
              <button
                onClick={() => {
                  setAltitudeRange(45000);
                  setSpeedRange(650);
                }}
                className="text-neutral-400 hover:underline"
              >
                Reset
              </button>
              <button
                onClick={() => setShowFilterModal(false)}
                className="rounded bg-yellow-400 px-3 py-1 font-bold text-neutral-950"
              >
                Apply
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Settings Modal */}
      {showSettingsModal && (
        <div className="absolute bottom-20 left-1/2 -translate-x-1/2 z-30 w-80 rounded-xl border border-neutral-700 bg-neutral-900/95 p-4 shadow-2xl backdrop-blur-xl">
          <div className="flex items-center justify-between border-b border-neutral-800 pb-2 mb-3">
            <span className="font-bold text-sm text-white">Map Display Settings</span>
            <button onClick={() => setShowSettingsModal(false)} className="text-neutral-400 hover:text-white">✕</button>
          </div>
          <div className="flex flex-col gap-3 text-xs">
            <div className="flex items-center justify-between">
              <span>Map Base Layer</span>
              <select
                value={mapType}
                onChange={(e) => setMapType(e.target.value as any)}
                className="rounded bg-neutral-800 border border-neutral-700 px-2 py-1 text-slate-200"
              >
                <option value="dark">Dark Matter (FR24)</option>
                <option value="satellite">World Satellite</option>
                <option value="light">Voyager Light</option>
              </select>
            </div>
            <div className="flex items-center justify-between">
              <span>Speed Units</span>
              <span className="font-bold text-yellow-400">Knots (kts)</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Altitude Units</span>
              <span className="font-bold text-yellow-400">Feet (ft)</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Data Source</span>
              <span className="font-mono text-emerald-400">OpenSky Network API</span>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
