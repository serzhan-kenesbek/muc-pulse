import { TimeOfDay } from "@/types/emotion";

// 1. DEFINITIONS: This controls the text and logic for your UI filters
export const TIME_RANGES: Record<TimeOfDay, { label: string; hours: string; min: number; max: number }> = {
  morning: { 
    label: "Morning", 
    hours: "06:00 - 12:00", 
    min: 6, 
    max: 12 
  },
  afternoon: { 
    label: "Afternoon", 
    hours: "12:00 - 18:00", 
    min: 12, 
    max: 18 
  },
  night: { 
    label: "Night", 
    hours: "18:00 - 06:00", 
    min: 18, 
    max: 6 
  },
  all: {
    label: "All Day",
    hours: "24h",
    min: 0,
    max: 24
  }
};

// 2. LOGIC: This function takes a raw Date object and returns the category string
export const getTimeOfDay = (date: Date): TimeOfDay => {
  const hour = date.getHours();
  
  // Morning: 6 AM to 11:59 AM
  if (hour >= 6 && hour < 12) return "morning";
  
  // Afternoon: 12 PM to 5:59 PM
  if (hour >= 12 && hour < 18) return "afternoon";
  
  // Night: Everything else (6 PM to 5:59 AM)
  return "night";
};