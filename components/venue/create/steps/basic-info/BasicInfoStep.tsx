import React, { Dispatch, SetStateAction } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Users } from 'lucide-react';
import { IVenueClientState } from '@/types/venue.types';
import { capacityOptions, venueTypes } from './VenueInfoValues';

export default function BasicInfoStep(
    { venue, setVenue }
    : {venue: IVenueClientState, setVenue: Dispatch<SetStateAction<IVenueClientState>>}
) {
    const MAX_DESCRIPTION_WORDS = 50;
    const countWords = (text: string) => {
        return text.trim().split(/\s+/).filter(Boolean).length;
    };


    const handleCapacityChange = (type: 'seated' | 'standing', value: string) => {
        const option = capacityOptions.find(opt => opt.value === value);

        if (option && venue.seating) {
            const newSeating = {
                ...venue.seating,
                [type]: option.count
            };

            setVenue({
                ...venue,
                seating: newSeating,
                capacity: newSeating.seated + newSeating.standing,
            });
        }
    };

    if(!venue.seating) return <></>;

    return (
        <div className="space-y-6">
            <h1 className='font-bold text-3xl'>Basic Information</h1>

            <div>
                <Label htmlFor="name">Name <span className="text-red-500">*</span></Label>
                <Input id="name" placeholder="Enter venue name" value={venue.name} 
                       onChange={(e) => setVenue({ ...venue, name: e.target.value })} className="mt-2"
                />
            </div>

            <div>
                <Label htmlFor="description">Description <span className="text-red-500">*</span></Label>
                <p className="text-sm text-muted-foreground mb-1 mt-1">
                    Include key features, atmosphere, unique selling points, and any other relevant details.
                </p>
                <Textarea id="description" placeholder="Describe your venue in detail" value={venue.description}
                          onChange={(e) => {
                              if (countWords(e.target.value) <= MAX_DESCRIPTION_WORDS) {
                                setVenue({ ...venue, description: e.target.value })
                              }
                          }}
                          className="mt-3 h-32 resize-none"
                />
                <p className="text-sm mt-1">
                    {MAX_DESCRIPTION_WORDS - countWords(venue.description ?? "")} words remaining
                </p>
            </div>

            <div>
                <Label htmlFor="type">Venue Type <span className="text-red-500">*</span></Label>
                <Select value={venue.type} onValueChange={(value) => setVenue({ ...venue, type: value })}>
                    <SelectTrigger id="type" className="mt-1">
                        <SelectValue placeholder="Select venue type" />
                    </SelectTrigger>
                    <SelectContent>
                        {venueTypes.map((type) => (
                            <SelectItem key={type} value={type}>
                                {type}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            <div className="space-y-4">
                <h3 className="text-lg font-semibold">Capacity Information</h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <Label>Seated Capacity <span className="text-red-500">*</span></Label>
                        <Select
                            value={capacityOptions.find(opt => opt.count === venue.seating?.seated)?.value}
                            onValueChange={(value) => handleCapacityChange('seated', value)}
                        >
                            <SelectTrigger className="mt-1">
                                <SelectValue placeholder="Select seated capacity" />
                            </SelectTrigger>
                            <SelectContent>
                                {capacityOptions.map((option) => (
                                    <SelectItem key={option.value} value={option.value}>
                                        {option.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div>
                        <Label>Standing Capacity <span className="text-red-500">*</span></Label>
                        <Select
                            value={capacityOptions.find(opt => opt.count === venue.seating?.standing)?.value}
                            onValueChange={(value) => handleCapacityChange('standing', value)}
                        >
                            <SelectTrigger className="mt-1">
                                <SelectValue placeholder="Select standing capacity" />
                            </SelectTrigger>
                            <SelectContent>
                                {capacityOptions.map((option) => (
                                    <SelectItem key={option.value} value={option.value}>
                                        {option.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                {(venue.seating.seated > 0 || venue.seating.standing > 0 ) && (
                    <div className="flex items-center gap-2 p-3 bg-muted rounded-lg">
                        <Users className="h-5 w-5 text-muted-foreground" />
                        <span className="font-medium">Total Capacity: {venue.capacity}</span>
                    </div>
                )}
            </div>
        </div>
    );
};