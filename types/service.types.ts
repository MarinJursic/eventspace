export interface IServiceClientState {
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
  description?: string;
  features: string[];
  images: {
    file?: File;
    url: string;
    alt: string;
    width?: number;
    height?: number;
    caption: string;
  }[];
  policies?: {
    listOfPolicies: {
      name: string;
      description: string;
    }[];
  };
  bookedDates: {
    date: string | number;
    bookingRef?: string;
  }[];
  availabilityRules: {
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
  owner: string;
  rating: {
    average: number;
    count: number;
  };
  sponsored: {
    isActive: boolean;
    until?: Date;
    planType?: string;
  };
  createdAt?: string;
  updatedAt?: string;
}

export interface SerializedLocation {
  address: string;
  city?: string;
  street?: string;
  houseNumber?: string; // Keep as string
  country?: string;
  postalCode?: string;
  latitude?: number;
  longitude?: number; // Keep as string
}
export interface SerializedPrice {
  basePrice: number;
  model: "hour" | "day" | "week";
}
export interface SerializedRating {
  average: number;
  count: number;
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
export interface SerializedPolicies {
  listOfPolicies?: SerializedPolicyItem[];
}
export interface SerializedBookedDate {
  date: string;
  bookingRef?: string;
} // Date as string
export interface SerializedBlockedWeekday {
  weekday: string;
  recurrenceRule: "weekly" | "biweekly" | "monthly";
}
export interface SerializedAvailabilityRules {
  blockedWeekdays?: SerializedBlockedWeekday[];
}

// Structure Expected by the Client for Populated Features (from Enum)
export interface PopulatedFeatureClient {
  _id: string;
  id: string; // Mongoose virtual added via toObject/serialize
  key: string;
  label: string;
  icon?: string; // Optional icon name string from Enum
}

// Structure for serialized reviews with populated user
export interface SerializedPopulatedReview {
  id: string;
  _id: string;
  user: { _id: string; id: string; name: string }; // Populated user
  rating: number;
  comment?: string;
  target: string;
  targetModel: "Venue" | "Service";
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
}

// Main Serialized Service type reflecting populated fields for Detail View
export interface SerializedPopulatedService {
  id: string;
  _id: string;
  name: string;
  location: SerializedLocation;
  price: SerializedPrice;
  description?: string;
  features?: PopulatedFeatureClient[]; // Populated features
  images: SerializedImage[];
  policies?: SerializedPolicies;
  bookedDates?: SerializedBookedDate[];
  availabilityRules?: SerializedAvailabilityRules;
  category?: PopulatedFeatureClient; // Populated category (assuming single ref to Enum)
  type?: string;
  status: string;
  owner: { _id: string; id: string; name: string }; // Populated owner
  rating: SerializedRating;
  sponsored?: { isActive: boolean; until?: string; planType?: string };
  reviews?: SerializedPopulatedReview[]; // Populated reviews
  createdAt?: string;
  updatedAt?: string;
}

// Serialized type for List View (less populated)
export interface SerializedServiceListItem {
  id: string;
  _id: string;
  name: string;
  location: SerializedLocation;
  price: SerializedPrice;
  images: SerializedImage[];
  type?: string;
  rating: SerializedRating;
  sponsored?: { isActive: boolean };
  // Features might be string IDs or omitted for list view depending on needs
  features?: string[]; // Or PopulatedFeatureClient[] if needed, but less likely
}
// --- End Type Definitions ---
