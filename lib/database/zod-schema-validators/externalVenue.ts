import { z } from "zod";

export const createExternalVenueSchema = z.object({
    name: z.string().min(1, "Name is required"),
    location: z.object({
        address: z.string().min(1, "Address is required"),
        city: z.string().min(1, "City is required"),
        street: z.string().min(1, "Street is required"),
        houseNumber: z.number({
            invalid_type_error: "House number must be a number",
        }),
        country: z.string().min(1, "Country is required"),
        postalCode: z.number({
            invalid_type_error: "Postal code must be a number",
        }),
    }),
    bookedDates: z.array(
        z.object({
            date: z.coerce.date({ invalid_type_error: "Date is required" }),
            bookingRef: z.string().optional(),
        })
    ).default([]),
    owner: z.string().min(1, "Owner ID is required"),
});