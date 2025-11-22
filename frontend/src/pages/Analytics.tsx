import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { CityMap } from "@/components/CityMap";
import { TimeFilter } from "@/components/TimeFilter";
import { EMOTION_CONFIG, EmotionSignal, EmotionType, TimeOfDay } from "@/types/emotion";
import { Heart, ChevronDown, ChevronUp, BarChart3 } from "lucide-react";
import { generateMockSignals } from "@/data/mockSignals";
import { MUNICH_BOUNDS, MAP_DEFAULTS } from "@/config/map";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"; // Import ToggleGroup components

const EMOTION_CATEGORIES = [
  { label: "Safety", value: "safe-unsafe", emotions: ["safe", "unsafe"] as EmotionType[] },
  { label: "Cleanliness", value: "clean-dirty", emotions: ["clean", "dirty"] as EmotionType[] },
  { label: "Accessibility", value: "accessible-inaccessible", emotions: ["accessible", "inaccessible"] as EmotionType[] },
  { label: "Sound", value: "quiet-noisy", emotions: ["quiet", "noisy"] as EmotionType[] },
  { label: "Crowd", value: "uncrowded-crowded", emotions: ["uncrowded", "crowded"] as EmotionType[] },
  { label: "Vibrancy", value: "lively-boring", emotions: ["lively", "boring"] as EmotionType[] },
];

