"use client";

import React, { useEffect, useMemo, useState, useCallback } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import VenueCard from "@/components/ui/VenueCard";
import { Separator } from "@/components/ui/separator";
import { Slider } from "@/components/ui/slider";
import { Filter, Search, Building, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/useToast";
import { useCart } from "../context/CartContext";
import ExternalVenueModal from "@/components/venue/ExternalVenueModal";
import FilterGroup from "@/components/venue/FilterGroup";
import { venues as mockVenues } from "@/lib/mockVenues";
import { LocationCombobox } from "@/components/ui/LocationCombobox"; // Import the combobox
import { venueTypes, capacities, getUniqueCities } from "@/lib/venueFilters"; // Import shared definitions

// Helper function to safely parse numbers from URL params
const safeParseInt = (str: string | null, defaultValue: number): number => {
  if (str === null) return defaultValue;
  const parsed = parseInt(str, 10);
  return isNaN(parsed) ? defaultValue : parsed;
};

// Helper function to parse comma-separated strings into a Set
const parseSetParam = (str: string | null): Set<string> => {
  return str ? new Set(str.split(',')) : new Set<string>();
};


const Venues: React.FC = () => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { toast } = useToast();
  const { addExternalVenue } = useCart();

  // --- State ---
  const [searchTerm, setSearchTerm] = useState<string>("");
  // locationSearch now stores the selected city label (original casing) from URL/Combobox
  const [locationSearch, setLocationSearch] = useState<string>("");
  const [priceRange, setPriceRange] = useState<number[]>([500, 5000]);
  const [sortOption, setSortOption] = useState<string>("recommended");
  const [selectedFilters, setSelectedFilters] = useState<{
    venueTypes: Set<string>;
    capacities: Set<string>;
    amenities: Set<string>;
  }>({
    venueTypes: new Set<string>(),
    capacities: new Set<string>(),
    amenities: new Set<string>(),
  });
  const [isExternalVenueModalOpen, setIsExternalVenueModalOpen] = useState(false);
  const [hasInitializedFromUrl, setHasInitializedFromUrl] = useState(false);

  // --- Data Definitions ---
  // Use imported definitions
  const venueTypeOptions = useMemo(() => venueTypes, []);
  const capacityOptions = useMemo(() => capacities, []);
  // Get unique cities once - use the shared function
  const uniqueCities = useMemo(() => getUniqueCities(mockVenues), []);
  // Get amenities (assuming these are static for now)
  const amenityOptions = useMemo(() => [
      { id: "parking", label: "Free Parking" },
      { id: "catering", label: "In-house Catering" },
      { id: "wifi", label: "Free WiFi" },
      { id: "av", label: "AV Equipment" },
      { id: "accessible", label: "Wheelchair Accessible" },
      { id: "outdoor", label: "Outdoor Space" },
  ], []);

   // --- Derived State for Combobox ---
   // Convert locationSearch (label) back to value (lowercase) for the Combobox state
   const locationValue = useMemo(() => {
        return uniqueCities.find(c => c.label === locationSearch)?.value || "";
   }, [locationSearch, uniqueCities]);


  // --- Effect to Initialize State from URL ---
  useEffect(() => {
    window.scrollTo(0, 0);

    // Read initial state from URL parameters
    const urlSearchTerm = searchParams.get("q") || "";
    // Location now comes directly as the city name (label)
    const urlLocation = searchParams.get("location") || "";
    const urlMinPrice = safeParseInt(searchParams.get("minPrice"), 500);
    const urlMaxPrice = safeParseInt(searchParams.get("maxPrice"), 5000);
    const urlSort = searchParams.get("sort") || "recommended";
    const urlTypes = parseSetParam(searchParams.get("types"));
    const urlCapacities = parseSetParam(searchParams.get("capacities"));
    const urlAmenities = parseSetParam(searchParams.get("amenities"));

    setSearchTerm(urlSearchTerm);
    // Store the location label directly
    setLocationSearch(urlLocation);
    setPriceRange([urlMinPrice, urlMaxPrice]);
    setSortOption(urlSort);
    setSelectedFilters({
      venueTypes: urlTypes,
      capacities: urlCapacities,
      amenities: urlAmenities,
    });

    setHasInitializedFromUrl(true);

  }, [searchParams]); // Depend only on searchParams

  // --- Effect to Update URL from State ---
  useEffect(() => {
    if (!hasInitializedFromUrl) return;

    const params = new URLSearchParams();

    if (searchTerm) params.set("q", searchTerm);
    // Send the location label (original casing) if it exists
    if (locationSearch) params.set("location", locationSearch);
    if (priceRange[0] !== 500) params.set("minPrice", priceRange[0].toString());
    if (priceRange[1] !== 5000) params.set("maxPrice", priceRange[1].toString());
    if (sortOption !== "recommended") params.set("sort", sortOption);
    if (selectedFilters.venueTypes.size > 0) params.set("types", Array.from(selectedFilters.venueTypes).join(','));
    if (selectedFilters.capacities.size > 0) params.set("capacities", Array.from(selectedFilters.capacities).join(','));
    if (selectedFilters.amenities.size > 0) params.set("amenities", Array.from(selectedFilters.amenities).join(','));

    // Debounce or throttle this if performance becomes an issue with rapid changes
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });

  }, [
    searchTerm,
    locationSearch, // Use the label state for URL update
    priceRange,
    sortOption,
    selectedFilters,
    pathname,
    router,
    hasInitializedFromUrl
  ]);

  // --- Filter Change Handler ---
  const handleFilterChange = useCallback(
    (category: keyof typeof selectedFilters, id: string) => {
      setSelectedFilters((prev) => {
        const updated = new Set(prev[category]);
        updated.has(id) ? updated.delete(id) : updated.add(id);
        return { ...prev, [category]: updated };
      });
    },
    []
  );

   // --- Location Change Handler ---
   const handleLocationChange = useCallback((value: string) => { // value is lowercase city
       const cityLabel = uniqueCities.find(c => c.value === value)?.label || "";
       setLocationSearch(cityLabel); // Update state with the label
   }, [uniqueCities]);


  // --- Filtered and Sorted Venues ---
  const filteredAndSortedVenues = useMemo(() => {
    // Perform case-insensitive comparison for location using the label
    const lowerCaseLocationSearch = locationSearch.toLowerCase();

    return mockVenues
      .filter((venue) => {
        const matchesSearch = venue.name.toLowerCase().includes(searchTerm.toLowerCase());

        // Location Match: Compare venue's city (lowercase) with selected location (lowercase)
        const matchesLocation =
          !lowerCaseLocationSearch ||
          (venue.location?.city && venue.location.city.toLowerCase() === lowerCaseLocationSearch);

        const priceInRange = venue.price.basePrice >= priceRange[0] && venue.price.basePrice <= priceRange[1];

        const matchesType =
          selectedFilters.venueTypes.size === 0 || (venue.type && selectedFilters.venueTypes.has(venue.type));

        let capacityLabel = "small"; // Default
        if (venue.capacity) {
            const capNum = venue.capacity;
             if (capNum < 50) capacityLabel = "small";
             else if (capNum <= 150) capacityLabel = "medium";
             else if (capNum <= 300) capacityLabel = "large";
             else capacityLabel = "xlarge";
        }
        const matchesCapacity =
          selectedFilters.capacities.size === 0 || selectedFilters.capacities.has(capacityLabel);

        const matchesAmenities =
          selectedFilters.amenities.size === 0 ||
          (venue.amenities && Array.from(selectedFilters.amenities).every((a) => venue.amenities.includes(a)));

        return matchesSearch && matchesLocation && priceInRange && matchesType && matchesCapacity && matchesAmenities;
      })
      .sort((a, b) => {
        if (sortOption === "price-asc") return a.price.basePrice - b.price.basePrice;
        if (sortOption === "price-desc") return b.price.basePrice - a.price.basePrice;
        if (sortOption === "rating") return b.rating.average - a.rating.average;
        return 0;
      });
  }, [mockVenues, searchTerm, locationSearch, priceRange, sortOption, selectedFilters]);


  // --- Reset Filters ---
  const resetFilters = useCallback(() => {
      setSearchTerm("");
      setLocationSearch(""); // Reset location label state
      setPriceRange([500, 5000]);
      setSortOption("recommended");
      setSelectedFilters({
          venueTypes: new Set(),
          capacities: new Set(),
          amenities: new Set(),
      });
      // URL update effect handles clearing params
  }, []);

   if (!hasInitializedFromUrl) {
     return <div className="min-h-screen pt-24 pb-16 flex items-center justify-center">Loading venues...</div>;
   }

  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-grow pt-24 pb-16">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row gap-8">
            {/* --- Sidebar --- */}
            <aside className="w-full md:w-1/4 lg:w-1/5 space-y-6">
              <div className="bg-white rounded-xl shadow-sm p-6 sticky top-24">
                <h2 className="text-lg font-display font-semibold mb-4 flex items-center">
                  <Filter className="w-5 h-5 mr-2" /> Filters
                </h2>

                {/* Search Input */}
                <div className="mb-6 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                  <input
                    type="text"
                    placeholder="Search venue name..." // More specific
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 rounded-lg border h-10" // Adjusted height
                    aria-label="Search venues by name"
                  />
                </div>

                {/* Location Combobox */}
                <div className="mb-6 relative">
                   {/* <label className="block text-xs font-medium text-gray-600 mb-1 ml-1">Location</label> */} {/* Optional label */}
                    <LocationCombobox
                        locations={uniqueCities}
                        value={locationValue} // Use derived lowercase value for Combobox state
                        onChange={handleLocationChange} // Use the handler
                        placeholder="Filter by city..."
                        inputClassName="h-10 rounded-lg border-input bg-background" // Match input style
                        className="w-full"
                   />
                </div>

                {/* Price Range Slider */}
                <div className="mb-6">
                    <h3 className="font-medium mb-3 text-sm">Price Range</h3> {/* Smaller heading */}
                    <Slider
                        min={0} max={10000} step={100}
                        value={priceRange} onValueChange={setPriceRange}
                        className="mb-2"
                        aria-label={`Price range from $${priceRange[0]} to $${priceRange[1]}`}
                    />
                    <div className="flex justify-between text-xs text-muted-foreground"> {/* Smaller text */}
                        <span>${priceRange[0]}</span>
                        <span>${priceRange[1]}{priceRange[1] === 10000 ? '+' : ''}</span>
                    </div>
                </div>

                <Separator className="my-5" />

                {/* Filter Groups */}
                <FilterGroup
                  title="Venue Type"
                  options={venueTypeOptions} // Use state variable
                  selected={selectedFilters.venueTypes}
                  onChange={(id) => handleFilterChange("venueTypes", id)}
                  idPrefix="venueTypes"
                />
                <FilterGroup
                  title="Capacity"
                  options={capacityOptions} // Use state variable
                  selected={selectedFilters.capacities}
                  onChange={(id) => handleFilterChange("capacities", id)}
                  idPrefix="capacities"
                />
                <FilterGroup
                  title="Amenities"
                  options={amenityOptions} // Use state variable
                  selected={selectedFilters.amenities}
                  onChange={(id) => handleFilterChange("amenities", id)}
                  idPrefix="amenities"
                />

                 <Button
                    variant="ghost"
                    className="w-full mt-6 text-sm text-primary hover:underline h-auto py-1" // Adjust size
                    onClick={resetFilters}
                 >
                    Reset all filters
                 </Button>
              </div>
            </aside>

            {/* --- Main Content --- */}
            <div className="w-full md:w-3/4 lg:w-4/5">
               {/* Header and External Venue Button */}
               <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                 <div>
                   <h1 className="text-3xl font-display font-bold mb-1">Find the Perfect Venue</h1>
                   <p className="text-muted-foreground">Discover unique venues for your special events</p>
                 </div>
                 <Button
                   variant="outline"
                   className="mt-4 md:mt-0 flex items-center shrink-0"
                   onClick={() => setIsExternalVenueModalOpen(true)}
                 >
                   <Building className="w-4 h-4 mr-2" />I already have a venue
                 </Button>
               </div>

               {/* Sort & Count */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-3">
                 <p className="text-sm text-muted-foreground">
                    Showing <span className="font-medium text-foreground">{filteredAndSortedVenues.length}</span> venue{filteredAndSortedVenues.length !== 1 ? 's' : ''}
                 </p>
                 <div className="flex items-center">
                   <label htmlFor="sort" className="text-sm mr-2 shrink-0">
                     Sort by:
                   </label>
                   <select
                     id="sort" value={sortOption} onChange={(e) => setSortOption(e.target.value)}
                     className="bg-background border rounded-lg px-3 py-1.5 text-sm focus:ring-primary focus:border-primary"
                   >
                     <option value="recommended">Recommended</option>
                     <option value="price-asc">Price: Low to High</option>
                     <option value="price-desc">Price: High to Low</option>
                     <option value="rating">Top Rated</option>
                   </select>
                 </div>
               </div>

              {/* Venue Grid or No Results */}
              {filteredAndSortedVenues.length > 0 ? (
                 <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                   {filteredAndSortedVenues.map((venue) => (
                     <VenueCard key={venue.id} venue={venue} />
                   ))}
                 </div>
              ) : (
                 <div className="text-center py-16 text-muted-foreground bg-secondary/30 rounded-lg">
                     <p className="text-lg mb-2 font-medium">No venues match your filters.</p>
                     <p className="text-sm">Try adjusting your search criteria or reset the filters.</p>
                     <Button variant="link" onClick={resetFilters} className="mt-3">Reset Filters</Button>
                 </div>
              )}
            </div> {/* End Main Content Area */}
          </div> {/* End Flex Container */}
        </div> {/* End Container */}
      </main>

      {/* --- External Venue Modal --- */}
      <ExternalVenueModal
        isOpen={isExternalVenueModalOpen}
        onClose={() => setIsExternalVenueModalOpen(false)}
        onConfirm={addExternalVenue}
      />
    </div>
  );
};

export default Venues;