import { Dispatch, SetStateAction } from 'react';
import { venueAmenityValues } from './VenueAmenityValues';
import { IVenueClientState } from '@/types/venue.types';

export default function AmenitiesStep(
    { venue, setVenue }
    : { venue: IVenueClientState, setVenue: Dispatch<SetStateAction<IVenueClientState>> }
) {
    if(venue.amenities === undefined) return;

    const handleAmenitySelect = (amenityId: string) => {
        setVenue((prevVenue: IVenueClientState): IVenueClientState => {
            const currentAmenities = prevVenue.amenities || [];
            let updatedAmenities: string[];
            
            if (currentAmenities.includes(amenityId)) {
                updatedAmenities = currentAmenities.filter(id => id !== amenityId);
            } else {
                updatedAmenities = [...currentAmenities, amenityId];
            }
            
            return {
                ...prevVenue,
                amenities: updatedAmenities,
            };
        });
    };

    const checkIsAmenityIncluded = (_id: string): boolean => {
        return venue.amenities?.includes(_id) ?? false;
    }

    return (
        <div className="space-y-6">
            <h1 className='font-bold text-3xl pb-5'>Amenities</h1>

            <p className="text-muted-foreground mb-4" style={{marginTop: "0px"}}>
                Including more amenities can make your venue more attractive to potential clients. Select all amenities that are available at your venue.
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {venueAmenityValues.map((amenity) => (
                    <div
                        key={amenity.id}
                        className={`
                            p-4 border rounded-lg cursor-pointer transition-colors flex flex-col items-center justify-center text-center gap-3
                            ${checkIsAmenityIncluded(amenity._id) ? 'bg-primary/10 border-primary' : 'hover:bg-muted'}
                        `}
                        onClick={() => handleAmenitySelect(amenity._id)}
                    >
                        <div className={`p-2 rounded-full ${checkIsAmenityIncluded(amenity._id) ? 'bg-primary/20' : 'bg-muted'}`}>
                            {amenity.icon}
                        </div>
                        <span className="font-medium">{amenity.label}</span>
                    </div>
                ))}
            </div>
        </div>
    );
};