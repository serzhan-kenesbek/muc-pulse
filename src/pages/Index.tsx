import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { CityMap } from "@/components/CityMap";
import { TimeFilter } from "@/components/TimeFilter";
import { SubmitSignalDialog } from "@/components/SubmitSignalDialog";
import { generateMockSignals } from "@/data/mockSignals";
import { EmotionSignal, EmotionType, TimeOfDay } from "@/types/emotion";
import { Plus, Heart } from "lucide-react";
import { toast } from "sonner";

const Index = () => {
  const [signals, setSignals] = useState<EmotionSignal[]>(() => generateMockSignals(50));
  const [selectedTime, setSelectedTime] = useState<TimeOfDay>("all");
  const [dialogOpen, setDialogOpen] = useState(false);

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
    toast.success("Your emotion has been shared!");
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Heart className="h-8 w-8 text-primary" />
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                  MUCForge
                </h1>
                <p className="text-xs text-muted-foreground">City Signals</p>
              </div>
            </div>
            <Button onClick={() => setDialogOpen(true)} size="lg" className="gap-2">
              <Plus className="h-5 w-5" />
              Share Emotion
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6 space-y-6">
        {/* Stats Card */}
        <Card className="p-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
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
            Emotion Map 
            <span className="text-sm text-muted-foreground ml-2">
              ({filteredSignals.length} signals)
            </span>
          </h2>
          <div className="h-[600px] rounded-lg overflow-hidden border">
            <CityMap signals={filteredSignals} />
          </div>
        </div>

        {/* Info */}
        <Card className="p-6 bg-gradient-to-br from-primary/5 to-accent/5 border-primary/20">
          <h3 className="font-semibold mb-2">How it works</h3>
          <ul className="text-sm text-muted-foreground space-y-1">
            <li>• Share your current emotion with the Munich community</li>
            <li>• See real-time emotional patterns across the city</li>
            <li>• Filter by time of day to understand mood changes</li>
            <li>• Click markers to see individual stories</li>
          </ul>
        </Card>
      </main>

      {/* Submit Dialog */}
      <SubmitSignalDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onSubmit={handleSubmitSignal}
      />
    </div>
  );
};

export default Index;
