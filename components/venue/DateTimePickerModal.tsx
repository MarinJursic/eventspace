// src/components/venue/DateTimePickerModal.tsx

import React, { useState, useEffect } from "react";
import { Calendar } from "@/components/ui/calendar";
import { SelectMultipleEventHandler, DayModifiers } from "react-day-picker";
import { X, Check, CalendarDays } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
// Removed Venue import

// --- Specific Prop Types ---
interface BookedDate {
  date: string | Date;
  bookingRef?: string;
}
interface BlockedWeekday {
    weekday: string;
    recurrenceRule: 'weekly' | 'biweekly' | 'monthly';
}
interface AvailabilityRules {
     blockedWeekdays?: BlockedWeekday[];
}

// --- Moved Helper Function Outside ---
const isSameDay = (date1: Date | null | undefined, date2: Date | null | undefined): boolean => {
    if (!date1 || !date2) return false;
    return (
      date1.getFullYear() === date2.getFullYear() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getDate() === date2.getDate()
    );
};
// ------------------------------------

type DatePickerProps = {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (selectedDates: string[], selectedTimeSlot: string) => void;
  bookedDates: BookedDate[];
  availabilityRules?: AvailabilityRules;
  initialSelectedDates?: string[];
  className?: string;
};

const DatePicker: React.FC<DatePickerProps> = ({
  isOpen,
  onClose,
  onSelect,
  bookedDates = [],
  availabilityRules,
  initialSelectedDates = [],
  className,
}) => {
  // --- State and Effects ---
  const getInitialDates = () => initialSelectedDates
    .map((dateStr) => {
        if (!/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) { return null; }
        const date = new Date(dateStr + 'T00:00:00');
        return isNaN(date.getTime()) ? null : date;
    })
    .filter((date): date is Date => date !== null);

  const [selectedDates, setSelectedDates] = useState<Date[]>([]);
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date());

  useEffect(() => {
    if (isOpen) {
      const initialValidDates = getInitialDates();
      setSelectedDates(initialValidDates);
      setCurrentMonth(initialValidDates.length > 0 ? initialValidDates[0] : new Date());
    }
    // We only want this effect to run when `isOpen` changes from false to true
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  // --- Handlers ---
  const handleConfirm = () => {
    if (selectedDates.length === 0) return;
    const dateStrings = selectedDates
        .sort((a, b) => a.getTime() - b.getTime())
        .map(date => date.toISOString().split("T")[0]);
    onSelect(dateStrings, "Full day");
    onClose();
  };

   const handleDayPickerSelect: SelectMultipleEventHandler = ( days, selectedDay, activeModifiers) => {
       setSelectedDates(days || []);
   };

  // --- isDateDisabled (uses helper) ---
  const isDateDisabled = (date: Date): boolean => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (date < today) return true;
    const isBooked = bookedDates.some(booked => isSameDay(new Date(booked.date), date));
    if (isBooked) return true;
    if (availabilityRules?.blockedWeekdays) {
        const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
        const dayOfWeek = dayNames[date.getDay()];
        const isBlocked = availabilityRules.blockedWeekdays.some(rule => rule.weekday.toLowerCase() === dayOfWeek.toLowerCase()); // Case-insensitive comparison
        if (isBlocked) return true;
    }
    return false;
  };

  // --- JSX ---
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[380px] p-0">
        <DialogHeader className="px-6 pt-6 pb-4">
          <DialogTitle className="text-lg font-semibold">Select Available Dates</DialogTitle>
        </DialogHeader>
        <div className="px-6 pb-4">
           <Calendar
            mode="multiple"
            selected={selectedDates}
            onSelect={handleDayPickerSelect}
            disabled={isDateDisabled}
            month={currentMonth}
            onMonthChange={setCurrentMonth}
            fromDate={new Date()}
            className="p-0 rounded-md flex justify-center" // Center calendar
            classNames={{ /* ... previous shadcn styles ... */
                caption_label: "text-sm font-medium",
                nav_button: "h-7 w-7",
                nav_button_previous: "absolute left-1",
                nav_button_next: "absolute right-1",
                head_cell: "text-muted-foreground rounded-md w-9 font-normal text-[0.8rem]",
                cell: "text-center text-sm p-0 relative [&:has([aria-selected])]:bg-accent first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20",
                day: "h-9 w-9 p-0 font-normal aria-selected:opacity-100 rounded-md",
                day_selected: "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground",
                day_disabled: "text-muted-foreground opacity-50",
                day_outside: "text-muted-foreground opacity-50",
            }}
            showOutsideDays
          />
        </div>
        <Separator />
        {/* Selected Dates Summary */}
        <div className="px-6 pt-4 pb-6 space-y-3">
            <h3 className="text-sm font-medium">Selected ({selectedDates.length})</h3>
            <div className="min-h-[60px] max-h-24 overflow-y-auto rounded-md border p-2">
                {selectedDates.length === 0 ? (
                    <p className="text-muted-foreground text-sm px-1 py-1">Click available dates on the calendar to select.</p>
                ) : (
                    <div className="flex flex-wrap gap-1.5">
                        {selectedDates
                        .slice() // Create a copy before sorting for display
                        .sort((a, b) => a.getTime() - b.getTime())
                        .map((date) => (
                            <Badge key={date.toISOString()} variant="secondary" className="flex items-center gap-1 font-normal text-xs pl-1.5 pr-1 py-0.5">
                                {date.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                                <button
                                    onClick={() => setSelectedDates((prev) => prev.filter((d) => !isSameDay(d, date)))}
                                    className="text-muted-foreground hover:text-destructive ml-0.5 rounded-full focus:outline-none focus:ring-1 focus:ring-ring"
                                    aria-label={`Remove date ${date.toLocaleDateString()}`}
                                >
                                    <X className="h-3 w-3" />
                                </button>
                            </Badge>
                        ))}
                    </div>
                )}
            </div>
        </div>
        {/* Footer */}
        <DialogFooter className="px-6 pb-6 sm:justify-end gap-2">
            <DialogClose asChild><Button type="button" variant="outline">Cancel</Button></DialogClose>
            <Button disabled={selectedDates.length === 0} onClick={handleConfirm}>
                <Check className="mr-2 h-4 w-4" /> Confirm Dates ({selectedDates.length})
            </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DatePicker;