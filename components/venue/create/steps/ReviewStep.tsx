import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import {
    MapPin,
    Users,
    Image,
    Check,
    AlertTriangle,
    CalendarDays,
    Info,
    Euro,
} from 'lucide-react';
import { IVenueClientState } from '@/types/venue.types';
import { venueAmenityValues } from './amenities/VenueAmenityValues';
import { venueServiceValues } from './services/VenueServiceValues';
import { bannedServiceValues } from './policies/VenuePolicyValues';

export default function ReviewStep ({ venue }: {venue: IVenueClientState}) {

    if(!venue.seating || !venue.amenities || !venue.policies || !venue.availabilityRules) return <></>;

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-2xl font-bold mb-4">Review Your Venue</h2>
                <p className="text-muted-foreground mb-6">
                    Please review all information before submitting your venue.
                </p>
            </div>

            <Card>
                <CardContent className="p-6">
                    <div className="space-y-6">
                        <div>
                            <h3 className="text-lg font-semibold border-b pb-2 flex items-center">
                                <Info className='mr-2 h-4 w-4'/> Basic Information
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-3">
                                <div>
                                    <p className="text-sm text-muted-foreground">Name</p>
                                    <p className="font-medium">{venue.name || 'Not provided'}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground">Type</p>
                                    <p className="font-medium">{venue.type || 'Not provided'}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground">Status</p>
                                    <Badge variant="outline" className="mt-1">
                                        {venue.status}
                                    </Badge>
                                </div>
                            </div>
                            <div className="mt-3">
                                <p className="text-sm text-muted-foreground">Description</p>
                                <p className="font-medium">{venue.description || 'Not provided'}</p>

                            </div>
                        </div>

                        <div>
                            <h3 className="text-lg font-semibold border-b pb-2 flex items-center">
                                <MapPin className="mr-2 h-4 w-4" /> Location
                            </h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-3">
                                <div>
                                    <p className="text-sm text-muted-foreground">Street & Number</p>
                                    <p className="font-medium">
                                        {venue.location.street} {venue.location.houseNumber}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground">City</p>
                                    <p className="font-medium">{venue.location.city || 'Not provided'}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground">Postal Code</p>
                                    <p className="font-medium">{venue.location.postalCode}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground">Country</p>
                                    <p className="font-medium">{venue.location.country || 'Not provided'}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground">Additional Info</p>
                                    <p className="font-medium">{venue.location.address || 'None'}</p>
                                </div>
                            </div>
                        </div>

                        <div>
                            <h3 className="text-lg font-semibold border-b pb-2 flex items-center">
                                <Euro className="mr-2 h-4 w-4" /> Pricing
                            </h3>
                            <div className="mt-3">
                                <p className="text-sm text-muted-foreground">Base Price</p>
                                <p className="font-medium text-lg">
                                    €{venue.price.basePrice} per {venue.price.model}
                                </p>
                            </div>
                        </div>

                        <div>
                            <h3 className="text-lg font-semibold border-b pb-2 flex items-center">
                                <Users className="mr-2 h-4 w-4" /> Capacity
                            </h3>
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-3">
                                <div>
                                    <p className="text-sm text-muted-foreground">Total Capacity</p>
                                    <p className="font-medium">{venue.capacity} persons</p>
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground">Seated</p>
                                    <p className="font-medium">{venue.seating.seated} persons</p>
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground">Standing</p>
                                    <p className="font-medium">{venue.seating.standing} persons</p>
                                </div>
                            </div>
                        </div>

                        <div>
                            <h3 className="text-lg font-semibold border-b pb-2 flex items-center">
                                <Image className="mr-2 h-4 w-4" /> Media
                            </h3>
                            <div className="mt-3">
                                {venue.images.length === 0 ? (
                                    <p className="text-sm text-muted-foreground">No images provided.</p>
                                ) : (
                                    <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 gap-2">
                                        {venue.images.map((image, index) => (
                                            <div key={index} className="aspect-square rounded-md overflow-hidden">
                                                <img
                                                    src={image.url}
                                                    alt={image.alt}
                                                    className="w-full h-full object-cover"
                                                />
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <h3 className="text-lg font-semibold border-b pb-2 flex items-center">
                                    <Check className="mr-2 h-4 w-4" /> Amenities & Services
                                </h3>
                                <div className="mt-3 grid grid-cols-1 gap-2">
                                    {venue.amenities.length > 0 && (
                                        <div>
                                            <p className="text-sm text-muted-foreground">Amenities</p>
                                            <div className="flex flex-wrap gap-1 mt-1">
                                                {venue.amenities.map((item, index) => (
                                                    <Badge key={index} variant="outline">
                                                        {venueAmenityValues.find(venueAmenityValue => venueAmenityValue._id === item)?.label}
                                                    </Badge>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {venue.services.length > 0 && (
                                        <div className="mt-2">
                                            <p className="text-sm text-muted-foreground">Services</p>
                                            <div className="flex flex-wrap gap-1 mt-1">
                                                {venue.services.map((item, index) => (
                                                    <Badge key={index} variant="outline">
                                                        {venueServiceValues.find(venueAmenityValue => venueAmenityValue._id === item)?.label}
                                                    </Badge>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {venue.amenities.length === 0 && venue.services.length === 0 && (
                                        <p className="text-sm text-muted-foreground">No amenities or services specified.</p>
                                    )}
                                </div>
                            </div>

                            <div>
                                <h3 className="text-lg font-semibold border-b pb-2 flex items-center">
                                    <AlertTriangle className="mr-2 h-4 w-4" /> Policies
                                </h3>
                                <div className="mt-3">
                                    {venue.policies.bannedServices.length > 0 && (
                                        <div className="mb-3">
                                            <p className="text-sm text-muted-foreground">Banned Services</p>
                                            <div className="flex flex-wrap gap-1 mt-1">
                                                {venue.policies.bannedServices.map((item, index) => (
                                                    <Badge key={index} variant="destructive" className="bg-red-100 text-red-800 hover:bg-red-200">
                                                        No {bannedServiceValues.find(venueAmenityValue => venueAmenityValue._id === item)?.label}

                                                    </Badge>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {venue.policies.listOfPolicies.length > 0 && (
                                        <div>
                                            <p className="text-sm text-muted-foreground">Custom Policies</p>
                                            <div className="space-y-2 mt-1 max-h-32 overflow-y-auto">
                                                {venue.policies.listOfPolicies.map((policy, index) => (
                                                    <div key={index} className="text-sm">
                                                        <span className="font-medium">{policy.name}:</span>{' '}
                                                        <span className="text-muted-foreground">{policy.description}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {venue.policies.bannedServices.length === 0 && venue.policies.listOfPolicies.length === 0 && (
                                        <p className="text-sm text-muted-foreground">No policies specified.</p>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div>
                            <h3 className="text-lg font-semibold border-b pb-2 flex items-center">
                                <CalendarDays className="mr-2 h-4 w-4" /> Availability
                            </h3>
                            <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <p className="text-sm text-muted-foreground">Blocked Dates</p>
                                    <p className="font-medium">
                                        {venue.bookedDates.length} date(s) blocked
                                    </p>
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground">Blocked Weekdays</p>
                                    {venue.availabilityRules.blockedWeekdays.length > 0 ? (
                                        <div className="flex flex-wrap gap-1 mt-1">
                                            {venue.availabilityRules.blockedWeekdays.map((item, index) => (
                                                <Badge key={index} variant="outline">
                                                    {item.weekday} ({item.recurrenceRule})
                                                </Badge>
                                            ))}
                                        </div>
                                    ) : (
                                        <p className="font-medium">None</p>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};