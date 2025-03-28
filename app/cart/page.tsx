"use client";

import React from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Calendar, Clock, MapPin, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useCart, Service } from "@/app/context/CartContext";
import { useToast } from "@/hooks/useToast";
import AnimatedSection from "@/components/ui/AnimatedSection";

const recommendedServices = [
  {
    id: 101,
    name: "Premium Catering Service",
    image:
      "https://images.unsplash.com/photo-1555244162-803834f70033?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80",
    category: "Catering",
    price: "$1,500",
  },
  {
    id: 102,
    name: "Professional DJ Services",
    image:
      "https://images.unsplash.com/photo-1516873240891-4bf014598ab4?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80",
    category: "Entertainment",
    price: "$800",
  },
  {
    id: 103,
    name: "Event Decoration Package",
    image:
      "https://images.unsplash.com/photo-1478146059778-26028b07395a?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80",
    category: "Decoration",
    price: "$1,200",
  },
];

const Cart: React.FC = () => {
  const { cart, removeService, clearCart } = useCart();
  const { toast } = useToast();
  const router = useRouter();

  const extractPrice = (priceString: string) => {
    const match = priceString.match(/\$?([\d,]+)/);
    if (match && match[1]) {
      return parseInt(match[1].replace(/,/g, ""));
    }
    return 0;
  };

  const getVenuePrice = () => {
    if (!cart?.venue?.price) return 0;
    const numDays = cart.selectedDates.length;
    return extractPrice(cart.venue.price) * numDays;
  };

  const getServicesTotal = () => {
    if (!cart?.services?.length) return 0;
    return cart.services.reduce((total, service) => {
      if (service.totalPrice) {
        const serviceDays = service.selectedDays || cart.selectedDates;
        const daysRatio = serviceDays.length / cart.selectedDates.length;
        return total + extractPrice(service.totalPrice) * daysRatio;
      }
      return total + extractPrice(service.price);
    }, 0);
  };

  const handleCheckout = () => {
    router.push("/payment");
  };

  if (!cart || !cart.venue) {
    return (
      <div className="mt-10 min-h-screen flex flex-col">
        <main className="flex-grow container mx-auto px-4 py-16">
          <div className="text-center py-16">
            <h2 className="text-2xl font-display font-bold mb-4">
              Your booking is empty
            </h2>
            <p className="text-muted-foreground mb-8">
              You haven't added any venues or services to your booking yet.
            </p>
            <Button asChild>
              <Link href="/venues">Browse Venues</Link>
            </Button>
          </div>
        </main>
      </div>
    );
  }

  const formatServiceDates = (service: Service) => {
    const days = service.selectedDays || cart.selectedDates || [];
    if (days.length === 0) return "No dates";
    if (days.length === 1) return days[0];
    if (cart && days.length === cart.selectedDates.length) {
      return "All event days";
    }
    if (days.length <= 3) {
      return days.join(", ");
    }
    return `${days.length} days (${days[0]} - ${days[days.length - 1]})`;
  };

  const isMultiDay = cart.selectedDates.length > 1;

  return (
    <div className="mt-10 min-h-screen flex flex-col">
      <main className="flex-grow container mx-auto px-4 py-8">
        <AnimatedSection animation="fade-in">
          <Link
            href="/"
            className="inline-flex items-center text-muted-foreground hover:text-foreground mb-6"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Continue browsing
          </Link>

          <h1 className="text-3xl font-display font-bold mb-8">Your Booking</h1>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Side */}
            <div className="lg:col-span-2 space-y-8">
              {/* Selected Venue Section */}
              <div className="bg-card border border-border rounded-xl p-6">
                <h2 className="text-xl font-display font-semibold mb-4">
                  Selected Venue
                </h2>
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="w-full md:w-1/3">
                    <div className="aspect-video rounded-lg overflow-hidden">
                      <img
                        src={cart.venue.image}
                        alt={cart.venue.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                  <div className="flex-1">
                    <h3 className="font-display font-semibold text-lg">
                      {cart.venue.name}
                    </h3>
                    <div className="flex items-center text-muted-foreground mt-1">
                      <MapPin className="h-4 w-4 mr-1" />
                      <span>{cart.venue.location}</span>
                    </div>
                    <div className="flex flex-col mt-2 gap-1">
                      <div className="flex items-center text-muted-foreground">
                        <Calendar className="h-4 w-4 mr-1" />
                        <span>
                          {isMultiDay
                            ? `${cart.selectedDates.length} dates (${
                                cart.selectedDates[0]
                              } to ${
                                cart.selectedDates[
                                  cart.selectedDates.length - 1
                                ]
                              })`
                            : cart.selectedDates[0]}
                        </span>
                      </div>
                      <div className="flex items-center text-muted-foreground">
                        <Clock className="h-4 w-4 mr-1" />
                        <span>{cart.timeSlot}</span>
                      </div>
                    </div>
                    <div className="mt-3">
                      <span className="font-semibold">{cart.venue.price}</span>
                      <span className="text-sm text-muted-foreground ml-1">
                        × {cart.selectedDates.length} day
                        {cart.selectedDates.length !== 1 ? "s" : ""}
                      </span>
                    </div>
                  </div>
                </div>
                {isMultiDay && (
                  <div className="mt-4">
                    <h4 className="font-medium text-sm mb-2">
                      Selected Dates:
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {cart.selectedDates.map((date, index) => (
                        <span
                          key={index}
                          className="inline-block px-2 py-1 bg-primary/10 text-primary text-sm rounded-md"
                        >
                          {date}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Services Section */}
              <div className="bg-card border border-border rounded-xl p-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-display font-semibold">
                    Services
                  </h2>
                  <Button asChild variant="outline" size="sm">
                    <Link href="/services" className="flex items-center gap-1">
                      <Plus className="h-4 w-4" />
                      Add Services
                    </Link>
                  </Button>
                </div>

                {cart.services.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <p>No services added yet</p>
                    <p className="text-sm mt-1">
                      Enhance your event with catering, photography, and more
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {cart.services.map((service) => (
                      <div
                        key={service.id}
                        className="flex items-start gap-4 p-4 bg-secondary/20 rounded-lg"
                      >
                        <div className="w-16 h-16 rounded-md overflow-hidden flex-shrink-0">
                          <img
                            src={service.image}
                            alt={service.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex-1">
                          <div className="flex justify-between">
                            <h4 className="font-medium">{service.name}</h4>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => removeService(service.id)}
                              className="text-muted-foreground hover:text-destructive h-8 w-8"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {service.category}
                          </p>
                          <div className="flex items-center mt-1 text-xs bg-primary/5 px-2 py-1 rounded-full w-fit">
                            <Calendar className="h-3 w-3 mr-1 text-primary" />
                            <span className="text-primary">
                              {formatServiceDates(service)}
                            </span>
                          </div>
                          {service.selectedCustomizations &&
                            service.selectedCustomizations.length > 0 && (
                              <div className="mt-2 text-sm">
                                <p className="text-xs text-muted-foreground">
                                  Customizations:
                                </p>
                                <ul className="list-disc list-inside text-xs pl-1 mt-1">
                                  {service.selectedCustomizations.map(
                                    (option, idx) => (
                                      <li
                                        key={idx}
                                        className="text-muted-foreground"
                                      >
                                        {option.name} ({option.price})
                                      </li>
                                    )
                                  )}
                                </ul>
                              </div>
                            )}
                          <p className="text-sm font-semibold mt-1">
                            {service.totalPrice || service.price}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Recommended Services Section */}
              <div className="bg-card border border-border rounded-xl p-6">
                <h2 className="text-xl font-display font-semibold mb-4">
                  Recommended Services
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {recommendedServices.map((service) => (
                    <div
                      key={service.id}
                      className="border border-border rounded-lg overflow-hidden bg-background"
                    >
                      <div className="aspect-video overflow-hidden">
                        <img
                          src={service.image}
                          alt={service.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="p-4">
                        <h3 className="font-medium">{service.name}</h3>
                        <p className="text-sm text-muted-foreground">
                          {service.category}
                        </p>
                        <div className="flex justify-between items-center mt-2">
                          <span className="font-semibold">{service.price}</span>
                          <Button variant="outline" size="sm" asChild>
                            <Link href={`/services/${service.id}`}>View</Link>
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Summary Sidebar */}
            <div className="lg:col-span-1">
              <div className="sticky top-24 bg-card border border-border rounded-xl p-6">
                <h2 className="text-xl font-display font-semibold mb-4">
                  Summary
                </h2>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Venue</span>
                    <span>${getVenuePrice()}</span>
                  </div>
                  <div className="text-xs text-muted-foreground pl-4">
                    {cart.venue.price} × {cart.selectedDates.length} day
                    {cart.selectedDates.length !== 1 ? "s" : ""}
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">
                      Services ({cart.services.length || 0})
                    </span>
                    <span>${getServicesTotal()}</span>
                  </div>
                  <Separator className="my-3" />
                  <div className="flex justify-between font-semibold">
                    <span>Estimated Total</span>
                    <span>${getVenuePrice() + getServicesTotal()}</span>
                  </div>
                </div>
                <Button
                  className="w-full mt-6"
                  size="lg"
                  onClick={handleCheckout}
                >
                  Proceed to Payment
                </Button>
                <p className="text-xs text-center text-muted-foreground mt-3">
                  You'll review all details before final confirmation
                </p>
                <Button
                  variant="ghost"
                  className="w-full mt-4 text-muted-foreground hover:text-destructive"
                  onClick={clearCart}
                >
                  Clear Booking
                </Button>
              </div>
            </div>
          </div>
        </AnimatedSection>
      </main>
    </div>
  );
};

export default Cart;
