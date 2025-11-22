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

export const EMOTION_CONFIG: Record<EmotionType, { icon: string; color: string; label: string }> = {
  happy: { icon: "Smile", color: "emotion-happy", label: "Happy" },
  neutral: { icon: "Minus", color: "emotion-neutral", label: "Neutral" },
  sad: { icon: "Frown", color: "emotion-sad", label: "Sad" },
  stressed: { icon: "Zap", color: "emotion-stressed", label: "Stressed" },
  calm: { icon: "Heart", color: "emotion-calm", label: "Calm" },
  energetic: { icon: "Flame", color: "emotion-energetic", label: "Energetic" },
  tired: { icon: "Moon", color: "emotion-tired", label: "Tired" },
};
