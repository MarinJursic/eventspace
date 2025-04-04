import { z } from "zod";

// Schema for a single enum item.
export const createEnumItemSchema = z.object({
  key: z.string().min(1, "Key is required"),
  label: z.string().min(1, "Label is required"),
  icon: z.string().optional(),
});

// Schema for the enum document.
export const createEnumSchema = z.object({
  _id: z.string().min(1, "Enum type identifier is required"),
  values: z.array(createEnumItemSchema).default([]),
  updatedAt: z.coerce.date().default(new Date()),
});