import {
    Award, // For Experience/Awards
    BookUser, // For Portfolio/References
    Boxes, // For Packages
    CalendarCheck, // For Online Booking
    CheckSquare, // For Customization
    CreditCard, // For Payment Options
    Globe, // For Travel Willingness
    Languages, // For Languages Spoken
    Leaf, // For Eco-Friendly
    MessageSquareQuote, // For Consultation
    ShieldCheck, // For Insurance
    Sparkles, // For Specialization
    Wrench, // For Equipment Provided
    Trash2, // For Setup/Cleanup
} from "lucide-react";
import React from "react";

// Renamed type for clarity in service context
type Feature = {
    _id: string; // Unique Database ID (placeholder)
    id: string; // URL-friendly slug / identifier
    label: string; // User-friendly display name
    icon: React.ReactNode; // Icon component
};

// Renamed variable to reflect service features
export const serviceFeatureValues: Array<Feature> = [
    {
        _id: "662a2c4d7f3e6c3c1e5d2c01", // New placeholder ID
        id: "customizable-packages",
        label: "Customizable Packages",
        icon: <CheckSquare className="h-5 w-5" />,
    },
    {
        _id: "662a2c4d7f3e6c3c1e5d2c02",
        id: "initial-consultation",
        label: "Initial Consultation", // Could specify free/paid elsewhere
        icon: <MessageSquareQuote className="h-5 w-5" />,
    },
    {
        _id: "662a2c4d7f3e6c3c1e5d2c03",
        id: "liability-insurance",
        label: "Liability Insurance",
        icon: <ShieldCheck className="h-5 w-5" />,
    },
    {
        _id: "662a2c4d7f3e6c3c1e5d2c04",
        id: "travel-available",
        label: "Travel Available", // Could specify range elsewhere
        icon: <Globe className="h-5 w-5" />,
    },
    {
        _id: "662a2c4d7f3e6c3c1e5d2c05",
        id: "multiple-languages",
        label: "Multiple Languages",
        icon: <Languages className="h-5 w-5" />,
    },
    {
        _id: "662a2c4d7f3e6c3c1e5d2c06",
        id: "online-booking",
        label: "Online Booking",
        icon: <CalendarCheck className="h-5 w-5" />,
    },
    {
        _id: "662a2c4d7f3e6c3c1e5d2c07",
        id: "portfolio-available",
        label: "Portfolio Available",
        icon: <BookUser className="h-5 w-5" />,
    },
    {
        _id: "662a2c4d7f3e6c3c1e5d2c08",
        id: "flexible-payment",
        label: "Flexible Payment Options",
        icon: <CreditCard className="h-5 w-5" />,
    },
    {
        _id: "662a2c4d7f3e6c3c1e5d2c09",
        id: "eco-friendly-options",
        label: "Eco-Friendly Options",
        icon: <Leaf className="h-5 w-5" />,
    },
    {
        _id: "662a2c4d7f3e6c3c1e5d2c0a",
        id: "specialized-service",
        label: "Specialized Service", // e.g., specific cuisine, style
        icon: <Sparkles className="h-5 w-5" />,
    },
    {
        _id: "662a2c4d7f3e6c3c1e5d2c0b",
        id: "equipment-provided",
        label: "Equipment Provided", // e.g., photo booth, sound system
        icon: <Wrench className="h-5 w-5" />,
    },
    {
        _id: "662a2c4d7f3e6c3c1e5d2c0c",
        id: "setup-cleanup-included",
        label: "Setup/Cleanup Included",
        icon: <Trash2 className="h-5 w-5" />,
    },
    {
        _id: "662a2c4d7f3e6c3c1e5d2c0d",
        id: "award-winning",
        label: "Award-Winning", // If applicable
        icon: <Award className="h-5 w-5" />,
    },
    {
        _id: "662a2c4d7f3e6c3c1e5d2c0e",
        id: "package-deals",
        label: "Package Deals Available", // Predefined packages
        icon: <Boxes className="h-5 w-5" />,
    },
];