import { TimeOfDay } from "@/types/emotion";
import { Button } from "@/components/ui/button";
import { Clock, Sun, Sunset, Moon } from "lucide-react";
import { cn } from "@/lib/utils";

interface TimeFilterProps {
  selectedTime: TimeOfDay;
  onSelectTime: (time: TimeOfDay) => void;
}

const TIME_OPTIONS: { value: TimeOfDay; label: string; icon: React.ReactNode }[] = [
  { value: "all", label: "All Day", icon: <Clock className="h-4 w-4" /> },
  { value: "morning", label: "Morning", icon: <Sun className="h-4 w-4" /> },
  { value: "afternoon", label: "Afternoon", icon: <Sunset className="h-4 w-4" /> },
  { value: "night", label: "Night", icon: <Moon className="h-4 w-4" /> },
];

export const TimeFilter = ({ selectedTime, onSelectTime }: TimeFilterProps) => {
  return (
    <div className="flex gap-2 overflow-x-auto pb-2">
      {TIME_OPTIONS.map((option) => (
        <Button
          key={option.value}
          variant={selectedTime === option.value ? "default" : "outline"}
          size="sm"
          onClick={() => onSelectTime(option.value)}
          className={cn("flex items-center gap-2 whitespace-nowrap")}
        >
          {option.icon}
          {option.label}
        </Button>
      ))}
    </div>
  );
};
