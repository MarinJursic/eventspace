import { z } from "zod";

export const createEnumSchema = z.object({
  _id: z.string().optional(),
  enumType: z.string().min(1, "enumType is required"),
  values: z.array(z.any()).default([]),
  updatedAt: z.coerce.date().default(new Date()),
});
