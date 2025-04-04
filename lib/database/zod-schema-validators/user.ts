import { z } from "zod";

export const createUserSchema = z.object({
    name: z.string().min(1, "Name is required"),
    email: z.string().email("A valid email is required"),
    password: z.string().min(1, "Password is required"),
    emailVerified: z.boolean().default(false),
    isDeleted: z.boolean().default(false),
    role: z.enum(["admin", "vendor", "customer"]).default("customer"),
});
