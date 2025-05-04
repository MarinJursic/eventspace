// components/service/ServiceListClient.tsx
"use client";

import React, {
  useEffect,
  useMemo,
  useState,
  useCallback,
  Suspense,
} from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";

// --- Import UI Components ---
import ServiceCard from "@/components/ui/ServiceCard";
import { Separator } from "@/components/ui/separator";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Filter, Search, Calendar, Star } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

// --- Import Context and Utils ---
import { useCart } from "@/app/context/CartContext";

// --- Import Types ---
import { SerializedService } from "./ServiceDetailClient";
import { LocationCombobox } from "@/components/ui/LocationCombobox";

// --- Component Props ---
interface ServiceListClientProps {
  initialServices: SerializedService[];
  allServiceTypes: { id: string; label: string }[];
  allServiceCities: { value: string; label: string }[];
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
  // Store keys/ids consistently (e.g., lowercase)
  const items = str
    .split(",")
    .map((item) => item.trim().toLowerCase())
    .filter((item) => item !== "");
  return new Set<string>(items);
};

// Helper to format price (can be moved to utils)
const formatPrice = (service: SerializedService): string => {
  // Check if price exists before formatting
  if (!service || !service.price) return "N/A";
  const base = `$${service.price.basePrice.toLocaleString()}`;
  switch (service.price.model) {
    case "hour":
      return `${base} / hour`;
    case "day":
      return `${base} / event day`;
    case "week":
      return `${base} / week`;
    default:
      return `From ${base}`; // Or just base
  }
};