const Analytics = () => {
  const [signals] = useState<EmotionSignal[]>(() => generateMockSignals(50));
  const [selectedTime, setSelectedTime] = useState<TimeOfDay>("all");
  const [showStats, setShowStats] = useState(false);
  const [activeEmotionCategories, setActiveEmotionCategories] = useState<string | undefined>("safe-unsafe"); // Set default to 'safe-unsafe'

  const filteredSignals = useMemo(() => {
    let currentSignals = signals;

    if (selectedTime !== "all") {
      currentSignals = currentSignals.filter((signal) => signal.timeOfDay === selectedTime);
    }

    if (activeEmotionCategories) { // Check if a category is active
      const category = EMOTION_CATEGORIES.find(cat => cat.value === activeEmotionCategories); // Find the single active category
      if (category) {
        currentSignals = currentSignals.filter((signal) => category.emotions.includes(signal.emotion));
      }
    }

    return currentSignals;
  }, [signals, selectedTime, activeEmotionCategories]);

  return (
    <div className="min-h-screen bg-background pb-6">
      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center gap-3">
              <img src="/logo.svg" alt="MUCPulse Logo" className="h-10 w-auto" />
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                  MUCPulse
                </h1>
                <p className="text-xs text-muted-foreground">Heatmap & Analytics</p>
              </div>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6 space-y-6">
        {/* Filters/Toggles */}
        <Card className="p-4 mb-6">
          <h2 className="text-lg font-semibold mb-3">Filter by Time</h2>
          <TimeFilter selectedTime={selectedTime} onSelectTime={setSelectedTime} />
        </Card>

        <Card className="p-4">
          <h2 className="text-lg font-semibold mb-3">Filter by Emotion Category</h2>
          <ToggleGroup 
            type="single" 
            value={activeEmotionCategories} 
            onValueChange={(value) => setActiveEmotionCategories(value || undefined)} 
            className="flex flex-nowrap overflow-x-auto pb-2 gap-2 justify-start" // Added justify-start
          >
            {EMOTION_CATEGORIES.map(category => (
              <ToggleGroupItem 
                key={category.value} 
                value={category.value} 
                aria-label={category.label}
                className="flex items-center gap-2 whitespace-nowrap px-3 py-2 text-sm font-medium transition-colors hover:bg-muted hover:text-muted-foreground data-[state=on]:bg-primary data-[state=on]:text-primary-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 h-9 rounded-md flex-shrink-0"
              >
                {category.label}
              </ToggleGroupItem>
            ))}
          </ToggleGroup>
        </Card>

        {/* Heatmap */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-semibold">
              City Signals Heatmap
              <span className="text-sm text-muted-foreground ml-2">
                ({filteredSignals.length} signals)
              </span>
            </h2>
          </div>
          <div className="h-[400px] md:h-[600px] rounded-lg overflow-hidden border">
            {/* 2. Pass the bounds here to lock it to Munich */}
            <CityMap 
              signals={filteredSignals} 
              maxBounds={MUNICH_BOUNDS} 
              minZoom={MAP_DEFAULTS.minZoom}
            />
          </div>
        </div>

        {/* Toggle Statistics Button */}
        <div className="flex justify-center">
          <Button
            onClick={() => setShowStats(!showStats)}
            variant="outline"
            size="lg"
            className="gap-2"
          >
            <BarChart3 className="h-5 w-5" />
            {showStats ? "Hide" : "Show"} Statistics / Analytics
            {showStats ? (
              <ChevronUp className="h-4 w-4" />
            ) : (
              <ChevronDown className="h-4 w-4" />
            )}
          </Button>
        </div>

        {/* Statistics Section - Collapsible */}
        {showStats && (
          <div className="space-y-6 animate-in slide-in-from-top-4 duration-300">
            {/* Emotion Stats Grid */}
            <Card className="p-6">
              <h3 className="font-semibold mb-4 text-lg">Signal Distribution</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {EMOTION_CATEGORIES.map((category) => (
                  <Card key={category.value} className="p-4 border-2 border-dashed border-muted-foreground/20 bg-accent/10">
                    <h4 className="font-semibold text-md mb-3 text-center">{category.label}</h4>
                    <div className="flex justify-around items-center gap-4">
                      {category.emotions.map((emotion) => {
                        const config = EMOTION_CONFIG[emotion];
                        const count = signals.filter((s) => s.emotion === emotion).length;
                        return (
                          <div key={emotion} className="flex flex-col items-center">
                            <p className={`text-3xl font-bold ${config.color}`}>{count}</p>
                            <p className="text-sm text-muted-foreground">{config.label}</p>
                          </div>
                        );
                      })}
                    </div>
                  </Card>
                ))}
              </div>
            </Card>

            {/* Time-based Analytics */}
            <Card className="p-6">
              <h3 className="font-semibold mb-4 text-lg">Time Distribution</h3>
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <p className="text-3xl font-bold text-primary">
                    {signals.filter((s) => s.timeOfDay === "morning").length}
                  </p>
                  <p className="text-sm text-muted-foreground">Morning</p>
                </div>
                <div>
                  <p className="text-3xl font-bold text-primary">
                    {signals.filter((s) => s.timeOfDay === "afternoon").length}
                  </p>
                  <p className="text-sm text-muted-foreground">Afternoon</p>
                </div>
                <div>
                  <p className="text-3xl font-bold text-primary">
                    {signals.filter((s) => s.timeOfDay === "night").length}
                  </p>
                  <p className="text-sm text-muted-foreground">Night</p>
                </div>
              </div>
            </Card>

            {/* Overall Stats */}
            <Card className="p-6">
              <h3 className="font-semibold mb-4 text-lg">Overall Statistics</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div className="text-center p-4 bg-muted/50 rounded-lg">
                  <p className="text-2xl font-bold text-primary">{signals.length}</p>
                  <p className="text-sm text-muted-foreground">Total Signals</p>
                </div>
                <div className="text-center p-4 bg-muted/50 rounded-lg">
                  <p className="text-2xl font-bold text-primary">
                    {new Set(signals.map((s) => `${s.location.lat},${s.location.lng}`)).size}
                  </p>
                  <p className="text-sm text-muted-foreground">Unique Locations</p>
                </div>
                <div className="text-center p-4 bg-muted/50 rounded-lg col-span-2 md:col-span-1">
                  <p className="text-2xl font-bold text-primary">Live</p>
                  <p className="text-sm text-muted-foreground">Real-Time Data</p>
                </div>
              </div>
            </Card>
          </div>
        )}
      </main>
    </div>
  );
};

export default Analytics;