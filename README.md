# Airspace

A small live air-traffic dashboard built with Next.js, TypeScript, and Tailwind CSS. Aircraft positions are provided by the OpenSky Network REST API.

## Run locally

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). The server-side `/api/states` route requests anonymous OpenSky state vectors for the selected region. No API key is required for the demo; OpenSky may apply rate limits to anonymous requests.

The browser refreshes visible dashboards every 15 seconds, and the API route briefly caches results to reduce upstream requests. If OpenSky is unavailable before a live response is received, the dashboard shows clearly labeled sample traffic; after a successful response it keeps the most recent positions visible during temporary upstream failures.

The aircraft list supports region selection, callsign/country search, and altitude/on-ground filters. Select an aircraft to inspect its latest available details. Its dotted track is built from distinct position observations received during the current browser session.

## Scripts

- `npm run dev` — start the development server.
- `npm run build` — create a production build.
- `npm run lint` — run ESLint.
