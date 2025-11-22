import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { EmotionSelector } from "./EmotionSelector";
import { EmotionType } from "@/types/emotion";
import { MapPin, Navigation, Loader2 } from "lucide-react";
import { toast } from "sonner";

interface SubmitSignalDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (emotion: EmotionType, description: string, lat: number, lng: number) => void;
  userLocation: { lat: number; lng: number } | null;
}

export const SubmitSignalDialog = ({ open, onOpenChange, onSubmit, userLocation }: SubmitSignalDialogProps) => {
  const [selectedEmotion, setSelectedEmotion] = useState<EmotionType | null>(null);
  const [description, setDescription] = useState("");

  const handleSubmit = () => {
    if (!selectedEmotion) {
      toast.error("Please select an emotion");
      return;
    }
    if (!userLocation) {
      toast.error("Please share your location first");
      return;
    }

    onSubmit(selectedEmotion, description, userLocation.lat, userLocation.lng);
    
    // Reset form
    setSelectedEmotion(null);
    setDescription("");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Share Your Emotion</DialogTitle>
          <DialogDescription>
            {userLocation 
              ? "How are you feeling right now?" 
              : "Please enable location access to continue"}
          </DialogDescription>
        </DialogHeader>
        
        {!userLocation ? (
          <div className="py-8 text-center space-y-4">
            <Loader2 className="h-12 w-12 mx-auto animate-spin text-primary" />
            <p className="text-sm text-muted-foreground">Waiting for location access...</p>
          </div>
        ) : (
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-3 block">Select Emotion</label>
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

            <Button 
              className="w-full" 
              onClick={handleSubmit}
              disabled={!selectedEmotion}
            >
              Submit Signal
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};
