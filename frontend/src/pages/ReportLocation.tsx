import { useState, useEffect, useCallback } from "react"; // Added useCallback
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { CityMap } from "@/components/CityMap";
import { Heart, MapPin, Navigation } from "lucide-react";
import { toast } from "sonner";
import { MUNICH_BOUNDS, MAP_DEFAULTS } from "@/config/map";

const ReportLocation = () => {
  const navigate = useNavigate();
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [selectedLocation, setSelectedLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [locationMethod, setLocationMethod] = useState<"auto" | "manual" | null>(null);

  useEffect(() => {
    // Auto-prompt for location only if no method has been chosen yet (initial load) or explicitly 'auto'
    if ("geolocation" in navigator && !userLocation && (locationMethod === null || locationMethod === "auto")) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const location = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          setUserLocation(location);
          // Always set selectedLocation if we successfully got userLocation and are in auto mode
          if (locationMethod === "auto" || locationMethod === null) { // <--- MODIFIED THIS CONDITION
             setSelectedLocation(location);
             setLocationMethod("auto"); // Explicitly set to auto if detected
          }
          toast.success("Location detected");
        },
        (error) => {
          console.error(error);
          // Don't show toast on error to avoid spamming if permission is just pending
          // If locationMethod is null and failed, set it to manual as a fallback
          if (locationMethod === null) {
            setLocationMethod("manual");
            toast.info("You can set a pin manually on the map");
          }
        }
      );
    }
  }, [userLocation, selectedLocation, locationMethod]); // Added locationMethod to dependencies

  const handleUseMyLocation = () => {
    // Force re-prompt/re-detection if user clicks 'Use My Location' again
    setUserLocation(null); 
    setSelectedLocation(null); // Clear previous selection
    setLocationMethod("auto");
    // The useEffect will handle the actual geolocation call
  };

  const handleSetPin = () => {
    setSelectedLocation(null); // Clear any auto-detected pin
    setLocationMethod("manual");
    toast.info("Click on the map to set your location");
  };

  // FIX 2: Memoize this function so the Map doesn't think it changed
  const handleMapClick = useCallback((lat: number, lng: number) => {
    if (locationMethod === "manual") {
      setSelectedLocation({ lat, lng });
      toast.success("Location set on map");
    }
  }, [locationMethod]);

  const handleNext = () => {
    if (!selectedLocation) {
      toast.error("Please select a location first");
      return;
    }
    sessionStorage.setItem("reportLocation", JSON.stringify(selectedLocation));
    navigate("/report/submit");
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-3">
            <Link to="/" className="flex items-center gap-3">
              <img src="/logo.svg" alt="MUCPulse Logo" className="h-10 w-auto" />
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                  MUCPulse
                </h1>
                <p className="text-xs text-muted-foreground">Report a Signal</p>
              </div>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 container mx-auto px-4 py-6 flex flex-col">
        <div className="mb-4">
          <h2 className="text-xl font-bold mb-2">Step 1: Select Location</h2>
          <p className="text-sm text-muted-foreground">
            Choose your location method below
          </p>
        </div>

        {/* Location Options */}
        <Card className="p-4 mb-4">
          <div className="grid grid-cols-2 gap-3">
            <Button
              onClick={handleUseMyLocation}
              variant={locationMethod === "auto" ? "default" : "outline"}
              className="h-auto py-4 flex-col gap-2"
            >
              <Navigation className="h-6 w-6" />
              <span className="text-sm">Use My Location</span>
            </Button>
            <Button
              onClick={handleSetPin}
              variant={locationMethod === "manual" ? "default" : "outline"}
              className="h-auto py-4 flex-col gap-2"
            >
              <MapPin className="h-6 w-6" />
              <span className="text-sm">Set a Pin</span>
            </Button>
          </div>
        </Card>

        {/* Map - FIX 3: Added h-[400px] instead of min-h to force explicit height */}
        <div className="w-full h-[400px] rounded-lg overflow-hidden border mb-4 relative bg-muted/20">
          <CityMap
            onLocationSelect={handleMapClick}
            selectMode={locationMethod === "manual"}
            maxBounds={MUNICH_BOUNDS} // Use MUNICH_BOUNDS from config
            minZoom={MAP_DEFAULTS.minZoom}
            center={selectedLocation ? [selectedLocation.lng, selectedLocation.lat] : undefined} // Center map on selected location
            signals={selectedLocation ? [{
              id: "user-location", 
              emotion: "safe", // Neutral emotion for user's own location
              location: selectedLocation,
              timestamp: new Date(),
              description: "Your location",
              timeOfDay: "all",
            }] : []}
          />
        </div>

        {/* Selected Location Info */}
        {selectedLocation && (
          <Card className="p-4 mb-4 bg-primary/5 animate-in fade-in slide-in-from-bottom-2">
            <div className="flex items-center gap-2 text-sm">
              <MapPin className="h-4 w-4 text-primary" />
              <span className="font-medium">Location Selected:</span>
              <span className="text-muted-foreground">
                {selectedLocation.lat.toFixed(4)}, {selectedLocation.lng.toFixed(4)}
              </span>
            </div>
          </Card>
        )}

        {/* Next Button */}
        <Button
          onClick={handleNext}
          size="lg"
          className="w-full"
          disabled={!selectedLocation}
        >
          Next
        </Button>
      </main>
    </div>
  );
};

export default ReportLocation;