# WORLDVIEW // FRONTEND (CLIENT)
🌍 **Operational Geospatial Dashboard**

This is the frontend component of the Urf (WorldView) monorepo. It provides a high-performance, WebGL-accelerated 3D globe visualization for real-time tactical data.

## 🛠 Tech Stack
- **Framework:** React 19 + TypeScript + Vite
- **Geospatial Engine:** [Deck.gl v9](https://deck.gl/)
- **Base Map:** Google Maps Photorealistic 3D Tiles API
- **Visuals:** Custom GLSL Post-Processing (CRT, NVG, FLIR)
- **Icons:** Lucide React

## 🚀 Quick Start

### 1. Prerequisites
Ensure you have a **Google Maps API Key** with the **Map Tiles API** enabled.

### 2. Environment Setup
Create a `.env` file in this directory (see `.env.example`):
```bash
VITE_GOOGLE_MAPS_API_KEY=your_api_key_here
```

### 3. Installation & Launch
From the project root:
```bash
npm run dev:client
```
The dashboard will be available at `http://localhost:5173`.

## 📡 Features & Controls
- **3D Globe View:** Real-time spherical projection.
- **Flight Tracking:** Visualizes live aircraft via the `/server` proxy.
- **Visual Modes:**
  - **NORMAL:** Standard satellite/3D imagery.
  - **CRT:** Tactical monitor simulation with scanlines.
  - **NVG:** High-gain Night Vision (Green).
  - **FLIR:** Thermal imaging heat-map simulation.

## 💻 Technical Mandates
- **Memory Safety:** All WebGL resources are actively managed to prevent leaks.
- **Zoom Guards:** 3D Tiles are throttled below zoom level 8 to prevent coordinate-clustering artifacts.
- **Proxy Requirement:** All data layers must poll through the backend proxy to ensure rate-limit compliance.

---
*Operational Status: ACTIVE*
