import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Heart } from "lucide-react";
import * as Icons from "lucide-react";
import { toast } from "sonner";

// Signal types based on wireframe
const SIGNAL_OPTIONS = [
  [
    { id: "safe", label: "Safe", icon: "ShieldCheck", color: "text-green-500" },
    { id: "unsafe", label: "Unsafe", icon: "AlertTriangle", color: "text-red-500" },
  ],
  [
    { id: "clean", label: "Clean", icon: "Sparkles", color: "text-teal-500" },
    { id: "dirty", label: "Dirty", icon: "Trash2", color: "text-orange-500" },
  ],
  [
    { id: "accessible", label: "Accessible", icon: "Accessibility", color: "text-blue-500" },
    { id: "inaccessible", label: "Inaccessible", icon: "Ban", color: "text-gray-500" },
  ],
  [
    { id: "quiet", label: "Quiet", icon: "VolumeX", color: "text-blue-400" },
    { id: "noisy", label: "Too Noisy", icon: "Volume2", color: "text-purple-500" },
  ],
  [
    { id: "uncrowded", label: "Uncrowded", icon: "PersonStanding", color: "text-cyan-500" },
    { id: "crowded", label: "Crowded", icon: "Users", color: "text-pink-500" },
  ],
  [
    { id: "lively", label: "Fun / Lively", icon: "PartyPopper", color: "text-yellow-500" },
    { id: "boring", label: "Boring", icon: "Hourglass", color: "text-rose-500" },
  ],
];

const ReportSubmit = () => {
  const navigate = useNavigate();
  const [selectedSignal, setSelectedSignal] = useState<string | null>(null);

  const handleSubmit = () => {
    if (!selectedSignal) {
      toast.error("Please select a signal type");
      return;
    }

    const locationStr = sessionStorage.getItem("reportLocation");
    if (!locationStr) {
      toast.error("Location data missing. Please start over.");
      navigate("/report/location");
      return;
    }

    // Store selection for success page
    sessionStorage.setItem("reportSignal", selectedSignal);
    
    // In a real app, this would submit to backend
    toast.success("Signal submitted successfully!");
    navigate("/report/success");
  };

  const renderIcon = (iconName: string) => {
    const IconComponent = Icons[iconName as keyof typeof Icons] as any;
    return IconComponent ? <IconComponent className="h-8 w-8" /> : null;
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
        <div className="mb-6">
          <h2 className="text-xl font-bold mb-2">Step 2: Select Signal Type</h2>
          <p className="text-sm text-muted-foreground">
            What would you like to report about this location?
          </p>
        </div>

        {/* Signal Options Grid - 2 columns */}
        <div className="grid grid-cols-1 gap-3 mb-6">
          {SIGNAL_OPTIONS.map((pair, index) => (
            <Card key={index} className="p-2 border-2 border-dashed border-muted-foreground/20 bg-accent/10">
              <div className="flex flex-row gap-2">
                {pair.map((option) => (
                  <Card
                    key={option.id}
                    className={`flex-1 p-4 cursor-pointer transition-all hover:scale-105 ${
                      selectedSignal === option.id
                        ? "ring-2 ring-primary bg-primary/20"
                        : "hover:border-primary/50"
                    }`}
                    onClick={() => setSelectedSignal(option.id)}
                  >
                    <div className="flex flex-col items-center gap-2 text-center">
                      <div className={option.color}>
                        {renderIcon(option.icon)}
                      </div>
                      <span className="text-sm font-medium">{option.label}</span>
                    </div>
                  </Card>
                ))}
              </div>
            </Card>
          ))}
        </div>

        {/* Submit Button */}
        <Button
          onClick={handleSubmit}
          size="lg"
          className="w-full mt-auto"
          disabled={!selectedSignal}
        >
          Submit
        </Button>
      </main>
    </div>
  );
};

export default ReportSubmit;
