// src/components/venue/VenueMap.tsx
"use client";

import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import { MapPin } from 'lucide-react'; // Keep for placeholder

// --- !! ICON FIX START (Public Folder Method) !! ---
delete (L.Icon.Default.prototype as any)._getIconUrl; // Keep this line!

L.Icon.Default.mergeOptions({
  // Paths relative to the 'public' directory
  iconRetinaUrl: 'leaflet/dist/images/marker-icon-2x.png',
  iconUrl: 'leaflet/dist/images/marker-icon.png',
  shadowUrl: 'leaflet/dist/images/marker-shadow.png',
});
// --- !! ICON FIX END !! ---

// ... (Rest of the component: Props, ChangeView, VenueMap logic) ...

interface VenueMapProps {
    latitude?: number;
    longitude?: number;
    venueName: string;
    address: string;
    zoomLevel?: number;
    className?: string;
}

const ChangeView: React.FC<{ center: L.LatLngExpression; zoom: number }> = ({ center, zoom }) => {
    const map = useMap();
    useEffect(() => {
        map.setView(center, zoom);
    }, [center, zoom, map]);
    return null;
}

const VenueMap: React.FC<VenueMapProps> = ({
    latitude,
    longitude,
    venueName,
    address,
    zoomLevel = 14,
    className = "h-64 md:h-80",
}) => {

    const hasValidCoords = typeof latitude === 'number' && typeof longitude === 'number';

    if (!hasValidCoords) {
        return (
            <div className={`w-full rounded-lg bg-muted/60 flex items-center justify-center border ${className}`}>
                <div className="text-center p-4">
                    <MapPin className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                    <p className="text-muted-foreground text-sm">Map location unavailable.</p>
                    <p className="font-medium mt-1 text-sm">{address}</p>
                </div>
            </div>
        );
    }

    const position: L.LatLngExpression = [latitude, longitude];

    return (
        <div className={`w-full rounded-lg overflow-hidden border ${className}`}>
            <MapContainer
                center={position}
                zoom={zoomLevel}
                scrollWheelZoom={false}
                style={{ height: '100%', width: '100%' }}
            >
                <ChangeView center={position} zoom={zoomLevel} />
                <TileLayer
                    attribution='© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors © <a href="https://carto.com/attributions">CARTO</a>'
                    url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
                    maxZoom={20}
                />
                <Marker position={position}>
                    <Popup>
                        <span className="font-semibold">{venueName}</span><br />
                        {address}
                    </Popup>
                </Marker>
            </MapContainer>
        </div>
    );
};


export default VenueMap;