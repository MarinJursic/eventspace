import React, { useState, useEffect } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { X, CalendarDays, Check } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

type DateWithSlots = {
  date: string;
  slots: string[];
};

type DatePickerProps = {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (selectedDates: string[], selectedTimeSlot: string) => void;
  availableDates: DateWithSlots[];
  initialSelectedDates?: string[]; // Add this prop for existing selections
  className?: string;
};

const DatePicker: React.FC<DatePickerProps> = ({
  isOpen,
  onClose,
  onSelect,
  availableDates,
  initialSelectedDates = [],
  className,
}) => {
  // Convert initial string dates to Date objects
  const initialDateObjects = initialSelectedDates.map(
    (dateStr) => new Date(dateStr)
  );
  const [selectedDates, setSelectedDates] =
    useState<Date[]>(initialDateObjects);

  // Generate March 2025 dates
  const generateMarch2025Dates = (): DateWithSlots[] => {
    const dates: DateWithSlots[] = [];
    const year = 2025;
    const month = 2; // JavaScript months are 0-indexed, so March is 2

    // Generate all days in March 2025
    for (let day = 1; day <= 31; day++) {
      const date = new Date(year, month, day);

      // Stop if we've moved to April
      if (date.getMonth() !== month) break;

      dates.push({
        date: date.toISOString().split("T")[0],
        slots: ["Full day"],
      });
    }

    return dates;
  };

  // Use generated March 2025 dates
  const march2025Dates = generateMarch2025Dates();

  // Convert string dates to Date objects for the calendar
  const availableDateObjects = march2025Dates.map((d) => new Date(d.date));

  useEffect(() => {
    if (isOpen) {
      // Reset to initial dates when modal opens
      setSelectedDates(initialDateObjects);
    }
  }, [isOpen, initialSelectedDates]);

  const handleConfirm = () => {
    if (selectedDates.length === 0) return;
    // Convert Date objects to string dates in YYYY-MM-DD format
    const dateStrings = selectedDates.map(
      (date) => date.toISOString().split("T")[0]
    );
    // Since we simplified, we pass "Full day" as the time slot
    onSelect(dateStrings, "Full day");
    onClose();
  };

  // Helper function to check if a date is disabled
  const isDateDisabled = (date: Date) => {
    // Disable past dates
    if (date < new Date()) return true;

    // Check if date is in available dates
    return !availableDateObjects.some((availableDate) =>
      isSameDay(availableDate, date)
    );
  };

  // Helper function to compare dates without time
  const isSameDay = (date1: Date, date2: Date) => {
    return (
      date1.getFullYear() === date2.getFullYear() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getDate() === date2.getDate()
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Select Dates</DialogTitle>
        </DialogHeader>

        <div className={`space-y-6 ${className}`}>
          <div className="mt-4 space-y-6">
            {/* Calendar */}
            <div>
              <h3 className="text-sm font-medium mb-2 flex items-center">
                <CalendarDays className="w-4 h-4 mr-2" />
                Available Dates
              </h3>
              <div className="border rounded-md p-4">
                <Calendar
                  mode="multiple"
                  selected={selectedDates}
                  onSelect={(dates) => {
                    // Handle the case when dates is undefined
                    if (!dates) {
                      setSelectedDates([]);
                      return;
                    }
                    // Handle the case when dates is an array
                    if (Array.isArray(dates)) {
                      setSelectedDates(dates);
                    }
                  }}
                  disabled={isDateDisabled}
                  className="pointer-events-auto"
                  defaultMonth={new Date(2025, 2)} // Default to March 2025
                />
              </div>
            </div>

            <Separator className="my-4" />

            {/* Selected Dates Summary */}
            <div className="space-y-4">
              <h3 className="text-sm font-medium">Your Selected Dates</h3>

              {selectedDates.length === 0 ? (
                <p className="text-muted-foreground text-sm">
                  No dates selected yet
                </p>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {selectedDates.map((date, index) => (
                    <Badge
                      key={index}
                      variant="outline"
                      className="flex items-center gap-1"
                    >
                      {date.toLocaleDateString()}
                      <button
                        onClick={() =>
                          setSelectedDates((prev) =>
                            prev.filter((_, i) => i !== index)
                          )
                        }
                        className="text-muted-foreground hover:text-foreground ml-1"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          </div>

          <Button
            disabled={selectedDates.length === 0}
            onClick={handleConfirm}
            className="w-full"
          >
            <Check className="mr-2 h-4 w-4" /> Confirm Dates
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DatePicker;
