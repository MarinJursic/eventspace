// components/venue/VenueListClient.tsx
"use client";

import React, { useEffect, useMemo, useState, useCallback, Suspense } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";

// --- Import UI Components ---
import VenueCard from "@/components/ui/VenueCard"; // Adjust path if needed
import { Separator } from "@/components/ui/separator"; // Adjust path
import { Slider } from "@/components/ui/slider";       // Adjust path
import { Filter, Search, Building } from "lucide-react";
import { Button } from "@/components/ui/button";       // Adjust path
import { LocationCombobox } from "@/components/ui/LocationCombobox"; // Adjust path
import FilterGroup from "@/components/venue/FilterGroup";         // Adjust path
import ExternalVenueModal from "@/components/venue/ExternalVenueModal"; // Adjust path

// --- Import Context and Utils ---
import { useCart } from "@/app/context/CartContext"; // Adjust path
import { venueTypes, capacities } from "@/lib/venueFilters"; // Adjust path

// --- Define Types ---
// Define the structure of the populated/serialized amenity data
interface PopulatedAmenity {
    _id: string;
    id?: string; // Optional virtual ID
    key: string; // e.g., 'parking', 'wifi'
    label: string; // e.g., 'Parking', 'WiFi'
    icon?: string; // Optional: icon name string if stored/populated
}

// Define the serialized venue data type expected as a prop
// This MUST match the structure returned by getAllVenues after serialization
interface SerializedVenue {
    id: string; // Virtual 'id' field from Mongoose
    _id: string; // Original ObjectId as string
    name: string;
    location: { address: string; city?: string; };
    price: { basePrice: number; model: 'hour' | 'day' | 'week'; };
    images: { url: string; alt?: string; caption?: string; }[];
    rating: { average: number; count: number; };
    type?: string;
    capacity?: number;
    amenities?: PopulatedAmenity[]; // Expecting array of populated objects now
    sponsored?: { isActive: boolean; };
    // Add other fields if they exist after serialization
}

interface VenueListClientProps {
  initialVenues: SerializedVenue[]; // Use the specific type
  allCities: { value: string; label: string }[];
}

// Helper function to safely parse numbers from URL params
const safeParseInt = (str: string | null, defaultValue: number): number => {
    if (str === null) return defaultValue;
    const parsed = parseInt(str, 10);
    return isNaN(parsed) ? defaultValue : parsed;
};

// Helper function to parse comma-separated strings from URL params into a Set
const parseSetParam = (str: string | null): Set<string> => {
    if (!str || str.trim() === "") return new Set<string>();
    const items = str.split(',').map(item => item.trim()).filter(item => item !== "");
    return new Set<string>(items);
};

