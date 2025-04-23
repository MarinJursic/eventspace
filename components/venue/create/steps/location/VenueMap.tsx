"use client";

import { defaultLeafletLocation } from "@/lib/defaults/leafletLocation.default";
import { ILeafletLocationInfo } from "@/types/leaflet.types";
import { IVenueClientState } from "@/types/venue.types";
import { LatLng } from "leaflet";
import dynamic from "next/dynamic";
import { Dispatch, SetStateAction, useEffect, useState } from "react";

const DynamicLeafletMap = dynamic(
    () => import('@/components/leaflet/Map'),
    {
        ssr: false,
        loading: () => <p className="flex justify-center items-center h-64">Loading map...</p>
    }
);

export default function VenueMap({venue, setVenue}: { venue: IVenueClientState, setVenue: Dispatch<SetStateAction<IVenueClientState>> }){

    const [leafletLocation, setLeafletLocation] = useState<ILeafletLocationInfo>(venue.location as ILeafletLocationInfo);

    const handleMapClick = (data: LatLng) => {
        setVenue((previousVenue: IVenueClientState) => ({
            ...previousVenue,
            location: {
                ...previousVenue.location,
                lat: data.lat,
                lng: data.lng
            }
        }))
    }

    useEffect(() => {
        setVenue((previousVenue: IVenueClientState) => ({
            ...previousVenue,
            location: {
                ...previousVenue.location,
                street: leafletLocation.street,
                houseNumber: leafletLocation.houseNumber,
                postalCode: leafletLocation.postalCode,
                city: leafletLocation.city,
                country: leafletLocation.country,
                lat: leafletLocation.lat,
                lng: leafletLocation.lng,
            },
        }));
    }, [leafletLocation]);

    return (<>
        <DynamicLeafletMap
            lat={45.813119}
            lng={15.977350}
            zoom={13}
            onLocationSelect={(e) => { handleMapClick(e) }}
            className="w-full h-64 active:cursor-pointer"
            leafletLocation={leafletLocation}
            setLeafletLocation={setLeafletLocation}
        />
    </>);
}