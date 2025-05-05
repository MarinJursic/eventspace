"use client";
import React, { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react"; // Removed ChevronDown as Combobox handles it
import { cn } from "@/lib/utils/cn";
import { Button } from "@/components/ui/button";
import { LocationCombobox } from "@/components/ui/LocationCombobox"; // Import the new component
import { venues as mockVenues } from "@/lib/mocks/mockVenues"; // Import venues for cities
import { venueTypes, capacities, getUniqueCities } from "@/lib/venueFilters"; // Import shared definitions

interface SearchBarProps {
  className?: string;
}

const SearchBar: React.FC<SearchBarProps> = ({ className }) => {
  const router = useRouter();
  const [location, setLocation] = useState(""); // Will store lowercase city name
  const [selectedType, setSelectedType] = useState(""); // Stores venue type id
  const [selectedCapacity, setSelectedCapacity] = useState(""); // Stores capacity id

  // Get unique city list once
  const uniqueCities = useMemo(() => getUniqueCities(mockVenues), []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const params = new URLSearchParams();

    if (location) {
      // Find the original casing for display/potentially better matching if needed,
      // but send the consistent lowercase value
      const cityLabel =
        uniqueCities.find((c) => c.value === location)?.label || location;
      params.set("location", cityLabel); // Send original casing label as location parameter
    }
    if (selectedType) {
      params.set("types", selectedType); // Send venue type id
    }
    if (selectedCapacity) {
      params.set("capacities", selectedCapacity); // Send capacity id
    }

    const targetUrl = `/venues?${params.toString()}`;
    console.log("Navigating to:", targetUrl);
    router.push(targetUrl);
  };

  return (
    <div
      className={cn(
        "w-full max-w-4xl bg-white/80 backdrop-blur-md rounded-2xl p-4 shadow-lg border border-gray-200/50",
        className
      )}
    >
      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end"
      >
        {/* Location Combobox */}
        <div className="relative">
          <label
            htmlFor="location-combobox" // Point to the button trigger
            className="block text-xs font-medium text-gray-600 mb-1 ml-1"
          >
            Location
          </label>
          <LocationCombobox
            locations={uniqueCities}
            value={location}
            onChange={setLocation} // Pass the setter directly
            placeholder="City"
            inputClassName="bg-white border-gray-300 focus:ring-2 focus:ring-primary/30 focus:border-primary/50" // Add necessary styling classes
          />
          {/* Hidden input for form semantics if needed, though not strictly required for JS nav */}
          <input type="hidden" id="location" name="location" value={location} />
        </div>

        {/* Venue Type Select */}
        <div className="relative">
          <label
            htmlFor="venueType"
            className="block text-xs font-medium text-gray-600 mb-1 ml-1"
          >
            Venue Type
          </label>
          <select
            id="venueType"
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className={cn(
              "w-full h-12 px-4 py-2 rounded-xl border border-gray-300 bg-white focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition-all appearance-none",
              !selectedType && "text-gray-500"
            )}
            aria-label="Select venue type"
          >
            <option value="">Any Type</option>
            {venueTypes.map((type) => (
              <option key={type.id} value={type.id}>
                {type.label}
              </option>
            ))}
          </select>
          {/* Dropdown arrow */}
          <div className="pointer-events-none absolute inset-y-0 right-0 top-6 flex items-center px-3 text-gray-700">
            <svg
              className="fill-current h-4 w-4"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
            >
              <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
            </svg>
          </div>
        </div>

        {/* Capacity Select */}
        <div className="relative">
          <label
            htmlFor="capacity"
            className="block text-xs font-medium text-gray-600 mb-1 ml-1"
          >
            Guests
          </label>
          <select
            id="capacity"
            value={selectedCapacity}
            onChange={(e) => setSelectedCapacity(e.target.value)}
            className={cn(
              "w-full h-12 px-4 py-2 rounded-xl border border-gray-300 bg-white focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition-all appearance-none",
              !selectedCapacity && "text-gray-500"
            )}
            aria-label="Select number of guests"
          >
            <option value="">Any Size</option>
            {capacities.map((cap) => (
              <option key={cap.id} value={cap.id}>
                {cap.label}
              </option>
            ))}
          </select>
          {/* Dropdown arrow */}
          <div className="pointer-events-none absolute inset-y-0 right-0 top-6 flex items-center px-3 text-gray-700">
            <svg
              className="fill-current h-4 w-4"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
            >
              <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
            </svg>
          </div>
        </div>

        {/* Submit Button */}
        <div className="relative">
          <label className="invisible block text-xs font-medium mb-1 ml-1">
            Search
          </label>
          <Button type="submit" className="w-full h-12 rounded-xl" size="lg">
            <Search className="w-5 h-5 mr-2" />
            Search
          </Button>
        </div>
      </form>
    </div>
  );
};

export default SearchBar;
