import { venueCategoryValues } from './VenueCategoryValues';
import React, { Dispatch, SetStateAction } from 'react';
import { IVenueClientState } from '@/types/venue.types';

export default function CategoriesStep(
    { venue, setVenue }
    : { venue: IVenueClientState, setVenue: Dispatch<SetStateAction<IVenueClientState>> }
) {

    const handleCategorySelect = (selectedCategory: string) => {
        setVenue((prevVenue: IVenueClientState): IVenueClientState => {
            if (prevVenue.category === selectedCategory) {
                return prevVenue;
            }

            return {
                ...prevVenue,
                category: selectedCategory,
            };
        });
    };

    if (!venue.category) {
        console.error("Venue category is unexpectedly null or empty. Please ensure a default category is set in the initial state.");
    }

    return (
        <div className="space-y-6">
            <h1 className='font-bold text-3xl'>Category</h1>

            <p className="text-muted-foreground mb-4">
                Select the category that best describes your venue. This helps potential clients find your space more easily.
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {venueCategoryValues.map((category) => (
                    <div
                        key={category.id}
                        className={`
                            p-4 border rounded-lg cursor-pointer transition-colors flex flex-col items-center justify-center text-center gap-3
                            ${venue.category === category._id ? 'bg-primary/10 border-primary' : 'hover:bg-muted'}
                        `}
                        onClick={() => handleCategorySelect(category._id)}
                    >
                        <div className={`
                            p-2 rounded-full
                            ${venue.category === category.id ? 'bg-primary/20' : 'bg-muted'}
                        `}>
                            {category.icon}
                        </div>
                        <span className="font-medium">{category.label}</span>
                    </div>
                ))}
            </div>
        </div>
    );
};