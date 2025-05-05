// src/lib/mockServices.ts
import { v4 as uuidv4 } from 'uuid';

// Define a type for the mock data structure for clarity,
// replacing Mongoose ObjectIds with strings for frontend use.
export interface MockService {
    id: string; // Added unique ID
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
    reviews: string[]; // Using string IDs for mock reviews
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
        date: Date;
        bookingRef?: string; // Using string IDs for mock bookings
    }[];
    availabilityRules?: { // Made optional for mock data variety
        blockedWeekdays: {
            weekday: string; // e.g., 'Sunday', 'Monday'
            recurrenceRule: 'weekly' | 'biweekly' | 'monthly';
        }[];
    };
    category: string[]; // Using string IDs for mock categories
    type?: string;
    status: 'pending' | 'approved' | 'rejected' | 'softDeleted' | 'deleted' | 'active' | 'inactive';
    owner: string; // Using string ID for mock owner
    rating: {
        average: number;
        count: number;
    };
    sponsored: {
        isActive: boolean;
        until?: Date;
        planType?: string;
    };
    // Add timestamps if needed for frontend display, otherwise omit
    createdAt?: Date;
    updatedAt?: Date;
}


// --- Mock Data ---

export const mockServices: MockService[] = [
    {
        id: uuidv4(),
        name: "Ethereal Blooms Floral Design",
        location: {
            address: "123 Blossom Lane, Suite 100",
            city: "San Francisco",
            street: "Blossom Lane",
            houseNumber: 123,
            country: "USA",
            postalCode: 94107,
        },
        price: {
            basePrice: 1500,
            model: 'day', // Assuming 'day' means per-event package
        },
        reviews: ["review_florist_1", "review_florist_2", "review_florist_3"],
        description: "Creating breathtaking floral arrangements for weddings and events. Specializing in romantic and modern styles.",
        features: ["Custom Bouquets", "Centerpieces", "Installation Art", "Delivery & Setup", "Free Consultation"],
        images: [
            { url: "https://images.unsplash.com/photo-1717778444574-f2a865927769?q=80&w=2670&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", alt: "Romantic wedding bouquet", width: 600, height: 400, caption: "Bridal Bouquet" },
            { url: "https://images.unsplash.com/photo-1632107914295-5d2f3f36167b?q=80&w=2675&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", alt: "Elegant table centerpiece", width: 600, height: 400, caption: "Reception Centerpiece" },
        ],
        policies: {
            listOfPolicies: [
                { name: "Booking Deposit", description: "50% non-refundable deposit required to secure date." },
                { name: "Cancellation", description: "Cancellations within 30 days of event forfeit deposit." }
            ]
        },
        bookedDates: [
            { date: new Date('2024-08-15T00:00:00.000Z'), bookingRef: "booking_abc" },
            { date: new Date('2024-09-22T00:00:00.000Z') },
        ],
        availabilityRules: {
            blockedWeekdays: [
                { weekday: 'Sunday', recurrenceRule: 'weekly' }
            ]
        },
        category: ["cat_florist_id", "cat_decor_id"], // Example category IDs
        type: "Wedding Florist",
        status: 'active',
        owner: "owner_user_florist_id",
        rating: {
            average: 4.9,
            count: 55,
        },
        sponsored: {
            isActive: true,
            until: new Date('2025-01-01T00:00:00.000Z'),
            planType: 'gold',
        },
        createdAt: new Date('2023-01-10T10:00:00.000Z'),
        updatedAt: new Date('2024-05-20T15:30:00.000Z'),
    },
    {
        id: uuidv4(),
        name: "Moment Capturers Photography",
        location: {
            address: "456 Shutter St",
            city: "New York",
            street: "Shutter St",
            houseNumber: 456,
            country: "USA",
            postalCode: 10001,
        },
        price: {
            basePrice: 3000,
            model: 'day',
        },
        reviews: ["review_photo_1", "review_photo_2"],
        description: "Documentary-style wedding and event photography. We capture the real moments.",
        features: ["8-Hour Coverage", "Online Gallery", "Second Shooter Available", "Engagement Session Included"],
        images: [
            { url: "https://images.unsplash.com/photo-1629756048377-09540f52caa1?q=80&w=2669&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", alt: "Bride and groom portrait", width: 600, height: 400, caption: "Couple's Portrait" },
            { url: "https://images.unsplash.com/photo-1503525443530-339273ca8a86?q=80&w=2670&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", alt: "Candid wedding reception photo", width: 600, height: 400, caption: "Reception Fun" },
        ],
        // policies: // No specific policies listed for this one
        bookedDates: [
            { date: new Date('2024-10-05T00:00:00.000Z'), bookingRef: "booking_def" },
        ],
        // availabilityRules: // No specific rules listed
        category: ["cat_photography_id"],
        type: "Wedding Photographer",
        status: 'active',
        owner: "owner_user_photo_id",
        rating: {
            average: 4.7,
            count: 82,
        },
        sponsored: {
            isActive: false,
        },
        createdAt: new Date('2022-11-01T11:00:00.000Z'),
        updatedAt: new Date('2024-04-10T09:00:00.000Z'),
    },
    {
        id: uuidv4(),
        name: "Gourmet Gatherings Catering",
        location: {
            address: "789 Flavor Ave",
            city: "Chicago",
            street: "Flavor Ave",
            houseNumber: 789,
            country: "USA",
            postalCode: 60611,
        },
        price: {
            basePrice: 95,
            model: 'hour', // Per person per hour? Or total per hour? Clarify if needed. Assume per person for now.
        },
        reviews: ["review_cater_1"],
        description: "Full-service catering offering diverse menus for any occasion. From corporate lunches to elegant weddings.",
        features: ["Custom Menus", "Buffet & Plated Options", "Licensed Bartenders", "Setup & Cleanup", "Dietary Accommodations"],
        images: [
            { url: "https://images.unsplash.com/photo-1555244162-803834f70033?q=80&w=2670&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", alt: "Elaborate buffet table", width: 600, height: 400, caption: "Delicious Buffet" },
            { url: "https://images.unsplash.com/photo-1576842546422-60562b9242ae?q=80&w=2658&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", alt: "Gourmet plated dinner", width: 600, height: 400, caption: "Elegant Plating" },
        ],
        policies: {
            listOfPolicies: [
                { name: "Minimum Guest Count", description: "Minimum of 25 guests for weekend events." },
                { name: "Service Charge", description: "A 20% service charge applies to all events." }
            ]
        },
        bookedDates: [
            { date: new Date('2024-07-20T00:00:00.000Z'), bookingRef: "booking_ghi" },
            { date: new Date('2024-09-10T00:00:00.000Z'), bookingRef: "booking_jkl" },
            { date: new Date('2024-09-11T00:00:00.000Z'), bookingRef: "booking_mno" },

        ],
        availabilityRules: {
            blockedWeekdays: [
                { weekday: 'Monday', recurrenceRule: 'weekly' },
                { weekday: 'Tuesday', recurrenceRule: 'weekly' },
            ]
        },
        category: ["cat_catering_id"],
        status: 'active',
        owner: "owner_user_cater_id",
        rating: {
            average: 4.6,
            count: 115,
        },
        sponsored: {
            isActive: false,
        },
        createdAt: new Date('2023-03-15T14:00:00.000Z'),
        updatedAt: new Date('2024-05-28T11:20:00.000Z'),
    },
    {
        id: uuidv4(),
        name: "Rhythm Revolution DJ Services",
        location: {
            address: "101 Beat Blvd",
            city: "Austin",
            street: "Beat Blvd",
            houseNumber: 101,
            country: "USA",
            postalCode: 73301,
        },
        price: {
            basePrice: 1200,
            model: 'day', // Per event package
        },
        reviews: ["review_dj_1", "review_dj_2", "review_dj_3", "review_dj_4"],
        description: "Professional DJ and MC services to keep your party energized. Wide range of music genres.",
        features: ["Professional Sound System", "Wireless Microphones", "Dance Floor Lighting", "MC Services", "Custom Playlists"],
        images: [
            { url: "https://images.unsplash.com/photo-1516873240891-4bf014598ab4?q=80&w=2670&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", alt: "DJ mixing console and speakers", width: 600, height: 400, caption: "DJ Booth" },
            { url: "https://images.unsplash.com/photo-1542628682-88321d2a4828?q=80&w=2670&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", alt: "People dancing at an event", width: 600, height: 400, caption: "Party Time" },
        ],
        bookedDates: [], // Available
        category: ["cat_music_id", "cat_entertainment_id"],
        type: "DJ",
        status: 'active',
        owner: "owner_user_dj_id",
        rating: {
            average: 4.8,
            count: 68,
        },
        sponsored: {
            isActive: true,
            planType: 'silver', // No end date specified
        },
        createdAt: new Date('2023-06-01T09:00:00.000Z'),
        updatedAt: new Date('2024-03-01T18:00:00.000Z'),
    },
];

// Helper function to find service by ID
export const findServiceById = (id: string | string[] | undefined): MockService | undefined => {
    if (!id || Array.isArray(id)) return undefined;
    return mockServices.find(service => service.id === id);
}