export type EmotionType = 
  | "happy" 
  | "neutral" 
  | "sad" 
  | "stressed" 
  | "calm" 
  | "energetic" 
  | "tired";

export type TimeOfDay = "morning" | "afternoon" | "night" | "all";

export interface EmotionSignal {
  id: string;
  emotion: EmotionType;
  description?: string;
  location: {
    lat: number;
    lng: number;
  };
  timestamp: Date;
  timeOfDay: TimeOfDay;
}

export const EMOTION_CONFIG: Record<EmotionType, { emoji: string; color: string; label: string }> = {
  happy: { emoji: "😊", color: "emotion-happy", label: "Happy" },
  neutral: { emoji: "😐", color: "emotion-neutral", label: "Neutral" },
  sad: { emoji: "😢", color: "emotion-sad", label: "Sad" },
  stressed: { emoji: "😰", color: "emotion-stressed", label: "Stressed" },
  calm: { emoji: "😌", color: "emotion-calm", label: "Calm" },
  energetic: { emoji: "⚡", color: "emotion-energetic", label: "Energetic" },
  tired: { emoji: "😴", color: "emotion-tired", label: "Tired" },
};
