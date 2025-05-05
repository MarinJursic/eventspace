export function sanitizeString(text: string): string {
  // This function remains the same - it always collapses and trims
  return text
    .replace(/[^\p{L}\p{N} ]+/gu, "")
    .replace(/ {2,}/g, " ")
    .trim();
}

export function replaceSpecialWithSpace(
  text: string,
  {
    collapse = true,
    trimEnds = true,
  }: { collapse?: boolean; trimEnds?: boolean } = {} // Added types for options
): string {
  // Replace special characters with a single space
  let out = text.replace(/[^\p{L}\p{N} ]+/gu, " ");

  // Only collapse multiple spaces if the option is true
  if (collapse) {
    out = out.replace(/ {2,}/g, " ");
  }

  // Only trim start/end spaces if the option is true
  if (trimEnds) {
    out = out.trim();
  }

  return out;
}
