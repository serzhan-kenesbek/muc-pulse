export type EmotionType = 
  | "unsafe" 
  | "dirty" 
  | "inaccessible" 
  | "noisy" 
  | "crowded" 
  | "boring" 
  | "safe" 
  | "clean" 
  | "accessible" 
  | "quiet" 
  | "uncrowded" 
  | "lively";

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
  // Negative (problem signals)
  unsafe: { icon: "AlertTriangle", color: "text-red-500", label: "Unsafe" },
  dirty: { icon: "Trash2", color: "text-orange-500", label: "Dirty" },
  inaccessible: { icon: "Ban", color: "text-gray-500", label: "Inaccessible" },
  noisy: { icon: "Volume2", color: "text-purple-500", label: "Too Noisy" },
  crowded: { icon: "Users", color: "text-pink-500", label: "Crowded" },
  boring: { icon: "Hourglass", color: "text-rose-500", label: "Boring" },
  // Positive (success signals)
  safe: { icon: "ShieldCheck", color: "text-green-500", label: "Safe" },
  clean: { icon: "Sparkles", color: "text-teal-500", label: "Clean" },
  accessible: { icon: "Accessibility", color: "text-blue-500", label: "Accessible" },
  quiet: { icon: "VolumeX", color: "text-blue-400", label: "Quiet" },
  uncrowded: { icon: "PersonStanding", color: "text-cyan-500", label: "Uncrowded" },
  lively: { icon: "PartyPopper", color: "text-yellow-500", label: "Fun / Lively" },
};
