"use client";

import React from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Calendar, Clock, MapPin, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
// Import updated types and hook from context
import { useCart, Service as CartServiceType } from "@/app/context/CartContext"; // Renamed Service import
import { useToast } from "@/hooks/useToast";
import AnimatedSection from "@/components/ui/AnimatedSection";
// Optional: Import mockServices to potentially link recommended services
import { mockServices } from "@/lib/mockServices";

// Hardcoded recommended services (Placeholder - Ideally fetch dynamically)
const recommendedServicesData = [
  // Find actual IDs from mockServices if possible, or use placeholders
  { id: mockServices[2]?.id || "rec-101", name: "Gourmet Gatherings Catering", image: mockServices[2]?.images[0]?.url || "", category: "Catering", price: `$${mockServices[2]?.price.basePrice || 1500} / hour` },
  { id: mockServices[3]?.id || "rec-102", name: "Rhythm Revolution DJ Services", image: mockServices[3]?.images[0]?.url || "", category: "Entertainment", price: `$${mockServices[3]?.price.basePrice || 800} / day` },
  { id: mockServices[0]?.id || "rec-103", name: "Ethereal Blooms Floral Design", image: mockServices[0]?.images[0]?.url || "", category: "Decoration", price: `$${mockServices[0]?.price.basePrice || 1200} / day` },
];


// Helper function to format price based on model (can be moved to utils)
const formatDisplayPrice = (amount: number, model?: 'hour' | 'day' | 'week'): string => {
  const base = `$${amount.toLocaleString()}`;
  switch (model) {
    case 'hour': return `${base} / hour*`;
    case 'day': return `${base} / event day`;
    case 'week': return `${base} / week`;
    default: return base;
  }
};