// --- Client Component Content ---
const ServiceListClientContent: React.FC<ServiceListClientProps> = ({
  initialServices = [],
  allServiceTypes = [],
  allServiceCities = [],
}) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { hasVenue, selectedDates, isMultiDay } = useCart(); // Get cart info

  // Flag for initial URL sync
  const [hasInitializedFromUrl, setHasInitializedFromUrl] = useState(false);

  // --- State Initialization from URL ---
  const [searchTerm, setSearchTerm] = useState<string>(
    () => searchParams.get("q") || ""
  );
  const [locationSearch, setLocationSearch] = useState<string>(
    () => searchParams.get("location") || ""
  );
  const [priceRange, setPriceRange] = useState<number[]>(() => [
    safeParseInt(searchParams.get("minPrice"), 0),
    safeParseInt(searchParams.get("maxPrice"), 5000), // Default service price max
  ]);
  // State stores lowercase type IDs
  const [selectedCategories, setSelectedCategories] = useState<Set<string>>(
    () => parseSetParam(searchParams.get("types"))
  );
  const [minRating, setMinRating] = useState<number | null>(
    () => safeParseInt(searchParams.get("minRating"), 0) || null
  );
  const [sortOption, setSortOption] = useState<string>(
    () => searchParams.get("sort") || "recommended"
  );

  // --- Data Definitions ---
  // Service types for filtering, using data passed from server
  const serviceTypeOptions = useMemo(() => allServiceTypes, [allServiceTypes]);
  const uniqueCities = useMemo(() => allServiceCities, [allServiceCities]);
  // Rating options are static
  const ratingOptions = useMemo(
    () => [
      { id: 5, label: "5 Stars" },
      { id: 4, label: "4 Stars & Up" },
      { id: 3, label: "3 Stars & Up" },
    ],
    []
  );

  const locationValue = useMemo(() => {
    return (
      uniqueCities.find(
        (c) => c.label.toLowerCase() === locationSearch.toLowerCase()
      )?.value || ""
    );
  }, [locationSearch, uniqueCities]);

  // --- Effect to Set Initialized Flag ---
  useEffect(() => {
    setHasInitializedFromUrl(true);
  }, []);

  // --- Effect to Update URL ---
  useEffect(() => {
    if (!hasInitializedFromUrl) return;

    const currentParams = new URLSearchParams(searchParams.toString());
    const updateParam = (
      key: string,
      value: string | number | null | undefined
    ) => {
      const stringValue = value?.toString() ?? null; // Convert number to string
      if (stringValue && stringValue.trim() !== "")
        currentParams.set(key, stringValue);
      else currentParams.delete(key);
    };

    updateParam("q", searchTerm);
    updateParam("minPrice", priceRange[0] !== 0 ? priceRange[0] : null);
    updateParam("maxPrice", priceRange[1] !== 5000 ? priceRange[1] : null); // Use service default max
    updateParam("sort", sortOption !== "recommended" ? sortOption : null);
    // Join the lowercase keys for the URL
    updateParam(
      "types",
      selectedCategories.size > 0
        ? Array.from(selectedCategories).join(",")
        : null
    );
    updateParam("minRating", minRating !== null ? minRating : null);

    if (currentParams.toString() !== searchParams.toString()) {
      router.replace(`${pathname}?${currentParams.toString()}`, {
        scroll: false,
      });
    }
    // Update dependencies to include minRating
  }, [
    searchTerm,
    locationSearch,
    priceRange,
    sortOption,
    selectedCategories,
    minRating,
    pathname,
    router,
    hasInitializedFromUrl,
    searchParams,
  ]);

  // --- Handlers ---
  const toggleCategory = useCallback((categoryId: string) => {
    // categoryId is lowercase key
    setSelectedCategories((prev) => {
      const updated = new Set(prev);
      if (updated.has(categoryId)) updated.delete(categoryId);
      else updated.add(categoryId);
      return updated;
    });
  }, []);

  const toggleRating = useCallback((rating: number) => {
    setMinRating((prev) => (prev === rating ? null : rating)); // Toggle based on the clicked rating value
  }, []);

  const handleLocationChange = useCallback(
    (value: string) => {
      const cityLabel =
        uniqueCities.find((c) => c.value === value)?.label || "";
      setLocationSearch(cityLabel);
    },
    [uniqueCities]
  );

  const resetFilters = useCallback(() => {
    setSearchTerm("");
    setPriceRange([0, 5000]); // Reset to service defaults
    setSelectedCategories(new Set());
    setMinRating(null);
    setSortOption("recommended");
  }, []);

  // --- Filtered and Sorted Services (Client-Side) ---
  const filteredAndSortedServices = useMemo(() => {
    const lowerCaseLocationSearch = locationSearch.toLowerCase();

    return initialServices
      .filter((service) => {
        // Basic validation
        if (!service?.price || !service.name || !service.rating) return false;

        const lowerSearchTerm = searchTerm.toLowerCase();
        const matchesSearch =
          !searchTerm ||
          service.name.toLowerCase().includes(lowerSearchTerm) ||
          (service.description &&
            service.description.toLowerCase().includes(lowerSearchTerm)) ||
          (service.features &&
            service.features.some((f) =>
              f.toLowerCase().includes(lowerSearchTerm)
            ));
        if (!matchesSearch) return false;

        const matchesLocation =
          !lowerCaseLocationSearch ||
          (service.location?.city &&
            service.location.city.toLowerCase() === lowerCaseLocationSearch);
        if (!matchesLocation) return false;

        const price = service.price.basePrice;
        const matchesPrice = price >= priceRange[0] && price <= priceRange[1];
        if (!matchesPrice) return false;

        const serviceTypeLower = service.type?.toLowerCase(); // Handle potentially undefined type
        const matchesCategory =
          selectedCategories.size === 0 ||
          (serviceTypeLower && selectedCategories.has(serviceTypeLower));
        if (!matchesCategory) return false;

        const rating = service.rating.average;
        const matchesRating = minRating === null || rating >= minRating;
        if (!matchesRating) return false;

        return true;
      })
      .sort((a, b) => {
        if (sortOption === "price-asc")
          return a.price.basePrice - b.price.basePrice;
        if (sortOption === "price-desc")
          return b.price.basePrice - a.price.basePrice;
        if (sortOption === "rating") return b.rating.average - a.rating.average;
        if (sortOption === "recommended") {
          if (a.sponsored?.isActive && !b.sponsored?.isActive) return -1;
          if (!a.sponsored?.isActive && b.sponsored?.isActive) return 1;
          return b.rating.average - a.rating.average;
        }
        return 0;
      });
  }, [
    initialServices,
    locationSearch,
    searchTerm,
    priceRange,
    selectedCategories,
    minRating,
    sortOption,
  ]);

  // --- JSX Rendering ---
  return (
    <main className="flex-grow pt-24 pb-16">
      <div className="container mx-auto px-4">
        {/* Booking Alert */}
        {hasVenue && (
          <Alert className="mb-6 border-primary/30 bg-primary/5">
            <Calendar className="h-4 w-4 text-primary" />
            <AlertTitle className="font-semibold text-primary/90">
              Booking in progress
            </AlertTitle>
            <AlertDescription className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <span>
                Adding services for your event on{" "}
                {isMultiDay
                  ? `${selectedDates[0]} to ${selectedDates[selectedDates.length - 1]}`
                  : selectedDates[0]}
                .
              </span>
              <Button asChild size="sm" variant="outline">
                <Link href="/cart">View Booking</Link>
              </Button>
            </AlertDescription>
          </Alert>
        )}

        {/* Main Content */}
        <div className="flex flex-col md:flex-row gap-8">
          {/* Sidebar */}
          <aside className="w-full md:w-1/4 lg:w-1/5 space-y-6">
            <div className="bg-white rounded-xl shadow-sm p-4 md:p-6 sticky top-24 border">
              <h2 className="text-lg font-display font-semibold mb-4 flex items-center">
                <Filter className="w-5 h-5 mr-2" /> Filter Services
              </h2>
              {/* Search */}
              <div className="mb-5 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search services..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 rounded-lg border h-10 focus:ring-primary/50 focus:border-primary/50 focus:outline-none"
                  aria-label="Search services"
                />
              </div>
              {/* Location Combobox */}
              <div className="mb-5 relative">
                <LocationCombobox
                  locations={uniqueCities} // Use cities from props
                  value={locationValue} // Derived from locationSearch state
                  onChange={handleLocationChange} // Use handler
                  placeholder="Filter by city..."
                  inputClassName="h-10 rounded-lg border-input bg-background"
                />
              </div>
              {/* Price */}
              <div className="mb-5">
                <h3 className="font-medium text-sm mb-2">Price Range</h3>
                <Slider
                  min={0}
                  max={5000}
                  step={50}
                  value={priceRange}
                  onValueChange={setPriceRange}
                  className="mb-2"
                  aria-label={`Price range from $${priceRange[0]} to $${priceRange[1]}`}
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>${priceRange[0].toLocaleString()}</span>
                  <span>
                    ${priceRange[1].toLocaleString()}
                    {priceRange[1] === 5000 ? "+" : ""}
                  </span>
                </div>
              </div>
              <Separator className="my-4" />
              {/* Service Type Filter */}
              {serviceTypeOptions.length > 0 && (
                <div className="mb-5">
                  <h3 className="font-medium text-sm mb-2">Service Type</h3>
                  <div className="space-y-1.5 max-h-48 overflow-y-auto pr-2">
                    {serviceTypeOptions.map((category) => (
                      <div
                        key={category.id}
                        className="flex items-center space-x-2"
                      >
                        {/* Check against lowercase id */}
                        <Checkbox
                          id={`category-${category.id}`}
                          checked={selectedCategories.has(category.id)}
                          onCheckedChange={() => toggleCategory(category.id)}
                        />
                        <Label
                          htmlFor={`category-${category.id}`}
                          className="text-sm font-normal cursor-pointer truncate"
                        >
                          {category.label}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              <Separator className="my-4" />
              {/* Rating Filter */}
              <div>
                <h3 className="font-medium text-sm mb-2">Minimum Rating</h3>
                <div className="space-y-1.5">
                  {/* Use ratingOptions for mapping */}
                  {ratingOptions.map((option) => (
                    <div
                      key={option.id}
                      className="flex items-center space-x-2"
                    >
                      {/* Checkbox value is the rating number (option.id) */}
                      <Checkbox
                        id={`rating-${option.id}`}
                        checked={minRating === option.id}
                        onCheckedChange={() => toggleRating(option.id)}
                      />
                      <Label
                        htmlFor={`rating-${option.id}`}
                        className="text-sm font-normal cursor-pointer"
                      >
                        <div className="flex items-center">
                          {option.id} {/* Display the number */}
                          <Star className="h-3.5 w-3.5 ml-1 text-yellow-400 fill-yellow-400" />
                          <span className="ml-1 text-muted-foreground">
                            & up
                          </span>
                        </div>
                      </Label>
                    </div>
                  ))}
                </div>
              </div>
              <Separator className="my-4" />
              {/* Reset Button */}
              <Button
                variant="ghost"
                className="w-full mt-4 text-sm text-primary hover:underline h-auto py-1"
                onClick={resetFilters}
              >
                Reset all filters
              </Button>
            </div>
          </aside>

          {/* Results Area */}
          <div className="w-full md:w-3/4 lg:w-4/5">
            {/* Header */}
            <div className="mb-6">
              {" "}
              <h1 className="text-3xl font-display font-bold mb-1">
                {" "}
                Browse Event Services{" "}
              </h1>{" "}
              <p className="text-muted-foreground">
                {" "}
                Find trusted professionals to bring your event to life.{" "}
              </p>{" "}
            </div>
            {/* Sort & Count */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-3">
              <p className="text-sm text-muted-foreground">
                Showing{" "}
                <span className="font-medium text-foreground">
                  {filteredAndSortedServices.length}
                </span>{" "}
                service{filteredAndSortedServices.length !== 1 ? "s" : ""}
              </p>
              <div className="flex items-center">
                <label htmlFor="sort" className="text-sm mr-2 shrink-0">
                  Sort by:
                </label>
                <select
                  id="sort"
                  value={sortOption}
                  onChange={(e) => setSortOption(e.target.value)}
                  className="bg-background border border-input rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-ring"
                >
                  <option value="recommended">Recommended</option>
                  <option value="price-asc">Price: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                  <option value="rating">Top Rated</option>
                </select>
              </div>
            </div>
            {/* Service Grid */}
            {filteredAndSortedServices.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredAndSortedServices.map((service) => (
                  <ServiceCard
                    key={service.id || service._id}
                    id={service.id || service._id} // Pass id
                    name={service.name}
                    image={
                      service.images?.[0]?.url ||
                      "https://via.placeholder.com/300x200?text=No+Image"
                    }
                    category={service.type || "Service"} // Use service.type
                    price={formatPrice(service)} // Use helper
                    rating={service.rating.average}
                    reviewCount={service.rating.count}
                  >
                    {/* Sponsored Badge */}
                    {service.sponsored?.isActive && (
                      <Badge
                        variant="secondary"
                        className="absolute top-3 right-3 z-10 bg-gradient-to-r from-yellow-400 to-orange-500 text-white border-none px-2 py-0.5 text-xs"
                      >
                        Sponsored
                      </Badge>
                    )}
                  </ServiceCard>
                ))}
              </div>
            ) : (
              <div className="text-center py-16 text-muted-foreground bg-secondary/30 rounded-lg border border-dashed">
                <p className="text-lg mb-2 font-medium">
                  No services match your filters.
                </p>
                <p className="text-sm">Try adjusting your search criteria.</p>
                <Button variant="link" onClick={resetFilters} className="mt-3">
                  Reset Filters
                </Button>
              </div>
            )}
          </div>
        </div>
        {/* External Venue Modal (If needed) */}
        {/* <ExternalVenueModal isOpen={isExternalVenueModalOpen} onClose={() => setIsExternalVenueModalOpen(false)} onConfirm={handleExternalVenueConfirm} /> */}
      </div>
    </main>
  );
};

// --- Wrapper Component ---
const ServiceListClient: React.FC<ServiceListClientProps> = (props) => (
  <Suspense
    fallback={
      <div className="flex justify-center items-center min-h-[50vh]">
        Loading Services...
      </div>
    }
  >
    {" "}
    {/* Basic fallback */}
    <ServiceListClientContent {...props} />
  </Suspense>
);

export default ServiceListClient;
