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
        basePrice: number,
        model: string;
    };
    reviews: string[];
    seating?: {
        seated: number;
        standing: number;
    };
    description?: string;
    images: {
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
    status: 'pending' | 'approved' | 'rejected' | 'softDeleted' | 'deleted' | 'active' | 'inactive';
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