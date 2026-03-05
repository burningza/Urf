import React, { useState, useEffect, useMemo } from "react";
import DeckGL from "@deck.gl/react";
import { Tile3DLayer } from "@deck.gl/geo-layers";
import { IconLayer, BitmapLayer } from "@deck.gl/layers";
import { TileLayer } from "@deck.gl/geo-layers";
import { PostProcessEffect, _GlobeView as GlobeView } from "@deck.gl/core";
import axios from "axios";
import { postProcessShader } from "../shaders/postprocess";

const GOOGLE_MAPS_API_KEY = "AIzaSyBBsikB6zQW6P96z4L25RnrIHtNE3P5ta8";

const INITIAL_VIEW_STATE = {
  latitude: 40.7128,
  longitude: -74.006,
  zoom: 1,
  pitch: 0,
  bearing: 0
};

interface GlobeProps {
  shaderMode: number;
}

export const Globe: React.FC<GlobeProps> = ({ shaderMode }) => {
  const [viewState, setViewState] = useState(INITIAL_VIEW_STATE);
  const [flights, setFlights] = useState<any>(null);

  useEffect(() => {
    const fetchFlights = async () => {
      try {
        const response = await axios.get("http://localhost:3001/api/flights");
        setFlights(response.data);
      } catch (err) {
        console.error("Failed to fetch flights", err);
      }
    };

    fetchFlights();
    const interval = setInterval(fetchFlights, 10000);
    return () => clearInterval(interval);
  }, []);

  const postProcessEffect = useMemo(() => {
    return new PostProcessEffect({
      name: 'urf_post_process',
      fs: postProcessShader,
      passes: [{ sampler: true }],
      uniforms: {
        mode: shaderMode,
        bloom: shaderMode === 3 ? 0.5 : 0.0,
        time: 0
      }
    } as any, {});
  }, [shaderMode]);

  const layers = [
    // Base Satellite Layer for the Globe Surface
    new TileLayer({
      id: 'base-satellite',
      data: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
      minZoom: 0,
      maxZoom: 19,
      tileSize: 256,
      renderSubLayers: (props: any) => {
        const {
          bbox: { west, south, east, north }
        } = props.tile;

        return new BitmapLayer(props, {
          data: null,
          image: props.data,
          bounds: [west, south, east, north]
        });
      }
    }),
    // 3D Tiles Layer (Only active when zoomed in to prevent artifacts)
    new Tile3DLayer({
      id: "google-3d-tiles",
      data: `https://tile.googleapis.com/v1/3dtiles/root.json?key=${GOOGLE_MAPS_API_KEY}`,
      onTileLoad: () => console.log("3D Tile Loaded"),
      minZoom: 8, // Hide at low zoom to prevent clustering at [0,0]
      opacity: 1.0,
      pickable: true
    }),
    new IconLayer({
      id: "flights-layer",
      data: flights?.features || [],
      getPosition: (d: any) => d.geometry.coordinates,
      getIcon: () => ({
        url: "https://raw.githubusercontent.com/visgl/deck.gl-data/master/website/icon-atlas.png",
        x: 0,
        y: 0,
        width: 128,
        height: 128,
        anchorY: 128,
        mask: true
      }),
      getSize: 30,
      sizeScale: Math.max(0.1, Math.min(1.0, (viewState.zoom / 10))), // Adjust marker size based on zoom
      getColor: [0, 255, 65],
      pickable: true
    })
  ];

  return (
    <div style={{ width: "100vw", height: "100vh", background: "#000" }}>
      <DeckGL
        views={new GlobeView()}
        initialViewState={viewState}
        onViewStateChange={(e: any) => setViewState(e.viewState)}
        controller={true}
        layers={layers}
        effects={[postProcessEffect]}
      />
    </div>
  );
};
