import { v4 as uuidv4 } from 'uuid';

import { reviews, Review } from './mockReviews';

export interface Venue {
  id: string;
  name: string;
  location: {
    address: string;
    city: string;
    street: string;
    houseNumber: number;
    country: string;
    postalCode: number;
  };
  price: {
    basePrice: number;
    model: 'hour' | 'day' | 'week';
  };
  reviews: Review[];
  seating: {
    seated: number;
    standing: number;
  };
  description?: string;
  amenities: string[];
  policies?: {
    bannedServices: string[];
    listOfPolicies: { name: string; description: string }[];
  };
  images: {
    url: string;
    alt: string;
    width?: number;
    height?: number;
    caption: string;
  }[];
  bookedDates: { date: Date; bookingRef: string }[];
  availabilityRules: {
    blockedWeekdays: { weekday: string; recurrenceRule: 'weekly' | 'biweekly' | 'monthly' }[];
  };
  category: string[];
  type?: string;
  status: 'pending' | 'approved' | 'rejected' | 'softDeleted' | 'deleted' | 'active' | 'inactive';
  capacity?: number;
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
}

export const venues: Venue[] = [
  {
    id: "0",
    name: "Sunset Hall",
    location: {
      address: "123 Sunset Blvd",
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
    reviews,
    seating: {
      seated: 150,
      standing: 50
    },
    description: "A beautiful venue with a view of the sunset over the hills.",
    images: [
      {
        url: "https://images.unsplash.com/photo-1549895058-36748fa6c6a7?q=80&w=2574&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        alt: "Elegant hall with sunset view",
        width: 600,
        height: 400,
        caption: "Main event area."
      },
      {
        url: "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?q=80&w=2698&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        alt: "Elegant hall with sunset view",
        width: 600,
        height: 400,
        caption: "Main event area."
      },
      {
        url: "https://images.unsplash.com/photo-1690284843657-3cff7aba0677?q=80&w=2574&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        alt: "Elegant hall with sunset view",
        width: 600,
        height: 400,
        caption: "Main event area."
      }
    ],
    amenities: ["parking", "catering", "av"],
    policies: {
      bannedServices: [],
      listOfPolicies: [
        { name: "No Smoking", description: "Smoking is strictly prohibited indoors." }
      ]
    },
    bookedDates: [
      { date: new Date("2025-06-15"), bookingRef: uuidv4() }
    ],
    availabilityRules: {
      blockedWeekdays: [
        { weekday: "Sunday", recurrenceRule: "weekly" }
      ]
    },
    category: [uuidv4()],
    type: "ballroom",
    status: "active",
    capacity: 200,
    owner: uuidv4(),
    rating: {
      average: 4.7,
      count: 120
    },
    sponsored: {
      isActive: true,
      until: new Date("2025-12-31"),
      planType: "gold"
    },
  },
  {
    id: "1",
    name: "Rooftop Garden",
    location: {
      address: "789 Skyline Ave",
      city: "New York",
      street: "Skyline Ave",
      houseNumber: 789,
      country: "USA",
      postalCode: 10001
    },
    price: {
      basePrice: 800,
      model: "hour"
    },
    reviews,
    seating: {
      seated: 100,
      standing: 200
    },
    description: "A rooftop venue with stunning views of the city skyline.",
    images: [
      {
        url: "https://images.unsplash.com/photo-1541922633525-b39c46b1b219?q=80&w=2749&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        alt: "Modern rooftop event space",
        width: 600,
        height: 400,
        caption: "City skyline view."
      },
      {
        url: "https://images.unsplash.com/photo-1533377437229-5ca96ecbcd78?q=80&w=2670&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        alt: "Modern rooftop event space",
        width: 600,
        height: 400,
        caption: "City skyline view."
      },
      {
        url: "https://images.unsplash.com/photo-1719941080090-b3d1ba7cb6a1?q=80&w=2574&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        alt: "Modern rooftop event space",
        width: 600,
        height: 400,
        caption: "City skyline view."
      },
    ],
    amenities: ["outdoor", "wifi", "av"],
    policies: {
      bannedServices: [],
      listOfPolicies: [
        { name: "No Loud Music After 10 PM", description: "Noise restrictions apply after 10 PM." }
      ]
    },
    bookedDates: [
      { date: new Date("2025-07-04"), bookingRef: uuidv4() }
    ],
    availabilityRules: {
      blockedWeekdays: []
    },
    category: [uuidv4()],
    type: "rooftop",
    status: "approved",
    capacity: 300,
    owner: uuidv4(),
    rating: {
      average: 4.9,
      count: 85
    },
    sponsored: {
      isActive: false
    }
  }
];
