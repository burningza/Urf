Project: Urf (aka WorldView)
🌍 Overview
WorldView is a highly immersive, spy-thriller-style geospatial dashboard that fuses real-time data against a 3D model of the Earth. Inspired by Palantir's systems and recent viral "vibe-coded" projects, this browser-based tool aggregates satellite tracking, live CCTV cameras, and flight data into a single operational picture.

This project relies heavily on AI-assisted development (CLI agents). To prevent catastrophic browser crashes and API bans, this architecture enforces strict state management, local proxy caching, and WebGL garbage collection.

🛠 Tech Stack & Data Sources
3D Globe & Environment: Google Maps Photorealistic 3D Tiles API via Deck.gl or CesiumJS for optimized rendering.

Caching Proxy Backend: A lightweight Node.js or Python proxy to handle external requests and prevent front-end rate limiting.

Commercial & Military Flights: Open Sky Network and ADS-B Exchange (ADSBx).

Satellite Tracking: NORAD TLE data via the Space-Track API.

Points of Interest & Roads: OpenStreetMap (OSM) via the Overpass API.

CCTV Feeds: Public traffic camera APIs.

Seismic Activity: USGS global earthquake GeoJSON feeds.

🚀 Core Features & Standard Practices
1. The 3D Base Map & Camera Navigation
Use standard geospatial coordinates (EPSG:4326) for all data transformations.

Implement lazy loading for 3D tiles based entirely on the camera's current frustum.

Calculate the center of mass from OSM bounding boxes to ensure smooth, cinematic camera fly-to animations when jumping between landmarks.

2. Live Data Integrations & Rate Limiting
Never hit public APIs directly from the client; route all calls through the local caching proxy.

Throttle CCTV API image polling to a strict 60-second interval to avoid IP bans.

Utilize WebSockets for air traffic and telemetry updates instead of aggressive HTTP polling.

Spawn street traffic particle systems only within a 5-kilometer radius of the active camera target.

3. Visual Filters & WebGL Memory Management
Build a unified post-processing pipeline for CRT, Night Vision (NVG), and FLIR (thermal) modes.

Explicitly dispose of WebGL geometries, materials, and textures the moment a particle or layer is removed from the scene to prevent massive memory leaks.

Add user-controlled sliders for bloom, pixelation, and chromatic aberration.

💻 AI CLI Development Strategy
1. Context Isolation (Multi-Agent Setup)
Agent A (The WebGL Wizard): Restricted strictly to writing custom shaders, particle systems, and handling rendering logic.

Agent B (The Data Plumber): Restricted to writing the backend proxy, API polling logic, and formatting JSON payloads into standardized GeoJSON.

2. Defensive Prompting
Do not allow the AI to hallucinate infinite loops; force the implementation of error boundaries.

Require sequential loading in all rendering prompts to ensure highways load before arterial roads.

Mandate that the AI includes console logging for data payload sizes.

3. High-Yield Prompts
Prompt 1: Base Environment & Memory Safety

"Using Deck.gl and the Google Maps 3D Tiles API, set up a full globe browser environment. Write a function that takes an OSM bounding box, calculates its 3D volume, and smoothly animates the camera to center it. Ensure all off-screen 3D tiles are actively garbage collected to maintain 60fps."

Prompt 2: Post-Processing Pipeline

"Write a WebGL post-processing shader pipeline with three toggleable modes: a CRT monitor effect with scanlines, green-tinted Night Vision, and FLIR thermal imaging. The shader must be highly optimized and include uniform sliders for bloom intensity and pixelation scale."

Prompt 3: Proxy Data Ingestion

"Build a lightweight Node.js proxy server that fetches live flight data from ADS-B Exchange. Implement a caching layer that holds the data for 10 seconds to prevent rate limiting, and expose an endpoint that the frontend can poll safely."


