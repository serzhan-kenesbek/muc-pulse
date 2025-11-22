import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { CityMap } from "@/components/CityMap";
import { TimeFilter } from "@/components/TimeFilter";
import { EmotionSignal, TimeOfDay } from "@/types/emotion";
import { Heart, ChevronDown, ChevronUp, BarChart3 } from "lucide-react";
import { generateMockSignals } from "@/data/mockSignals";

const Analytics = () => {
  const [signals] = useState<EmotionSignal[]>(() => generateMockSignals(50));
  const [selectedTime, setSelectedTime] = useState<TimeOfDay>("all");
  const [showStats, setShowStats] = useState(false);

  const filteredSignals = useMemo(() => {
    if (selectedTime === "all") return signals;
    return signals.filter((signal) => signal.timeOfDay === selectedTime);
  }, [signals, selectedTime]);

  return (
    <div className="min-h-screen bg-background pb-6">
      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center gap-3">
              <Heart className="h-8 w-8 text-primary" />
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
        <Card className="p-4">
          <h2 className="text-lg font-semibold mb-3">Filter by Time</h2>
          <TimeFilter selectedTime={selectedTime} onSelectTime={setSelectedTime} />
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
            <CityMap signals={filteredSignals} />
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
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
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
                <div>
                  <p className="text-3xl font-bold text-emotion-sad">
                    {signals.filter((s) => s.emotion === "sad").length}
                  </p>
                  <p className="text-sm text-muted-foreground">Sad</p>
                </div>
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
