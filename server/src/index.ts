import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import NodeCache from "node-cache";
import axios from "axios";

dotenv.config();

const app = express();
const port = process.env.PORT || 3001;
const cache = new NodeCache({ stdTTL: 10 });

app.use(cors());
app.use(express.json());

// Root route to prevent "Cannot GET /"
app.get("/", (req, res) => {
  res.json({ project: "WorldView Proxy", status: "active", endpoints: ["/api/health", "/api/flights"] });
});

app.get("/api/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

app.get("/api/flights", async (req, res) => {
  const cachedData = cache.get("flights");
  if (cachedData) {
    return res.json(cachedData);
  }

  try {
    const response = await axios.get("https://opensky-network.org/api/states/all", {
      timeout: 10000
    });
    
    const states = response.data.states || [];
    const geojson = {
      type: "FeatureCollection",
      features: states.filter((s: any) => s[5] && s[6]).map((s: any) => ({
        type: "Feature",
        properties: {
          icao24: s[0],
          callsign: s[1]?.trim(),
          origin: s[2],
          altitude: s[7] || s[13],
          velocity: s[9],
          track: s[10]
        },
        geometry: {
          type: "Point",
          coordinates: [s[5], s[6], s[7] || 0]
        }
      }))
    };

    cache.set("flights", geojson);
    res.json(geojson);
  } catch (error: any) {
    console.error("Error fetching flight data:", error.message);
    res.status(500).json({ error: "Failed to fetch flight data" });
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
