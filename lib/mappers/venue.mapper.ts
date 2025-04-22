import { mongo, Types } from 'mongoose';
import { ObjectId } from 'mongodb';
import { IVenue } from '@/lib/database/schemas/venue'; 
import { IVenueClientState } from '@/types/venue.types';

export function mapVenueToClientState(venue: IVenue): IVenueClientState {
    return {
        _id: venue._id?.toString(),
        name: venue.name,
        location: venue.location,
        price: venue.price,
        reviews: venue.reviews.map(objectId => objectId.toString()),
        seating: venue.seating,
        description: venue.description,
        images: venue.images,
        amenities: venue.amenities?.map(objectId => objectId.toString()),
        services: venue.services.map(objectId => objectId.toString()),
        policies: venue.policies,
        bookedDates: venue.bookedDates.map(bookedDate => ({
            date: bookedDate.date.toISOString(),
            bookingRef: bookedDate.bookingRef?.toString()
        })),
        availabilityRules: venue.availabilityRules,
        category: venue.category.toString(),
        type: venue.type,
        status: venue.status,
        capacity: venue.capacity,
        owner: venue.owner.toString(),
        rating: venue.rating,
        sponsored: venue.sponsored,
        createdAt: venue.createdAt,
        updatedAt: venue.updatedAt
    } as IVenueClientState;
}

// export function mapClientStateToVenueData(venue: IVenueClientState): IVenue {
//     return {
//         name: venue.name,
//         location: venue.location,
//         price: venue.price,
//         seating: venue.seating,
//         description: venue.description,
//         images: venue.images,
//         availabilityRules: venue.availabilityRules,
//         type: venue.type,
//         status: venue.status,
//         capacity: venue.capacity,
//         rating: venue.rating,
//         reviews: venue.reviews?.map(id => new Types.ObjectId(id)),
//         amenities: venue.amenities?.map(id => new Types.ObjectId(id)),
//         services: venue.services?.map(id => new Types.ObjectId(id)),
//         category: new Types.ObjectId(venue.category),
//         policies: venue.policies ? {
//             listOfPolicies: venue.policies.listOfPolicies,
//             bannedServices: venue.policies.bannedServices?.map(id => new Types.ObjectId(id)),
//         } : undefined,
//         bookedDates: venue.bookedDates?.map(bd => ({
//             date: new Date(bd.date),
//             bookingRef: bd.bookingRef ? new Types.ObjectId(bd.bookingRef) : undefined,
//         })),
//         owner: venue.owner ? new Types.ObjectId(venue.owner) : undefined,
//         sponsored: venue.sponsored ? {
//             isActive: venue.sponsored.isActive,
//             planType: venue.sponsored.planType,
//             until: venue.sponsored.until ? new Date(venue.sponsored.until) : undefined,
//         } : undefined,
//     } as IVenue;
// }

export function mapClientStateToVenueData(venue: IVenueClientState): IVenue {
    return {
        name: venue.name,
        location: venue.location,
        price: venue.price,
        seating: venue.seating,
        description: venue.description,
        images: venue.images,
        availabilityRules: venue.availabilityRules,
        type: venue.type,
        status: venue.status,
        capacity: venue.capacity,
        rating: venue.rating,
        reviews: venue.reviews?.map(id => new Types.ObjectId(id)),
        amenities: venue.amenities?.map(id => new Types.ObjectId(id)),
        services: venue.services?.map(id => new Types.ObjectId(id)),
        category: new Types.ObjectId(venue.category),
        policies: venue.policies,
        bookedDates: venue.bookedDates?.map(bd => ({
            date: new Date(bd.date),
            bookingRef: bd.bookingRef ? new Types.ObjectId(bd.bookingRef) : undefined,
        })),
        owner: venue.owner ? new Types.ObjectId(venue.owner) : undefined,
        sponsored: venue.sponsored,
    } as IVenue;
}