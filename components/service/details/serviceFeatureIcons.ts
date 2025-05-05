// components/service/details/serviceFeatureIcons.ts
import React from 'react';
import {
    Award, BookUser, Boxes, CalendarCheck, CheckSquare, CreditCard,
    Globe, Languages, Leaf, MessageSquareQuote, ShieldCheck, Sparkles,
    Wrench, Trash2, Check // Added Check as a potential default
} from "lucide-react";

// Define the mapping from service feature *key* (lowercase string from Enum) to Icon component
// Ensure the keys here match the 'key' field in your 'serviceFeature' Enum document values
export const serviceFeatureIconMap: { [key: string]: React.ElementType } = {
  "customizable-packages": CheckSquare,
  "initial-consultation": MessageSquareQuote,
  "liability-insurance": ShieldCheck,
  "travel-available": Globe,
  "multiple-languages": Languages,
  "online-booking": CalendarCheck,
  "portfolio-available": BookUser,
  "flexible-payment": CreditCard,
  "eco-friendly-options": Leaf,
  "specialized-service": Sparkles,
  "equipment-provided": Wrench,
  "setup-cleanup-included": Trash2,
  "award-winning": Award,
  "package-deals": Boxes,
  // Add more feature keys and their corresponding Lucide icons
};

// Choose a default icon for unmapped features
export const DefaultFeatureIcon = Check; // Or Sparkles