import {
    BookOpen,
    Building2,
    Camera,
    GraduationCap,
    Heart,
    Hotel,
    MapPin,
    Music,
    Palette,
    Trees,
    Trophy,
    Users,
    Utensils,
    Wine,
} from "lucide-react";

type Category = {
    _id: string;
    id: string;
    label: string;
    icon: React.ReactNode;
};

export const venueCategoryValues: Array<Category> = [
    {
        _id: "661f1a2b5f1e4a1a9c3b0a01",
        id: "wedding",
        label: "Wedding",
        icon: <Heart className="h-5 w-5" />,
    },
    {
        _id: "661f1a2b5f1e4a1a9c3b0a02",
        id: "corporate",
        label: "Corporate",
        icon: <Building2 className="h-5 w-5" />,
    },
    {
        _id: "661f1a2b5f1e4a1a9c3b0a03",
        id: "entertainment",
        label: "Entertainment",
        icon: <Music className="h-5 w-5" />,
    },
    {
        _id: "661f1a2b5f1e4a1a9c3b0a04",
        id: "social-events",
        label: "Social Events",
        icon: <Users className="h-5 w-5" />,
    },
    {
        _id: "661f1a2b5f1e4a1a9c3b0a05",
        id: "dining",
        label: "Dining",
        icon: <Utensils className="h-5 w-5" />,
    },
    {
        _id: "661f1a2b5f1e4a1a9c3b0a06",
        id: "sports",
        label: "Sports",
        icon: <Trophy className="h-5 w-5" />,
    },
    {
        _id: "661f1a2b5f1e4a1a9c3b0a07",
        id: "arts-culture",
        label: "Arts & Culture",
        icon: <Palette className="h-5 w-5" />,
    },
    {
        _id: "661f1a2b5f1e4a1a9c3b0a08",
        id: "education",
        label: "Education",
        icon: <BookOpen className="h-5 w-5" />,
    },
    {
        _id: "661f1a2b5f1e4a1a9c3b0a09",
        id: "outdoor",
        label: "Outdoor",
        icon: <Trees className="h-5 w-5" />,
    },
    {
        _id: "661f1a2b5f1e4a1a9c3b0a0a",
        id: "hospitality",
        label: "Hospitality",
        icon: <Hotel className="h-5 w-5" />,
    },
    {
        _id: "661f1a2b5f1e4a1a9c3b0a0b",
        id: "photo-video",
        label: "Photo & Video",
        icon: <Camera className="h-5 w-5" />,
    },
    {
        _id: "661f1a2b5f1e4a1a9c3b0a0c",
        id: "food-wine",
        label: "Food & Wine",
        icon: <Wine className="h-5 w-5" />,
    },
    {
        _id: "661f1a2b5f1e4a1a9c3b0a0d",
        id: "conferences",
        label: "Conferences",
        icon: <GraduationCap className="h-5 w-5" />,
    },
    {
        _id: "661f1a2b5f1e4a1a9c3b0a0e",
        id: "tourism",
        label: "Tourism",
        icon: <MapPin className="h-5 w-5" />,
    },
];