const Cart: React.FC = () => {
  // Use the renamed type to avoid conflict
  const { cart, removeService, clearCart } = useCart();
  const { toast } = useToast(); // Keep toast if needed, although not used in this refactor
  const router = useRouter();

  // --- Price Calculation ---
  // Use numeric values directly from context
  const getVenuePrice = (): number => {
    if (!cart?.venue?.price) return 0;
    const numDays = cart.selectedDates.length || 1; // Default to 1 day if somehow empty
    // Venue price calculation depends on its model
    switch (cart.venue.price.model) {
        case 'day':
            return cart.venue.price.basePrice * numDays;
        case 'hour': // Hourly venue price calculation is complex, show base or 0 for now
            // return cart.venue.price.basePrice * estimatedHours; // Needs more info
            return 0; // Or display base price without multiplication?
        case 'week':
             // Simple week calculation might be base * numWeeks, needs logic
            return cart.venue.price.basePrice; // Show base for now
        default:
            return cart.venue.price.basePrice; // Fallback for unknown models
    }
  };

  const getServicesTotal = (): number => {
    if (!cart?.services?.length) return 0;
    // Use the pre-calculated total price stored in the cart service object
    return cart.services.reduce((total, service) => {
      return total + service.totalCalculatedPrice;
    }, 0);
  };

  const getTotalBookingPrice = (): number => {
      return getVenuePrice() + getServicesTotal();
  };

  const handleCheckout = () => {
      // Implement checkout logic or navigation
    router.push("/checkout"); // Example navigation
     toast({ title: "Proceeding to Checkout", description: "Redirecting to payment..." });
  };

  // --- Empty Cart Display ---
  if (!cart || !cart.venue) {
    return (
      <div className="mt-10 min-h-screen flex flex-col">
        <main className="flex-grow container mx-auto px-4 py-16">
          <div className="text-center py-16 bg-secondary/20 border border-dashed rounded-lg"> {/* Added styling */}
            <h2 className="text-2xl font-display font-bold mb-4">
              Your booking is empty
            </h2>
            <p className="text-muted-foreground mb-8">
              Start by selecting a venue for your event.
            </p>
            <Button asChild size="lg"><Link href="/venues">Browse Venues</Link></Button>
          </div>
        </main>
      </div>
    );
  }

  // --- Date Formatting ---
  const formatServiceDates = (service: CartServiceType): string => {
    // Service object now reliably has selectedDays array
    const days = service.selectedDays || [];
    if (!cart?.selectedDates) return "Dates N/A"; // Safety check

    // If service selectedDays is empty, it means it's for a single-day event OR not day-specific
    if (days.length === 0 && cart.selectedDates.length === 1) {
        return `Event day (${cart.selectedDates[0]})`;
    }
    // If service selectedDays matches all event dates
    if (days.length > 0 && days.length === cart.selectedDates.length && days.every((d, i) => d === cart.selectedDates[i])) {
      return `All event days (${days.length})`;
    }
    // If specific days selected for the service
    if (days.length === 1) return `1 day (${days[0]})`;
    if (days.length > 1 && days.length < 4) { // Show individual dates if few
        return `${days.length} days: ${days.join(", ")}`;
    }
    if (days.length >= 4) { // Show range if many
        // Ensure days are sorted before showing range
        const sortedDays = [...days].sort();
        return `${days.length} days (${sortedDays[0]} to ${sortedDays[sortedDays.length - 1]})`;
    }

    return "Specific dates selected"; // Fallback
  };

  const isMultiDay = cart.selectedDates.length > 1;

  return (
    <div className="mt-10 min-h-screen flex flex-col">
      <main className="flex-grow container mx-auto px-4 py-8">
        <AnimatedSection animation="fade-in">
          <Link
            href="/services" // Link to services page maybe?
            className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-6" // Consistent styling
          >
            <ArrowLeft className="mr-1.5 h-4 w-4" /> {/* Consistent styling */}
            Back to Services
          </Link>

          <h1 className="text-3xl font-display font-bold mb-8">Your Booking</h1>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 xl:gap-12"> {/* Added xl gap */}
            {/* Left Side */}
            <div className="lg:col-span-2 space-y-8">
              {/* Selected Venue Section */}
              <div className="bg-card border border-border rounded-xl p-6 shadow-sm"> {/* Added shadow */}
                <h2 className="text-xl font-display font-semibold mb-4">
                  Selected Venue
                </h2>
                <div className="flex flex-col sm:flex-row gap-4"> {/* sm breakpoint */}
                  <div className="w-full sm:w-1/3 flex-shrink-0">
                    <div className="aspect-video rounded-lg overflow-hidden bg-muted"> {/* Added bg */}
                      {/* Access venue image correctly */}
                      <img
                        src={cart.venue.images?.[0]?.url || "https://via.placeholder.com/300x200?text=No+Venue+Image"}
                        alt={cart.venue.images?.[0]?.alt || cart.venue.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                  <div className="flex-1">
                    <h3 className="font-display font-semibold text-lg">
                      {cart.venue.name}
                    </h3>
                     {/* Access venue location correctly */}
                    <div className="flex items-center text-sm text-muted-foreground mt-1">
                      <MapPin className="h-4 w-4 mr-1.5 flex-shrink-0" />
                      <span>{cart.venue.location?.address || 'Location not specified'}</span>
                    </div>
                    <div className="flex flex-col mt-2 gap-1 text-sm">
                      <div className="flex items-center text-muted-foreground">
                        <Calendar className="h-4 w-4 mr-1.5 flex-shrink-0" />
                        <span>
                          {isMultiDay
                            ? `${cart.selectedDates.length} dates (${
                                cart.selectedDates[0]
                              } to ${
                                cart.selectedDates[cart.selectedDates.length - 1]
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
                       <span className="font-semibold">{formatDisplayPrice(cart.venue.price.basePrice, cart.venue.price.model)}</span>
                       {/* Clarify multiplication only if price model is 'day' */}
                       {cart.venue.price.model === 'day' && (
                           <span className="text-sm text-muted-foreground ml-1">
                            × {cart.selectedDates.length} day{cart.selectedDates.length !== 1 ? "s" : ""}
                          </span>
                       )}
                    </div>
                  </div>
                </div>
                 {/* Keep selected dates display if multi-day */}
                {/* {isMultiDay && ( ... )} */}
              </div>

              {/* Services Section */}
              <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-display font-semibold">
                    Added Services ({cart.services.length})
                  </h2>
                  <Button asChild variant="outline" size="sm"><Link href="/services" className="flex items-center gap-1"><Plus className="h-4 w-4" />Add Services</Link></Button>
                </div>

                {cart.services.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground border border-dashed rounded-md bg-secondary/20"> {/* Added styling */}
                    <p className="font-medium">No services added yet.</p>
                    <p className="text-sm mt-1">
                      Browse services to enhance your event.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {cart.services.map((service) => (
                      <div
                        key={service.id} // Use string ID
                        className="flex items-start gap-4 p-3 border border-border rounded-lg bg-background hover:bg-secondary/20 transition-colors" // Added hover, padding, bg
                      >
                        <div className="w-16 h-16 rounded-md overflow-hidden flex-shrink-0 bg-muted"> {/* Added bg */}
                           {/* Use service image from context */}
                          <img
                            src={service.image || "https://via.placeholder.com/100x100?text=No+Image"}
                            alt={service.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex-1">
                          <div className="flex justify-between items-start mb-1"> {/* Align items start */}
                            <h4 className="font-medium leading-tight">{service.name}</h4>
                            {/* Use string ID for removeService */}
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => removeService(service.id)}
                              className="text-muted-foreground hover:text-destructive h-7 w-7 flex-shrink-0" // Smaller button
                              aria-label={`Remove ${service.name}`}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                          {/* Category removed - not in Service type */}
                          {/* <p className="text-sm text-muted-foreground">{service.category}</p> */}

                           {/* Format selected dates */}
                          <div className="flex items-center mt-1 text-xs bg-secondary px-1.5 py-0.5 rounded-full w-fit border"> {/* Adjusted styling */}
                            <Calendar className="h-3 w-3 mr-1 text-muted-foreground" />
                            <span className="text-muted-foreground">
                              {formatServiceDates(service)}
                            </span>
                          </div>

                          {/* Customizations removed */}

                          {/* Display total calculated price */}
                          <p className="text-sm font-semibold mt-2">
                             {formatDisplayPrice(service.totalCalculatedPrice)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Recommended Services Section */}
              <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
                <h2 className="text-xl font-display font-semibold mb-4">
                  You Might Also Need
                </h2>
                {/* Check if recommended services exist before mapping */}
                {recommendedServicesData.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {recommendedServicesData.map((recService) => (
                        <div
                          key={recService.id}
                          className="border border-border rounded-lg overflow-hidden bg-background transition-shadow hover:shadow-md" // Added hover effect
                        >
                          <div className="aspect-video overflow-hidden bg-muted">
                            <img
                              src={recService.image || "https://via.placeholder.com/300x200?text=No+Image"}
                              alt={recService.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="p-3"> {/* Reduced padding */}
                            <h3 className="font-medium text-sm truncate">{recService.name}</h3> {/* Truncate long names */}
                            <p className="text-xs text-muted-foreground mb-2">
                              {recService.category}
                            </p>
                            <div className="flex justify-between items-center">
                              <span className="font-semibold text-sm">{recService.price}</span>
                              {/* Ensure link uses the correct service ID */}
                              <Button variant="outline" size="sm" asChild><Link href={`/services/${recService.id}`}>View</Link></Button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                ) : (
                     <p className="text-sm text-muted-foreground text-center py-4">No recommendations available.</p>
                )}

              </div>
            </div>

            {/* Summary Sidebar */}
            <div className="lg:col-span-1">
              <div className="sticky top-24 bg-card border border-border rounded-xl p-6 shadow-sm"> {/* Added shadow */}
                <h2 className="text-xl font-display font-semibold mb-4">
                  Summary
                </h2>
                <div className="space-y-3 text-sm"> {/* Base text size */}
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Venue Total</span>
                    {/* Format venue price */}
                    <span>{formatDisplayPrice(getVenuePrice())}</span>
                  </div>
                  {/* Clarification for venue price */}
                   {cart.venue.price.model === 'day' && (
                       <div className="text-xs text-muted-foreground pl-4">
                           ({formatDisplayPrice(cart.venue.price.basePrice)} × {cart.selectedDates.length} day{cart.selectedDates.length !== 1 ? "s" : ""})
                       </div>
                   )}
                   {/* Add clarification for other models if needed */}

                  <div className="flex justify-between">
                    <span className="text-muted-foreground">
                      Services Total ({cart.services.length})
                    </span>
                     {/* Format services total */}
                    <span>{formatDisplayPrice(getServicesTotal())}</span>
                  </div>
                  <Separator className="my-3" />
                  <div className="flex justify-between font-semibold text-base"> {/* Larger total */}
                    <span>Estimated Total</span>
                     {/* Format grand total */}
                    <span>{formatDisplayPrice(getTotalBookingPrice())}</span>
                  </div>
                </div>
                <Button
                  className="w-full mt-6"
                  size="lg"
                  onClick={handleCheckout}
                  disabled={!cart.venue} // Disable if no venue
                >
                  Proceed to Checkout
                </Button>
                <p className="text-xs text-center text-muted-foreground mt-3">
                  You can review all details before payment.
                </p>
                <Button
                  variant="ghost"
                  size="sm" // Smaller clear button
                  className="w-full mt-4 text-sm text-muted-foreground hover:text-destructive" // Subtle clear
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