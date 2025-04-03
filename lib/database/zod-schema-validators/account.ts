import { z } from "zod";

export const createAccountSchema = z.object({
    provider: z.string().min(1, "Provider is required"),
    type: z.string().min(1, "Type is required"),
    providerAccountId: z.string().min(1, "Provider Account ID is required"),
    accessToken: z.string().min(1, "Access Token is required"),
    expiresAt: z.number({
        invalid_type_error: "ExpiresAt must be a number",
    }),
    scope: z.string().min(1, "Scope is required"),
    tokenType: z.string().min(1, "Token Type is required"),
    tokenId: z.string().min(1, "Token ID is required"),
    userId: z.string().optional(), 
});