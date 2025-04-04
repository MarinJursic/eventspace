import { z } from "zod";

export const createBookingSchema = z.object({
    user: z.string().min(1, "User ID is required"),
    venue: z.string().min(1, "Venue ID is required"),
    service: z.array(z.string()).optional(),
    isExternalVenue: z.boolean(),
    datesBooked: z.array(z.coerce.date()).optional(),
    status: z
        .enum(["pending", "confirmed", "cancelled", "softDelete", "delete"])
        .default("pending"),
});