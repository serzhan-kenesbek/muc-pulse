import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { EmotionSelector } from "./EmotionSelector";
import { EmotionType } from "@/types/emotion";
import { MapPin, Navigation } from "lucide-react";
import { toast } from "sonner";

interface SubmitSignalDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (emotion: EmotionType, description: string, lat: number, lng: number) => void;
}

export const SubmitSignalDialog = ({ open, onOpenChange, onSubmit }: SubmitSignalDialogProps) => {
  const [selectedEmotion, setSelectedEmotion] = useState<EmotionType | null>(null);
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);

  const handleGetLocation = () => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
          toast.success("Location captured!");
        },
        (error) => {
          toast.error("Could not get location. Please enable location services.");
          console.error(error);
        }
      );
    } else {
      toast.error("Geolocation not supported by your browser");
    }
  };

  const handleSubmit = () => {
    if (!selectedEmotion) {
      toast.error("Please select an emotion");
      return;
    }
    if (!location) {
      toast.error("Please set your location");
      return;
    }

    onSubmit(selectedEmotion, description, location.lat, location.lng);
    
    // Reset form
    setSelectedEmotion(null);
    setDescription("");
    setLocation(null);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Share Your Emotion</DialogTitle>
          <DialogDescription>
            How are you feeling right now in Munich?
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium mb-2 block">Select Emotion</label>
            <EmotionSelector 
              selectedEmotion={selectedEmotion} 
              onSelectEmotion={setSelectedEmotion} 
            />
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">
              Description (optional)
            </label>
            <Textarea
              placeholder="What's making you feel this way?"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
            />
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">Location</label>
            <Button
              variant="outline"
              className="w-full"
              onClick={handleGetLocation}
            >
              {location ? (
                <>
                  <MapPin className="h-4 w-4 mr-2" />
                  Location Set ({location.lat.toFixed(4)}, {location.lng.toFixed(4)})
                </>
              ) : (
                <>
                  <Navigation className="h-4 w-4 mr-2" />
                  Use My Location
                </>
              )}
            </Button>
          </div>

          <Button 
            className="w-full" 
            onClick={handleSubmit}
            disabled={!selectedEmotion || !location}
          >
            Submit Signal
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
