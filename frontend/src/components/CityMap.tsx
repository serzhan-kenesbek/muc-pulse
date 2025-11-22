import { useEffect, useRef, useMemo } from "react";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import { EmotionSignal } from "@/types/emotion";
import { MapPin } from "lucide-react";
import { MUNICH_CENTER, MUNICH_BOUNDS, MAP_DEFAULTS } from "@/config/map";

interface CityMapProps {
    signals: EmotionSignal[];
    onLocationSelect?: (lat: number, lng: number) => void;
    selectMode?: boolean;
    maxBounds?: maplibregl.LngLatBoundsLike;
    minZoom?: number;
    center?: [number, number];
}

// welche Emotionen zählen als „good“ / „bad“
const GOOD_EMOTIONS = new Set<string>([
    "safe",
    "clean",
    "accessible",
    "quiet",
    "uncrowded",
    "lively",
]);

const BAD_EMOTIONS = new Set<string>([
    "unsafe",
    "dirty",
    "inaccessible",
    "noisy",
    "crowded",
    "boring",
]);

export const CityMap = ({
                            signals,
                            onLocationSelect,
                            selectMode = false,
                            maxBounds = MUNICH_BOUNDS,
                            minZoom = MAP_DEFAULTS.minZoom,
                            center = MUNICH_CENTER,
                        }: CityMapProps) => {
    const mapContainer = useRef<HTMLDivElement | null>(null);
    const map = useRef<maplibregl.Map | null>(null);

    // getrennte GeoJSONs für good / bad
    const { goodGeojson, badGeojson } = useMemo(() => {
        const goodFeatures: any[] = [];
        const badFeatures: any[] = [];

        for (const s of signals) {
            const coords: [number, number] = [s.location.lng, s.location.lat];

            if (BAD_EMOTIONS.has(s.emotion)) {
                badFeatures.push({
                    type: "Feature",
                    properties: { weight: 1.0 },
                    geometry: { type: "Point", coordinates: coords },
                });
            } else if (GOOD_EMOTIONS.has(s.emotion)) {
                goodFeatures.push({
                    type: "Feature",
                    properties: { weight: 0.7 },
                    geometry: { type: "Point", coordinates: coords },
                });
            } else {
                // neutral / unknown -> leicht positiv
                goodFeatures.push({
                    type: "Feature",
                    properties: { weight: 0.4 },
                    geometry: { type: "Point", coordinates: coords },
                });
            }
        }

        return {
            goodGeojson: {
                type: "FeatureCollection" as const,
                features: goodFeatures,
            },
            badGeojson: {
                type: "FeatureCollection" as const,
                features: badFeatures,
            },
        };
    }, [signals]);

    // 🔹 Map EINMAL initialisieren – NICHT von signals abhängig
    useEffect(() => {
        if (!mapContainer.current || map.current) return;

        const m = new maplibregl.Map({
            container: mapContainer.current,
            style: "https://tiles.stadiamaps.com/styles/osm_bright.json",
            center,
            zoom: MAP_DEFAULTS.initialZoom,
            maxBounds,
            minZoom,
        });

        map.current = m;
        m.addControl(new maplibregl.NavigationControl(), "top-right");

        m.on("load", () => {
            // BAD-Heatmap (pink/orange/rot)
            m.addSource("signals-bad", {
                type: "geojson",
                data: badGeojson,
            });

            m.addLayer({
                id: "heatmap-bad",
                type: "heatmap",
                source: "signals-bad",
                maxzoom: 18,
                paint: {
                    "heatmap-weight": ["get", "weight"],
                    "heatmap-intensity": 1.4,
                    "heatmap-radius": 40,
                    "heatmap-opacity": [
                        "interpolate",
                        ["linear"],
                        ["zoom"],
                        10,
                        0.6,
                        15,
                        0.95,
                    ],
                    "heatmap-color": [
                        "interpolate",
                        ["linear"],
                        ["heatmap-density"],
                        0.0,
                        "rgba(0,0,0,0)",
                        0.2,
                        "#f9a8d4", // pink-300
                        0.5,
                        "#fb923c", // orange-400
                        0.8,
                        "#f97373", // soft red
                        1.0,
                        "#ef4444", // red-500
                    ],
                },
            });

            // GOOD-Heatmap (grün / cyan)
            m.addSource("signals-good", {
                type: "geojson",
                data: goodGeojson,
            });

            m.addLayer({
                id: "heatmap-good",
                type: "heatmap",
                source: "signals-good",
                maxzoom: 18,
                paint: {
                    "heatmap-weight": ["get", "weight"],
                    "heatmap-intensity": 1.2,
                    "heatmap-radius": 40,
                    "heatmap-opacity": [
                        "interpolate",
                        ["linear"],
                        ["zoom"],
                        10,
                        0.5,
                        15,
                        0.9,
                    ],
                    "heatmap-color": [
                        "interpolate",
                        ["linear"],
                        ["heatmap-density"],
                        0.0,
                        "rgba(0,0,0,0)",
                        0.2,
                        "#6ee7b7", // emerald-300
                        0.5,
                        "#22c55e", // green-500
                        0.8,
                        "#22d3ee", // cyan-400
                        1.0,
                        "#2dd4bf", // teal-400
                    ],
                },
            });
        });

        return () => {
            m.remove();
            map.current = null;
        };
    }, [center, maxBounds, minZoom, goodGeojson, badGeojson]);

    // 🔹 Daten nachladen wenn sich signals/Filter ändern
    useEffect(() => {
        if (!map.current) return;

        const badSource = map.current.getSource("signals-bad") as
            | maplibregl.GeoJSONSource
            | undefined;
        const goodSource = map.current.getSource("signals-good") as
            | maplibregl.GeoJSONSource
            | undefined;

        if (badSource) badSource.setData(badGeojson);
        if (goodSource) goodSource.setData(goodGeojson);
    }, [badGeojson, goodGeojson]);

    // 🔹 Click-to-select (für /report/location) – zeigt nichts auf der Karte, ruft nur Callback
    useEffect(() => {
        if (!map.current || !onLocationSelect) return;

        const handleClick = (e: maplibregl.MapMouseEvent & maplibregl.EventData) => {
            if (!selectMode) return;
            onLocationSelect(e.lngLat.lat, e.lngLat.lng);
        };

        map.current.on("click", handleClick);
        return () => {
            map.current?.off("click", handleClick);
        };
    }, [selectMode, onLocationSelect]);

    return (
        <div className="relative w-full h-full">
            <div
                ref={mapContainer}
                className="absolute inset-0 rounded-lg shadow-lg"
            />
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
