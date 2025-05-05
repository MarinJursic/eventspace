import { Venue } from "./mocks/mockVenues";

// Venue Types (matches Venues page)
export const venueTypes = [
  { id: "hotel", label: "Hotel Venues" },
  { id: "garden", label: "Garden & Outdoor" },
  { id: "ballroom", label: "Ballrooms" },
  { id: "waterfront", label: "Waterfront" },
  { id: "historic", label: "Historic Venues" },
  { id: "rooftop", label: "Rooftop" },
];

// Capacities (matches Venues page)
export const capacities = [
  { id: "small", label: "Up to 50 guests" },
  { id: "medium", label: "50-150 guests" },
  { id: "large", label: "150-300 guests" },
  { id: "xlarge", label: "300+ guests" },
];

// Function to get unique cities from venues data
export const getUniqueCities = (
  venues: Venue[]
): { value: string; label: string }[] => {
  if (!venues) return [];
  const cities = new Set<string>();
  venues.forEach((venue) => {
    if (venue.location?.city) {
      cities.add(venue.location.city);
    }
  });
  return Array.from(cities)
    .sort() // Sort alphabetically
    .map((city) => ({ value: city.toLowerCase(), label: city })); // Use lowercase value for consistency
};
