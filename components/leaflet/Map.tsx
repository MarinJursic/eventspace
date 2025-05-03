/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, {
  CSSProperties,
  Dispatch,
  SetStateAction,
  useEffect,
  useState,
} from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L, { LatLng, LatLngExpression } from "leaflet";
import "leaflet/dist/leaflet.css";

import iconRetinaUrl from "leaflet/dist/images/marker-icon-2x.png";
import iconUrl from "leaflet/dist/images/marker-icon.png";
import shadowUrl from "leaflet/dist/images/marker-shadow.png";
import { ILeafletLocationInfo } from "@/types/leaflet.types";
import MapClickHandler from "./MapClickHandler";

delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: iconRetinaUrl.src,
  iconUrl: iconUrl.src,
  shadowUrl: shadowUrl.src,
});

export default function LeafletMap({
  lat,
  lng,
  zoom,
  onLocationSelect,
  style,
  className,
  leafletLocation,
  setLeafletLocation,
}: {
  lat: number;
  lng: number;
  zoom: number;
  onLocationSelect: (data: LatLng) => void;
  style?: CSSProperties;
  className?: string;
  leafletLocation: ILeafletLocationInfo;
  setLeafletLocation: Dispatch<SetStateAction<ILeafletLocationInfo>>;
}) {
  const [addressValue, setAddressValue] =
    useState<ILeafletLocationInfo>(leafletLocation);
  const [selectedPositionValue, setSelectedPositionValue] =
    useState<LatLngExpression | null>([lat, lng]);

  useEffect(() => {
    setLeafletLocation(addressValue);
  }, [addressValue]);

  if (!addressValue.lat || !addressValue.lng) return;

  return (
    <MapContainer
      center={[addressValue.lat, addressValue.lng]}
      zoom={zoom}
      scrollWheelZoom={true}
      style={style}
      className={className}
    >
      <TileLayer
        attribution='© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
      />

      {selectedPositionValue && (
        <Marker position={[addressValue.lat, addressValue.lng]}>
          <Popup>
            {addressValue.street + " " + addressValue.houseNumber === " "
              ? "No information"
              : addressValue.street + " " + addressValue.houseNumber}
          </Popup>
        </Marker>
      )}

      <MapClickHandler
        onSelect={onLocationSelect}
        setAddressValue={setAddressValue}
        setSelectedPositionValue={setSelectedPositionValue}
      />
    </MapContainer>
  );
}
