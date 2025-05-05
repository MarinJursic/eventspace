import { replaceSpecialWithSpace } from "./sanitizeString";

export function capitalizeString(title: string): string {
  let titleCapitalzed = "";
  const words = replaceSpecialWithSpace(title).split(" "); // Get words after sanitizing

  // Handle the case where the input (after sanitizing) is empty
  if (words.length === 1 && words[0] === "") {
    return ""; // Return an empty string for empty input
  }

  for (const word of words) {
    // Check if the word is not empty before trying to capitalize
    if (word.length > 0) {
      titleCapitalzed +=
        word[0].toUpperCase() +
        word.substring(1).toLowerCase() + // Use substring(1) directly
        " ";
    } else {
      // If the word itself is empty (e.g., from multiple spaces), just add the space back
      // Or potentially skip adding the space if you want to fully collapse multiple spaces
      titleCapitalzed += " "; // Keep the space for now to match original logic intent
    }
  }

  // Trim the final trailing space
  return titleCapitalzed.trimEnd();
}
