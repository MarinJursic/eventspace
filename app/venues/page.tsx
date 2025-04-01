"use client";

import React, { useEffect, useMemo, useState } from "react";
import VenueCard from "@/components/ui/VenueCard";
import { Separator } from "@/components/ui/separator";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Filter, Search, Building } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/useToast";
import { useCart } from "../context/CartContext";
import { useRouter } from "next/navigation";
import ExternalVenueModal from "@/components/venue/ExternalVenueModal";
import FilterGroup from "@/components/venue/FilterGroup";

const Venues: React.FC = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const [searchTerm, setSearchTerm] = useState("");
  const [priceRange, setPriceRange] = useState<number[]>([500, 5000]);
  const [sortOption, setSortOption] = useState("recommended");
  const [selectedFilters, setSelectedFilters] = useState({
    venueTypes: new Set<string>(),
    capacities: new Set<string>(),
    amenities: new Set<string>(),
  });
  const [isExternalVenueModalOpen, setIsExternalVenueModalOpen] = useState(false);

  const [hasLoadedFilters, setHasLoadedFilters] = useState<boolean>(false);

  const [hasMounted, setHasMounted] = useState(false);

  const { toast } = useToast();
  const { addExternalVenue } = useCart();
  const router = useRouter();

  const venues = [
    {
      id: 1,
      name: "The Grand Ballroom",
      image: "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?ixlib=rb-4.0.3&auto=format&fit=crop&w=2148&q=80",
      location: "New York, NY",
      minPrice: 2500,
      maxPrice: 5000,
      rating: 4.8,
      reviewCount: 124,
      type: "ballroom",
      capacity: "large",
      capacityCount: 200,
      amenities: ["parking", "catering", "av"]
    },
    {
      id: 2,
      name: "Seaside Pavilion",
      image: "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?ixlib=rb-4.0.3&auto=format&fit=crop&w=2073&q=80",
      location: "Miami, FL",
      minPrice: 3000,
      maxPrice: 6000,
      rating: 4.9,
      reviewCount: 89,
      type: "waterfront",
      capacity: "xlarge",
      capacityCount: 350,
      amenities: ["outdoor", "wifi", "av"]
    },
    {
      id: 3,
      name: "Mountain View Lodge",
      image: "https://images.unsplash.com/photo-1724420966113-f56d03f9759d?q=80&w=3687&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      location: "Denver, CO",
      minPrice: 2000,
      maxPrice: 4500,
      rating: 4.7,
      reviewCount: 62,
      type: "garden",
      capacity: "medium",
      capacityCount: 120,
      amenities: ["outdoor", "wifi", "accessible"]
    },
    {
      id: 4,
      name: "Urban Loft Space",
      image: "https://images.unsplash.com/photo-1629140727571-9b5c6f6267b4?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80",
      location: "Chicago, IL",
      minPrice: 1800,
      maxPrice: 3500,
      rating: 4.6,
      reviewCount: 78,
      type: "rooftop",
      capacity: "small",
      capacityCount: 40,
      amenities: ["wifi", "accessible"]
    },
    {
      id: 5,
      name: "Sunset Garden Terrace",
      image: "https://images.unsplash.com/photo-1646083329522-f2dce8ed4063?q=80&w=3732&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      location: "San Diego, CA",
      minPrice: 2200,
      maxPrice: 4200,
      rating: 4.8,
      reviewCount: 92,
      type: "garden",
      capacity: "medium",
      capacityCount: 100,
      amenities: ["parking", "outdoor", "catering"]
    },
    {
      id: 6,
      name: "Historic Mansion",
      image: "https://plus.unsplash.com/premium_photo-1742493720994-3879b1fa8aac?q=80&w=3029&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      location: "Boston, MA",
      minPrice: 3500,
      maxPrice: 7000,
      rating: 4.9,
      reviewCount: 105,
      type: "historic",
      capacity: "large",
      capacityCount: 250,
      amenities: ["parking", "catering", "accessible", "av"]
    }
  ];

  const venueTypes = [
    { id: "hotel", label: "Hotel Venues" },
    { id: "garden", label: "Garden & Outdoor" },
    { id: "ballroom", label: "Ballrooms" },
    { id: "waterfront", label: "Waterfront" },
    { id: "historic", label: "Historic Venues" },
    { id: "rooftop", label: "Rooftop" },
  ];

  const capacities = [
    { id: "small", label: "Up to 50 guests" },
    { id: "medium", label: "50-150 guests" },
    { id: "large", label: "150-300 guests" },
    { id: "xlarge", label: "300+ guests" },
  ];

  const amenities = [
    { id: "parking", label: "Free Parking" },
    { id: "catering", label: "In-house Catering" },
    { id: "wifi", label: "Free WiFi" },
    { id: "av", label: "AV Equipment" },
    { id: "accessible", label: "Wheelchair Accessible" },
    { id: "outdoor", label: "Outdoor Space" },
  ];

  const handleFilterChange = (category: keyof typeof selectedFilters, id: string) => {
    setSelectedFilters((prev) => {
      const updated = new Set(prev[category]);
      updated.has(id) ? updated.delete(id) : updated.add(id);
      return { ...prev, [category]: updated };
    });
  };

  const filteredAndSortedVenues = useMemo(() => {
    return venues
      .filter((venue) => {
        const matchesSearch = venue.name.toLowerCase().includes(searchTerm.toLowerCase());
  
        const priceInRange =
          venue.maxPrice >= priceRange[0] && venue.minPrice <= priceRange[1];
  
        const matchesType =
          selectedFilters.venueTypes.size === 0 || selectedFilters.venueTypes.has(venue.type);
  
        const matchesCapacity =
          selectedFilters.capacities.size === 0 || selectedFilters.capacities.has(venue.capacity);
  
        const matchesAmenities =
          selectedFilters.amenities.size === 0 ||
          Array.from(selectedFilters.amenities).every((a) => venue.amenities.includes(a));
  
        return matchesSearch && priceInRange && matchesType && matchesCapacity && matchesAmenities;
      })
      .sort((a, b) => {
        const priceA = a.minPrice;
        const priceB = b.minPrice;
        if (sortOption === "price-asc") return priceA - priceB;
        if (sortOption === "price-desc") return priceB - priceA;
        if (sortOption === "rating") return b.rating - a.rating;
        return 0;
      });
  }, [venues, searchTerm, priceRange, sortOption, selectedFilters]);

  const handleExternalVenueAdd = (venueName: string, location: string, selectedDates: string[]) => {
    setIsExternalVenueModalOpen(false);
    addExternalVenue(venueName, location, selectedDates);
    toast({
      title: "External venue added",
      description: `${venueName} has been added to your booking for ${selectedDates.length} day(s)`,
    });
    router.push("/cart");
  };

  // On filter change, save the filter data to localStorage
  useEffect(() => {
    if (!hasLoadedFilters) return;
  
    localStorage.setItem(
      "venueFilters",
      JSON.stringify({
        venueTypes: Array.from(selectedFilters.venueTypes),
        capacities: Array.from(selectedFilters.capacities),
        amenities: Array.from(selectedFilters.amenities),
        searchTerm,
        priceRange,
        sortOption,
      })
    );
  }, [selectedFilters, searchTerm, priceRange, sortOption, hasLoadedFilters]);


  // On inital render, load saved filters from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("venueFilters");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
  
        setSelectedFilters({
          venueTypes: new Set(parsed.venueTypes || []),
          capacities: new Set(parsed.capacities || []),
          amenities: new Set(parsed.amenities || []),
        });
  
        if (parsed.searchTerm) setSearchTerm(parsed.searchTerm);
        if (parsed.priceRange && parsed.priceRange.length === 2) setPriceRange(parsed.priceRange);
        if (parsed.sortOption) setSortOption(parsed.sortOption);
  
      } catch (err) {
        console.error("Failed to parse venueFilters from localStorage", err);
      }
    }
    setHasLoadedFilters(true);
  }, []);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  if (!hasMounted) {
    return (
      <div className="min-h-screen flex items-center justify-center text-muted-foreground">
        <div className="animate-pulse text-center space-y-2">
          <div className="h-6 bg-muted w-48 mx-auto rounded" />
          <div className="h-4 bg-muted w-64 mx-auto rounded" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-grow pt-24 pb-16">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row gap-8">
            <aside className="w-full md:w-1/4 lg:w-1/5 space-y-6">
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h2 className="text-lg font-display font-semibold mb-4 flex items-center">
                  <Filter className="w-5 h-5 mr-2" /> Filters
                </h2>

                <div className="mb-6 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                  <input
                    type="text"
                    placeholder="Search venues..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 rounded-lg border"
                  />
                </div>

                <div className="mb-6">
                  <h3 className="font-medium mb-3">Price Range</h3>
                  <Slider min={0} max={10000} step={100} value={priceRange} onValueChange={setPriceRange} />
                  <div className="flex justify-between text-sm">
                    <span>${priceRange[0]}</span>
                    <span>${priceRange[1]}+</span>
                  </div>
                </div>

                <Separator className="my-5" />

                <FilterGroup
                  title="Venue Type"
                  options={venueTypes}
                  selected={selectedFilters.venueTypes}
                  onChange={(id) => handleFilterChange("venueTypes", id)}
                  idPrefix="venueTypes"
                />
                <FilterGroup
                  title="Capacity"
                  options={capacities}
                  selected={selectedFilters.capacities}
                  onChange={(id) => handleFilterChange("capacities", id)}
                  idPrefix="capacities"
                />
                <FilterGroup
                  title="Amenities"
                  options={amenities}
                  selected={selectedFilters.amenities}
                  onChange={(id) => handleFilterChange("amenities", id)}
                  idPrefix="amenities"
                />
              </div>
              <Button
                variant="ghost"
                className="w-full mt-4 text-sm text-primary hover:underline"
                onClick={() => {
                  setSelectedFilters({
                    venueTypes: new Set(),
                    capacities: new Set(),
                    amenities: new Set(),
                  });
                  setSearchTerm("");
                  setPriceRange([500, 5000]);
                  setSortOption("recommended");
                }}
              >
                Reset all filters
              </Button>
            </aside>

            <div className="w-full md:w-3/4 lg:w-4/5">
              <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between">
                <div>
                  <h1 className="text-3xl font-display font-bold mb-2">Find the Perfect Venue</h1>
                  <p className="text-muted-foreground">Discover and book unique venues for your special events</p>
                </div>
                <Button
                  variant="outline"
                  className="mt-4 md:mt-0 flex items-center"
                  onClick={() => setIsExternalVenueModalOpen(true)}
                >
                  <Building className="w-4 h-4 mr-2" />I already have a venue
                </Button>
              </div>

              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
                <p className="text-muted-foreground mb-3 sm:mb-0">
                  Showing <span className="font-medium text-foreground">{filteredAndSortedVenues.length}</span> venues
                </p>
                <div className="flex items-center">
                  <label htmlFor="sort" className="text-sm mr-2">
                    Sort by:
                  </label>
                  <select
                    id="sort"
                    value={sortOption}
                    onChange={(e) => setSortOption(e.target.value)}
                    className="bg-background border rounded-lg px-3 py-1.5 text-sm"
                  >
                    <option value="recommended">Recommended</option>
                    <option value="price-asc">Price: Low to High</option>
                    <option value="price-desc">Price: High to Low</option>
                    <option value="rating">Top Rated</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredAndSortedVenues.map((venue) => (
                  <VenueCard key={venue.id} {...venue} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>

      <ExternalVenueModal
        isOpen={isExternalVenueModalOpen}
        onClose={() => setIsExternalVenueModalOpen(false)}
        onConfirm={handleExternalVenueAdd}
      />
    </div>
  );
};

export default Venues;
