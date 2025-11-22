import { EMOTION_CONFIG, EmotionType } from "@/types/emotion";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface EmotionSelectorProps {
  selectedEmotion: EmotionType | null;
  onSelectEmotion: (emotion: EmotionType) => void;
}

export const EmotionSelector = ({ selectedEmotion, onSelectEmotion }: EmotionSelectorProps) => {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
      {(Object.keys(EMOTION_CONFIG) as EmotionType[]).map((emotion) => {
        const config = EMOTION_CONFIG[emotion];
        const isSelected = selectedEmotion === emotion;
        
        return (
          <Button
            key={emotion}
            variant="outline"
            onClick={() => onSelectEmotion(emotion)}
            className={cn(
              "h-20 flex flex-col gap-1 transition-all border-2",
              isSelected && `border-${config.color} bg-${config.color}/10 scale-105`
            )}
          >
            <span className="text-3xl">{config.emoji}</span>
            <span className="text-xs font-medium">{config.label}</span>
          </Button>
        );
      })}
    </div>
  );
};
