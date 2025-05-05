"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { useToast } from "../../hooks/useToast";
import { v4 as uuidv4 } from "uuid";
export interface CartVenue {
  id: string;
  name: string;
  description?: string;
  location: {
    address: string;
    city?: string;
    street?: string;
    houseNumber?: string;
  };
  price: {
    basePrice: number;
    model: "hour" | "day" | "week";
  };
  images: {
    url: string;
    alt?: string;
    caption?: string;
  }[];
  type?: string;
  rating?: { average: number; count: number };
}

export type CartService = {
  id: string;
  name: string;
  image: string;
  price: number;
  priceModel: "hour" | "day" | "week";
  selectedDays: string[];
  totalCalculatedPrice: number;
};

export type CartItem = {
  venue: CartVenue;
  selectedDates: string[];
  timeSlot: string;
  services: CartService[];
};

// --- Define the Context Type ---
type CartContextType = {
  cart: CartItem | null;
  addVenue: (
    venue: CartVenue,
    selectedDates: string[],
    timeSlot: string
  ) => void; // Expects CartVenue
  addExternalVenue: (
    venueName: string,
    location: string,
    selectedDates: string[]
  ) => void;
  addService: (service: CartService) => void; // Expects CartService
  removeService: (serviceId: string) => void;
  clearCart: () => void;
  hasVenue: boolean;
  selectedDates: string[];
  eventTimeSlot: string;
  isMultiDay: boolean;
};

// --- Create Context ---
const CartContext = createContext<CartContextType | undefined>(undefined);

// --- Create Provider Component ---
export const CartProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [cart, setCart] = useState<CartItem | null>(null);
  const { toast } = useToast();

  // --- Load cart from localStorage on mount ---
  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedCart = localStorage.getItem("eventCart");
      if (savedCart) {
        try {
          const parsedCart: CartItem = JSON.parse(savedCart);
          // Add more robust validation if needed (e.g., check required fields)
          if (parsedCart && parsedCart.venue && parsedCart.selectedDates) {
            // Convert date strings back to Date objects if necessary for internal logic
            // (localStorage stores strings) - Although current types use strings
            setCart(parsedCart);
          } else {
            console.warn(
              "Invalid cart structure found in localStorage. Clearing."
            );
            localStorage.removeItem("eventCart");
          }
        } catch (e) {
          console.error("Failed to parse cart from localStorage", e);
          localStorage.removeItem("eventCart");
        }
      }
    }
  }, []);

  // --- Save cart to localStorage whenever it changes ---
  useEffect(() => {
    if (typeof window !== "undefined") {
      if (cart) {
        // Convert Date objects to strings before saving if necessary
        localStorage.setItem("eventCart", JSON.stringify(cart));
      } else {
        localStorage.removeItem("eventCart");
      }
    }
  }, [cart]);

  // --- addVenue ---
  const addVenue = (
    venue: CartVenue, // Expects the simplified CartVenue type
    selectedDates: string[],
    timeSlot: string
  ) => {
    const shouldClearServices = cart?.venue?.id !== venue.id;
    const existingServices = shouldClearServices ? [] : cart?.services || [];

    if (shouldClearServices && existingServices.length > 0) {
      toast({
        title: "Venue Changed",
        description: `Venue updated to ${venue.name}. Previous services removed.`,
        variant: "default",
      });
    }

    setCart({
      venue, // Store the passed CartVenue object
      selectedDates,
      timeSlot,
      services: existingServices,
    });

    const dateText =
      selectedDates.length === 1
        ? selectedDates[0]
        : `${selectedDates.length} dates (${selectedDates[0]} to ${selectedDates[selectedDates.length - 1]})`;

    toast({
      title: "Venue Added",
      description: `${venue.name} added for ${dateText}.`,
    });
  };

  // --- addExternalVenue ---
  const addExternalVenue = (
    venueName: string,
    location: string, // Simple location string from modal
    selectedDates: string[]
  ) => {
    // Create an object that conforms to the CartVenue type
    const externalVenue: CartVenue = {
      id: `external-${uuidv4()}`, // Unique ID for external
      name: venueName,
      location: { address: location, city: "" }, // Use the location string for address
      price: { basePrice: 0, model: "day" }, // Default price
      images: [
        {
          url: "https://via.placeholder.com/300x200?text=External+Venue",
          alt: venueName,
        },
      ], // Placeholder image
      // Add defaults for any other fields required by CartVenue
      type: "External",
      rating: { average: 0, count: 0 },
      // Ensure all fields required by CartVenue are present
    };

    const shouldClearServices =
      cart?.venue && !cart.venue.id.startsWith("external-");
    const existingServices = shouldClearServices ? [] : cart?.services || [];
    if (shouldClearServices && existingServices.length > 0) {
      toast({
        title: "Venue Changed",
        description: `External venue ${venueName} added. Previous services removed.`,
        variant: "default",
      });
    }

    setCart({
      venue: externalVenue,
      selectedDates,
      timeSlot: "Full day", // Default time slot
      services: existingServices,
    });

    const dateText =
      selectedDates.length === 1
        ? selectedDates[0]
        : `${selectedDates.length} dates (${selectedDates[0]} to ${selectedDates[selectedDates.length - 1]})`;

    toast({
      title: "External Venue Added",
      description: `${venueName} added for ${dateText}.`,
    });
  };

  // --- addService ---
  const addService = (service: CartService) => {
    // Expects CartService type
    if (!cart || !cart.venue) {
      toast({ title: "No venue selected", variant: "destructive" });
      return;
    }
    if (cart.services.some((s) => s.id === service.id)) {
      toast({
        title: "Service already added",
        description: `${service.name} is already in your booking.`,
      });
      return;
    }

    setCart({ ...cart, services: [...cart.services, service] });

    const daysCount = service.selectedDays.length;
    const daysText =
      daysCount === 0 ? "your event date" : `${daysCount} day(s)`;
    toast({
      title: "Service Added",
      description: `${service.name} added for ${daysText}.`,
    });
  };

  // --- removeService ---
  const removeService = (serviceId: string) => {
    if (!cart) return;
    const service = cart.services.find((s) => s.id === serviceId);
    setCart({
      ...cart,
      services: cart.services.filter((s) => s.id !== serviceId),
    });
    if (service) {
      toast({
        title: "Service removed",
        description: `${service.name} removed.`,
      });
    }
  };

  // --- clearCart ---
  const clearCart = () => {
    setCart(null);
    toast({
      title: "Booking Cleared",
      description: "Your booking details have been cleared.",
    });
  };

  // --- Derived State ---
  const isMultiDay = cart ? cart.selectedDates.length > 1 : false;

  // --- Provide Context Value ---
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
        eventTimeSlot: cart?.timeSlot || "",
        isMultiDay,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

// --- Custom Hook ---
export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};
