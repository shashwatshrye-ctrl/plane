export interface Flight {
  id: string;
  callsign: string;
  country: string;
  latitude: number;
  longitude: number;
  baroAltitude: number | null;
  altitudeFt: number | null;
  geoAltitude: number | null;
  velocityKts: number | null;
  velocityKmh: number | null;
  verticalRateFpm: number | null;
  heading: number | null;
  squawk: string | null;
  onGround: boolean;
  positionSource: string;
  category: string;
  lastContact: number;
}

export interface FlightRoute {
  origin: string;
  destination: string;
  operatorIata?: string;
  flightNumber?: number | string;
}

export type MapType = "dark" | "satellite" | "light";

export function parseOpenSkyState(state: any): Flight | null {
  const [
    icao24,
    rawCallsign,
    originCountry,
    timePosition,
    lastContact,
    longitude,
    latitude,
    baroAltitude,
    onGround,
    velocity,
    trueTrack,
    verticalRate,
    ,
    geoAltitude,
    squawk,
    ,
    positionSource,
    category,
  ] = state;

  if (longitude == null || latitude == null || isNaN(longitude) || isNaN(latitude)) {
    return null;
  }

  const callsign = rawCallsign?.trim() || icao24.toUpperCase();
  const sources = ["ADS-B", "ASTERIX", "MLAT", "FLARM"];
  const categories = [
    "No information",
    "No ADS-B info",
    "Light (< 15,500 lbs)",
    "Small (15,500 - 75,000 lbs)",
    "Large (75,000 - 300,000 lbs)",
    "High Vortex Large",
    "Heavy (> 300,000 lbs)",
    "High Performance (> 5g & 400 kts)",
    "Rotorcraft",
    "Glider / Sailplane",
    "Lighter-than-air",
    "Parachutist",
    "Ultralight / Hang-glider",
    "Reserved",
    "UAV / Drone",
    "Space / Trans-atmospheric",
  ];

  return {
    id: icao24,
    callsign,
    country: originCountry || "Unknown",
    latitude,
    longitude,
    baroAltitude: baroAltitude != null ? Math.round(baroAltitude) : null,
    altitudeFt: baroAltitude != null ? Math.round(baroAltitude * 3.28084) : null,
    geoAltitude: geoAltitude != null ? Math.round(geoAltitude) : null,
    velocityKts: velocity != null ? Math.round(velocity * 1.94384) : null,
    velocityKmh: velocity != null ? Math.round(velocity * 3.6) : null,
    verticalRateFpm: verticalRate != null ? Math.round(verticalRate * 196.85) : null,
    heading: trueTrack != null ? Math.round(trueTrack) : null,
    squawk: squawk || null,
    onGround: Boolean(onGround),
    positionSource: sources[positionSource] || "ADS-B",
    category: categories[category] || "Commercial Transport",
    lastContact: lastContact || timePosition || Math.floor(Date.now() / 1000),
  };
}
