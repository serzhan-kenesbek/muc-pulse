import { useState, useMemo, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { CityMap } from "@/components/CityMap";
import { TimeFilter } from "@/components/TimeFilter";
import { SubmitSignalDialog } from "@/components/SubmitSignalDialog";
import { EmotionSignal, EmotionType, TimeOfDay } from "@/types/emotion";
import { Plus, Heart, MapPin } from "lucide-react";
import { toast } from "sonner";

const Index = () => {
  const [signals, setSignals] = useState<EmotionSignal[]>([]);
  const [selectedTime, setSelectedTime] = useState<TimeOfDay>("all");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [hasSubmitted, setHasSubmitted] = useState(false);

  // Request location on mount
  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
          toast.success("Location access granted");
        },
        (error) => {
          toast.error("Location access denied. Please enable location to use this app.");
          console.error(error);
        }
      );
    } else {
      toast.error("Geolocation not supported by your browser");
    }
  }, []);

  const filteredSignals = useMemo(() => {
    if (selectedTime === "all") return signals;
    return signals.filter((signal) => signal.timeOfDay === selectedTime);
  }, [signals, selectedTime]);

  const handleSubmitSignal = (
    emotion: EmotionType,
    description: string,
    lat: number,
    lng: number
  ) => {
    const now = new Date();
    const timeOfDay: TimeOfDay = 
      now.getHours() >= 6 && now.getHours() < 12 
        ? "morning" 
        : now.getHours() >= 12 && now.getHours() < 18 
        ? "afternoon" 
        : "night";

    const newSignal: EmotionSignal = {
      id: `signal-${Date.now()}`,
      emotion,
      description,
      location: { lat, lng },
      timestamp: now,
      timeOfDay,
    };

    setSignals((prev) => [newSignal, ...prev]);
    setHasSubmitted(true);
    toast.success("Your emotion has been shared!");
  };

  const handleShareEmotion = () => {
    if (!userLocation) {
      toast.error("Please enable location access first");
      return;
    }
    setDialogOpen(true);
  };

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-3">
            <Heart className="h-8 w-8 text-primary" />
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                MUCPulse
              </h1>
              <p className="text-xs text-muted-foreground">City Emotion Heatmap</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6 space-y-6">
        {!hasSubmitted ? (
          <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-6 text-center">
            <MapPin className="h-16 w-16 text-primary" />
            <div>
              <h2 className="text-2xl font-bold mb-2">Welcome to MUCPulse</h2>
              <p className="text-muted-foreground">
                Share your emotion to see the city's mood heatmap
              </p>
            </div>
          </div>
        ) : (
          <>
            {/* Stats Card */}
            <Card className="p-6">
              <h3 className="font-semibold mb-4">Emotion Analytics</h3>
              <div className="grid grid-cols-2 gap-4 text-center">
                <div>
                  <p className="text-3xl font-bold text-primary">{signals.length}</p>
                  <p className="text-sm text-muted-foreground">Total Signals</p>
                </div>
                <div>
                  <p className="text-3xl font-bold text-emotion-happy">
                    {signals.filter((s) => s.emotion === "happy").length}
                  </p>
                  <p className="text-sm text-muted-foreground">Happy</p>
                </div>
                <div>
                  <p className="text-3xl font-bold text-emotion-calm">
                    {signals.filter((s) => s.emotion === "calm").length}
                  </p>
                  <p className="text-sm text-muted-foreground">Calm</p>
                </div>
                <div>
                  <p className="text-3xl font-bold text-emotion-stressed">
                    {signals.filter((s) => s.emotion === "stressed").length}
                  </p>
                  <p className="text-sm text-muted-foreground">Stressed</p>
                </div>
              </div>
            </Card>

            {/* Time Filter */}
            <div>
              <h2 className="text-lg font-semibold mb-3">Filter by Time</h2>
              <TimeFilter selectedTime={selectedTime} onSelectTime={setSelectedTime} />
            </div>

            {/* Map */}
            <div>
              <h2 className="text-lg font-semibold mb-3">
                Emotion Heatmap
                <span className="text-sm text-muted-foreground ml-2">
                  ({filteredSignals.length} signals)
                </span>
              </h2>
              <div className="h-[400px] md:h-[600px] rounded-lg overflow-hidden border">
                <CityMap signals={filteredSignals} />
              </div>
            </div>
          </>
        )}
      </main>

      {/* Fixed Bottom Button */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-background border-t">
        <Button 
          onClick={handleShareEmotion} 
          size="lg" 
          className="w-full gap-2"
          disabled={!userLocation}
        >
          <Plus className="h-5 w-5" />
          Share Emotion
        </Button>
      </div>

      {/* Submit Dialog */}
      <SubmitSignalDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onSubmit={handleSubmitSignal}
        userLocation={userLocation}
      />
    </div>
  );
};

export default Index;
