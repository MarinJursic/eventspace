"use client";

import React, { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Calendar,
  ArrowLeft,
  Check,
  Star,
  Clock,
  MapPin,
  CreditCard,
  Home,
  PhoneCall,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import AnimatedSection from "@/components/ui/AnimatedSection";
import Navbar from "@/components/navbar/Navbar";
import { rootRoute } from "@/lib/constants/route.constants";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useCart } from "../context/CartContext";
import { useSession } from "next-auth/react";
import { useToast } from "@/hooks/useToast";
import Image from "next/image";
import { formatDisplayPrice } from "@/lib/utils/formatDisplayPrice";

export default function ThankYou() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { cart } = useCart();
  const { data: session } = useSession();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);

  const stripeSessionId = searchParams.get("session_id");

  // --- Data derived from cart ---
  // Use optional chaining and provide defaults
  const venue = cart?.venue;
  const services = cart?.services || [];
  const selectedDates = cart?.selectedDates || [];
  const timeSlot = cart?.timeSlot || "N/A";

  // Calculate totals based on cart data
  const getVenuePrice = (): number => {
    if (!venue?.price || selectedDates.length === 0) return 0;
    const numDays = selectedDates.length;
    return venue.price.basePrice * numDays;
  };

  const getServicesTotal = (): number => {
    return services.reduce((total, service) => {
      return total + (service.totalCalculatedPrice || 0); // Use pre-calculated price
    }, 0);
  };

  const venuePrice = getVenuePrice();
  const servicesTotal = getServicesTotal();
  const estimatedTotal = venuePrice + servicesTotal;

  useEffect(() => {
    if (stripeSessionId) {
      console.log(
        "Thank You page loaded with Stripe session, clearing cart:",
        stripeSessionId
      );
      setIsLoading(false); // Stop loading once session ID is confirmed
    } else {
      // If no session ID, maybe redirect or show an error/different message
      console.warn("Thank You page loaded without Stripe session ID.");
      toast({
        title: "Invalid Access",
        description: "Booking confirmation requires a valid session.",
        variant: "destructive",
      });
      // Redirect after a delay if no session ID and no cart (likely direct access)
      if (!cart) {
        const redirectTimer = setTimeout(
          () => router.push(rootRoute.value),
          3000
        );
        return () => clearTimeout(redirectTimer);
      } else {
        // If there's a cart but no session ID, maybe it was a different flow?
        // Or just show the cart data without confirming payment? For now, stop loading.
        setIsLoading(false);
      }
    }
  }, [stripeSessionId, router, toast, cart]); // Add cart to dependencies

  // Show loading or invalid access message
  if (isLoading && stripeSessionId) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background">
        <p>Loading confirmation...</p>
      </div>
    );
  }

  // Handle case where cart is empty but we expected data (e.g., after clearCart or direct access)
  // We check specifically if we expected data because of stripeSessionId
  if (!venue && stripeSessionId) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Navbar />
        <main className="flex-grow container mx-auto px-4 py-8 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">
              Confirmation Details Unavailable
            </h1>
            <p className="text-muted-foreground mb-6">
              Could not load booking details. Please check your email or account
              dashboard.
            </p>
            <Button onClick={() => router.push(rootRoute.value)}>
              Return to Home
            </Button>
          </div>
        </main>
      </div>
    );
  }
  // If no stripeSessionId and no cart, show generic message or redirect (handled partly in useEffect)
  if (!venue && !stripeSessionId) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Navbar />
        <main className="flex-grow container mx-auto px-4 py-8 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">No Booking Found</h1>
            <p className="text-muted-foreground mb-6">
              It seems there&apos;s no active booking to display.
            </p>
            <Button onClick={() => router.push(rootRoute.value)}>
              Return to Home
            </Button>
          </div>
        </main>
      </div>
    );
  }

  // --- Render Confirmation Details using Cart Data ---
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className="flex-grow container mx-auto px-4 py-8 mt-10">
        {" "}
        {/* Added margin-top */}
        <Button
          variant="ghost"
          className="mb-6 hover:bg-transparent hover:text-primary"
          onClick={() => router.push(rootRoute.value)}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to home
        </Button>
        <div className="max-w-6xl mx-auto">
          <AnimatedSection animation="fade-in">
            <div className="flex flex-col items-center text-center mb-10">
              <div className="h-16 w-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                <Check className="h-8 w-8 text-green-600" />
              </div>
              <h1 className="text-3xl font-bold mb-2">Booking Confirmed!</h1>
              <p className="text-muted-foreground max-w-lg">
                We&apos;ve sent a confirmation email to{" "}
                {session?.user?.email || "your email address"}.
              </p>
            </div>
          </AnimatedSection>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              {/* Venue Details Card */}
              <AnimatedSection animation="fade-in" delay={100}>
                <Card>
                  <CardHeader className="border-b">
                    <CardTitle className="flex justify-between items-center text-xl md:text-2xl">
                      <span>Booked Venue Details</span>
                      {stripeSessionId && (
                        <span className="text-sm md:text-base font-normal rounded-lg bg-green-100 px-2 py-1 text-green-800">
                          Ref: ...{stripeSessionId.slice(-8)}
                        </span>
                      )}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-6">
                    <div className="flex flex-col gap-6">
                      {/* Venue Info */}
                      <div className="w-full">
                        <div className="flex justify-between items-start">
                          <h3 className="font-semibold text-lg flex items-center gap-2">
                            {venue?.name || "Venue Name N/A"}
                            {venue?.rating && venue.rating.count > 0 && (
                              <div className="flex items-center bg-secondary px-2 py-1 rounded-full">
                                <Star className="w-3.5 h-3.5 text-yellow-500 fill-yellow-500 mr-1" />
                                <span className="text-xs font-medium">
                                  {venue.rating.average.toFixed(1)}
                                </span>
                              </div>
                            )}
                          </h3>
                        </div>
                        <p className="text-sm mt-2 text-muted-foreground">
                          {venue?.description || "No description available."}
                        </p>
                      </div>

                      {/* Dates & Capacity */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="flex items-start space-x-3">
                          <Calendar className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
                          <div>
                            <p className="text-sm text-muted-foreground">
                              Event Date(s)
                            </p>
                            <p className="font-medium">
                              {selectedDates.length === 0
                                ? "N/A"
                                : selectedDates.length === 1
                                  ? selectedDates[0]
                                  : `${selectedDates[0]} to ${selectedDates[selectedDates.length - 1]}`}
                              {selectedDates.length > 1 &&
                                ` (${selectedDates.length} days)`}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-start space-x-3">
                          <Clock className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
                          <div>
                            <p className="text-sm text-muted-foreground">
                              Time Slot
                            </p>
                            <p className="font-medium">{timeSlot}</p>
                          </div>
                        </div>
                      </div>

                      {/* Location */}
                      <div className="flex items-start space-x-3">
                        <MapPin className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
                        <div>
                          <p className="text-sm text-muted-foreground">
                            Location
                          </p>
                          <p className="font-medium">
                            {venue?.location?.street
                              ? venue?.location?.street +
                                " " +
                                venue?.location?.houseNumber
                              : "/"}
                          </p>
                          {/* Optional: Add Get Directions button if lat/lng available */}
                        </div>
                      </div>

                      {/* Venue Image */}
                      {venue?.images && venue.images.length > 0 && (
                        <div className="rounded-lg overflow-hidden aspect-[16/9] mt-2">
                          <div className="relative w-full h-full">
                            <Image
                              src={venue.images[0].url}
                              alt={venue.images[0].alt || venue.name}
                              fill
                              className="w-full h-full object-cover"
                            />
                          </div>
                        </div>
                      )}
                      {/* Optional: View Photos Button */}
                      {/* <div className="flex justify-start mt-1"> ... </div> */}
                    </div>
                  </CardContent>
                </Card>
              </AnimatedSection>

              {/* Services Details Card */}
              {services.length > 0 && (
                <AnimatedSection
                  animation="fade-in"
                  delay={200}
                  className="mt-8"
                >
                  <Card>
                    <CardHeader className="border-b">
                      <CardTitle className="text-xl md:text-2xl">
                        Booked Services
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-6">
                      <div className="space-y-6">
                        {services.map((service) => (
                          <div
                            key={service.id}
                            className="flex flex-col sm:flex-row gap-4"
                          >
                            {/* Service Image */}
                            <div className="w-full sm:w-1/4 flex-shrink-0">
                              <div className="rounded-lg overflow-hidden aspect-video bg-muted">
                                <div className="relative w-full h-full">
                                  {service.image && (
                                    <Image
                                      fill
                                      src={service.image}
                                      alt={service.name}
                                      className="w-full h-full object-cover"
                                    />
                                  )}
                                </div>
                              </div>
                            </div>
                            {/* Service Info */}
                            <div className="flex-1">
                              <div className="flex justify-between items-start">
                                <div>
                                  <h3 className="font-semibold">
                                    {service.name}
                                  </h3>
                                  {/* Display service dates */}
                                  <div className="flex items-center mt-1 text-xs bg-secondary px-1.5 py-0.5 rounded-full w-fit border">
                                    <Calendar className="h-3 w-3 mr-1 text-muted-foreground" />
                                    <span className="text-muted-foreground">
                                      {/* Logic to display service dates based on selection */}
                                      {service.selectedDays.length === 0 &&
                                      selectedDates.length === 1
                                        ? `Event day (${selectedDates[0]})`
                                        : service.selectedDays.length > 0
                                          ? `${service.selectedDays.length} day(s)`
                                          : "Event duration"}
                                    </span>
                                  </div>
                                </div>
                                <span className="font-semibold">
                                  {formatDisplayPrice(
                                    service.totalCalculatedPrice
                                  )}
                                </span>
                              </div>
                              {/* Optional: View Details Button */}
                              {/* <div className="mt-3 flex justify-start items-center"> ... </div> */}
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </AnimatedSection>
              )}
            </div>

            {/* Right Section - Payment details and Actions */}
            <div className="lg:col-span-1">
              <div className="lg:sticky lg:top-24 space-y-8">
                {/* Payment Summary Card */}
                <AnimatedSection animation="fade-in" delay={300}>
                  <Card>
                    <CardHeader className="border-b">
                      <CardTitle className="text-xl md:text-2xl">
                        Payment Summary
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-6">
                      <div className="space-y-2">
                        {/* Display calculated totals */}
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">
                            Venue ({selectedDates.length} day
                            {selectedDates.length !== 1 ? "s" : ""})
                          </span>
                          <span>{formatDisplayPrice(venuePrice)}</span>
                        </div>
                        {servicesTotal > 0 && (
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">
                              Services ({services.length})
                            </span>
                            <span>{formatDisplayPrice(servicesTotal)}</span>
                          </div>
                        )}
                        {/* Add placeholders for fees/taxes if needed, otherwise omit */}
                        {/* <div className="flex justify-between text-sm">...</div> */}
                        <Separator className="my-2" />
                        <div className="flex justify-between font-semibold">
                          <span>Total Paid</span>
                          {/* Use the total from Stripe if available, otherwise calculated */}
                          <span>{formatDisplayPrice(estimatedTotal)}</span>
                        </div>
                      </div>

                      {/* Payment Method (Placeholder - Stripe doesn't easily expose this post-session) */}
                      <div className="mt-4 pt-4 border-t text-sm">
                        <div className="flex">
                          <CreditCard className="h-4 w-4 mr-2 text-muted-foreground shrink-0 mt-0.5" />
                          <div>
                            <p className="font-medium">Payment Method</p>
                            <p className="text-muted-foreground">
                              Card (via Stripe)
                            </p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </AnimatedSection>

                {/* Need Help Card */}
                <AnimatedSection animation="fade-in" delay={400}>
                  <Card>
                    <CardHeader className="border-b">
                      <CardTitle className="text-xl md:text-2xl">
                        Need Help?
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-6">
                      <div className="space-y-4">
                        <p className="text-sm text-muted-foreground">
                          Questions about your booking? Contact our support team
                          or view your bookings in your dashboard.
                        </p>
                        <Button
                          variant="outline"
                          className="w-full"
                          onClick={() => router.push("/help-center")} // Update with your help route
                        >
                          <PhoneCall className="mr-2 h-4 w-4" /> Contact Support
                        </Button>
                        {session?.user && (
                          <Button
                            variant="outline"
                            className="w-full"
                            onClick={() => router.push("/account/bookings")}
                          >
                            <Calendar className="mr-2 h-4 w-4" /> My Bookings
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </AnimatedSection>

                {/* Return Home Button */}
                <AnimatedSection animation="fade-in" delay={500}>
                  <Button
                    className="w-full"
                    size="lg" // Make it prominent
                    onClick={() => router.push(rootRoute.value)}
                  >
                    <Home className="mr-2 h-5 w-5" /> Return to Homepage
                  </Button>
                </AnimatedSection>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
