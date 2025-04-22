import { IServiceClientState } from '@/types/service.types'; // Adjust path if needed

export const defaultServiceClientState: IServiceClientState = {
    name: '',
    location: {
        address: '',
        city: '',
        street: '',
        houseNumber: 0,
        country: '',
        postalCode: 0,
    },
    price: {
        basePrice: 0,
        model: 'day',
    },
    reviews: [],
    features: [],
    images: [],
    bookedDates: [],
    availabilityRules: {
        blockedWeekdays: [],
    },
    category: '',
    status: 'pending',
    owner: '',
    rating: {
        average: 0,
        count: 0,
    },
    sponsored: {
        isActive: false,
        until: undefined,
        planType: undefined,
    },
    _id: "",
    description: "",
    policies: {listOfPolicies: []},
    type: "",
    createdAt: "",
    updatedAt: "",
};