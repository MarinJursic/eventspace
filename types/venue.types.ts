export interface IVenueClientState {
  _id?: string;
  name: string;
  location: {
    address: string;
    city: string;
    street: string;
    houseNumber: string;
    country: string;
    postalCode: string;
    lat?: number;
    lng?: number;
  };
  price: {
    basePrice: number;
    model: string;
  };
  reviews: string[];
  seating?: {
    seated: number;
    standing: number;
  };
  description?: string;
  images: {
    file?: File;
    url: string;
    alt: string;
    width?: number;
    height?: number;
    caption: string;
  }[];
  amenities?: string[];
  services: string[];
  policies?: {
    bannedServices: string[];
    listOfPolicies: {
      name: string;
      description: string;
    }[];
  };
  bookedDates: {
    date: string | number;
    bookingRef?: string;
  }[];
  availabilityRules?: {
    blockedWeekdays: {
      weekday: string;
      recurrenceRule: string;
    }[];
  };
  category: string;
  type?: string;
  status:
    | "pending"
    | "approved"
    | "rejected"
    | "softDeleted"
    | "deleted"
    | "active"
    | "inactive";
  capacity: number;
  owner: string;
  rating: {
    average: number;
    count: number;
  };
  sponsored: {
    isActive: boolean;
    until?: string | number;
    planType?: string;
  };
  createdAt?: string;
  updatedAt?: string;
}

export interface PopulatedOwnerInfo {
  _id: string;
  id: string;
  name: string;
  email?: string; // Optional: Add if populated and needed
}

export interface PopulatedReviewUserInfo {
  _id: string;
  id: string;
  name: string;
}

export interface PopulatedAmenityClient {
  _id: string;
  id: string; // Mongoose virtual added via toObject/serialize
  key: string;
  label: string;
  icon?: string; // Optional icon name string from Enum
}

export interface SerializedLocation {
  address: string;
  city?: string;
  street?: string;
  houseNumber?: string; // Keep as string to match schema/input
  country?: string;
  postalCode?: string; // Keep as string to match schema/input
  latitude?: number;
  longitude?: number;
}
export interface SerializedPrice {
  basePrice: number;
  model: "hour" | "day" | "week";
}
export interface SerializedRating {
  average: number;
  count: number;
}
export interface SerializedSeating {
  seated: number;
  standing: number;
}
export interface SerializedImage {
  url: string;
  alt?: string;
  caption?: string;
}
export interface SerializedPolicyItem {
  name: string;
  description: string;
}
// Type for policies with potentially populated banned services
export interface SerializedPopulatedPolicies {
  bannedServices?: PopulatedAmenityClient[]; // Use the populated type for banned services if they are Enums
  listOfPolicies?: SerializedPolicyItem[];
}
export interface SerializedBookedDate {
  date: string; // Date as ISO string
  bookingRef?: string; // ObjectId as string
}
export interface SerializedBlockedWeekday {
  weekday: string;
  recurrenceRule: "weekly" | "biweekly" | "monthly";
}
export interface SerializedAvailabilityRules {
  blockedWeekdays?: SerializedBlockedWeekday[];
}
// Type for serialized reviews with populated user info
export interface SerializedPopulatedReview {
  id: string;
  _id: string;
  user: PopulatedReviewUserInfo;
  rating: number;
  comment?: string;
  target: string;
  targetModel: "Venue" | "Service";
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
}

// Type for the fully populated and serialized Venue for Detail View
export interface SerializedPopulatedVenue {
  id: string;
  _id: string;
  name: string;
  location: SerializedLocation;
  price: SerializedPrice;
  seating?: SerializedSeating;
  description?: string;
  images: SerializedImage[];
  amenities?: PopulatedAmenityClient[]; // Populated
  reviews?: SerializedPopulatedReview[]; // Populated reviews with user
  policies?: SerializedPopulatedPolicies; // Populated policies
  bookedDates?: SerializedBookedDate[];
  availabilityRules?: SerializedAvailabilityRules;
  category?: PopulatedAmenityClient; // Populated category (assuming it's an Enum ref)
  type?: string;
  status: string;
  capacity?: number;
  owner: PopulatedOwnerInfo; // Populated owner
  rating: SerializedRating;
  sponsored?: { isActive: boolean; until?: string; planType?: string };
  createdAt?: string;
  updatedAt?: string;
}

// Type for the serialized Venue for List View (less populated)
export interface SerializedVenueListItem {
  id: string;
  _id: string;
  name: string;
  location: SerializedLocation;
  price: SerializedPrice;
  images: SerializedImage[];
  type?: string;
  rating: SerializedRating;
  sponsored?: { isActive: boolean };
  amenities?: PopulatedAmenityClient[]; // Include populated amenities for card display
  capacity?: number; // Include capacity if needed for card display
}
// --- End Type Definitions ---
