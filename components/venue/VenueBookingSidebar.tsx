"use client";

import React from "react";
import { X, CalendarDays, ShoppingCart, HelpCircle } from "lucide-react"; // Added icons
import { Button } from "../ui/button";
import { Separator } from "../ui/separator";
import { Badge } from "../ui/badge";
import { Venue } from "@/lib/mocks/mockVenues"; // Assuming Venue type path

// --- Updated Props Interface ---
interface VenueBookingSidebarProps {
  priceInfo: Venue["price"]; // Accept the price object
  selectedDates: string[];
  onRemoveDate: (date: string) => void; // Expects the date string
  onBook: () => void;
  onOpenDatePicker: () => void;
  onOpenExternalModal: () => void;
}

const VenueBookingSidebar: React.FC<VenueBookingSidebarProps> = ({
  priceInfo,
  selectedDates,
  onRemoveDate, // Use the updated handler type
  onBook,
  onOpenDatePicker,
  onOpenExternalModal,
}) => {
  return (
    <div className="sticky top-24 space-y-5">
      {/* Main Booking Card */}
      <div className="bg-card rounded-xl p-6 shadow-lg border border-border">
        <div className="mb-4">
          <h3 className="font-display text-xl font-semibold">
            Book this Venue
          </h3>
        </div>
        {/* Price Display */}
        <div className="mb-6 pb-4 border-b">
          <p className="font-display text-3xl font-bold tracking-tight">
            {/* Format price using priceInfo */}$
            {priceInfo.basePrice.toLocaleString()}
          </p>
          <p className="text-sm text-muted-foreground mt-1">
            {/* Clarify price model */}
            {priceInfo.model === "day"
              ? "per day"
              : priceInfo.model === "hour"
                ? "per hour*"
                : priceInfo.model === "week"
                  ? "per week"
                  : ""}
            {priceInfo.model === "hour" && (
              <span className="italic"> (final cost may vary)</span>
            )}
          </p>
        </div>

        {/* Conditional Buttons/Date Display */}
        {selectedDates.length > 0 ? (
          <div className="space-y-4">
            <div>
              <h4 className="font-medium text-sm mb-2">
                Selected Dates ({selectedDates.length}):
              </h4>
              <div className="flex flex-wrap gap-1.5 max-h-28 overflow-y-auto rounded-md border p-2 bg-secondary/30">
                {[...selectedDates].sort().map(
                  (
                    date // Sort for display
                  ) => (
                    <Badge
                      key={date} // Use date string as key
                      variant="secondary"
                      className="flex items-center gap-1 font-normal text-xs pl-1.5 pr-1 py-0.5"
                    >
                      {new Date(date + "T00:00:00").toLocaleDateString(
                        undefined,
                        { month: "short", day: "numeric", year: "numeric" }
                      )}
                      {/* Pass date string to onRemoveDate */}
                      <button
                        onClick={() => onRemoveDate(date)}
                        className="text-muted-foreground hover:text-destructive ml-0.5 rounded-full p-0.5 focus:outline-none focus:ring-1 focus:ring-ring"
                        aria-label={`Remove date ${date}`}
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  )
                )}
              </div>
            </div>
            <Button className="w-full" size="lg" onClick={onBook}>
              <ShoppingCart className="mr-2 h-4 w-4" /> Add Venue to Booking
            </Button>
            <Button
              variant="outline"
              className="w-full"
              onClick={onOpenDatePicker}
            >
              <CalendarDays className="mr-2 h-4 w-4" /> Change Dates
            </Button>
          </div>
        ) : (
          <Button className="w-full" size="lg" onClick={onOpenDatePicker}>
            <CalendarDays className="mr-2 h-4 w-4" /> Select Dates
          </Button>
        )}
        <p className="text-xs text-center text-muted-foreground mt-3">
          You won&apos;t be charged yet
        </p>
        <Separator className="my-4" />
        <Button
          variant="outline"
          className="w-full text-sm text-muted-foreground hover:text-primary justify-center px-1 py-2 h-auto"
          onClick={onOpenExternalModal}
        >
          Already have a venue?
        </Button>
      </div>

      {/* Help Box */}
      <div className="bg-secondary/30 border border-secondary/50 p-4 rounded-lg text-center">
        <HelpCircle className="w-5 h-5 mx-auto mb-2 text-primary" />
        <h4 className="font-medium text-sm mb-1">Need assistance?</h4>
        <p className="text-xs text-muted-foreground mb-3">
          Our event specialists can help with questions or custom quotes.
        </p>
        <Button
          variant="outline"
          size="sm"
          className="w-full"
          onClick={() => alert("Contact Support Clicked!")}
        >
          Contact Support
        </Button>
      </div>
    </div>
  );
};

export default VenueBookingSidebar;
