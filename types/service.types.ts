export interface IServiceClientState {
    _id?: string;
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
        basePrice: number,
        model: string;
    };
    reviews: string[];
    description?: string;
    features: string[];
    images: {
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
    category: string,
    type?: string;
    status: 'pending' | 'approved' | 'rejected' | 'softDeleted' | 'deleted' | 'active' | 'inactive';
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