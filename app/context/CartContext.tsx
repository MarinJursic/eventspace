"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { useToast } from "../../hooks/useToast";

type ServiceCustomization = {
  id: number;
  name: string;
  price: string;
  default: boolean;
};

export type Service = {
  id: number;
  name: string;
  image: string;
  category: string;
  price: string;
  priceNumeric?: number;
  perUnit?: string;
  rating: number;
  reviewCount: number;
  selectedCustomizations?: ServiceCustomization[];
  selectedDays?: string[]; // Specific days this service is for
  totalPrice?: string;
};

export type Venue = {
  id: number;
  name: string;
  image: string;
  location: string;
  price: string;
  rating: number;
  reviewCount: number;
  isExternal?: boolean; // Flag to indicate external venue
};

export type CartItem = {
  venue: Venue;
  selectedDates: string[]; // Selected dates for the booking
  timeSlot: string;
  services: Service[];
};

type CartContextType = {
  cart: CartItem | null;
  addVenue: (venue: Venue, selectedDates: string[], timeSlot: string) => void;
  addExternalVenue: (
    venueName: string,
    location: string,
    selectedDates: string[]
  ) => void;
  addService: (service: Service, selectedDays?: string[]) => void;
  removeService: (serviceId: number) => void;
  clearCart: () => void;
  hasVenue: boolean;
  selectedDates: string[];
  eventTimeSlot: string;
  isMultiDay: boolean;
  isExternalVenue: boolean;
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
          setCart(JSON.parse(savedCart));
        } catch (e) {
          console.error("Failed to parse cart from localStorage", e);
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

  const addVenue = (
    venue: Venue,
    selectedDates: string[],
    timeSlot: string
  ) => {
    setCart({
      venue,
      selectedDates,
      timeSlot,
      services: cart?.services || [],
    });

    const dateText =
      selectedDates.length === 1
        ? selectedDates[0]
        : `${selectedDates.length} dates (${selectedDates[0]} to ${
            selectedDates[selectedDates.length - 1]
          })`;

    toast({
      title: "Venue added",
      description: `${venue.name} has been added to your booking for ${dateText}`,
    });
  };

  const addExternalVenue = (
    venueName: string,
    location: string,
    selectedDates: string[]
  ) => {
    const externalVenue: Venue = {
      id: 0, // Special ID for external venues
      name: venueName,
      image:
        "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?ixlib=rb-4.0.3&auto=format&fit=crop&w=2148&q=80",
      location,
      price: "N/A",
      rating: 0,
      reviewCount: 0,
      isExternal: true,
    };

    setCart({
      venue: externalVenue,
      selectedDates,
      timeSlot: "Full day", // Default time slot for external venues
      services: cart?.services || [],
    });

    const dateText =
      selectedDates.length === 1
        ? selectedDates[0]
        : `${selectedDates.length} dates (${selectedDates[0]} to ${
            selectedDates[selectedDates.length - 1]
          })`;

    toast({
      title: "External venue added",
      description: `${venueName} has been added to your booking for ${dateText}`,
    });
  };

  const addService = (service: Service, selectedDays?: string[]) => {
    if (!cart) {
      toast({
        title: "No venue selected",
        description: "Please select a venue first before adding services",
        variant: "destructive",
      });
      return;
    }

    // Check if the service is already added
    if (cart.services.some((s) => s.id === service.id)) {
      toast({
        title: "Service already added",
        description: `${service.name} is already in your booking`,
        variant: "destructive",
      });
      return;
    }

    const serviceDays = selectedDays || [...cart.selectedDates];

    const serviceWithDays = {
      ...service,
      selectedDays: serviceDays,
      totalPrice: calculateServiceTotalPrice(service, serviceDays.length),
    };

    setCart({
      ...cart,
      services: [...cart.services, serviceWithDays],
    });

    const daysText =
      serviceDays.length === 1 ? "1 day" : `${serviceDays.length} days`;

    toast({
      title: "Service added",
      description: `${service.name} has been added to your booking for ${daysText}`,
    });
  };

  // Helper: calculate total price for a service
  const calculateServiceTotalPrice = (
    service: Service,
    numberOfDays: number
  ): string => {
    if (service.priceNumeric) {
      const total = service.priceNumeric * numberOfDays;
      return `$${total.toLocaleString()}`;
    }
    return `${service.price} (per day)`;
  };

  const removeService = (serviceId: number) => {
    if (!cart) return;
    const service = cart.services.find((s) => s.id === serviceId);
    setCart({
      ...cart,
      services: cart.services.filter((s) => s.id !== serviceId),
    });

    if (service) {
      toast({
        title: "Service removed",
        description: `${service.name} has been removed from your booking`,
      });
    }
  };

  const clearCart = () => {
    setCart(null);
    toast({
      title: "Booking cleared",
      description: "Your booking has been cleared",
    });
  };

  const isMultiDay = cart ? cart.selectedDates.length > 1 : false;
  const isExternalVenue = cart?.venue?.isExternal || false;

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
        isExternalVenue,
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
