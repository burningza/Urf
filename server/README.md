# WorldView Server - Caching Proxy

The WorldView server acts as a centralized data plumber, ingesting live telemetry and serving it to the client in a standardized format while protecting against rate limits.

## 🛠 Tech Stack
- **Node.js:** CommonJS/TypeScript runtime.
- **Express 5:** Next-gen routing and middleware.
- **node-cache:** Lightweight in-memory TTL caching.
- **WebSockets (ws):** For real-time telemetry streaming.

## 📡 API Endpoints (Planned/Implemented)
- `GET /api/flights`: Proxies OpenSky/ADSBx data (10s Cache).
- `GET /api/cctv`: Proxies traffic camera feeds (60s Cache).
- `GET /api/satellites`: Proxies NORAD TLE data via Space-Track.
- `GET /api/seismic`: Proxies USGS earthquake feeds.

## 🛡 Security & Reliability
- **CORS:** Only allows requests from the approved frontend origin.
- **Rate Limiting:** Enforces strict polling intervals to prevent IP bans from public data providers.
- **Error Boundaries:** Returns graceful GeoJSON empty sets if upstream providers fail.

## 🚀 Local Development
```bash
npm run dev
```
The server will start on [http://localhost:3001](http://localhost:3001).
