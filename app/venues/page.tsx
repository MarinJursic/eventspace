"use client";

import React, { useEffect, useState } from "react";
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

const Venues: React.FC = () => {
  // Scroll to top on page load
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const [priceRange, setPriceRange] = useState<number[]>([500, 5000]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isExternalVenueModalOpen, setIsExternalVenueModalOpen] =
    useState(false);
  const { toast } = useToast();
  const { addExternalVenue } = useCart();
  const router = useRouter();

  // Mock venue data
  const venues = [
    {
      id: 1,
      name: "The Grand Ballroom",
      image:
        "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?ixlib=rb-4.0.3&auto=format&fit=crop&w=2148&q=80",
      location: "New York, NY",
      price: "$2,500 - $5,000",
      rating: 4.8,
      reviewCount: 124,
    },
    {
      id: 2,
      name: "Seaside Pavilion",
      image:
        "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?ixlib=rb-4.0.3&auto=format&fit=crop&w=2073&q=80",
      location: "Miami, FL",
      price: "$3,000 - $6,000",
      rating: 4.9,
      reviewCount: 89,
    },
    {
      id: 3,
      name: "Mountain View Lodge",
      image:
        "https://images.unsplash.com/photo-1724420966113-f56d03f9759d?q=80&w=3687&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      location: "Denver, CO",
      price: "$2,000 - $4,500",
      rating: 4.7,
      reviewCount: 62,
    },
    {
      id: 4,
      name: "Urban Loft Space",
      image:
        "https://images.unsplash.com/photo-1629140727571-9b5c6f6267b4?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80",
      location: "Chicago, IL",
      price: "$1,800 - $3,500",
      rating: 4.6,
      reviewCount: 78,
    },
    {
      id: 5,
      name: "Sunset Garden Terrace",
      image:
        "https://images.unsplash.com/photo-1646083329522-f2dce8ed4063?q=80&w=3732&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      location: "San Diego, CA",
      price: "$2,200 - $4,200",
      rating: 4.8,
      reviewCount: 92,
    },
    {
      id: 6,
      name: "Historic Mansion",
      image:
        "https://plus.unsplash.com/premium_photo-1742493720994-3879b1fa8aac?q=80&w=3029&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      location: "Boston, MA",
      price: "$3,500 - $7,000",
      rating: 4.9,
      reviewCount: 105,
    },
  ];

  // Filter options
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

  const handleExternalVenueAdd = (
    venueName: string,
    location: string,
    selectedDates: string[]
  ) => {
    setIsExternalVenueModalOpen(false);
    addExternalVenue(venueName, location, selectedDates);
    toast({
      title: "External venue added",
      description: `${venueName} has been added to your booking for ${selectedDates.length} day(s)`,
    });
    router.push("/cart");
  };

  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-grow pt-24 pb-16">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row gap-8">
            {/* Filters Sidebar */}
            <aside className="w-full md:w-1/4 lg:w-1/5 space-y-6">
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h2 className="text-lg font-display font-semibold mb-4 flex items-center">
                  <Filter className="w-5 h-5 mr-2" />
                  Filters
                </h2>

                {/* Search */}
                <div className="mb-6">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                    <input
                      type="text"
                      placeholder="Search venues..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 rounded-lg border border-input focus:outline-none focus:ring-2 focus:ring-primary/10 focus:border-primary/30"
                    />
                  </div>
                </div>

                {/* Price Range */}
                <div className="mb-6">
                  <h3 className="font-medium mb-3">Price Range</h3>
                  <Slider
                    defaultValue={[500, 5000]}
                    min={0}
                    max={10000}
                    step={100}
                    value={priceRange}
                    onValueChange={setPriceRange}
                    className="mb-2"
                  />
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>${priceRange[0]}</span>
                    <span>${priceRange[1]}+</span>
                  </div>
                </div>

                <Separator className="my-5" />

                {/* Venue Type */}
                <div className="mb-6">
                  <h3 className="font-medium mb-3">Venue Type</h3>
                  <div className="space-y-2">
                    {venueTypes.map((type) => (
                      <div
                        key={type.id}
                        className="flex items-center space-x-2"
                      >
                        <Checkbox id={`type-${type.id}`} />
                        <Label
                          htmlFor={`type-${type.id}`}
                          className="text-sm font-normal cursor-pointer"
                        >
                          {type.label}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>

                <Separator className="my-5" />

                {/* Capacity */}
                <div className="mb-6">
                  <h3 className="font-medium mb-3">Capacity</h3>
                  <div className="space-y-2">
                    {capacities.map((capacity) => (
                      <div
                        key={capacity.id}
                        className="flex items-center space-x-2"
                      >
                        <Checkbox id={`capacity-${capacity.id}`} />
                        <Label
                          htmlFor={`capacity-${capacity.id}`}
                          className="text-sm font-normal cursor-pointer"
                        >
                          {capacity.label}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>

                <Separator className="my-5" />

                {/* Amenities */}
                <div>
                  <h3 className="font-medium mb-3">Amenities</h3>
                  <div className="space-y-2">
                    {amenities.map((amenity) => (
                      <div
                        key={amenity.id}
                        className="flex items-center space-x-2"
                      >
                        <Checkbox id={`amenity-${amenity.id}`} />
                        <Label
                          htmlFor={`amenity-${amenity.id}`}
                          className="text-sm font-normal cursor-pointer"
                        >
                          {amenity.label}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </aside>

            {/* Main Content */}
            <div className="w-full md:w-3/4 lg:w-4/5">
              {/* Page Header */}
              <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between">
                <div>
                  <h1 className="text-3xl font-display font-bold mb-2">
                    Find the Perfect Venue
                  </h1>
                  <p className="text-muted-foreground">
                    Discover and book unique venues for your special events
                  </p>
                </div>

                {/* External Venue Button */}
                <Button
                  variant="outline"
                  className="mt-4 md:mt-0 flex items-center"
                  onClick={() => setIsExternalVenueModalOpen(true)}
                >
                  <Building className="w-4 h-4 mr-2" />I already have a venue
                </Button>
              </div>

              {/* Results Count & Sort */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
                <p className="text-muted-foreground mb-3 sm:mb-0">
                  Showing{" "}
                  <span className="font-medium text-foreground">
                    {venues.length}
                  </span>{" "}
                  venues
                </p>
                <div className="flex items-center">
                  <label htmlFor="sort" className="text-sm mr-2">
                    Sort by:
                  </label>
                  <select
                    id="sort"
                    className="bg-background border border-input rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/10 focus:border-primary/30"
                  >
                    <option value="recommended">Recommended</option>
                    <option value="price-asc">Price: Low to High</option>
                    <option value="price-desc">Price: High to Low</option>
                    <option value="rating">Top Rated</option>
                  </select>
                </div>
              </div>

              {/* Venues Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {venues.map((venue) => (
                  <VenueCard
                    key={venue.id}
                    id={venue.id}
                    name={venue.name}
                    image={venue.image}
                    location={venue.location}
                    price={venue.price}
                    rating={venue.rating}
                    reviewCount={venue.reviewCount}
                  />
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
