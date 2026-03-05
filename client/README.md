# WorldView Client - Frontend Engine

The frontend for WorldView is built for high-performance geospatial rendering and cinematic post-processing.

## 🛠 Tech Stack
- **React 19:** Utilizing the latest concurrent rendering features.
- **Vite:** Lightning-fast HMR and build times.
- **Deck.gl v9:** Modular geospatial rendering for massive datasets.
- **Google Maps 3D Tiles:** Photorealistic terrain and buildings.
- **Custom Shaders:** GLSL-based post-processing (CRT, NVG, Thermal).

## 📂 Folder Structure
- `src/components/`: Core UI and Globe components.
- `src/shaders/`: Custom GLSL shader definitions.
- `src/layers/`: Deck.gl layer implementations (GeoJSON, Scenegraph, etc.).
- `src/hooks/`: Geospatial and state management hooks.

## 🎨 Vibe-Coding Standards
- All UI components must use the monospace font family.
- UI elements should be positioned as "HUD Overlays" rather than standard web containers.
- Color palette is strictly locked to `#00ff41` on `#000000`.

## 🚀 Local Development
```bash
npm run dev
```
The client will start on [http://localhost:5173](http://localhost:5173).

## ⚡ Performance Note
Always ensure that `dispose()` methods are called on any custom WebGL resources within `useEffect` cleanups to prevent memory leaks during hot-reloads or layer toggles.
