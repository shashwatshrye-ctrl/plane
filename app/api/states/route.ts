import { NextRequest, NextResponse } from "next/server";

const regions = {
  world: { lamin: -85, lamax: 85, lomin: -180, lomax: 180 },
  europe: { lamin: 34, lamax: 72, lomin: -12, lomax: 42 },
  americas: { lamin: 15, lamax: 62, lomin: -130, lomax: -55 },
  asia: { lamin: -12, lamax: 55, lomin: 65, lomax: 145 },
} as const;

type Region = keyof typeof regions;
type OpenSkyState = [
  string,
  string | null,
  string | null,
  number | null,
  number,
  number | null,
  number | null,
  number | null,
  boolean,
  number | null,
  number | null,
  number | null,
  number[] | null,
  number | null,
  string | null,
  boolean,
  number,
  number?,
];

type OpenSkyResponse = { time: number; states: OpenSkyState[] | null };
type CachedResponse = { data: OpenSkyResponse; fetchedAt: number };

const cache = new Map<Region, CachedResponse>();
const CACHE_MS = 12_000;

export async function GET(request: NextRequest) {
  const requestedRegion = request.nextUrl.searchParams.get("region") ?? "europe";
  if (!Object.hasOwn(regions, requestedRegion)) {
    return NextResponse.json({ error: "Unknown region." }, { status: 400 });
  }

  const region = requestedRegion as Region;
  const previous = cache.get(region);
  if (previous && Date.now() - previous.fetchedAt < CACHE_MS) {
    return NextResponse.json({
      ...previous.data,
      cached: true,
      ageSeconds: Math.floor((Date.now() - previous.fetchedAt) / 1000),
    });
  }

  const bounds = regions[region];
  const query = new URLSearchParams({
    lamin: String(bounds.lamin),
    lamax: String(bounds.lamax),
    lomin: String(bounds.lomin),
    lomax: String(bounds.lomax),
  });

  try {
    const response = await fetch(
      `https://opensky-network.org/api/states/all?${query.toString()}`,
      { cache: "no-store", signal: AbortSignal.timeout(8_000) },
    );

    if (!response.ok) {
      const retryAfter = response.headers.get("Retry-After");
      if (previous) {
        return NextResponse.json({
          ...previous.data,
          stale: true,
          ageSeconds: Math.floor((Date.now() - previous.fetchedAt) / 1000),
          message: `OpenSky returned ${response.status}; showing the last available update.`,
        });
      }
      return NextResponse.json(
        { error: `OpenSky is temporarily unavailable (${response.status}).` },
        {
          status: response.status === 429 ? 429 : 502,
          headers: retryAfter ? { "Retry-After": retryAfter } : undefined,
        },
      );
    }

    const data = (await response.json()) as OpenSkyResponse;
    const entry = { data, fetchedAt: Date.now() };
    cache.set(region, entry);
    return NextResponse.json({
      ...data,
      ageSeconds: 0,
    });
  } catch (error) {
    console.error("OpenSky request failed:", error);
    if (previous) {
      return NextResponse.json({
        ...previous.data,
        stale: true,
        ageSeconds: Math.floor((Date.now() - previous.fetchedAt) / 1000),
        message: "OpenSky could not be reached; showing the last available update.",
      });
    }
    return NextResponse.json(
      { error: "OpenSky could not be reached. Please try again shortly." },
      { status: 503 },
    );
  }
}
