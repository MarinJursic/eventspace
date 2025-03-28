"use client";
import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";

type ExternalVenueModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (
    venueName: string,
    location: string,
    selectedDates: string[]
  ) => void;
};

const ExternalVenueModal: React.FC<ExternalVenueModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
}) => {
  const [venueName, setVenueName] = useState("");
  const [venueLocation, setVenueLocation] = useState("");
  const [selectedDates, setSelectedDates] = useState<Date[]>([]);

  const handleConfirm = () => {
    if (!venueName || !venueLocation || selectedDates.length === 0) return;

    // Convert Date objects to ISO strings (YYYY-MM-DD)
    const dateStrings = selectedDates
      .map((date) => date.toISOString().split("T")[0])
      .sort();

    onConfirm(venueName, venueLocation, dateStrings);
  };

  const resetForm = () => {
    setVenueName("");
    setVenueLocation("");
    setSelectedDates([]);
  };

  // Reset form when modal opens
  React.useEffect(() => {
    if (isOpen) {
      resetForm();
    }
  }, [isOpen]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-xl">Add External Venue</DialogTitle>
        </DialogHeader>

        <div className="mt-4 space-y-4">
          <div className="space-y-2">
            <Label htmlFor="venue-name">Venue Name</Label>
            <Input
              id="venue-name"
              placeholder="Enter venue name"
              value={venueName}
              onChange={(e) => setVenueName(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="venue-location">Venue Location</Label>
            <Input
              id="venue-location"
              placeholder="Enter venue location (e.g., City, State)"
              value={venueLocation}
              onChange={(e) => setVenueLocation(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label>Select Event Dates</Label>
            <Calendar
              mode="multiple"
              selected={selectedDates}
              onSelect={(dates) =>
                dates &&
                setSelectedDates(Array.isArray(dates) ? dates : [dates])
              }
              disabled={(date) => date < new Date()}
              className="p-3 pointer-events-auto"
            />
          </div>

          <div>
            <Label>Selected Dates</Label>
            {selectedDates.length === 0 ? (
              <p className="text-muted-foreground text-sm mt-2">
                No dates selected yet
              </p>
            ) : (
              <div className="flex flex-wrap gap-2 mt-2">
                {selectedDates.map((date) => {
                  const dateString = date.toISOString().split("T")[0];
                  return (
                    <Badge
                      key={dateString}
                      variant="outline"
                      className="flex items-center gap-1"
                    >
                      {dateString}
                      <button
                        onClick={() =>
                          setSelectedDates((prev) =>
                            prev.filter(
                              (d) => d.toISOString() !== date.toISOString()
                            )
                          )
                        }
                        className="text-muted-foreground hover:text-foreground ml-1"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        <DialogFooter className="mt-6">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            disabled={
              !venueName || !venueLocation || selectedDates.length === 0
            }
            onClick={handleConfirm}
          >
            Add External Venue
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ExternalVenueModal;
