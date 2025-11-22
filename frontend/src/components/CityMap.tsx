import { useEffect, useRef } from "react";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import { EmotionSignal, EMOTION_CONFIG } from "@/types/emotion";
import { MapPin } from "lucide-react";
// IMPORT THE NEW CONFIG
import { MUNICH_CENTER, MUNICH_BOUNDS, MAP_DEFAULTS } from "@/config/map";

interface CityMapProps {
  signals: EmotionSignal[];
  onLocationSelect?: (lat: number, lng: number) => void;
  selectMode?: boolean;
  maxBounds?: maplibregl.LngLatBoundsLike;
  minZoom?: number; 
  center?: [number, number]; // Add center prop
}

// Color map for emotions (matching our design system)
const EMOTION_COLORS: Record<string, string> = {
  happy: "#f4c430",
  neutral: "#b3b3b3",
  sad: "#5b8cdb",
  stressed: "#e85d4a",
  calm: "#4db6a3",
  energetic: "#f5a142",
  tired: "#9370db",
};

export const CityMap = ({
  signals,
  onLocationSelect,
  selectMode = false,
  maxBounds = MUNICH_BOUNDS,
  minZoom = MAP_DEFAULTS.minZoom,
  center = MUNICH_CENTER // Use center prop with default from config
}: CityMapProps) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<maplibregl.Map | null>(null);

  useEffect(() => {
    if (!mapContainer.current) return;
    // Prevent double initialization (React 18 Strict Mode fix)
    if (map.current) return;

    map.current = new maplibregl.Map({
      container: mapContainer.current,
      style: "https://tiles.stadiamaps.com/styles/osm_bright.json", 
      center: center, // Use the center prop here
      zoom: MAP_DEFAULTS.initialZoom,
      maxBounds: maxBounds, 
      minZoom: minZoom // Apply minZoom here
    });

    map.current.addControl(new maplibregl.NavigationControl(), "top-right");

    // Add click handler for location selection
    if (selectMode && onLocationSelect) {
      map.current.on("click", (e) => {
        onLocationSelect(e.lngLat.lat, e.lngLat.lng);
      });
    }

    map.current.on("load", () => {
      // Add emotion markers with heatmap-style appearance
      signals.forEach((signal) => {
        const color = EMOTION_COLORS[signal.emotion] || "#999";

        // Create custom marker element
        const el = document.createElement("div");
        el.className = "emotion-marker";
        el.style.cssText = `
          background-color: ${color};
          width: 24px;
          height: 24px;
          border-radius: 50%;
          border: 2px solid white;
          cursor: pointer;
          box-shadow: 0 0 20px ${color}80, 0 2px 8px rgba(0,0,0,0.2);
          transition: all 0.2s;
          opacity: 0.8;
        `;
        el.addEventListener("mouseenter", () => {
          el.style.transform = "scale(1.3)";
          el.style.opacity = "1";
        });
        el.addEventListener("mouseleave", () => {
          el.style.transform = "scale(1)";
          el.style.opacity = "0.8";
        });

        // Create popup
        const popup = new maplibregl.Popup({ offset: 25 }).setHTML(`
          <div style="padding: 8px; font-family: system-ui;">
            <div style="font-weight: 600; text-align: center; margin-bottom: 4px; color: ${color};">${EMOTION_CONFIG[signal.emotion]?.label || signal.emotion}</div>
            ${signal.description ? `<div style="font-size: 12px; color: #666; margin-bottom: 4px;">${signal.description}</div>` : ""}
            <div style="font-size: 11px; color: #999; text-align: center;">${signal.timestamp.toLocaleTimeString()}</div>
          </div>
        `);

        new maplibregl.Marker(el)
          .setLngLat([signal.location.lng, signal.location.lat])
          .setPopup(popup)
          .addTo(map.current!);
      });
    });

    return () => {
      map.current?.remove();
      map.current = null;
    };
  }, [signals, selectMode, onLocationSelect, maxBounds, minZoom, center]); // Add center to dependencies

  return (
    <div className="relative w-full h-full">
      <div ref={mapContainer} className="absolute inset-0 rounded-lg shadow-lg" />
      {selectMode && (
        <div className="absolute top-4 left-4 bg-card p-3 rounded-lg shadow-md border z-10">
          <p className="text-sm font-medium flex items-center gap-2">
            <MapPin className="h-4 w-4" />
            Click on the map to set location
          </p>
        </div>
      )}
    </div>
  );
};