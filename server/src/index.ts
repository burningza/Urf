import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import NodeCache from "node-cache";
import axios from "axios";
import { WebSocketServer, WebSocket } from "ws";
import http from "http";

dotenv.config();

const app = express();
const port = process.env.PORT || 3001;
const cache = new NodeCache({ stdTTL: 30 });

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({ project: "UrfOps Proxy", status: "active", endpoints: ["/api/health", "/api/flights", "/api/cctv"] });
});

app.get("/api/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// Mock flight data generator for fallback
const generateMockFlights = () => {
  const features = [];
  const centers = [
    { lon: -74.006, lat: 40.7128 }, // NYC
    { lon: -0.1276, lat: 51.5072 }, // London
    { lon: 139.6917, lat: 35.6895 } // Tokyo
  ];

  for (let i = 0; i < 50; i++) {
    const center = centers[Math.floor(Math.random() * centers.length)];
    features.push({
      type: "Feature",
      properties: {
        icao24: `MOCK${i}`,
        callsign: `FLIGHT${i}`,
        origin: "MOCK_RADAR",
        altitude: 5000 + Math.random() * 5000,
        velocity: 200 + Math.random() * 100,
        track: Math.random() * 360
      },
      geometry: {
        type: "Point",
        coordinates: [
          center.lon + (Math.random() - 0.5) * 10,
          center.lat + (Math.random() - 0.5) * 10,
          5000 + Math.random() * 5000
        ]
      }
    });
  }
  return { type: "FeatureCollection", features };
};

let lastKnownFlights: any = generateMockFlights(); // Start with mock data so the UI isn't empty
let isFetchingFlights = false;

const mockCctvFeeds = {
  type: "FeatureCollection",
  features: [
    { type: "Feature", properties: { id: "CCTV-NY-01", status: "active", feed: "rtsp://..." }, geometry: { type: "Point", coordinates: [-74.006, 40.7128] } },
    { type: "Feature", properties: { id: "CCTV-LDN-01", status: "active", feed: "rtsp://..." }, geometry: { type: "Point", coordinates: [-0.1276, 51.5072] } },
    { type: "Feature", properties: { id: "CCTV-TKY-01", status: "active", feed: "rtsp://..." }, geometry: { type: "Point", coordinates: [139.6917, 35.6895] } }
  ]
};

const fetchFlightsData = async () => {
  if (isFetchingFlights) return lastKnownFlights;

  const cachedData = cache.get("flights");
  if (cachedData) return cachedData;

  isFetchingFlights = true;
  try {
    console.log("Attempting to fetch fresh flight data from OpenSky...");
    const response = await axios.get("https://opensky-network.org/api/states/all", {
      timeout: 15000,
      headers: { 'Accept-Encoding': 'gzip' }
    });

    const states = response.data.states || [];
    const geojson = {
      type: "FeatureCollection",
      features: states
        .filter((s: any) => s[5] && s[6])
        .slice(0, 500)
        .map((s: any) => ({
          type: "Feature",
          properties: {
            icao24: s[0],
            callsign: s[1]?.trim() || "UNK",
            origin: s[2],
            altitude: s[7] || s[13],
            velocity: s[9],
            track: s[10]
          },
          geometry: {
            type: "Point",
            coordinates: [s[5], s[6], (s[7] || 0)]
          }
        }))
    };

    cache.set("flights", geojson);
    lastKnownFlights = geojson;
    console.log(`Successfully fetched ${geojson.features.length} real flights.`);
    return geojson;
  } catch (error: any) {
    if (error.response?.status === 429) {
      console.warn("OpenSky Rate Limit (429) hit. Serving existing data to avoid UI blackout.");
      // If we have no real data yet, we've already initialized lastKnownFlights with mock data.
      cache.set("flights", lastKnownFlights, 60);
    } else {
      console.error("Error fetching flight data:", error.message);
    }
    return lastKnownFlights;
  } finally {
    isFetchingFlights = false;
  }
};

app.get("/api/flights", async (req, res) => {
  const data = await fetchFlightsData();
  res.json(data);
});

app.get("/api/cctv", (req, res) => {
  res.json(mockCctvFeeds);
});

const server = http.createServer(app);
const wss = new WebSocketServer({ server });

wss.on("connection", (ws: WebSocket) => {
  console.log("Client connected via WebSocket");
  // Always send something immediately
  ws.send(JSON.stringify({ type: "flights", data: lastKnownFlights }));
  ws.send(JSON.stringify({ type: "cctv", data: mockCctvFeeds }));
});

setInterval(async () => {
  const data = await fetchFlightsData();
  if (data && wss.clients.size > 0) {
    const payload = JSON.stringify({ type: "flights", data });
    wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(payload);
      }
    });
  }
}, 20000);

setInterval(() => {
  const payload = JSON.stringify({ type: "cctv", data: mockCctvFeeds });
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(payload);
    }
  });
}, 60000);

server.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
