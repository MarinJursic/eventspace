/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * Safely serializes data to JSON, handling potential Mongoose specific types.
 * @param data - The data to serialize.
 * @returns Serialized data or null/empty array on error.
 */
export function serializeData(data: any): any {
  try {
    if (data === null || data === undefined) return null;
    // Convert Mongoose document to plain object first if necessary
    // Using lean() in the query is often more efficient than toObject() later
    const plainData =
      typeof data.toObject === "function"
        ? data.toObject({ virtuals: true })
        : data;
    // Stringify and parse to handle ObjectIds, Dates etc.
    return JSON.parse(
      JSON.stringify(
        plainData,
        (key, value) => (typeof value === "bigint" ? value.toString() : value) // Handle BigInt just in case
      )
    );
  } catch (error) {
    console.error("Serialization Error:", error);
    return Array.isArray(data) ? [] : null;
  }
}
