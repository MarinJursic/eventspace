import { Dispatch, SetStateAction } from 'react';
import { serviceFeatureValues } from './ServiceFeatureValues';
import { IServiceClientState } from '@/types/service.types';

export default function FeaturesStep(
    { service, setService }
    : { service: IServiceClientState, setService: Dispatch<SetStateAction<IServiceClientState>> }
) {
    if (service.features === undefined) return;

    const handleAmenitySelect = (amenityId: string) => {
        setService((prevService: IServiceClientState): IServiceClientState => {
            const currentAmenities = prevService.features || [];
            let updatedAmenities: string[];
            
            if (currentAmenities.includes(amenityId)) {
                updatedAmenities = currentAmenities.filter(id => id !== amenityId);
            } else {
                updatedAmenities = [...currentAmenities, amenityId];
            }
            
            return {
                ...prevService,
                features: updatedAmenities,
            };
        });
    };

    const checkIsAmenityIncluded = (_id: string): boolean => {
        return service.features?.includes(_id) ?? false;
    }

    return (
        <div className="space-y-6">
            <h1 className='font-bold text-3xl pb-5'>Features</h1>

            <p className="text-muted-foreground mb-4" style={{marginTop: "0px"}}>
                Including more features can make your service more attractive to potential clients. Select all features that are available with your service.
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {serviceFeatureValues.map((amenity) => (
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