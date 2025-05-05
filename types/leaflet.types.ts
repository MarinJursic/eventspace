import { LatLng, LatLngExpression } from "leaflet";

export interface ILeafletMap {
    lat: number;
    lng: number;
    zoom: number;
    selectedPosition: LatLngExpression | null;
    onLocationSelect: (latLng: LatLng) => void;
    style?: React.CSSProperties;
    className?: string;
}

export interface ILeafletLocationInfo {
    street: string;
    houseNumber: string;
    postalCode: string;
    city: string;
    country: string;
    lat?: number;
    lng?: number;
}