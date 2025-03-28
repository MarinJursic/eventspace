"use client";
import React, { useState } from "react";
import { Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface SearchBarProps {
  className?: string;
}

const SearchBar: React.FC<SearchBarProps> = ({ className }) => {
  const [location, setLocation] = useState("");
  const [eventType, setEventType] = useState("");
  const [guests, setGuests] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Search params:", { location, eventType, guests });
    // Handle search logic here
  };

  return (
    <div
      className={cn(
        "w-full max-w-4xl glass rounded-2xl p-4 shadow-glass-sm",
        className
      )}
    >
      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 md:grid-cols-4 gap-4"
      >
        <div className="relative">
          <label
            htmlFor="location"
            className="block text-xs font-medium text-foreground/70 mb-1 ml-1"
          >
            Location
          </label>
          <input
            id="location"
            type="text"
            placeholder="City or Zip Code"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="w-full h-12 px-4 py-2 rounded-xl border border-border/60 bg-white/70 focus:outline-none focus:ring-2 focus:ring-primary/10 focus:border-primary/20 transition-all"
          />
        </div>

        <div className="relative">
          <label
            htmlFor="eventType"
            className="block text-xs font-medium text-foreground/70 mb-1 ml-1"
          >
            Event Type
          </label>
          <select
            id="eventType"
            value={eventType}
            onChange={(e) => setEventType(e.target.value)}
            className="w-full h-12 px-4 py-2 rounded-xl border border-border/60 bg-white/70 focus:outline-none focus:ring-2 focus:ring-primary/10 focus:border-primary/20 transition-all appearance-none"
          >
            <option value="">Any Type</option>
            <option value="wedding">Wedding</option>
            <option value="corporate">Corporate</option>
            <option value="birthday">Birthday</option>
            <option value="conference">Conference</option>
            <option value="reception">Reception</option>
          </select>
        </div>

        <div className="relative">
          <label
            htmlFor="guests"
            className="block text-xs font-medium text-foreground/70 mb-1 ml-1"
          >
            Guests
          </label>
          <select
            id="guests"
            value={guests}
            onChange={(e) => setGuests(e.target.value)}
            className="w-full h-12 px-4 py-2 rounded-xl border border-border/60 bg-white/70 focus:outline-none focus:ring-2 focus:ring-primary/10 focus:border-primary/20 transition-all appearance-none"
          >
            <option value="">Any Size</option>
            <option value="1-50">1-50</option>
            <option value="51-100">51-100</option>
            <option value="101-200">101-200</option>
            <option value="201-500">201-500</option>
            <option value="501+">501+</option>
          </select>
        </div>

        <div className="relative">
          <label className="invisible block text-xs font-medium mb-1 ml-1">
            Search
          </label>
          <Button type="submit" className="w-full h-12 rounded-xl" size="lg">
            <Search className="w-4 h-4 mr-2" />
            Search
          </Button>
        </div>
      </form>
    </div>
  );
};

export default SearchBar;
