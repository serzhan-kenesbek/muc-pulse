// Coordinates for Munich City Center (Marienplatz)
export const MUNICH_CENTER: [number, number] = [11.6250, 48.200];

// Bounding Box: [Southwest Lng, Lat], [Northeast Lng, Lat]
// Expanded North (2nd Lat) to 48.3000 to include Garching Forschungszentrum
export const MUNICH_BOUNDS: [[number, number], [number, number]] = [
  [11.3600, 48.0616], // Southwest (South of city)
  [11.9000, 48.4000]  // Northeast (North of Garching)
];

// Shared defaults for zoom
export const MAP_DEFAULTS = {
  minZoom: 9,
  initialZoom: 10 // Slightly zoomed out to see both Garching and City
};