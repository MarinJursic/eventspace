// src/components/pages/Services.tsx (or wherever your component lives)

"use client";

import React, { useEffect, useMemo, useState, useCallback } from "react";
import ServiceCard from "@/components/ui/ServiceCard";
import { Separator } from "@/components/ui/separator";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Filter, Search, Calendar, Star, Building } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useCart } from "../context/CartContext"; // Assuming path is correct
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { mockServices, MockService } from "@/lib/mockServices"; // Import mock data and type

const Services: React.FC = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // --- State ---
  const [priceRange, setPriceRange] = useState<number[]>([0, 5000]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<Set<string>>(new Set());
  const [minRating, setMinRating] = useState<number | null>(null);
  const [sortOption, setSortOption] = useState("recommended");

  const { hasVenue, selectedDates, isMultiDay } = useCart();

  // --- Dynamically Generate Filter Options ---
  const serviceCategories = useMemo(() => {
    const categories = new Set<string>();
    mockServices.forEach(service => {
      if (service.type) { categories.add(service.type); }
    });
    return Array.from(categories).sort().map(cat => ({ id: cat, label: cat }));
  }, []); // Removed mockServices dependency as it won't change at runtime typically

  // --- Filtering and Sorting Logic ---
  const filteredAndSortedServices = useMemo(() => {
    // 1. Filter
    const initiallyFilteredServices = mockServices.filter((service) => {
      // Search Term Filter
      const lowerSearchTerm = searchTerm.toLowerCase();
      const matchesSearch =
        !searchTerm ||
        service.name.toLowerCase().includes(lowerSearchTerm) ||
        (service.description && service.description.toLowerCase().includes(lowerSearchTerm)) ||
        (service.features && service.features.some(f => f.toLowerCase().includes(lowerSearchTerm)));
      if (!matchesSearch) return false;

      // Price Range Filter
      const price = service.price.basePrice;
      const matchesPrice = price >= priceRange[0] && price <= priceRange[1];
      if (!matchesPrice) return false;

      // Category Filter
      const matchesCategory =
        selectedCategories.size === 0 ||
        (service.type && selectedCategories.has(service.type));
      if (!matchesCategory) return false;

      // Rating Filter
      const rating = service.rating.average;
      const matchesRating = minRating === null || rating >= minRating;
      if (!matchesRating) return false;

      // Optional: Status Filter
      // const matchesStatus = service.status === 'active';
      // if (!matchesStatus) return false;

      return true;
    });

    // 2. Segregate
    const sponsoredFiltered = initiallyFilteredServices.filter(s => s.sponsored.isActive);
    const nonSponsoredFiltered = initiallyFilteredServices.filter(s => !s.sponsored.isActive);

    // 3. Sort Logic Function (applied independently to each group)
    const sortLogic = (a: MockService, b: MockService) => {
        switch (sortOption) {
            case "price-asc": return a.price.basePrice - b.price.basePrice;
            case "price-desc": return b.price.basePrice - a.price.basePrice;
            case "rating": return b.rating.average - a.rating.average;
            case "recommended": // For non-sponsored, 'recommended' might mean highest rating
            default: return b.rating.average - a.rating.average; // Default sort by rating desc
        }
    };

    // 4. Sort Each Group Independently
    const sortedSponsored = sponsoredFiltered.sort(sortLogic);
    const sortedNonSponsored = nonSponsoredFiltered.sort(sortLogic);

    // 5. Combine (Sponsored first)
    return [...sortedSponsored, ...sortedNonSponsored];

  }, [searchTerm, priceRange, selectedCategories, minRating, sortOption]); // Removed mockServices dependency

  // --- Filter Handlers ---
  const toggleCategory = useCallback((category: string) => {
    setSelectedCategories((prev) => {
      const updated = new Set(prev);
      if (updated.has(category)) { updated.delete(category); } else { updated.add(category); }
      return updated;
    });
  }, []);

  const toggleRating = useCallback((rating: number) => {
    setMinRating((prev) => (prev === rating ? null : rating));
  }, []);

  // --- Reset Handler ---
  const resetFilters = useCallback(() => {
      setPriceRange([0, 5000]);
      setSearchTerm("");
      setSelectedCategories(new Set());
      setMinRating(null);
      setSortOption("recommended"); // Reset sort to default
  }, []);

  // Recommended services (still useful for the dedicated section if needed)
  // Note: This doesn't strictly need useMemo if mockServices is static
  const recommendedServices = mockServices.filter(
    (service) => service.sponsored.isActive
  );

  // Helper to format price
  const formatPrice = (service: MockService): string => {
      const base = `$${service.price.basePrice.toLocaleString()}`;
      switch(service.price.model) {
          case 'hour': return `${base} / hour`;
          case 'day': return `${base} / event day`;
          case 'week': return `${base} / week`;
          default: return `From ${base}`;
      }
  };


  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-grow pt-24 pb-16">
        <div className="container mx-auto px-4">
          {/* --- Booking Alert --- */}
          {hasVenue && (
            <Alert className="mb-6 border-primary/30 bg-primary/5">
              <Calendar className="h-4 w-4 text-primary" />
              <AlertTitle className="font-semibold text-primary/90">Booking in progress</AlertTitle>
              <AlertDescription className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <span>
                  You're adding services for your event on{" "}
                  {isMultiDay
                    ? `${selectedDates[0]} to ${selectedDates[selectedDates.length - 1]}`
                    : selectedDates[0]}
                  .
                </span>
                <Button asChild size="sm" variant="outline">
                  <Link href="/cart">View Booking Details</Link>
                </Button>
              </AlertDescription>
            </Alert>
          )}

          {/* --- Recommended Services Section (Optional) --- */}
          {/* This section can stay if you want a separate highlight,
              or be removed since sponsored are now always at the top of the main list */}
          {hasVenue && recommendedServices.length > 0 && (
            <div className="mb-10">
               {/* ... Recommended section content ... */}
               {/* Consider removing this section if the main list's prioritization is enough */}
               {/* <Separator className="my-8" /> */}
            </div>
           )}

          {/* --- Main Content: Filters + Results --- */}
          <div className="flex flex-col md:flex-row gap-8">
            {/* --- Sidebar --- */}
            <aside className="w-full md:w-1/4 lg:w-1/5 space-y-6">
              <div className="bg-white rounded-xl shadow-sm p-6 sticky top-24">
                 {/* ... Filter Title ... */}
                 <h2 className="text-lg font-display font-semibold mb-4 flex items-center">
                  <Filter className="w-5 h-5 mr-2" /> Filter Services
                 </h2>

                {/* ... Search Input ... */}
                <div className="mb-6 relative">
                   {/* ... search input JSX ... */}
                   <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                   <input type="text" placeholder="Search services..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full pl-10 pr-4 py-2 rounded-lg border border-input focus:outline-none focus:ring-1 focus:ring-ring focus:border-ring h-10" aria-label="Search services by name, description, or feature"/>
                </div>

                {/* ... Price Range Slider ... */}
                <div className="mb-6">
                   {/* ... price slider JSX ... */}
                   <h3 className="font-medium text-sm mb-2">Price Range</h3>
                   <Slider min={0} max={5000} step={50} value={priceRange} onValueChange={setPriceRange} className="mb-2" aria-label={`Price range from $${priceRange[0]} to $${priceRange[1]}`}/>
                   <div className="flex justify-between text-xs text-muted-foreground"><span>${priceRange[0]}</span><span>${priceRange[1]}{priceRange[1] === 5000 ? '+' : ''}</span></div>
                </div>

                <Separator className="my-5" />

                {/* ... Service Category Filter ... */}
                 {serviceCategories.length > 0 && (
                     <div className="mb-6">
                         <h3 className="font-medium text-sm mb-2">Service Type</h3>
                         <div className="space-y-1.5 max-h-48 overflow-y-auto pr-2">
                             {serviceCategories.map((category) => (
                                 <div key={category.id} className="flex items-center space-x-2">
                                     <Checkbox id={`category-${category.id}`} checked={selectedCategories.has(category.id)} onCheckedChange={() => toggleCategory(category.id)} />
                                     <Label htmlFor={`category-${category.id}`} className="text-sm font-normal cursor-pointer truncate">{category.label}</Label>
                                 </div>
                             ))}
                         </div>
                     </div>
                 )}

                <Separator className="my-5" />

                {/* ... Minimum Rating Filter ... */}
                 <div>
                     <h3 className="font-medium text-sm mb-2">Minimum Rating</h3>
                     <div className="space-y-1.5">
                         {[5, 4, 3].map((rating) => (
                             <div key={rating} className="flex items-center space-x-2">
                                 <Checkbox id={`rating-${rating}`} checked={minRating === rating} onCheckedChange={() => toggleRating(rating)}/>
                                 <Label htmlFor={`rating-${rating}`} className="text-sm font-normal cursor-pointer">
                                     <div className="flex items-center">{rating}{' '}<Star className="h-3.5 w-3.5 ml-1 text-yellow-400 fill-yellow-400" /><span className="ml-1 text-muted-foreground">& up</span></div>
                                 </Label>
                             </div>
                         ))}
                     </div>
                 </div>

                <Separator className="my-5" />

                {/* ... Reset Button ... */}
                 <Button variant="ghost" onClick={resetFilters} className="w-full text-sm text-primary hover:underline h-auto py-1"> Reset All Filters </Button>
              </div>
            </aside>

            {/* --- Results Area --- */}
            <div className="w-full md:w-3/4 lg:w-4/5">
              {/* ... Title ... */}
              <div className="mb-6"> <h1 className="text-3xl font-display font-bold mb-1"> Browse Event Services </h1> <p className="text-muted-foreground"> Find trusted professionals to bring your event to life. </p> </div>

              {/* Sort & Count - Use filteredAndSortedServices */}
               <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-3">
                  <p className="text-sm text-muted-foreground">
                     Showing <span className="font-medium text-foreground">{filteredAndSortedServices.length}</span> service{filteredAndSortedServices.length !== 1 ? 's' : ''}
                  </p>
                 {/* ... Sort dropdown ... */}
                  <div className="flex items-center">
                      <label htmlFor="sort" className="text-sm mr-2 shrink-0"> Sort by: </label>
                      <select id="sort" value={sortOption} onChange={(e) => setSortOption(e.target.value)} className="bg-background border border-input rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-ring">
                          <option value="recommended">Recommended</option> {/* This now sorts by rating within groups */}
                          <option value="price-asc">Price: Low to High</option>
                          <option value="price-desc">Price: High to Low</option>
                          <option value="rating">Top Rated</option>
                      </select>
                  </div>
               </div>

              {/* Service Grid or No Results Message - Use filteredAndSortedServices */}
              {filteredAndSortedServices.length === 0 ? (
                  <div className="text-center py-16 bg-secondary/30 rounded-lg border border-dashed">
                      {/* ... No results message ... */}
                      <h3 className="text-lg font-medium mb-2"> No services match your filters </h3>
                      <p className="text-muted-foreground text-sm mb-4"> Try adjusting your filter criteria or view all services. </p>
                      <Button variant="outline" onClick={resetFilters}> Reset All Filters </Button>
                  </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {/* Map over the combined & sorted list */}
                    {filteredAndSortedServices.map((service) => (
                      <ServiceCard
                        key={service.id}
                        id={service.id}
                        name={service.name}
                        image={service.images[0]?.url || "https://via.placeholder.com/300x200?text=No+Image"}
                        category={service.type || "Service"}
                        price={formatPrice(service)}
                        rating={service.rating.average}
                        reviewCount={service.rating.count}
                      >
                        {/* Conditionally render sponsored badge */}
                        {service.sponsored.isActive && (
                            <Badge
                              variant="secondary"
                              // Add z-10 here:
                              className="absolute top-3 right-3 z-10 bg-gradient-to-r from-yellow-400 to-orange-500 text-white border-none px-2 py-0.5 text-xs"
                            >
                                Sponsored
                            </Badge>
                        )}
                      </ServiceCard>
                    ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Services;