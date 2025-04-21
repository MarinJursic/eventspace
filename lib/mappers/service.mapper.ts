import { Types } from 'mongoose';
import { IService } from '@/lib/database/schemas/service'; 
import { IServiceClientState } from '@/types/service.types';

export function mapServiceToClientState(service: IService): IServiceClientState {
    return {
        _id: service._id?.toString(),
        name: service.name,
        location: service.location,
        price: service.price,
        reviews: service.reviews.map(objectId => objectId.toString()),
        description: service.description ?? "",
        features: service.features?.map(objectId => objectId.toString()),
        images: service.images,
        policies: service.policies,
        bookedDates: service.bookedDates.map(bookedDate => ({
            date: bookedDate.date.toISOString(),
            bookingRef: bookedDate.bookingRef?.toString()
        })),
        availabilityRules: service.availabilityRules,
        category: service.category.toString(),
        type: service.type,
        status: service.status,
        owner: service.owner.toString(),
        rating: service.rating,
        sponsored: service.sponsored,
        createdAt: service.createdAt,
        updatedAt: service.updatedAt
    } as IServiceClientState;
}

export function mapClientStateToServiceData(service: IServiceClientState): IService {
    return {
        _id: service._id,
        name: service.name,
        location: service.location,
        price: service.price,
        reviews: service.reviews?.map(id => new Types.ObjectId(id)),
        description: service.description,
        features: service.features?.map(id => new Types.ObjectId(id)),
        images: service.images,
        policies: service.policies ? {
            listOfPolicies: service.policies.listOfPolicies
        } : undefined,
        bookedDates: service.bookedDates?.map(bd => ({
            date: new Date(bd.date),
            bookingRef: bd.bookingRef ? new Types.ObjectId(bd.bookingRef) : undefined,
        })),
        availabilityRules: service.availabilityRules,
        category: new Types.ObjectId(service.category),
        type: service.type,
        status: service.status,
        owner: service.owner ? new Types.ObjectId(service.owner) : undefined,
        rating: service.rating,
        sponsored: service.sponsored ? {
            isActive: service.sponsored.isActive,
            planType: service.sponsored.planType,
            until: service.sponsored.until ? new Date(service.sponsored.until) : undefined,
        } : undefined,
        createdAt: service.createdAt,
        updatedAt: service.updatedAt,
    } as IService;
}