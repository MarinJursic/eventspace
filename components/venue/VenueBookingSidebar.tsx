"use client";

import React from "react";
import { X, CalendarDays, ShoppingCart } from "lucide-react";
import { Button } from "../ui/button";
import { Separator } from "../ui/separator";
import { Badge } from "../ui/badge";

interface VenueBookingSidebarProps {
  price: string;
  selectedDates: string[];
  onRemoveDate: (index: number) => void;
  onBook: () => void;
  onOpenDatePicker: () => void;
  onOpenExternalModal: () => void;
}

const VenueBookingSidebar: React.FC<VenueBookingSidebarProps> = ({
  price,
  selectedDates,
  onRemoveDate,
  onBook,
  onOpenDatePicker,
  onOpenExternalModal,
}) => {
  return (
    <div className="sticky top-24 space-y-6">
      <div className="bg-card rounded-xl p-6 shadow-sm border border-border">
        <div className="mb-4">
          <h3 className="font-display text-xl font-semibold">
            Book this Venue
          </h3>
        </div>
        <div className="mb-4">
          <p className="font-display text-2xl font-bold">{price}</p>
          <p className="text-sm text-muted-foreground">per day</p>
        </div>
        {selectedDates.length > 0 ? (
          <div className="space-y-4">
            <div>
              <h4 className="font-medium text-sm mb-2">Selected Dates:</h4>
              <div className="flex flex-wrap gap-2">
                {selectedDates.map((date, index) => (
                  <Badge
                    key={index}
                    variant="outline"
                    className="flex items-center gap-1"
                  >
                    {date}
                    <button
                      onClick={() => onRemoveDate(index)}
                      className="text-muted-foreground hover:text-foreground ml-1"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            </div>
            <Button className="w-full" onClick={onBook}>
              <ShoppingCart className="mr-2 h-4 w-4" /> Book Now
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
          <Button className="w-full" onClick={onOpenDatePicker}>
            <CalendarDays className="mr-2 h-4 w-4" /> Select Dates
          </Button>
        )}
        <p className="text-xs text-center text-muted-foreground mt-3">
          You won't be charged yet
        </p>
        <Separator className="my-4" />
        <Button
          variant="outline"
          className="w-full"
          onClick={onOpenExternalModal}
        >
          Already have a venue?
        </Button>
      </div>
      <div className="bg-primary/5 p-4 rounded-lg">
        <h4 className="font-medium mb-2">Need help with your booking?</h4>
        <p className="text-sm text-muted-foreground mb-3">
          Our team is available to assist you with any questions or special
          requests.
        </p>
        <Button variant="outline" className="w-full">
          Contact Us
        </Button>
      </div>
    </div>
  );
};

export default VenueBookingSidebar;
