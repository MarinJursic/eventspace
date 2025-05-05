"use client";

import { ILeafletLocationInfo } from "@/types/leaflet.types";
import { IServiceClientState } from "@/types/service.types";
import { LatLng } from "leaflet";
import dynamic from "next/dynamic";
import { Dispatch, SetStateAction, useEffect, useState } from "react";

const DynamicLeafletMap = dynamic(() => import("@/components/leaflet/Map"), {
  ssr: false,
  loading: () => (
    <p className="flex justify-center items-center h-64">Loading map...</p>
  ),
});

export default function ServiceMap({
  service,
  setService,
}: {
  service: IServiceClientState;
  setService: Dispatch<SetStateAction<IServiceClientState>>;
}) {
  const [leafletLocation, setLeafletLocation] = useState<ILeafletLocationInfo>(
    service.location as ILeafletLocationInfo
  );

  const handleMapClick = (data: LatLng) => {
    setService((previousService: IServiceClientState) => ({
      ...previousService,
      location: {
        ...previousService.location,
        lat: data.lat,
        lng: data.lng,
      },
    }));
  };

  useEffect(() => {
    setService((previousService: IServiceClientState) => ({
      ...previousService,
      location: {
        ...previousService.location,
        street: leafletLocation.street,
        houseNumber: leafletLocation.houseNumber,
        postalCode: leafletLocation.postalCode,
        city: leafletLocation.city,
        country: leafletLocation.country,
        lat: leafletLocation.lat,
        lng: leafletLocation.lng,
      },
    }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [leafletLocation]);

  return (
    <>
      <DynamicLeafletMap
        lat={45.813119}
        lng={15.97735}
        zoom={13}
        onLocationSelect={(e) => {
          handleMapClick(e);
        }}
        className="w-full h-64 active:cursor-pointer"
        leafletLocation={leafletLocation}
        setLeafletLocation={setLeafletLocation}
      />
    </>
  );
}
