"use client";

import React, { useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import { MapPin } from "lucide-react"; // Keep for placeholder

import iconRetinaUrl from "leaflet/dist/images/marker-icon-2x.png";
import iconUrl from "leaflet/dist/images/marker-icon.png";
import shadowUrl from "leaflet/dist/images/marker-shadow.png";

// @ts-expect-error Cannot find module or its corresponding type declarations. - This is a known issue with leaflet's types sometimes
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: iconRetinaUrl.src,
  iconUrl: iconUrl.src,
  shadowUrl: shadowUrl.src,
});
// --- End Icon Fix ---

// ... (Rest of the component: Props, ChangeView, VenueMap logic) ...

interface VenueMapProps {
  latitude?: number;
  longitude?: number;
  venueName: string;
  address: string;
  zoomLevel?: number;
  className?: string;
}

const ChangeView: React.FC<{ center: L.LatLngExpression; zoom: number }> = ({
  center,
  zoom,
}) => {
  const map = useMap();
  useEffect(() => {
    map.setView(center, zoom);
  }, [center, zoom, map]);
  return null;
};

const VenueMap: React.FC<VenueMapProps> = ({
  latitude,
  longitude,
  venueName,
  address,
  zoomLevel = 14,
  className = "h-64 md:h-80",
}) => {
  console.log(latitude + "///////////" + longitude);

  const hasValidCoords =
    typeof latitude === "number" && typeof longitude === "number";

  if (!hasValidCoords) {
    return (
      <div
        className={`w-full rounded-lg bg-muted/60 flex items-center justify-center border ${className}`}
      >
        <div className="text-center p-4">
          <MapPin className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
          <p className="text-muted-foreground text-sm">
            Map location unavailable.
          </p>
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
        scrollWheelZoom={true}
        style={{ height: "100%", width: "100%" }}
      >
        <ChangeView center={position} zoom={zoomLevel} />
        <TileLayer
          attribution='© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors © <a href="https://carto.com/attributions">CARTO</a>'
          url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
          maxZoom={20}
        />
        <Marker position={position}>
          <Popup>
            <span className="font-semibold">{venueName}</span>
            <br />
            {address}
          </Popup>
        </Marker>
      </MapContainer>
    </div>
  );
};

export default VenueMap;
