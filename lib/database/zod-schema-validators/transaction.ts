import { z } from "zod";

export const createTransactionSchema = z.object({
    booking: z.string().min(1, "Booking ID is required"),
    user: z.string().min(1, "User ID is required"),
    amount: z.number().positive("Amount must be a positive number"),
    currency: z.string().min(1, "Currency is required"),
    method: z.enum(["credit_card", "paypal", "bank_transfer"]),
    status: z.enum(["pending", "completed", "failed"]).default("pending"),
    transactionDate: z.coerce.date().default(new Date()),
    updatedAt: z.coerce.date().nullable().default(null),
    recepientUrl: z.string().url("Recipient URL must be a valid URL"),
    refundAmount: z.number().min(0, "Refund amount must be 0 or more"),
    refundDate: z.coerce.date(),
    isRefunded: z.boolean(),
});