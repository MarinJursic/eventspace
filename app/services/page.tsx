"use client";

import React, { useEffect, useState } from "react";
import ServiceCard from "@/components/ui/ServiceCard";
import { Separator } from "@/components/ui/separator";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Filter, Search, Calendar, Star, Building } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useCart } from "../context/CartContext";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";

const Services: React.FC = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const [priceRange, setPriceRange] = useState<number[]>([0, 2000]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedEventTypes, setSelectedEventTypes] = useState<string[]>([]);
  const [minRating, setMinRating] = useState<number | null>(null);

  const { hasVenue, selectedDates, isMultiDay } = useCart();

  const allServices = [
    {
      id: 1,
      name: "Elegant Catering Co.",
      image:
        "https://images.unsplash.com/photo-1555244162-803834f70033?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80",
      category: "Catering",
      price: "$35",
      priceNumeric: 35,
      perUnit: "per guest",
      rating: 4.9,
      reviewCount: 157,
      popularWith: ["Wedding", "Corporate Event"],
      recommended: true,
    },
    {
      id: 2,
      name: "Capture Moments Photography",
      image:
        "https://images.unsplash.com/photo-1567947121469-241e6493f5ff?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&w=2070&q=80 ",
      category: "Photography",
      price: "$1,200",
      priceNumeric: 1200,
      perUnit: "",
      rating: 4.8,
      reviewCount: 93,
      popularWith: ["Wedding", "Birthday Party"],
      recommended: true,
    },
    {
      id: 3,
      name: "Party Beats DJ Services",
      image:
        "https://images.unsplash.com/photo-1516873240891-4bf014598ab4?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80",
      category: "Entertainment",
      price: "$500",
      priceNumeric: 500,
      perUnit: "",
      rating: 4.7,
      reviewCount: 82,
      popularWith: ["Wedding", "Corporate Event", "Birthday Party"],
      recommended: false,
    },
    {
      id: 4,
      name: "Bloom & Arrangements",
      image:
        "https://images.unsplash.com/photo-1643733149476-448e1dd6ed66?q=80&w=3870&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      category: "Floral",
      price: "$350",
      priceNumeric: 350,
      perUnit: "",
      rating: 4.9,
      reviewCount: 76,
      popularWith: ["Wedding", "Reception"],
      recommended: true,
    },
    {
      id: 5,
      name: "Event Decor Specialists",
      image:
        "https://images.unsplash.com/photo-1478146059778-26028b07395a?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80",
      category: "Decoration",
      price: "$800",
      priceNumeric: 800,
      perUnit: "",
      rating: 4.6,
      reviewCount: 64,
      popularWith: ["Wedding", "Corporate Event", "Conference"],
      recommended: false,
    },
    {
      id: 6,
      name: "Sweet Treats Bakery",
      image:
        "https://images.unsplash.com/photo-1535254973040-607b474cb50d?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80",
      category: "Cakes & Desserts",
      price: "$250",
      priceNumeric: 250,
      perUnit: "",
      rating: 4.8,
      reviewCount: 118,
      popularWith: ["Wedding", "Birthday Party"],
      recommended: false,
    },
    {
      id: 7,
      name: "Elite Bartending Services",
      image:
        "https://images.unsplash.com/photo-1574096079513-d8259312b785?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80",
      category: "Catering",
      price: "$45",
      priceNumeric: 45,
      perUnit: "per guest",
      rating: 4.7,
      reviewCount: 89,
      popularWith: ["Wedding", "Corporate Event"],
      recommended: true,
    },
    {
      id: 8,
      name: "Harmony String Quartet",
      image:
        "https://images.unsplash.com/photo-1558584673-c834fb1cc3ca?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80",
      category: "Entertainment",
      price: "$700",
      priceNumeric: 700,
      perUnit: "",
      rating: 5.0,
      reviewCount: 42,
      popularWith: ["Wedding", "Reception"],
      recommended: false,
    },
  ];

  const filteredServices = allServices.filter((service) => {
    if (
      searchTerm &&
      !service.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
      !service.category.toLowerCase().includes(searchTerm.toLowerCase())
    ) {
      return false;
    }

    if (
      service.priceNumeric < priceRange[0] ||
      service.priceNumeric > priceRange[1]
    ) {
      return false;
    }

    if (
      selectedCategories.length > 0 &&
      !selectedCategories.includes(service.category)
    ) {
      return false;
    }

    if (
      selectedEventTypes.length > 0 &&
      !service.popularWith.some((type) => selectedEventTypes.includes(type))
    ) {
      return false;
    }

    if (minRating !== null && service.rating < minRating) {
      return false;
    }

    return true;
  });

  const serviceCategories = [
    { id: "Catering", label: "Catering" },
    { id: "Photography", label: "Photography & Video" },
    { id: "Entertainment", label: "Entertainment" },
    { id: "Floral", label: "Florist & Decorations" },
    { id: "Cakes & Desserts", label: "Cakes & Desserts" },
    { id: "Decoration", label: "Rentals & Equipment" },
  ];

  const eventTypes = [
    { id: "Wedding", label: "Wedding" },
    { id: "Corporate Event", label: "Corporate Event" },
    { id: "Birthday Party", label: "Birthday Party" },
    { id: "Conference", label: "Conference" },
    { id: "Reception", label: "Reception" },
  ];

  const toggleCategory = (category: string) => {
    setSelectedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category]
    );
  };

  const toggleEventType = (type: string) => {
    setSelectedEventTypes((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]
    );
  };

  const toggleRating = (rating: number) => {
    setMinRating((prev) => (prev === rating ? null : rating));
  };

  const recommendedServices = allServices.filter(
    (service) => service.recommended
  );

  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-grow pt-24 pb-16">
        <div className="container mx-auto px-4">
          {hasVenue && (
            <Alert className="mb-6">
              <Calendar className="h-4 w-4" />
              <AlertTitle>Booking in progress</AlertTitle>
              <AlertDescription className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <span>
                  You're adding services for your event on{" "}
                  {isMultiDay
                    ? `${selectedDates[0]} to ${
                        selectedDates[selectedDates.length - 1]
                      }`
                    : selectedDates[0]}
                </span>
                <Button asChild size="sm" variant="outline">
                  <Link href="/cart">View Booking</Link>
                </Button>
              </AlertDescription>
            </Alert>
          )}

          {hasVenue && recommendedServices.length > 0 && (
            <div className="mb-10">
              <h2 className="text-2xl font-display font-bold mb-4">
                Recommended for Your Event
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {recommendedServices.map((service) => (
                  <ServiceCard
                    key={service.id}
                    id={service.id}
                    name={service.name}
                    image={service.image}
                    category={service.category}
                    price={
                      service.perUnit
                        ? `${service.price} ${service.perUnit}`
                        : `From ${service.price}`
                    }
                    rating={service.rating}
                    reviewCount={service.reviewCount}
                  >
                    <Badge className="absolute top-3 right-3 bg-primary">
                      Recommended
                    </Badge>
                  </ServiceCard>
                ))}
              </div>
            </div>
          )}

          <div className="flex flex-col md:flex-row gap-8">
            <aside className="w-full md:w-1/4 lg:w-1/5 space-y-6">
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h2 className="text-lg font-display font-semibold mb-4 flex items-center">
                  <Filter className="w-5 h-5 mr-2" />
                  Filters
                </h2>

                <div className="mb-6">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                    <input
                      type="text"
                      placeholder="Search services..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 rounded-lg border border-input focus:outline-none focus:ring-2 focus:ring-primary/10 focus:border-primary/30"
                    />
                  </div>
                </div>

                <div className="mb-6">
                  <h3 className="font-medium mb-3">Price Range</h3>
                  <Slider
                    defaultValue={[50, 500]}
                    min={0}
                    max={2000}
                    step={10}
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

                <div className="mb-6">
                  <h3 className="font-medium mb-3">Service Type</h3>
                  <div className="space-y-2">
                    {serviceCategories.map((category) => (
                      <div
                        key={category.id}
                        className="flex items-center space-x-2"
                      >
                        <Checkbox
                          id={`category-${category.id}`}
                          checked={selectedCategories.includes(category.id)}
                          onCheckedChange={() => toggleCategory(category.id)}
                        />
                        <Label
                          htmlFor={`category-${category.id}`}
                          className="text-sm font-normal cursor-pointer"
                        >
                          {category.label}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>

                <Separator className="my-5" />

                <div className="mb-6">
                  <h3 className="font-medium mb-3">Event Type</h3>
                  <div className="space-y-2">
                    {eventTypes.map((type) => (
                      <div
                        key={type.id}
                        className="flex items-center space-x-2"
                      >
                        <Checkbox
                          id={`event-${type.id}`}
                          checked={selectedEventTypes.includes(type.id)}
                          onCheckedChange={() => toggleEventType(type.id)}
                        />
                        <Label
                          htmlFor={`event-${type.id}`}
                          className="text-sm font-normal cursor-pointer"
                        >
                          {type.label}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>

                <Separator className="my-5" />

                <div>
                  <h3 className="font-medium mb-3">Minimum Rating</h3>
                  <div className="space-y-2">
                    {[5, 4, 3, 2].map((rating) => (
                      <div key={rating} className="flex items-center space-x-2">
                        <Checkbox
                          id={`rating-${rating}`}
                          checked={minRating === rating}
                          onCheckedChange={() => toggleRating(rating)}
                        />
                        <Label
                          htmlFor={`rating-${rating}`}
                          className="text-sm font-normal cursor-pointer"
                        >
                          <div className="flex items-center">
                            {rating}+{" "}
                            <Star className="h-3 w-3 ml-1 text-yellow-500 fill-yellow-500" />
                          </div>
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>

                <Separator className="my-5" />

                <Button
                  variant="outline"
                  onClick={() => {
                    setPriceRange([50, 2000]);
                    setSearchTerm("");
                    setSelectedCategories([]);
                    setSelectedEventTypes([]);
                    setMinRating(null);
                  }}
                  className="w-full"
                >
                  Reset Filters
                </Button>
              </div>
            </aside>

            <div className="w-full md:w-3/4 lg:w-4/5">
              <div className="mb-8">
                <h1 className="text-3xl font-display font-bold mb-2">
                  Event Services
                </h1>
                <p className="text-muted-foreground">
                  Find trusted professionals to make your event special
                </p>
              </div>

              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
                <p className="text-muted-foreground mb-3 sm:mb-0">
                  Showing{" "}
                  <span className="font-medium text-foreground">
                    {filteredServices.length}
                  </span>{" "}
                  services
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

              {filteredServices.length === 0 ? (
                <div className="text-center py-16 bg-secondary/10 rounded-lg">
                  <h3 className="text-lg font-medium mb-2">
                    No services match your filters
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    Try adjusting your filter criteria
                  </p>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setPriceRange([50, 2000]);
                      setSearchTerm("");
                      setSelectedCategories([]);
                      setSelectedEventTypes([]);
                      setMinRating(null);
                    }}
                  >
                    Reset All Filters
                  </Button>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredServices.map((service) => (
                    <ServiceCard
                      key={service.id}
                      id={service.id}
                      name={service.name}
                      image={service.image}
                      category={service.category}
                      price={
                        service.perUnit
                          ? `${service.price} ${service.perUnit}`
                          : `From ${service.price}`
                      }
                      rating={service.rating}
                      reviewCount={service.reviewCount}
                    />
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
