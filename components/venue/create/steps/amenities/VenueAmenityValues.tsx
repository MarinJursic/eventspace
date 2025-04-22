import {
    Wifi,
    Car,
    Snowflake,
    Thermometer,
    Utensils,
    MonitorSmartphone,
    Mic,
    Bath,
    Accessibility,
    TreePine,
} from "lucide-react";

type Amenity = {
    _id: string;
    id: string;
    label: string;
    icon: React.ReactNode;
};

export const venueAmenityValues: Array<Amenity> = [
    {
        _id: "661f1b1c5f1e4a1a9c3b0b01",
        id: "wifi",
        label: "WiFi",
        icon: <Wifi className="h-5 w-5" />,
    },
    {
        _id: "661f1b1c5f1e4a1a9c3b0b02",
        id: "parking",
        label: "Parking",
        icon: <Car className="h-5 w-5" />,
    },
    {
        _id: "661f1b1c5f1e4a1a9c3b0b03",
        id: "air-conditioning",
        label: "Air Conditioning",
        icon: <Snowflake className="h-5 w-5" />,
    },
    {
        _id: "661f1b1c5f1e4a1a9c3b0b04",
        id: "heating",
        label: "Heating",
        icon: <Thermometer className="h-5 w-5" />,
    },
    {
        _id: "661f1b1c5f1e4a1a9c3b0b05",
        id: "kitchen",
        label: "Kitchen",
        icon: <Utensils className="h-5 w-5" />,
    },
    {
        _id: "661f1b1c5f1e4a1a9c3b0b06",
        id: "av-equipment",
        label: "AV Equipment",
        icon: <MonitorSmartphone className="h-5 w-5" />,
    },
    {
        _id: "661f1b1c5f1e4a1a9c3b0b07",
        id: "stage",
        label: "Stage",
        icon: <Mic className="h-5 w-5" />,
    },
    {
        _id: "661f1b1c5f1e4a1a9c3b0b08",
        id: "restrooms",
        label: "Restrooms",
        icon: <Bath className="h-5 w-5" />,
    },
    {
        _id: "661f1b1c5f1e4a1a9c3b0b09",
        id: "wheelchair-accessible",
        label: "Wheelchair Accessible",
        icon: <Accessibility className="h-5 w-5" />,
    },
    {
        _id: "661f1b1c5f1e4a1a9c3b0b0a",
        id: "outdoor-space",
        label: "Outdoor Space",
        icon: <TreePine className="h-5 w-5" />,
    },
];