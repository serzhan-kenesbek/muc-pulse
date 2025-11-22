import { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { EmotionSignal, EMOTION_CONFIG } from "@/types/emotion";
import { Input } from "@/components/ui/input";
import { MapPin } from "lucide-react";

interface CityMapProps {
  signals: EmotionSignal[];
  onLocationSelect?: (lat: number, lng: number) => void;
  selectMode?: boolean;
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

export const CityMap = ({ signals, onLocationSelect, selectMode = false }: CityMapProps) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [mapboxToken, setMapboxToken] = useState("");
  const [tokenSubmitted, setTokenSubmitted] = useState(false);

  useEffect(() => {
    if (!mapContainer.current || !tokenSubmitted || !mapboxToken) return;

    mapboxgl.accessToken = mapboxToken;

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/light-v11",
      center: [11.5820, 48.1351], // Munich
      zoom: 12,
    });

    map.current.addControl(new mapboxgl.NavigationControl(), "top-right");

    // Add click handler for location selection
    if (selectMode && onLocationSelect) {
      map.current.on("click", (e) => {
        onLocationSelect(e.lngLat.lat, e.lngLat.lng);
      });
    }

    map.current.on("load", () => {
      // Add emotion markers
      signals.forEach((signal) => {
        const color = EMOTION_COLORS[signal.emotion] || "#999";
        const emoji = EMOTION_CONFIG[signal.emotion].emoji;

        // Create custom marker element
        const el = document.createElement("div");
        el.className = "emotion-marker";
        el.style.cssText = `
          background-color: ${color};
          width: 32px;
          height: 32px;
          border-radius: 50%;
          border: 2px solid white;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 18px;
          cursor: pointer;
          box-shadow: 0 2px 8px rgba(0,0,0,0.2);
          transition: transform 0.2s;
        `;
        el.textContent = emoji;
        el.addEventListener("mouseenter", () => {
          el.style.transform = "scale(1.2)";
        });
        el.addEventListener("mouseleave", () => {
          el.style.transform = "scale(1)";
        });

        // Create popup
        const popup = new mapboxgl.Popup({ offset: 25 }).setHTML(`
          <div style="padding: 8px; font-family: system-ui;">
            <div style="font-size: 24px; text-align: center; margin-bottom: 4px;">${emoji}</div>
            <div style="font-weight: 600; text-align: center; margin-bottom: 4px;">${EMOTION_CONFIG[signal.emotion].label}</div>
            ${signal.description ? `<div style="font-size: 12px; color: #666; margin-bottom: 4px;">${signal.description}</div>` : ""}
            <div style="font-size: 11px; color: #999; text-align: center;">${signal.timestamp.toLocaleTimeString()}</div>
          </div>
        `);

        new mapboxgl.Marker(el)
          .setLngLat([signal.location.lng, signal.location.lat])
          .setPopup(popup)
          .addTo(map.current!);
      });
    });

    return () => {
      map.current?.remove();
    };
  }, [signals, tokenSubmitted, mapboxToken, selectMode, onLocationSelect]);

  if (!tokenSubmitted) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-muted rounded-lg p-8">
        <div className="max-w-md w-full space-y-4">
          <div className="text-center space-y-2">
            <MapPin className="h-12 w-12 mx-auto text-primary" />
            <h3 className="text-lg font-semibold">Enter Mapbox Token</h3>
            <p className="text-sm text-muted-foreground">
              Get your free token at{" "}
              <a
                href="https://mapbox.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                mapbox.com
              </a>
            </p>
          </div>
          <div className="flex gap-2">
            <Input
              type="text"
              placeholder="pk.eyJ1Ijoi..."
              value={mapboxToken}
              onChange={(e) => setMapboxToken(e.target.value)}
              className="flex-1"
            />
            <button
              onClick={() => setTokenSubmitted(true)}
              disabled={!mapboxToken}
              className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Load Map
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full">
      <div ref={mapContainer} className="absolute inset-0 rounded-lg shadow-lg" />
      {selectMode && (
        <div className="absolute top-4 left-4 bg-card p-3 rounded-lg shadow-md border">
          <p className="text-sm font-medium flex items-center gap-2">
            <MapPin className="h-4 w-4" />
            Click on the map to set location
          </p>
        </div>
      )}
    </div>
  );
};
