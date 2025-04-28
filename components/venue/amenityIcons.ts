// src/components/venue/amenityIcons.ts
import React from 'react';
import {
  ParkingCircle, Wifi, UtensilsCrossed, Tv, Wind, PersonStanding,
  Sun, Volume2, Dog, Sparkles, Check, // Add more as needed
} from 'lucide-react';

// Define the mapping from amenity *key* (lowercase string) to Icon component
// NOTE: The 'key' here should match the 'key' field you expect to have
// in your 'Enum' documents for amenities after populating/fetching them.
export const amenityIconMap: { [key: string]: React.ElementType } = {
  parking: ParkingCircle,
  wifi: Wifi,
  catering: UtensilsCrossed, // Example: Assuming 'catering' is an amenity key
  av: Volume2,
  "a/v": Volume2,
  "audio visual": Volume2,
  "air conditioning": Wind,
  heating: Wind,
  accessible: PersonStanding,
  "wheelchair accessible": PersonStanding,
  outdoor: Sun,
  "outdoor space": Sun,
  "pet friendly": Dog,
  projector: Tv,
  screen: Tv,
  "sound system": Volume2,
  // Add more known amenity keys and their icons
};

// Choose a default icon for unmapped amenities
export const DefaultAmenityIcon = Sparkles; // Or Check