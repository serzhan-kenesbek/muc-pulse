import { EMOTION_CONFIG, EmotionType } from "@/types/emotion";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import * as Icons from "lucide-react";

interface EmotionSelectorProps {
  selectedEmotion: EmotionType | null;
  onSelectEmotion: (emotion: EmotionType) => void;
}

export const EmotionSelector = ({ selectedEmotion, onSelectEmotion }: EmotionSelectorProps) => {
  return (
    <div className="grid grid-cols-2 gap-4">
      {(Object.keys(EMOTION_CONFIG) as EmotionType[]).map((emotion) => {
        const config = EMOTION_CONFIG[emotion];
        const isSelected = selectedEmotion === emotion;
        const IconComponent = Icons[config.icon as keyof typeof Icons] as React.ComponentType<{ className?: string }>;
        
        return (
          <Button
            key={emotion}
            variant="outline"
            onClick={() => onSelectEmotion(emotion)}
            className={cn(
              "h-24 flex flex-col gap-2 transition-all border-2",
              isSelected ? "border-primary bg-primary/10 scale-105" : "border-border"
            )}
          >
            <IconComponent className="h-8 w-8" />
            <span className="text-sm font-medium">{config.label}</span>
          </Button>
        );
      })}
    </div>
  );
};
