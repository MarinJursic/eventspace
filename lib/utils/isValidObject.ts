import { Types } from "mongoose";
/**
 * Validates if a string is a valid MongoDB ObjectId.
 * @param id - The string to validate.
 * @returns True if valid, false otherwise.
 */
export function isValidObjectId(id: string): boolean {
  // Basic check for length and hex characters, plus Mongoose's check
  return /^[0-9a-fA-F]{24}$/.test(id) && Types.ObjectId.isValid(id);
}
