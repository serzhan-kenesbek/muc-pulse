import { EmotionSignal, TimeOfDay } from "@/types/emotion";

// Munich coordinates: 48.1351, 11.5820
const MUNICH_CENTER = { lat: 48.1351, lng: 11.5820 };

function randomOffset(base: number, range: number): number {
  return base + (Math.random() - 0.5) * range;
}

function getTimeOfDay(hour: number): TimeOfDay {
  if (hour >= 6 && hour < 12) return "morning";
  if (hour >= 12 && hour < 18) return "afternoon";
  return "night";
}

export const generateMockSignals = (count: number = 1000): EmotionSignal[] => {
  const emotions = ["unsafe", "safe", "dirty", "clean", "calm", "quiet", "noisy"] as const;
  const signals: EmotionSignal[] = [];

  for (let i = 0; i < count; i++) {
    const now = new Date();
    const randomHoursAgo = Math.floor(Math.random() * 12);
    const timestamp = new Date(now.getTime() - randomHoursAgo * 60 * 60 * 1000);
    
    signals.push({
      id: `signal-${i}`,
      emotion: emotions[Math.floor(Math.random() * emotions.length)],
      location: {
        lat: randomOffset(MUNICH_CENTER.lat, 0.05),
        lng: randomOffset(MUNICH_CENTER.lng, 0.08),
      },
      timestamp,
      timeOfDay: getTimeOfDay(timestamp.getHours()),
    });
  }

  return signals;
};
