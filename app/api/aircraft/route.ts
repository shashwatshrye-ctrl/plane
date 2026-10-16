import { NextRequest, NextResponse } from "next/server";

let cachedToken: { token: string; expiresAt: number } | null = null;
let cachedData: { data: any; timestamp: number } | null = null;
const CACHE_TTL_MS = 10_000;

async function getAccessToken() {
  const now = Date.now();
  if (cachedToken && cachedToken.expiresAt > now + 30_000) {
    return cachedToken.token;
  }

  const clientId = process.env.OPENSKY_CLIENT_ID;
  const clientSecret = process.env.OPENSKY_CLIENT_SECRET;
  if (!clientId || !clientSecret) {
    throw new Error(
      "Missing OpenSky credentials. Set OPENSKY_CLIENT_ID and OPENSKY_CLIENT_SECRET in .env."
    );
  }

  const tokenResponse = await fetch(
    "https://auth.opensky-network.org/auth/realms/opensky-network/protocol/openid-connect/token",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        grant_type: "client_credentials",
        client_id: clientId,
        client_secret: clientSecret,
      }),
      cache: "no-store",
    }
  );

  if (!tokenResponse.ok) {
    throw new Error(`OpenSky authentication failed: ${tokenResponse.status}`);
  }

  const tokenData = await tokenResponse.json();
  cachedToken = {
    token: tokenData.access_token,
    expiresAt: now + (tokenData.expires_in || 300) * 1000,
  };
  return tokenData.access_token;
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const callsign = searchParams.get("callsign");
    const trackIcao = searchParams.get("track");
    const token = await getAccessToken();

    if (callsign) {
      const routeRes = await fetch(
        `https://opensky-network.org/api/routes?callsign=${encodeURIComponent(callsign.trim())}`,
        {
          headers: { Authorization: `Bearer ${token}` },
          cache: "no-store",
        }
      );
      if (!routeRes.ok) {
        return NextResponse.json({ route: null, callsign }, { status: 200 });
      }
      const text = await routeRes.text();
      if (!text) {
        return NextResponse.json({ route: null, callsign }, { status: 200 });
      }
      return NextResponse.json(JSON.parse(text));
    }

    if (trackIcao) {
      const trackRes = await fetch(
        `https://opensky-network.org/api/tracks/all?icao24=${encodeURIComponent(trackIcao.trim())}&time=0`,
        {
          headers: { Authorization: `Bearer ${token}` },
          cache: "no-store",
        }
      );
      if (!trackRes.ok) {
        return NextResponse.json({ path: [] }, { status: 200 });
      }
      const trackData = await trackRes.json();
      return NextResponse.json(trackData);
    }

    const now = Date.now();
    if (cachedData && now - cachedData.timestamp < CACHE_TTL_MS) {
      return NextResponse.json(cachedData.data);
    }

    const aircraftResponse = await fetch(
      "https://opensky-network.org/api/states/all",
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        cache: "no-store",
      }
    );

    if (!aircraftResponse.ok) {
      if (cachedData) return NextResponse.json(cachedData.data);
      return NextResponse.json(
        { error: "Failed to fetch aircraft data" },
        { status: 502 }
      );
    }

    const data = await aircraftResponse.json();
    cachedData = { data, timestamp: Date.now() };
    return NextResponse.json(data);
  } catch (error) {
    console.error("OpenSky API error:", error);
    if (cachedData) return NextResponse.json(cachedData.data);
    return NextResponse.json(
      { error: "Unable to retrieve aircraft data" },
      { status: 500 }
    );
  }
}
