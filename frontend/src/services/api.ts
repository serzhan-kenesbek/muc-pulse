import { EmotionSignal } from "@/types/emotion";
import { getTimeOfDay } from "@/config/time";

const API_BASE_URL = "http://localhost:8000";

// Helper to find which emotion is "true" in the object
const getEmotionFromRow = (item: any): string => {
  if (item.is_safe === true) return "safe";
  if (item.is_safe === false) return "unsafe";
  
  if (item.is_clean === true) return "clean";
  if (item.is_clean === false) return "dirty";
  
  if (item.is_accessible === true) return "accessible";
  if (item.is_accessible === false) return "inaccessible";
  
  if (item.is_quiet === true) return "quiet";
  if (item.is_quiet === false) return "noisy";
  
  if (item.is_uncrowded === true) return "uncrowded";
  if (item.is_uncrowded === false) return "crowded";
  
  if (item.is_lively === true) return "lively";
  if (item.is_lively === false) return "boring";

  return "neutral"; // Fallback
};

export const fetchSignals = async (): Promise<EmotionSignal[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/fetch-reports`);
    
    if (!response.ok) {
      throw new Error("Failed to fetch signals");
    }

    const data = await response.json();

    return data.map((item: any) => {
      const date = new Date(item.time || new Date());
      
      return {
        id: item.id?.toString() || Math.random().toString(),
        // Use helper to convert boolean flags -> string
        emotion: getEmotionFromRow(item), 
        location: {
          lat: item.latitude,
          lng: item.longitude
        },
        timestamp: date,
        description: "", 
        timeOfDay: getTimeOfDay(date),
      };
    });
  } catch (error) {
    console.error("API Error:", error);
    return [];
  }
};