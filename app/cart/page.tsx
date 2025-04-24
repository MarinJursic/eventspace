// /app/cart/page.tsx
"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Calendar,
  Clock,
  Loader2,
  MapPin,
  Plus,
  Trash2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useCart, Service as CartServiceType } from "@/app/context/CartContext";
import { useToast } from "@/hooks/useToast";
import AnimatedSection from "@/components/ui/AnimatedSection";
import { mockServices } from "@/lib/mockServices"; // Assuming you still use this for recommendations

// Stripe imports
import { loadStripe, StripeError } from "@stripe/stripe-js";

// Make sure to place your publishable key in the .env.local file
const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
);

// Helper function to format price
const formatDisplayPrice = (
  amount: number,
  model?: "hour" | "day" | "week"
): string => {
  // Use toLocaleString for currency formatting if desired, otherwise keep simple
  const base = `$${amount.toFixed(2)}`; // Ensure two decimal places
  switch (model) {
    case "hour":
      return `${base} / hour*`;
    case "day":
      return `${base} / event day`;
    case "week":
      return `${base} / week`;
    default:
      return base;
  }
};

// Recommended services data (adjust as needed)
const recommendedServicesData = [
  {
    id: mockServices[2]?.id || "rec-101",
    name: "Gourmet Gatherings Catering",
    image: mockServices[2]?.images[0]?.url || "",
    category: "Catering",
    price: formatDisplayPrice(
      mockServices[2]?.price.basePrice || 1500,
      mockServices[2]?.price.model
    ),
  },
  {
    id: mockServices[3]?.id || "rec-102",
    name: "Rhythm Revolution DJ Services",
    image: mockServices[3]?.images[0]?.url || "",
    category: "Entertainment",
    price: formatDisplayPrice(
      mockServices[3]?.price.basePrice || 800,
      mockServices[3]?.price.model
    ),
  },
  {
    id: mockServices[0]?.id || "rec-103",
    name: "Ethereal Blooms Floral Design",
    image: mockServices[0]?.images[0]?.url || "",
    category: "Decoration",
    price: formatDisplayPrice(
      mockServices[0]?.price.basePrice || 1200,
      mockServices[0]?.price.model
    ),
  },
];

