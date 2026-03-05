# WorldView (Urf) - Operations Manual

## 🌐 Vision & Objective
WorldView is an immersive, high-fidelity geospatial dashboard designed for real-time tracking and situational awareness. It aims to provide a "God's eye view" of the planet, blending photorealistic 3D terrain with live telemetry.

## 🎨 Visual Identity: "The Spy-Thriller Vibe"
All interface and rendering logic must adhere to the project's visual standards:
- **Primary Color:** `#00ff41` (Classic Matrix/Terminal Green).
- **Background:** Deep blacks (`#000000`) or charcoal grays for high contrast.
- **Typography:** Monospace fonts only (e.g., Fira Code, JetBrains Mono).
- **Effects:** High-contrast scanlines, subtle chromatic aberration, and a unified post-processing pipeline.
- **HUD Elements:** Lean, wireframe-style UI elements. No rounded corners or gradients unless they serve a functional "thermal" or "radar" purpose.

## 🛠 Tech Stack Deep Dive

### Frontend Architecture
- **Framework:** React 19 (TypeScript) using Vite for sub-second hot reloading.
- **Rendering Engine:** `Deck.gl` v9+ for massive geospatial datasets.
- **Terrain Engine:** Google Maps Photorealistic 3D Tiles API via CesiumJS/Resium.
- **Shaders:** Custom GLSL shaders for real-time post-processing (CRT, NVG, FLIR).
- **State Management:** React Context/Hooks for UI state; Deck.gl internal state for layer management.

### Backend Proxy Layer
- **Runtime:** Node.js (TypeScript) + Express.
- **Data Ingestion:** Axios for hitting OpenSky, ADSBx, Space-Track, and USGS.
- **Caching Mechanism:** `node-cache` with strict TTLs (10s for flights, 60s for CCTV).
- **Protocol:** Standard REST for data retrieval; WebSockets (`ws`) for live event streaming.

## ⚡ Performance Mandates
1. **WebGL Garbage Collection:** 
   - Every `Layer` or `Effect` must have an explicit disposal path.
   - When a user zooms out or a data source is toggled off, textures and buffers must be wiped from GPU memory.
2. **Frustum Culling:** 
   - 3D Tiles and GeoJSON layers must only load data within the camera's current viewing frustum.
3. **Target Performance:** 60 FPS is the baseline. If a shader or layer drops the framerate below 50 FPS, it must be refactored or optimized.

## 📡 Data Protocol
- **STRICT PROXY POLICY:** The client MUST NOT hit external APIs directly. This prevents CORS issues, hides API keys, and centralizes rate limiting.
- **Standardization:** All backend responses should be transformed into standardized GeoJSON before reaching the client.

## 🤖 AI Multi-Agent Workflow
To maintain high development velocity without introducing "code bloat," follow these roles:
- **WebGL Wizard:** Handles all `.glsl`, `.ts` files related to rendering, and Deck.gl layer definitions.
- **Data Plumber:** Handles all `server/` logic, API transformations, and caching strategies.
- **Business Analyst:** (You) Manages documentation, requirements, and project structure.

---
*Operational Document v1.0.0*
