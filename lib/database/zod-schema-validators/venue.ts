import { z } from "zod";

export const createVenueSchema = z.object({
    name: z.string().min(1, "Name is required"),
    location: z.object({
        address: z.string(),
        city: z.string().min(1, "City is required"),
        street: z.string().min(1, "Street is required"),
        houseNumber: z.number({ invalid_type_error: "House number must be a number" }),
        country: z.string().min(1, "Country is required"),
        postalCode: z.number({ invalid_type_error: "Postal code must be a number" }),
    }),
    price: z.object({
        basePrice: z.number({ invalid_type_error: "Base price must be a number" }),
        model: z.enum(["hour", "day", "week"]).default("day"),
    }),
    reviews: z.array(z.string()).default([]),
    seating: z.object({
        seated: z.number().default(0),
        standing: z.number().default(0),
    }).optional(),
    description: z.string().optional(),
    images: z.array(
        z.object({
            url: z.string().min(1, "Image URL is required"),
            alt: z.string().min(1, "Image alt is required"),
            width: z.number().optional(),
            height: z.number().optional(),
            caption: z.string().min(1, "Image caption is required"),
        })
    ).default([]),
    amenities: z.array(z.string()).default([]),
    services: z.array(z.string()).default([]),
    policies: z.object({
        bannedServices: z.array(z.string()).default([]),
        listOfPolicies: z.array(
            z.object({
                name: z.string().min(1, "Policy name is required"),
                description: z.string().min(1, "Policy description is required"),
            })
        ).default([]),
    }).optional(),
    bookedDates: z.array(
        z.object({
            date: z.coerce.date({ invalid_type_error: "Date is required" }),
            bookingRef: z.string().optional(),
        })
    ).default([]),
    availabilityRules: z.object({
        blockedWeekdays: z.array(
            z.object({
                weekday: z.string().min(1, "Weekday is required"),
                recurrenceRule: z.enum(["weekly", "biweekly", "monthly"]),
            })
        ).default([]),
    }).optional(),
    category: z.string().min(1, "Category is required"),
    type: z.string().optional(),
    status: z.enum(["pending", "approved", "rejected", "softDeleted", "deleted", "active", "inactive"]).default("pending"),
    capacity: z.number(),
    owner: z.string().min(1, "Owner ID is required"),
    rating: z.object({
        average: z.number().min(0, "Rating cannot be less than 0").max(5, "Rating cannot exceed 5").default(0),
        count: z.number().default(0),
    }),
    sponsored: z.object({
        isActive: z.boolean().default(false),
        until: z.coerce.date().optional(),
        planType: z.string().optional(),
    }),
});
