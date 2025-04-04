"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { useToast } from "../../hooks/useToast";
import { Venue } from "@/lib/mockVenues";

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
      id: "0",
      name: venueName,
      location: {
        address: location,
        city: "Los Angeles",
        street: "Sunset Blvd",
        houseNumber: 123,
        country: "USA",
        postalCode: 90026
      },
      price: {
        basePrice: 500,
        model: "day"
      },
      reviews: [],
      seating: {
        seated: 150,
        standing: 50
      },
      description: "",
      images: [],
      amenities: [],
      policies: {
        bannedServices: [],
        listOfPolicies: []
      },
      bookedDates: selectedDates.map((date) =>{ return {
          date: new Date(date),
          bookingRef: "0"
        }}),
      availabilityRules: {
        blockedWeekdays: []
      },
      category: [],
      type: "",
      status: "pending",
      capacity: 200,
      owner: "0",
      rating: {
        average: 0,
        count: 0
      },
      sponsored: {
        isActive: false,
        until: new Date(),
        planType: ""
      }
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

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};
