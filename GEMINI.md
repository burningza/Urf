# WorldView (Urf) - Project Mandates & Technical Standards

This document defines the foundational mandates and technical standards for the WorldView (Urf) project. All AI agents and developers MUST strictly adhere to these instructions.

## 🌍 Project Overview
WorldView is an immersive, spy-thriller-style geospatial dashboard. It fuses real-time data (flights, satellites, CCTV, seismic activity) against a photorealistic 3D model of Earth.

Load skills in gemini!

## 🛠 Core Mandates

### 1. Performance & Memory Safety
- **WebGL Garbage Collection:** Explicitly dispose of WebGL geometries, materials, and textures when a layer or particle system is removed.
- **Lazy Loading:** Implement lazy loading for 3D tiles based on the camera's current frustum.
- **60 FPS Target:** All rendering logic, including custom shaders, must be optimized to maintain a consistent 60 FPS.

### 2. Data Integrity & Rate Limiting
- **Proxy Requirement:** NEVER hit public APIs directly from the client. All external requests MUST be routed through the local caching proxy (`/server`).
- **Caching Strategy:**
    - Flight Data (OpenSky): 10-second cache TTL.
    - CCTV Feeds: Strict 60-second polling interval.
- **WebSockets:** Prefer WebSockets for high-frequency telemetry updates over HTTP polling where available.

### 3. Visual Aesthetic ("Vibe-Coded")
- **Spy-Thriller Style:** Maintain a dark, high-contrast, "ops-center" aesthetic.
- **Post-Processing Pipeline:** Use the unified `PostProcessEffect` for CRT, Night Vision (NVG), and FLIR (Thermal) modes.
- **UI Constraints:** Keep UI elements lean and futuristic (monospace fonts, primary color `#00ff41`).

## 💻 Specialized Agent Roles

### Agent A: The WebGL Wizard
- **Scope:** Writing custom shaders (GLSL), particle systems, and handling all `Deck.gl` / `luma.gl` rendering logic.
- **Standard:** Use Deck.gl v9+ module-based shader definitions. Ensure all shaders include optimization flags.

### Agent B: The Data Plumber
- **Scope:** Backend proxy development, API polling logic, and GeoJSON standardization.
- **Standard:** All backend endpoints must return standardized GeoJSON. Implement robust error boundaries and logging for payload sizes.

## 🚀 Technical Standards

### Frontend (Client)
- **Framework:** React 19 (TypeScript) + Vite.
- **Geospatial:** `Deck.gl` for layers, `Google Maps Photorealistic 3D Tiles API` for terrain.
- **Coordinate System:** Standard EPSG:4326 for all data transformations.

### Backend (Server)
- **Runtime:** Node.js (TypeScript) + Express.
- **Caching:** `node-cache` for lightweight local proxy caching.
- **Communication:** Axios for external fetches, standard REST for client communication.

## 🔄 Workflow Instructions

1. **Research Phase:** Before any implementation, map existing GeoJSON structures and verify rate limits for target data sources.
2. **Strategy Phase:** Define whether a change belongs to the "WebGL Wizard" (rendering) or the "Data Plumber" (data flow).
3. **Execution Phase:**
    - For bug fixes: Empirically reproduce the failure before applying the fix.
    - For features: Fulfill the entire lifecycle (implementation, testing, validation).
4. **Validation Phase:** Run `npm run lint` and verify rendering performance in the browser.

---
*Mandate Version: 1.0.0*
