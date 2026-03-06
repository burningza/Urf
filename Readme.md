# UrfOps (Urf) 🌍

**An Immersive Geospatial Spy-Thriller Dashboard.**

UrfOps is a photorealistic 3D Earth visualization tool that fuses live telemetry (flights, satellites, CCTV, seismic activity) into a unified, high-performance interface.

## 🚀 Quick Start

This is a monorepo containing both the frontend client and the backend proxy server.

### Prerequisites
- Node.js (v20+)
- npm

### Installation
```bash
# Install dependencies for the entire project
npm install
```

### Development
```bash
# Start the backend proxy (on port 3001)
npm run dev:server

# Start the frontend client (on port 5173)
npm run dev:client
```

## 🏗 Project Architecture

| Component | Technology | Description |
| :--- | :--- | :--- |
| **Client** | React 19, Vite, Deck.gl, Cesium | 3D Visualization & Post-Processing |
| **Server** | Node.js, Express, node-cache | Local Proxy & API Caching |
| **Styling** | Vanilla CSS (Vibe-Coded) | High-contrast "Ops Center" Aesthetic |

## 📂 Repository Structure
- `client/`: React application, custom shaders, and geospatial layers.
- `server/`: Express proxy server for data ingestion.
- `assets/`: Global branding and UI artifacts.
- `GEMINI.md`: Core mandates for AI-assisted development.
- `MANUAL.md`: Detailed operations and performance standards.

## 🛡 Performance & Safety
- **Proxy Requirement:** All external data flows through the `/server` to prevent rate-limiting and browser crashes.
- **Memory Management:** Mandatory WebGL garbage collection for all custom layers.
- **Target:** Consistent 60 FPS performance on modern hardware.

## 📖 Documentation
- [Operations Manual](./MANUAL.md) - Deep dive into tech and "vibe" standards.
- [Client README](./client/README.md) - Frontend specifics.
- [Server README](./server/README.md) - Backend specifics.

---
*Developed with AI-Assistance. Optimized for performance and immersion.*
