"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { useToast } from "../../hooks/useToast";
// Assuming Venue type is correctly imported from its location
import { Venue } from "@/lib/mockVenues"; // Adjust path if needed

// --- Updated Service type to match data from ServiceDetail ---
export type Service = {
  id: string; // Changed to string to match MockService id
  name: string;
  image: string;
  price: number; // Base price (numeric)
  priceModel: 'hour' | 'day' | 'week'; // Added price model
  selectedDays: string[]; // Specific days this service is for (can be empty for single day)
  totalCalculatedPrice: number; // Pre-calculated total price from ServiceDetail
};

// CartItem uses the updated Service type
export type CartItem = {
  venue: Venue;
  selectedDates: string[]; // Selected dates for the booking
  timeSlot: string; // Consider if this is always needed or optional
  services: Service[];
};

// CartContextType updated for string ID in removeService
type CartContextType = {
  cart: CartItem | null;
  addVenue: (venue: Venue, selectedDates: string[], timeSlot: string) => void;
  addExternalVenue: (
    venueName: string,
    location: string,
    selectedDates: string[]
  ) => void;
  addService: (service: Service) => void; // Simplified signature
  removeService: (serviceId: string) => void; // Changed serviceId to string
  clearCart: () => void;
  hasVenue: boolean;
  selectedDates: string[];
  eventTimeSlot: string; // Keep for now, maybe adjust based on venue logic
  isMultiDay: boolean;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [cart, setCart] = useState<CartItem | null>(null);
  const { toast } = useToast();

  // Load cart from localStorage on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedCart = localStorage.getItem("eventCart");
      if (savedCart) {
        try {
          // Add validation/migration logic if needed for old cart structures
          const parsedCart = JSON.parse(savedCart);
           // Basic check to see if it looks like a valid cart
          if (parsedCart && parsedCart.venue && parsedCart.selectedDates) {
                setCart(parsedCart);
          } else {
              console.warn("Invalid cart structure found in localStorage. Clearing.");
              localStorage.removeItem("eventCart");
          }
        } catch (e) {
          console.error("Failed to parse cart from localStorage", e);
          localStorage.removeItem("eventCart"); // Clear invalid data
        }
      }
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    if (typeof window !== "undefined") {
      if (cart) {
        localStorage.setItem("eventCart", JSON.stringify(cart));
      } else {
        localStorage.removeItem("eventCart");
      }
    }
  }, [cart]);

  // addVenue remains mostly the same, ensure Venue type matches
  const addVenue = (
    venue: Venue,
    selectedDates: string[],
    timeSlot: string
  ) => {
     // If switching venue, decide whether to keep services or clear them
     const shouldClearServices = cart?.venue?.id !== venue.id; // Clear if venue changes
     const existingServices = shouldClearServices ? [] : cart?.services || [];

     if (shouldClearServices && (cart?.services?.length ?? 0) > 0) {
         toast({
             title: "Venue Changed",
             description: `Venue updated to ${venue.name}. Previous services removed.`,
             variant: "default", // Use default or info variant
         });
     }


    setCart({
      venue,
      selectedDates,
      timeSlot,
      services: existingServices, // Reset services if venue changed
    });

    const dateText =
      selectedDates.length === 1
        ? selectedDates[0]
        : `${selectedDates.length} dates (${selectedDates[0]} to ${
            selectedDates[selectedDates.length - 1]
          })`;

    toast({
      title: "Venue Added",
      description: `${venue.name} added for ${dateText}.`,
    });
  };

  // addExternalVenue remains mostly the same, ensure Venue structure is correct
  const addExternalVenue = (
    venueName: string,
    location: string,
    selectedDates: string[]
  ) => {
    // External venue creation logic (ensure it matches Venue type)
    const externalVenue: Venue = {
      id: `external`, // Generate a unique ID for external venues
      name: venueName,
      location: { // Basic location structure
        address: location,
        city: "", // May need more detailed inputs in the modal later
        street: "",
        houseNumber: 0,
        country: "",
        postalCode: 0,
      },
      // Add other required fields with default/placeholder values
      price: { basePrice: 0, model: 'day' },
      reviews: [],
      description: "Externally added venue",
      images: [], // Provide a default placeholder image?
      policies: undefined, // Keep optional fields undefined or provide defaults
      bookedDates: [], // May not be relevant for external
      category: ["external"],
      type: "External Venue",
      status: 'active',
      owner: 'external',
      rating: { average: 0, count: 0 },
      sponsored: { isActive: false },
      // Add any other mandatory fields from Venue type with defaults
      amenities: [],
      capacity: 0,
      seating: {
        seated: 0,
        standing: 0
      },
      availabilityRules: {
        blockedWeekdays: [
          { weekday: "Sunday", recurrenceRule: "weekly" }
        ]
      },
    };

     // Clear services if switching from a non-external venue or another external one
     const shouldClearServices = cart?.venue && !cart.venue.id.startsWith('external-');
     const existingServices = shouldClearServices ? [] : cart?.services || [];
      if (shouldClearServices && (cart?.services?.length ?? 0) > 0) {
          toast({
              title: "Venue Changed",
              description: `External venue ${venueName} added. Previous services removed.`,
              variant: "default",
          });
      }


    setCart({
      venue: externalVenue,
      selectedDates,
      timeSlot: "Full day", // Default time slot seems reasonable
      services: existingServices,
    });

    const dateText =
      selectedDates.length === 1
        ? selectedDates[0]
        : `${selectedDates.length} dates (${selectedDates[0]} to ${
            selectedDates[selectedDates.length - 1]
          })`;

    toast({
      title: "External Venue Added",
      description: `${venueName} added for ${dateText}.`,
    });
  };

  // --- Updated addService ---
  const addService = (service: Service) => { // Parameter now expects the new Service type
    if (!cart || !cart.venue) { // Ensure cart and venue exist
      toast({
        title: "No venue selected",
        description: "Please select a venue first before adding services.",
        variant: "destructive",
      });
      return;
    }

    // Check if the service (by string ID) is already added
    if (cart.services.some((s) => s.id === service.id)) {
      toast({
        title: "Service already added",
        description: `${service.name} is already in your booking.`,
        // Consider allowing updates instead of just showing an error?
        // variant: "destructive", // Maybe use 'default' or 'info' instead
      });
      return; // Stop if service already exists
    }

    // The 'service' object passed in already contains the correct:
    // - id, name, image, price, priceModel, selectedDays, totalCalculatedPrice
    // No need to recalculate price or manually set selectedDays here.

    setCart({
      ...cart,
      services: [...cart.services, service], // Add the service object directly
    });

    // Determine days text based on the service's selectedDays
    const daysCount = service.selectedDays.length;
    const daysText = daysCount === 0 // Handle single-day case (empty selectedDays array)
        ? "your event date"
        : daysCount === 1
        ? `1 selected day (${service.selectedDays[0]})`
        : `${daysCount} selected days`;

    toast({
      title: "Service Added",
      description: `${service.name} added to your booking for ${daysText}.`,
    });
  };

  // Helper removed - no longer needed
  // const calculateServiceTotalPrice = (...) => { ... };

  // --- Updated removeService ---
  const removeService = (serviceId: string) => { // serviceId is now string
    if (!cart) return;
    const service = cart.services.find((s) => s.id === serviceId); // Find by string ID
    setCart({
      ...cart,
      services: cart.services.filter((s) => s.id !== serviceId), // Filter by string ID
    });

    if (service) {
      toast({
        title: "Service removed",
        description: `${service.name} has been removed from your booking.`,
      });
    }
  };

  const clearCart = () => {
    setCart(null);
    // Optional: Clear localStorage explicitly if needed, though useEffect handles it
    // if (typeof window !== "undefined") { localStorage.removeItem("eventCart"); }
    toast({
      title: "Booking Cleared",
      description: "Your current booking details have been cleared.",
    });
  };

  const isMultiDay = cart ? cart.selectedDates.length > 1 : false;

  return (
    <CartContext.Provider
      value={{
        cart,
        addVenue,
        addExternalVenue,
        addService,
        removeService,
        clearCart,
        hasVenue: !!cart?.venue,
        selectedDates: cart?.selectedDates || [],
        eventTimeSlot: cart?.timeSlot || "", // Ensure this is handled appropriately
        isMultiDay,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};
