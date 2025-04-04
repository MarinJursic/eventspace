import { z } from "zod";

export const createReviewSchema = z.object({
    user: z.string().min(1, "User ID is required"),
    rating: z
        .number()
        .min(0, "Rating cannot be less than 0")
        .max(5, "Rating cannot be more than 5")
        .default(0),
    comment: z.string().optional(),
    target: z.string().min(1, "Target ID is required"),
    targetModel: z.enum(["Venue", "Service"]),
    isDeleted: z.boolean().default(false),
});