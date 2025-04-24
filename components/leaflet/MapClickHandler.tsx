import getAddressInfoFromLatLng from "@/lib/leaflet/nominatim";
import { ILeafletLocationInfo } from "@/types/leaflet.types";
import { LatLng, LatLngExpression } from "leaflet";
import { Dispatch, SetStateAction } from "react";
import { useMapEvents } from "react-leaflet";

export default function MapClickHandler(
    { onSelect, setAddressValue, setSelectedPositionValue }
    : { 
        onSelect: (latlng: LatLng) => void
        setAddressValue: Dispatch<SetStateAction<ILeafletLocationInfo>>, 
        setSelectedPositionValue: Dispatch<SetStateAction<LatLngExpression | null>>
    }
) {
    useMapEvents({
        click(e) {
            onSelect(e.latlng);
            setSelectedPositionValue([e.latlng.lat, e.latlng.lng]);
            getAddressInfoFromLatLng(e.latlng.lat, e.latlng.lng).then((data) => {
                const leafletLocation: ILeafletLocationInfo = {
                    street: data.address.road ?? "",
                    houseNumber: data.address.house_number ?? "",
                    postalCode: data.address.postcode ?? "",
                    city: data.address.city ?? "",
                    country: data.address.country ?? "",
                    lat: parseFloat(data.lat),
                    lng: parseFloat(data.lon),
                }
                setAddressValue(leafletLocation);
            })
        },
    });

    return null;
}