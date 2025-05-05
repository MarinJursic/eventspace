import { IVenueClientState } from "@/types/venue.types";

export const defaultVenueClientState: IVenueClientState = {
  name: "",
  location: {
    address: "",
    city: "",
    street: "",
    houseNumber: "",
    country: "",
    postalCode: "",
    lat: 45.813093,
    lng: 15.977643,
  },
  price: {
    basePrice: 0,
    model: "day",
  },
  reviews: [],
  seating: {
    seated: 0,
    standing: 0,
  },
  description: "",
  images: [],
  amenities: [],
  services: [],
  policies: {
    bannedServices: [],
    listOfPolicies: [],
  },
  bookedDates: [],
  availabilityRules: {
    blockedWeekdays: [],
  },
  type: "",
  category: "",
  status: "pending",
  capacity: 0,
  owner: "",
  rating: {
    average: 0,
    count: 0,
  },
  sponsored: {
    isActive: false,
    until: undefined,
    planType: undefined,
  },
};