// --- Client Component Content ---
const VenueListClientContent: React.FC<VenueListClientProps> = ({ initialVenues, allCities }) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { addExternalVenue } = useCart();

  // Flag to prevent URL sync on initial mount
  const [hasInitializedFromUrl, setHasInitializedFromUrl] = useState(false);

  // --- State Initialization from URL Search Params ---
  const [searchTerm, setSearchTerm] = useState<string>(() => searchParams.get("q") || "");
  const [locationSearch, setLocationSearch] = useState<string>(() => searchParams.get("location") || "");
  const [priceRange, setPriceRange] = useState<number[]>(() => [
    safeParseInt(searchParams.get("minPrice"), 0),
    safeParseInt(searchParams.get("maxPrice"), 10000)
  ]);
  const [sortOption, setSortOption] = useState<string>(() => searchParams.get("sort") || "recommended");
  const [selectedFilters, setSelectedFilters] = useState<{
    venueTypes: Set<string>;
    capacities: Set<string>;
    amenities: Set<string>;
  }>(() => ({
    venueTypes: parseSetParam(searchParams.get("types")),
    capacities: parseSetParam(searchParams.get("capacities")),
    amenities: parseSetParam(searchParams.get("amenities")), // Stores amenity *keys* (e.g., 'wifi')
  }));
  const [isExternalVenueModalOpen, setIsExternalVenueModalOpen] = useState(false);

  // --- Data Definitions ---
  const venueTypeOptions = useMemo(() => venueTypes, []);
  const capacityOptions = useMemo(() => capacities, []);
  const uniqueCities = useMemo(() => allCities, [allCities]);
  // Amenity options for the filter group - 'id' should match the 'key' from the Enum
  const amenityOptions = useMemo(() => [
       { id: "parking", label: "Free Parking" },
       { id: "catering", label: "In-house Catering" },
       { id: "wifi", label: "Free WiFi" },
       { id: "av", label: "AV Equipment" },
       { id: "accessible", label: "Wheelchair Accessible" },
       { id: "outdoor", label: "Outdoor Space" },
  ], []);

  // --- Derived State for Combobox ---
   const locationValue = useMemo(() => {
       return uniqueCities.find(c => c.label.toLowerCase() === locationSearch.toLowerCase())?.value || "";
   }, [locationSearch, uniqueCities]);

  // --- Effect to Set Initialized Flag ---
  useEffect(() => {
    setHasInitializedFromUrl(true);
  }, []);

  // --- Effect to Update URL ---
  useEffect(() => {
    if (!hasInitializedFromUrl) return;

    const currentParams = new URLSearchParams(searchParams.toString());

    const updateParam = (key: string, value: string | null | undefined) => {
      if (value && value.trim() !== "") currentParams.set(key, value); else currentParams.delete(key);
    };

    updateParam("q", searchTerm);
    updateParam("location", locationSearch);
    updateParam("minPrice", priceRange[0] !== 0 ? priceRange[0].toString() : null);
    updateParam("maxPrice", priceRange[1] !== 10000 ? priceRange[1].toString() : null);
    updateParam("sort", sortOption !== "recommended" ? sortOption : null);
    updateParam("types", selectedFilters.venueTypes.size > 0 ? Array.from(selectedFilters.venueTypes).join(',') : null);
    updateParam("capacities", selectedFilters.capacities.size > 0 ? Array.from(selectedFilters.capacities).join(',') : null);
    updateParam("amenities", selectedFilters.amenities.size > 0 ? Array.from(selectedFilters.amenities).join(',') : null); // Send amenity keys

    if (currentParams.toString() !== searchParams.toString()) {
        router.replace(`${pathname}?${currentParams.toString()}`, { scroll: false });
    }

  }, [searchTerm, locationSearch, priceRange, sortOption, selectedFilters, pathname, router, hasInitializedFromUrl, searchParams]);


  // --- Handlers ---
  const handleFilterChange = useCallback((category: keyof typeof selectedFilters, id: string) => {
      setSelectedFilters((prev) => {
        const updated = new Set(prev[category]);
        if (updated.has(id)) updated.delete(id); else updated.add(id);
        return { ...prev, [category]: updated };
      });
    },[]);

  const handleLocationChange = useCallback((value: string) => {
      const cityLabel = uniqueCities.find(c => c.value === value)?.label || "";
      setLocationSearch(cityLabel);
  }, [uniqueCities]);

  const resetFilters = useCallback(() => {
      setSearchTerm("");
      setLocationSearch("");
      setPriceRange([0, 10000]);
      setSortOption("recommended");
      setSelectedFilters({ venueTypes: new Set(), capacities: new Set(), amenities: new Set() });
  }, []);

  const handleExternalVenueConfirm = useCallback((name: string, location: string, dates: string[]) => {
      addExternalVenue(name, location, dates);
      setIsExternalVenueModalOpen(false);
      router.push('/services');
  }, [addExternalVenue, router]);


  // --- Filtered and Sorted Venues (Client-Side) ---
  // This filters the 'initialVenues' prop based on client state
  const filteredAndSortedVenues = useMemo(() => {
      const lowerCaseLocationSearch = locationSearch.toLowerCase();

      return initialVenues
        .filter(venue => {
            if (!venue || !venue.price || !venue.name || !venue.rating) return false; // Basic validation

            // 1. Search Term
            const matchesSearch = !searchTerm || venue.name.toLowerCase().includes(searchTerm.toLowerCase());
            if (!matchesSearch) return false;

            // 2. Location
            const matchesLocation = !lowerCaseLocationSearch || (venue.location?.city && venue.location.city.toLowerCase() === lowerCaseLocationSearch);
            if (!matchesLocation) return false;

            // 3. Price
            const priceInRange = venue.price.basePrice >= priceRange[0] && venue.price.basePrice <= priceRange[1];
            if (!priceInRange) return false;

            // 4. Venue Type
            const matchesType = selectedFilters.venueTypes.size === 0 || (venue.type && selectedFilters.venueTypes.has(venue.type.toLowerCase()));
            if (!matchesType) return false;

            // 5. Capacity
            let capacityLabel = "";
            if (venue.capacity != null) {
                 const capNum = venue.capacity;
                 if (capNum < 50) capacityLabel = "small";
                 else if (capNum <= 150) capacityLabel = "medium";
                 else if (capNum <= 300) capacityLabel = "large";
                 else capacityLabel = "xlarge";
            }
            const matchesCapacity = selectedFilters.capacities.size === 0 || selectedFilters.capacities.has(capacityLabel);
            if (!matchesCapacity) return false;

            // 6. Amenities (Check against populated amenity keys)
            const matchesAmenities = selectedFilters.amenities.size === 0 ||
              ( venue.amenities && Array.isArray(venue.amenities) && venue.amenities.length > 0 &&
                Array.from(selectedFilters.amenities).every( (selectedKey: string) =>
                    venue.amenities?.some( (venueAmenity: PopulatedAmenity) => venueAmenity && venueAmenity.key === selectedKey )
                )
              );
            if (!matchesAmenities) return false;

            return true;
        })
        .sort((a, b) => {
            // Sorting logic
             if (sortOption === 'price-asc') return a.price.basePrice - b.price.basePrice;
             if (sortOption === 'price-desc') return b.price.basePrice - a.price.basePrice;
             if (sortOption === 'rating') return b.rating.average - a.rating.average;
             if (sortOption === 'recommended') {
                 if (a.sponsored?.isActive && !b.sponsored?.isActive) return -1;
                 if (!a.sponsored?.isActive && b.sponsored?.isActive) return 1;
                 return b.rating.average - a.rating.average;
             }
             return 0;
        });
  }, [initialVenues, searchTerm, locationSearch, priceRange, sortOption, selectedFilters]);


  // --- JSX Rendering ---
  return (
     <main className="flex-grow pt-24 pb-16">
         <div className="container mx-auto px-4">
              <div className="flex flex-col md:flex-row gap-8">
                 {/* Sidebar */}
                 <aside className="w-full md:w-1/4 lg:w-1/5 space-y-6">
                    <div className="bg-white rounded-xl shadow-sm p-4 md:p-6 sticky top-24 border">
                        <h2 className="text-lg font-display font-semibold mb-4 flex items-center"><Filter className="w-5 h-5 mr-2" /> Filters</h2>
                         {/* Search Input */}
                         <div className="mb-5 relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                            <input type="text" placeholder="Search venue name..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full pl-10 pr-4 py-2 rounded-lg border h-10 focus:ring-primary/50 focus:border-primary/50 focus:outline-none" aria-label="Search venues by name" />
                         </div>
                         {/* Location Combobox */}
                         <div className="mb-5 relative">
                             <LocationCombobox locations={uniqueCities} value={locationValue} onChange={handleLocationChange} placeholder="Filter by city..." inputClassName="h-10 rounded-lg border-input bg-background" />
                         </div>
                          {/* Price Slider */}
                         <div className="mb-5">
                             <h3 className="font-medium mb-3 text-sm">Price Range (/day)</h3>
                             <Slider min={0} max={10000} step={100} value={priceRange} onValueChange={setPriceRange} className="mb-2" aria-label={`Price range from $${priceRange[0]} to $${priceRange[1]}`} />
                             <div className="flex justify-between text-xs text-muted-foreground"><span>${priceRange[0].toLocaleString()}</span><span>${priceRange[1].toLocaleString()}{priceRange[1] === 10000 ? '+' : ''}</span></div>
                         </div>
                         <Separator className="my-4" />
                         {/* Filter Groups */}
                        <FilterGroup title="Venue Type" options={venueTypeOptions} selected={selectedFilters.venueTypes} onChange={(id) => handleFilterChange("venueTypes", id)} idPrefix="venueTypes" />
                        <FilterGroup title="Capacity" options={capacityOptions} selected={selectedFilters.capacities} onChange={(id) => handleFilterChange("capacities", id)} idPrefix="capacities" />
                        {/* Ensure amenityOptions use the 'key' (e.g., 'wifi') as their 'id' */}
                        <FilterGroup title="Amenities" options={amenityOptions} selected={selectedFilters.amenities} onChange={(id) => handleFilterChange("amenities", id)} idPrefix="amenities" />
                         <Button variant="ghost" className="w-full mt-4 text-sm text-primary hover:underline h-auto py-1" onClick={resetFilters}>Reset all filters</Button>
                    </div>
                </aside>

                 {/* Main Content Area */}
                 <div className="w-full md:w-3/4 lg:w-4/5">
                      {/* Header */}
                    <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                        <div><h1 className="text-3xl font-display font-bold mb-1">Find the Perfect Venue</h1><p className="text-muted-foreground">Discover unique spaces for your special events</p></div>
                        <Button variant="outline" className="mt-4 md:mt-0 flex items-center shrink-0" onClick={() => setIsExternalVenueModalOpen(true)}><Building className="w-4 h-4 mr-2" />I already have a venue</Button>
                    </div>
                     {/* Sort & Count */}
                     <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-3">
                         <p className="text-sm text-muted-foreground">Showing <span className="font-medium text-foreground">{filteredAndSortedVenues.length}</span> venue{filteredAndSortedVenues.length !== 1 ? 's' : ''}</p>
                         <div className="flex items-center">
                             <label htmlFor="sort" className="text-sm mr-2 shrink-0">Sort by:</label>
                             <select id="sort" value={sortOption} onChange={(e) => setSortOption(e.target.value)} className="bg-background border border-input rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-ring">
                                <option value="recommended">Recommended</option>
                                <option value="price-asc">Price: Low to High</option>
                                <option value="price-desc">Price: High to Low</option>
                                <option value="rating">Top Rated</option>
                             </select>
                         </div>
                     </div>
                     {/* Venue Grid */}
                    {filteredAndSortedVenues.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {filteredAndSortedVenues.map((venue) => (
                                // Pass the venue object which includes populated amenities
                                <VenueCard key={venue.id || venue._id} venue={venue} />
                            ))}
                        </div>
                    ) : (
                         <div className="text-center py-16 text-muted-foreground bg-secondary/30 rounded-lg border border-dashed">
                             <p className="text-lg mb-2 font-medium">No venues match your filters.</p>
                             <p className="text-sm">Try adjusting your search criteria.</p>
                             <Button variant="link" onClick={resetFilters} className="mt-3">Reset Filters</Button>
                         </div>
                    )}
                 </div>
              </div>
             {/* External Venue Modal */}
             <ExternalVenueModal isOpen={isExternalVenueModalOpen} onClose={() => setIsExternalVenueModalOpen(false)} onConfirm={handleExternalVenueConfirm} />
         </div>
     </main>
  );
};

// --- Wrapper Component ---
const VenueListClient: React.FC<VenueListClientProps> = (props) => (
    <Suspense fallback={<div>Loading Filters...</div>}>
        <VenueListClientContent {...props} />
    </Suspense>
);

export default VenueListClient; // Export the wrapped component