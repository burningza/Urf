import React, { useEffect, useState, useMemo } from 'react';
import DeckGL from '@deck.gl/react';
import { _GlobeView as GlobeView, PostProcessEffect } from '@deck.gl/core';
import type { MapViewState } from '@deck.gl/core';
import { TileLayer } from '@deck.gl/geo-layers';
import { IconLayer, BitmapLayer } from '@deck.gl/layers';
import { postProcessShader } from '../shaders/postprocess';

const INITIAL_VIEW_STATE: MapViewState = {
  latitude: 40.7128,
  longitude: -74.006,
  zoom: 1,
  pitch: 0,
  bearing: 0
};

interface FlightProperties {
  icao24: string;
  callsign: string;
  origin: string;
  altitude: number;
  velocity: number;
  track: number;
}

interface CCTVProperties {
  id: string;
  status: string;
  feed: string;
}

interface GeoJSONFeature<P> {
  type: 'Feature';
  properties: P;
  geometry: {
    type: 'Point';
    coordinates: [number, number, number?];
  };
}

type Flight = GeoJSONFeature<FlightProperties>;
type CCTV = GeoJSONFeature<CCTVProperties>;

interface GlobeProps {
  shaderMode: number;
}

export const Globe: React.FC<GlobeProps> = ({ shaderMode }) => {
  const [flights, setFlights] = useState<Flight[]>([]);
  const [cctv, setCctv] = useState<CCTV[]>([]);
  const [time, setTime] = useState(0);

  // Telemetry stream
  useEffect(() => {
    let ws: WebSocket | null = null;
    let reconnectTimeout: ReturnType<typeof setTimeout>;

    const connect = () => {
      // Use standard WebSocket connection to the proxy server
      ws = new WebSocket("ws://localhost:3001");
      ws.onopen = () => console.log("OPS_CENTER: Telemetry link established.");
      ws.onmessage = (event) => {
        try {
          const payload = JSON.parse(event.data);
          if (payload.type === "flights") setFlights(payload.data.features || []);
          else if (payload.type === "cctv") setCctv(payload.data.features || []);
        } catch (e) { console.error("Data error", e); }
      };
      ws.onclose = () => {
        console.warn("OPS_CENTER: Telemetry lost. Reconnecting...");
        reconnectTimeout = setTimeout(connect, 5000);
      };
    };

    connect();

    const startTime = performance.now();
    const interval = setInterval(() => {
      setTime((performance.now() - startTime) / 1000);
    }, 16);

    return () => {
      if (ws) ws.close();
      clearTimeout(reconnectTimeout);
      clearInterval(interval);
    };
  }, []);

  // Post-processing effect
  const postProcessEffect = useMemo(() => {
    return new PostProcessEffect({
      name: 'urf_post_process',
      fs: postProcessShader,
      passes: [{ filter: true }],
      uniformTypes: {
        bloom: 'f32',
        mode: 'i32',
        time: 'f32'
      }
    }, {
      bloom: 0.2,
      mode: shaderMode,
      time: time
    });
  }, [shaderMode, time]);

  const layers = [
    // Base map for oceans and background
    new TileLayer({
      id: 'base-map',
      data: 'https://basemaps.cartocdn.com/dark_nolabels/{z}/{x}/{y}.png',
      minZoom: 0,
      maxZoom: 19,
      tileSize: 256,
      extent: [-180, -85.051129, 180, 85.051129],
      renderSubLayers: (props) => {
        const { bbox } = props.tile;
        const b = bbox as {
          left?: number; bottom?: number; right?: number; top?: number;
          west?: number; south?: number; east?: number; north?: number;
        };
        const bounds: [number, number, number, number] = b.left !== undefined ?
          [b.left as number, b.bottom as number, b.right as number, b.top as number] :
          [b.west as number, b.south as number, b.east as number, b.north as number];

        return new BitmapLayer(props, {
          data: undefined,
          image: props.data,
          bounds
        });
      }
    }),

    // Flights Layer
    new IconLayer<Flight>({
      id: 'flights-layer',
      data: flights,
      pickable: true,
      getPosition: (f) => [
        f.geometry.coordinates[0],
        f.geometry.coordinates[1],
        (f.geometry.coordinates[2] || 0) * 10
      ],
      getIcon: () => ({
        url: 'https://raw.githubusercontent.com/visgl/deck.gl-data/master/website/icon-atlas.png',
        x: 0,
        y: 0,
        width: 128,
        height: 128,
        anchorY: 128,
        mask: true
      }),
      getSize: 30,
      getColor: [0, 255, 65], // High-visibility green
      // Billboard mode is default for IconLayer
    }),

    // CCTV Layer
    new IconLayer<CCTV>({
      id: 'cctv-layer',
      data: cctv,
      pickable: true,
      getPosition: (c) => [
        c.geometry.coordinates[0],
        c.geometry.coordinates[1],
        200
      ],
      getIcon: () => ({
        url: 'https://raw.githubusercontent.com/visgl/deck.gl-data/master/website/icon-atlas.png',
        x: 128,
        y: 0,
        width: 128,
        height: 128,
        anchorY: 128,
        mask: true
      }),
      getSize: 20,
      getColor: [255, 0, 65], // Red for CCTV
    })
  ];

  return (
    <div className="globe-container" style={{ width: '100vw', height: '100vh', background: '#000' }}>
      <DeckGL
        initialViewState={INITIAL_VIEW_STATE}
        controller={true}
        views={new GlobeView({ id: 'globe' })}
        layers={layers}
        effects={[postProcessEffect]}
      />
    </div>
  );
};
