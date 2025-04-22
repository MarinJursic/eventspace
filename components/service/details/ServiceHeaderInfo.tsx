import React from 'react';
import { MockService } from '@/lib/mockServices'; // Import type
import { Badge } from '@/components/ui/badge';
import { Star, MapPin } from 'lucide-react';

interface ServiceHeaderInfoProps {
    name: string;
    type?: string;
    rating: MockService['rating'];
    location?: MockService['location'];
}

const ServiceHeaderInfo: React.FC<ServiceHeaderInfoProps> = ({
    name,
    type,
    rating,
    location,
}) => {
    return (
        <div>
            <h1 className="font-display text-3xl md:text-4xl font-bold tracking-tight">
                {name}
            </h1>
            {type && <Badge variant="outline" className="mt-2">{type}</Badge>}
            <div className="flex items-center flex-wrap gap-x-4 gap-y-1 mt-3 text-sm">
                {rating.count > 0 ? (
                    <div className="flex items-center text-amber-600">
                        <Star className="w-4 h-4 fill-amber-400 text-amber-500 mr-1" />
                        <span className="font-medium">{rating.average.toFixed(1)}</span>
                        <span className="ml-1 text-muted-foreground">({rating.count} reviews)</span>
                    </div>
                ) : (
                    <div className="flex items-center text-muted-foreground">
                        <Star className="w-4 h-4 text-muted-foreground mr-1" />
                        <span>No reviews yet</span>
                    </div>
                )}
                {location?.city && (
                    <div className="flex items-center text-muted-foreground">
                        <MapPin className="w-4 h-4 mr-1" />
                        <span>{location.city}</span>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ServiceHeaderInfo;