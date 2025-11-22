import { useState, useEffect, useCallback } from "react"; // Added useCallback
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { CityMap } from "@/components/CityMap";
import { Heart, MapPin, Navigation } from "lucide-react";
import { toast } from "sonner";

// FIX 1: Move constants OUTSIDE the component so they don't recreate on every render
const MUNICH_BOUNDS: [[number, number], [number, number]] = [
  [11.3600, 48.0616], 
  [11.7229, 48.2480]
];

const ReportLocation = () => {
  const navigate = useNavigate();
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [selectedLocation, setSelectedLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [locationMethod, setLocationMethod] = useState<"auto" | "manual" | null>(null);

  useEffect(() => {
    // Auto-prompt for location
    if ("geolocation" in navigator && !userLocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const location = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          setUserLocation(location);
          // Only auto-select if user hasn't manually picked something yet
          if (!selectedLocation) {
             setSelectedLocation(location);
          }
          toast.success("Location detected");
        },
        (error) => {
          console.error(error);
          // Don't show toast on error to avoid spamming if permission is just pending
        }
      );
    }
  }, [userLocation, selectedLocation]);

  const handleUseMyLocation = () => {
    if (userLocation) {
      setSelectedLocation(userLocation);
      setLocationMethod("auto");
      toast.success("Using your current location");
    } else {
      // Retry getting location if it failed initially
      navigator.geolocation.getCurrentPosition(
        (position) => {
           const loc = { lat: position.coords.latitude, lng: position.coords.longitude };
           setUserLocation(loc);
           setSelectedLocation(loc);
           setLocationMethod("auto");
        }, 
        () => toast.error("Please enable location access")
      );
    }
  };

  const handleSetPin = () => {
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
            <Heart className="h-8 w-8 text-primary" />
            <div>
              <Link to="/">
                <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                  MUCPulse
                </h1>
              </Link>
              <p className="text-xs text-muted-foreground">Report a Signal</p>
            </div>
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
            signals={[]}
            onLocationSelect={handleMapClick}
            selectMode={locationMethod === "manual"}
            maxBounds={MUNICH_BOUNDS} // Passing the constant, not a new array
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