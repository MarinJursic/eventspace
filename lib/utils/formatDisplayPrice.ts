// Helper function to format price
export const formatDisplayPrice = (
  amount: number | undefined,
  model?: "hour" | "day" | "week"
): string => {
  if (amount === undefined) return "N/A";
  const base = `$${amount.toFixed(2)}`;
  switch (model) {
    case "hour":
      return `${base} / hour*`;
    case "day":
      return `${base} / event day`;
    case "week":
      return `${base} / week`;
    default:
      return base;
  }
};
