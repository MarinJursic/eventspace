import {
  Briefcase,
  Brush,
  Cake,
  Camera,
  Car,
  ChefHat,
  ClipboardList,
  Flower,
  Mic,
  Palette,
  ShieldCheck,
  Truck,
  Users,
  Video,
  Wine,
} from "lucide-react";
import React from "react";

type Category = {
  _id: string;
  id: string;
  label: string;
  icon: React.ReactNode;
};

export const serviceCategoryValues: Array<Category> = [
  {
    _id: "662a1b3c6f2e5b2b0d4c1b01",
    id: "event-planning",
    label: "Event Planning",
    icon: <ClipboardList className="h-5 w-5" />,
  },
  {
    _id: "662a1b3c6f2e5b2b0d4c1b02",
    id: "catering",
    label: "Catering",
    icon: <ChefHat className="h-5 w-5" />,
  },
  {
    _id: "662a1b3c6f2e5b2b0d4c1b03",
    id: "photography",
    label: "Photography",
    icon: <Camera className="h-5 w-5" />,
  },
  {
    _id: "662a1b3c6f2e5b2b0d4c1b04",
    id: "videography",
    label: "Videography",
    icon: <Video className="h-5 w-5" />,
  },
  {
    _id: "662a1b3c6f2e5b2b0d4c1b05",
    id: "music-entertainment",
    label: "Music & Entertainment",
    icon: <Mic className="h-5 w-5" />,
  },
  {
    _id: "662a1b3c6f2e5b2b0d4c1b06",
    id: "floral-design",
    label: "Floral Design",
    icon: <Flower className="h-5 w-5" />,
  },
  {
    _id: "662a1b3c6f2e5b2b0d4c1b07",
    id: "decor-styling",
    label: "Decor & Styling",
    icon: <Palette className="h-5 w-5" />,
  },
  {
    _id: "662a1b3c6f2e5b2b0d4c1b08",
    id: "beauty-services",
    label: "Beauty Services",
    icon: <Brush className="h-5 w-5" />,
  },
  {
    _id: "662a1b3c6f2e5b2b0d4c1b09",
    id: "bartending",
    label: "Bartending",
    icon: <Wine className="h-5 w-5" />,
  },
  {
    _id: "662a1b3c6f2e5b2b0d4c1b0a",
    id: "staffing",
    label: "Event Staffing",
    icon: <Users className="h-5 w-5" />,
  },
  {
    _id: "662a1b3c6f2e5b2b0d4c1b0b",
    id: "transportation",
    label: "Transportation",
    icon: <Car className="h-5 w-5" />,
  },
  {
    _id: "662a1b3c6f2e5b2b0d4c1b0c",
    id: "rentals",
    label: "Rentals",
    icon: <Truck className="h-5 w-5" />,
  },
  {
    _id: "662a1b3c6f2e5b2b0d4c1b0d",
    id: "cakes-desserts",
    label: "Cakes & Desserts",
    icon: <Cake className="h-5 w-5" />,
  },
  {
    _id: "662a1b3c6f2e5b2b0d4c1b0e",
    id: "security",
    label: "Security Services",
    icon: <ShieldCheck className="h-5 w-5" />,
  },
  {
    _id: "662a1b3c6f2e5b2b0d4c1b0f",
    id: "consulting",
    label: "Consulting",
    icon: <Briefcase className="h-5 w-5" />,
  },
];
