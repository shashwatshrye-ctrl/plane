"use client";

import dynamic from "next/dynamic";

const FlightDashboard = dynamic(() => import("./flight-dashboard"), {
  ssr: false,
  loading: () => (
    <div className="flex h-screen w-screen items-center justify-center bg-[#181b1f] text-yellow-400">
      <div className="flex flex-col items-center gap-3">
        <svg className="h-10 w-10 animate-spin text-yellow-400" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
        </svg>
        <span className="text-sm font-semibold tracking-wider text-slate-300 uppercase">
          Initializing Flightradar24 Map…
        </span>
      </div>
    </div>
  ),
});

export default function Home() {
  return <FlightDashboard />;
}

