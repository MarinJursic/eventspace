export function sanitizeString(text: string): string {
    return text
        .replace(/[^\p{L}\p{N} ]+/gu, "")  
        .replace(/ {2,}/g, " ")
        .trim();
}

export function replaceSpecialWithSpace(
    text: string, 
    {collapse = true, trimEnds = true } = {}
): string {
    let out = text.replace(/[^\p{L}\p{N} ]+/gu, " ");

    if (collapse) out = out.replace(/ {2,}/g, " ");
    if (trimEnds) out = out.trim();

    return out;
}