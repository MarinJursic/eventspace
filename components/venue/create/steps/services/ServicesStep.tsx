import { Dispatch, SetStateAction, useState } from 'react';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { IVenueClientState } from '@/types/venue.types';
import { venueServiceValues } from './VenueServiceValues';

export default function ServicesStep(
    { venue, setVenue }
    : {venue: IVenueClientState, setVenue: Dispatch<SetStateAction<IVenueClientState>>}
) {
    const [searchQuery, setSearchQuery] = useState('');

    const toggleService = (serviceId: string) => {
        if (venue.services.includes(serviceId)) {
            setVenue({
                ...venue,
                services: venue.services.filter((id) => id !== serviceId),
            });
        } else {
            setVenue({
                ...venue,
                services: [...venue.services, serviceId],
            });
        }
    };

    const filteredServices = venueServiceValues.filter(service =>
        service.label.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="space-y-6">
            <h1 className='font-bold text-3xl'>Services</h1>

            <p className="text-muted-foreground mb-4">
                Select the services that you offer or allow at your venue. Clients will be able to filter venues based on these services.
            </p>

            <div className="relative mb-4">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input placeholder="Search services..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-10"/>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {filteredServices.map((service) => (
                    <div key={service.id} onClick={() => toggleService(service._id)} className={`
                            p-4 border rounded-lg cursor-pointer transition-colors flex flex-col items-center justify-center text-center
                            ${venue.services.includes(service._id) ? 'bg-primary/10 border-primary' : 'hover:bg-muted'}
                        `}
                    >
                        <span className="font-medium">{service.label}</span>
                    </div>
                ))}

                {filteredServices.length === 0 && (
                    <div className="col-span-3 py-8 text-center text-muted-foreground">
                        No services match your search criteria
                    </div>
                )}
            </div>
        </div>
    );
};