const Cart: React.FC = () => {
  const { cart, removeService, clearCart } = useCart();
  const { toast } = useToast();
  const [isCheckingOut, setIsCheckingOut] = useState(false);

  // --- Price Calculation Functions ---
  const getVenuePrice = (): number => {
    if (!cart?.venue?.price) return 0;
    const numDays = cart.selectedDates.length || 1;
    // Basic calculation: assumes daily model if not specified differently
    // Add more complex logic based on cart.venue.price.model if needed
    return cart.venue.price.basePrice * numDays;
  };

  const getServicesTotal = (): number => {
    if (!cart?.services?.length) return 0;
    return cart.services.reduce((total, service) => {
      // Ensure totalCalculatedPrice is a valid number
      return total + (service.totalCalculatedPrice || 0);
    }, 0);
  };

  const getTotalBookingPrice = (): number => {
    return getVenuePrice() + getServicesTotal();
  };

  // --- Checkout Handler ---
  const handleCheckout = async () => {
    if (!cart || !cart.venue) {
      toast({
        title: "Cart Empty",
        description: "Cannot proceed to checkout without a venue.",
        variant: "destructive",
      });
      return;
    }

    setIsCheckingOut(true);

    const checkoutItems = [];
    const venuePrice = getVenuePrice();

    // Add Venue if price > 0
    if (venuePrice > 0) {
      checkoutItems.push({
        id: cart.venue.id, // Ensure venue has an ID
        name: `${cart.venue.name} (${cart.selectedDates.length} day${
          cart.selectedDates.length !== 1 ? "s" : ""
        })`,
        price: venuePrice, // Send the calculated TOTAL price for the venue duration
        quantity: 1,
        image: cart.venue.images?.[0]?.url || undefined,
      });
    }

    // Add Services if price > 0
    cart.services.forEach((service) => {
      if (service.totalCalculatedPrice > 0) {
        checkoutItems.push({
          id: service.id,
          name: `${service.name} (${service.selectedDays.length || 1} day${
            (service.selectedDays.length || 1) !== 1 ? "s" : ""
          })`,
          price: service.totalCalculatedPrice,
          quantity: 1,
          image: service.image || undefined,
        });
      }
    });

    if (checkoutItems.length === 0) {
      toast({
        title: "No items to checkout",
        description: "Your cart total is zero.",
        variant: "destructive",
      });
      setIsCheckingOut(false);
      return;
    }

    try {
      // Call backend API
      const response = await fetch("/api/v1/checkout_sessions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items: checkoutItems }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to create checkout session");
      }

      const { sessionId } = await response.json();

      // Redirect to Stripe Checkout
      const stripe = await stripePromise;
      if (!stripe) {
        throw new Error("Stripe.js failed to load.");
      }

      const { error } = await stripe.redirectToCheckout({ sessionId });

      if (error) {
        // Type guard for StripeError
        const stripeError = error as StripeError;
        console.error("Stripe redirect error:", stripeError);
        toast({
          title: "Checkout Error",
          description:
            stripeError.message || "Could not redirect to Stripe checkout.",
          variant: "destructive",
        });
        setIsCheckingOut(false); // Ensure loading stops on redirect error
      }
      // Note: If redirect is successful, code execution stops here for this browser tab.
    } catch (error) {
      console.error("Checkout process failed:", error);
      toast({
        title: "Checkout Failed",
        description:
          error instanceof Error
            ? error.message
            : "An unexpected error occurred during checkout.",
        variant: "destructive",
      });
      setIsCheckingOut(false); // Reset loading state on failure
    }
    // Removed the finally block as the state should only be reset on error here,
    // successful redirect means the component might unmount anyway.
  };

  // --- Date Formatting Helper ---
  const formatServiceDates = (service: CartServiceType): string => {
    const days = service.selectedDays || [];
    if (!cart?.selectedDates) return "Dates N/A";

    if (days.length === 0 && cart.selectedDates.length === 1) {
      return `Event day (${cart.selectedDates[0]})`;
    }
    if (
      days.length > 0 &&
      days.length === cart.selectedDates.length &&
      days.every((d, i) => d === cart.selectedDates[i])
    ) {
      return `All event days (${days.length})`;
    }
    if (days.length === 1) return `1 day (${days[0]})`;
    if (days.length > 1 && days.length < 4) {
      return `${days.length} days: ${days.join(", ")}`;
    }
    if (days.length >= 4) {
      const sortedDays = [...days].sort();
      return `${days.length} days (${sortedDays[0]} to ${
        sortedDays[sortedDays.length - 1]
      })`;
    }
    return "Specific dates selected";
  };

  // --- Empty Cart Display ---
  if (!cart || !cart.venue) {
    return (
      <div className="mt-10 min-h-screen flex flex-col">
        <main className="flex-grow container mx-auto px-4 py-16">
          <div className="text-center py-16 bg-secondary/20 border border-dashed rounded-lg">
            <h2 className="text-2xl font-display font-bold mb-4">
              Your booking is empty
            </h2>
            <p className="text-muted-foreground mb-8">
              Start by selecting a venue for your event.
            </p>
            <Button asChild size="lg">
              <Link href="/venues">Browse Venues</Link>
            </Button>
          </div>
        </main>
      </div>
    );
  }

  const isMultiDay = cart.selectedDates.length > 1;

  // --- Render Cart ---
  return (
    <div className="mt-10 min-h-screen flex flex-col">
      <main className="flex-grow container mx-auto px-4 py-8">
        <AnimatedSection animation="fade-in">
          {/* Back Link */}
          <Link
            href="/services" // Or maybe back to the last viewed venue/service?
            className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-6"
          >
            <ArrowLeft className="mr-1.5 h-4 w-4" />
            Back to Services
          </Link>

          <h1 className="text-3xl font-display font-bold mb-8">Your Booking</h1>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 xl:gap-12">
            {/* Left Column: Venue and Services */}
            <div className="lg:col-span-2 space-y-8">
              {/* --- Selected Venue Section --- */}
              <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
                <h2 className="text-xl font-display font-semibold mb-4">
                  {" "}
                  Selected Venue{" "}
                </h2>
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="w-full sm:w-1/3 flex-shrink-0">
                    <div className="aspect-video rounded-lg overflow-hidden bg-muted">
                      <img
                        src={
                          cart.venue.images?.[0]?.url ||
                          "https://via.placeholder.com/300x200?text=No+Venue+Image"
                        }
                        alt={cart.venue.images?.[0]?.alt || cart.venue.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                  <div className="flex-1">
                    <h3 className="font-display font-semibold text-lg">
                      {" "}
                      {cart.venue.name}{" "}
                    </h3>
                    <div className="flex items-center text-sm text-muted-foreground mt-1">
                      <MapPin className="h-4 w-4 mr-1.5 flex-shrink-0" />
                      {/* Ensure location object exists and has address */}
                      <span>
                        {cart.venue.location?.address ||
                          cart.venue.location?.city ||
                          "Location not specified"}
                      </span>
                    </div>
                    <div className="flex flex-col mt-2 gap-1 text-sm">
                      <div className="flex items-center text-muted-foreground">
                        <Calendar className="h-4 w-4 mr-1.5 flex-shrink-0" />
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
                      {cart.timeSlot && ( // Only show if timeslot exists
                        <div className="flex items-center text-muted-foreground">
                          <Clock className="h-4 w-4 mr-1.5 flex-shrink-0" />
                          <span>{cart.timeSlot}</span>
                        </div>
                      )}
                    </div>
                    {/* Display venue price correctly */}
                    <div className="mt-3">
                      {/* Use helper to format venue base price */}
                      <span className="font-semibold">
                        {formatDisplayPrice(
                          cart.venue.price.basePrice,
                          cart.venue.price.model
                        )}
                      </span>
                      {/* Clarify multiplication only if price model is 'day' */}
                      {cart.venue.price.model === "day" && (
                        <span className="text-sm text-muted-foreground ml-1">
                          × {cart.selectedDates.length} day
                          {cart.selectedDates.length !== 1 ? "s" : ""}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* --- Services Section --- */}
              <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-display font-semibold">
                    {" "}
                    Added Services ({cart.services.length}){" "}
                  </h2>
                  <Button asChild variant="outline" size="sm">
                    <Link href="/services" className="flex items-center gap-1">
                      <Plus className="h-4 w-4" />
                      Add Services
                    </Link>
                  </Button>
                </div>
                {cart.services.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground border border-dashed rounded-md bg-secondary/20">
                    <p className="font-medium">No services added yet.</p>
                    <p className="text-sm mt-1">
                      {" "}
                      Browse services to enhance your event.{" "}
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {cart.services.map((service) => (
                      <div
                        key={service.id}
                        className="flex items-start gap-4 p-3 border border-border rounded-lg bg-background hover:bg-secondary/20 transition-colors"
                      >
                        <div className="w-16 h-16 rounded-md overflow-hidden flex-shrink-0 bg-muted">
                          <img
                            src={
                              service.image ||
                              "https://via.placeholder.com/100x100?text=No+Image"
                            }
                            alt={service.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex-1">
                          <div className="flex justify-between items-start mb-1">
                            <h4 className="font-medium leading-tight">
                              {service.name}
                            </h4>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => removeService(service.id)}
                              className="text-muted-foreground hover:text-destructive h-7 w-7 flex-shrink-0"
                              aria-label={`Remove ${service.name}`}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                          <div className="flex items-center mt-1 text-xs bg-secondary px-1.5 py-0.5 rounded-full w-fit border">
                            <Calendar className="h-3 w-3 mr-1 text-muted-foreground" />
                            <span className="text-muted-foreground">
                              {" "}
                              {formatServiceDates(service)}{" "}
                            </span>
                          </div>
                          <p className="text-sm font-semibold mt-2">
                            {" "}
                            {formatDisplayPrice(
                              service.totalCalculatedPrice
                            )}{" "}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* --- Recommended Services Section --- */}
              <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
                <h2 className="text-xl font-display font-semibold mb-4">
                  {" "}
                  You Might Also Need{" "}
                </h2>
                {recommendedServicesData.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {recommendedServicesData.map((recService) => (
                      <div
                        key={recService.id}
                        className="border border-border rounded-lg overflow-hidden bg-background transition-shadow hover:shadow-md"
                      >
                        <div className="aspect-video overflow-hidden bg-muted">
                          <img
                            src={
                              recService.image ||
                              "https://via.placeholder.com/300x200?text=No+Image"
                            }
                            alt={recService.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="p-3">
                          <h3 className="font-medium text-sm truncate">
                            {recService.name}
                          </h3>
                          <p className="text-xs text-muted-foreground mb-2">
                            {" "}
                            {recService.category}{" "}
                          </p>
                          <div className="flex justify-between items-center">
                            <span className="font-semibold text-sm">
                              {recService.price}
                            </span>
                            <Button variant="outline" size="sm" asChild>
                              <Link href={`/services/${recService.id}`}>
                                View
                              </Link>
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground text-center py-4">
                    No recommendations available.
                  </p>
                )}
              </div>
            </div>

            {/* --- Summary Sidebar --- */}
            <div className="lg:col-span-1">
              <div className="sticky top-24 bg-card border border-border rounded-xl p-6 shadow-sm">
                <h2 className="text-xl font-display font-semibold mb-4">
                  {" "}
                  Summary{" "}
                </h2>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Venue Total</span>
                    <span>{formatDisplayPrice(getVenuePrice())}</span>
                  </div>
                  {cart.venue.price.model === "day" && (
                    <div className="text-xs text-muted-foreground pl-4">
                      ({formatDisplayPrice(cart.venue.price.basePrice)} ×{" "}
                      {cart.selectedDates.length} day
                      {cart.selectedDates.length !== 1 ? "s" : ""})
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">
                      {" "}
                      Services Total ({cart.services.length}){" "}
                    </span>
                    <span>{formatDisplayPrice(getServicesTotal())}</span>
                  </div>
                  <Separator className="my-3" />
                  <div className="flex justify-between font-semibold text-base">
                    <span>Estimated Total</span>
                    <span>{formatDisplayPrice(getTotalBookingPrice())}</span>
                  </div>
                </div>

                {/* Updated Checkout Button */}
                <Button
                  className="w-full mt-6"
                  size="lg"
                  onClick={handleCheckout}
                  disabled={!cart.venue || isCheckingOut}
                >
                  {isCheckingOut ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    "Proceed to Checkout"
                  )}
                </Button>

                <p className="text-xs text-center text-muted-foreground mt-3">
                  You will be redirected to Stripe to complete your payment
                  securely.
                </p>
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full mt-4 text-sm text-muted-foreground hover:text-destructive"
                  onClick={clearCart}
                  disabled={isCheckingOut}
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
