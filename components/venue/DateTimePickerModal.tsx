// src/components/venue/DateTimePickerModal.tsx

import React, { useState, useEffect } from "react";
// Use the Calendar component which wraps DayPicker
import { Calendar } from "@/components/ui/calendar";
import { SelectMultipleEventHandler, DayModifiers } from "react-day-picker";
import { X, Check, CalendarDays } from "lucide-react"; // Use CalendarDays icon
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
  DialogDescription, // Optional: for accessibility or context
} from "@/components/ui/dialog";
import { Venue } from "@/lib/mockVenues"; // Assuming path is correct

// Helper function to compare dates without time
const isSameDay = (date1: Date | null | undefined, date2: Date | null | undefined): boolean => {
    if (!date1 || !date2) return false;
    return (
      date1.getFullYear() === date2.getFullYear() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getDate() === date2.getDate()
    );
};

type DatePickerProps = {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (selectedDates: string[], selectedTimeSlot: string) => void;
  bookedDates: Venue['bookedDates'];
  availabilityRules?: Venue['availabilityRules'];
  initialSelectedDates?: string[];
  className?: string; // Keep className prop if needed for external styling
};

const DatePicker: React.FC<DatePickerProps> = ({
  isOpen,
  onClose,
  onSelect,
  bookedDates,
  availabilityRules,
  initialSelectedDates = [],
  className, // className is available but not used internally here
}) => {
  const getInitialDates = () => initialSelectedDates
    .map((dateStr) => {
        // Basic validation for date string format
        if (!/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
            console.warn(`Invalid initial date format: ${dateStr}. Skipping.`);
            return null;
        }
        const date = new Date(dateStr + 'T00:00:00'); // Ensure parsing as local time
        return isNaN(date.getTime()) ? null : date;
    })
    .filter((date): date is Date => date !== null); // Filter out invalid dates

  const [selectedDates, setSelectedDates] = useState<Date[]>([]);

  // State for the currently displayed month in the calendar
  const [currentMonth, setCurrentMonth] = useState<Date>(() => {
      const initial = getInitialDates();
      // Default to first selected date's month, or current month
      return initial.length > 0 ? initial[0] : new Date();
  });

  useEffect(() => {
    // Reset state only when the modal opens
    if (isOpen) {
      const initialValidDates = getInitialDates();
      setSelectedDates(initialValidDates);
      // Set initial month view
      setCurrentMonth(initialValidDates.length > 0 ? initialValidDates[0] : new Date());
    }
  }, [isOpen]); // Only depend on isOpen

  const handleConfirm = () => {
    if (selectedDates.length === 0) return;
    const dateStrings = selectedDates
        .sort((a, b) => a.getTime() - b.getTime())
        .map(date => date.toISOString().split("T")[0]);
    onSelect(dateStrings, "Full day");
    onClose();
  };

  const isDateDisabled = (date: Date): boolean => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (date < today) return true;
    const isBooked = bookedDates.some(booked => isSameDay(new Date(booked.date), date)); // Ensure booked.date is a Date
    if (isBooked) return true;
    if (availabilityRules?.blockedWeekdays) {
        const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
        const dayOfWeek = dayNames[date.getDay()];
        const isBlocked = availabilityRules.blockedWeekdays.some(rule => rule.weekday === dayOfWeek);
        if (isBlocked) return true;
    }
    return false;
  };

  const handleDayPickerSelect: SelectMultipleEventHandler = (
    days: Date[] | undefined,
    selectedDay: Date,
    activeModifiers: DayModifiers
  ) => {
      setSelectedDates(days || []);
  };

  return (
    // Control Dialog open state externally
    <Dialog open={isOpen} onOpenChange={onClose}>
      {/* Apply content styling */}
      <DialogContent className="sm:max-w-[380px] p-0"> {/* Adjust max-width, remove padding */}
        <DialogHeader className="px-6 pt-6 pb-4"> {/* Add padding to header */}
          <DialogTitle className="text-lg font-semibold">Select Available Dates</DialogTitle>
           {/* Optional: Add description if needed */}
           {/* <DialogDescription className="text-sm text-muted-foreground">Click dates to select or deselect.</DialogDescription> */}
        </DialogHeader>

        {/* Calendar Section - Add internal padding */}
        <div className="px-6 pb-4">
          <Calendar // Use the shadcn/ui Calendar component
            mode="multiple"
            selected={selectedDates}
            onSelect={handleDayPickerSelect}
            disabled={isDateDisabled}
            month={currentMonth} // Control the displayed month
            onMonthChange={setCurrentMonth} // Allow month navigation
            fromDate={new Date()} // Disable past dates visually
            className="p-0 rounded-md flex justify-center" // Center calendar, remove its internal padding
            classNames={{ // Target specific parts for styling
                caption_label: "text-sm font-medium",
                nav_button: "h-7 w-7", // Adjust nav button size
                nav_button_previous: "absolute left-1", // Position nav buttons
                nav_button_next: "absolute right-1",
                head_cell: "text-muted-foreground rounded-md w-9 font-normal text-[0.8rem]", // Style weekday headers
                cell: "text-center text-sm p-0 relative [&:has([aria-selected])]:bg-accent first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20", // Base cell style
                day: "h-9 w-9 p-0 font-normal aria-selected:opacity-100 rounded-md", // Style individual day buttons
                day_selected: "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground", // Selected style
                day_disabled: "text-muted-foreground opacity-50",
                day_outside: "text-muted-foreground opacity-50", // Style dates outside current month
                day_range_middle: "aria-selected:bg-accent aria-selected:text-accent-foreground", // Needed if using range selection later
            }}
            showOutsideDays // Show days from adjacent months
          />
        </div>

        <Separator />

        {/* Selected Dates Summary Section - Add internal padding */}
        <div className="px-6 pt-4 pb-6 space-y-3">
            <h3 className="text-sm font-medium">
                Selected ({selectedDates.length})
            </h3>
            <div className="min-h-[60px] max-h-24 overflow-y-auto rounded-md border p-2"> {/* Container with border, padding, and scroll */}
                {selectedDates.length === 0 ? (
                <p className="text-muted-foreground text-sm px-1 py-1">
                    Click available dates on the calendar to select.
                </p>
                ) : (
                <div className="flex flex-wrap gap-1.5">
                    {selectedDates
                    .slice()
                    .sort((a, b) => a.getTime() - b.getTime())
                    .map((date, index) => (
                        <Badge
                        key={date.toISOString()} // Use ISO string for a more stable key
                        variant="secondary"
                        className="flex items-center gap-1 font-normal text-xs pl-1.5 pr-1 py-0.5" // Adjust padding
                        >
                        {date.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                        <button
                            onClick={() =>
                            setSelectedDates((prev) =>
                                prev.filter((d) => !isSameDay(d, date))
                            )
                            }
                            className="text-muted-foreground hover:text-destructive ml-0.5 rounded-full focus:outline-none focus:ring-1 focus:ring-ring" // Add focus style
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

        {/* Footer - Use DialogFooter, add padding */}
        <DialogFooter className="px-6 pb-6 sm:justify-end gap-2">
            <DialogClose asChild>
                <Button type="button" variant="outline"> Cancel </Button>
            </DialogClose>
          <Button
            disabled={selectedDates.length === 0}
            onClick={handleConfirm}
          >
            <Check className="mr-2 h-4 w-4" /> Confirm Dates ({selectedDates.length})
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DatePicker;