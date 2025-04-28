// lib/actions/serviceActions.ts
"use server";

import connectToDatabase from "../database/mongodb"; // Using relative path from lib
import ServiceModel, { IService } from "../database/schemas/service"; // Using relative path
import ReviewModel, { IReview } from "../database/schemas/review"; // Using relative path
import { FilterQuery, Types, Document } from 'mongoose';
import { ReadonlyURLSearchParams } from "next/navigation";

// --- Define Serialized Types (Client-Facing) ---
// Adjust these interfaces to match EXACTLY what your final serialized data looks like

interface SerializedLocation {
    address: string; city?: string; street?: string; houseNumber?: number;
    country?: string; postalCode?: number; latitude?: number; longitude?: number;
}
interface SerializedPrice { basePrice: number; model: 'hour' | 'day' | 'week'; }
interface SerializedRating { average: number; count: number; }
interface SerializedImage { url: string; alt?: string; caption?: string; }
interface SerializedPolicyItem { name: string; description: string; }
interface SerializedPolicies { listOfPolicies?: SerializedPolicyItem[]; }
interface SerializedBookedDate { date: string; bookingRef?: string; }
interface SerializedBlockedWeekday { weekday: string; recurrenceRule: 'weekly' | 'biweekly' | 'monthly'; }
interface SerializedAvailabilityRules { blockedWeekdays?: SerializedBlockedWeekday[]; }

export interface SerializedReview { // Export if needed by client directly
    id: string; _id: string; user: string; rating: number; comment?: string;
    target: string; targetModel: 'Venue' | 'Service'; isDeleted: boolean;
    createdAt: string; updatedAt: string;
}

export interface SerializedService { // Export if needed by client directly
    id: string; _id: string; name: string; location: SerializedLocation;
    price: SerializedPrice; description?: string; features?: string[];
    images: SerializedImage[]; policies?: SerializedPolicies;
    bookedDates?: SerializedBookedDate[]; availabilityRules?: SerializedAvailabilityRules;
    category?: string[]; type?: string; status: string; owner: string;
    rating: SerializedRating; sponsored?: { isActive: boolean; until?: string; planType?: string };
    reviews?: SerializedReview[]; // Reviews included here
    createdAt?: string; updatedAt?: string;
}

// --- Helper for safe JSON serialization ---
function serializeData(data: any): any {
    try {
        if (data === null || data === undefined) return null;
        return JSON.parse(JSON.stringify(data, (key, value) =>
            typeof value === 'bigint' ? value.toString() : value
        ));
    } catch (error) {
        console.error("Serialization Error:", error);
        return Array.isArray(data) ? [] : null;
    }
}


// --- Fetch Single Service By ID (Includes Reviews) ---
export async function getServiceById(id: string): Promise<SerializedService | null> {
    if (!id || !id.match(/^[0-9a-fA-F]{24}$/)) {
        console.error("Invalid ID format provided to getServiceById:", id);
        return null;
    }
    try {
        await connectToDatabase();

        // Fetch service and reviews concurrently
        const [serviceDoc, reviews] = await Promise.all([
            ServiceModel.findById(id).exec(), // Fetch full Mongoose doc
            ReviewModel.find({
                target: new Types.ObjectId(id), // Ensure querying with ObjectId
                targetModel: 'Service',
                isDeleted: { $ne: true }
            })
            .sort({ createdAt: -1 })
            .limit(20)
            .lean({ virtuals: true }) // Lean reviews is okay
            .exec()
        ]).catch(err => {
            console.error(`[getServiceById] Error during Promise.all for Service ID ${id}:`, err);
            return [null, null];
        });

        if (!serviceDoc) {
            console.log(`Service with ID ${id} not found.`);
            return null;
        }

        // Convert Mongoose doc to plain object including virtuals
        const serviceObject = serviceDoc.toObject({ virtuals: true });

        // Combine with fetched reviews
        const finalData = {
            ...serviceObject,
            reviews: Array.isArray(reviews) ? reviews : [], // Add reviews array
        };

        // Serialize and cast
        return serializeData(finalData) as SerializedService | null;

    } catch (error) {
        if (error instanceof Error && error.name === 'CastError') { console.error("Invalid ID format during findById:", id); }
        else { console.error(`Error fetching service ${id}:`, error); }
        return null;
    }
}

// --- Fetch All Services ---
export async function getAllServices(
    searchParams: { [key: string]: string | string[] | undefined }
): Promise<SerializedService[]> {
    try {
        await connectToDatabase();
        const query: FilterQuery<IService> = { status: 'active' }; // Base query

        // Apply Filters
        const getStringParam = (key: string): string | null => {
             const value = searchParams[key]; return typeof value === 'string' ? value : null;
        };

        const searchTerm = getStringParam('q'); if (searchTerm) query.name = { $regex: searchTerm, $options: 'i' };
        const location = getStringParam('location'); if (location) query['location.city'] = new RegExp(`^${location}$`, 'i');
        const minPrice = getStringParam('minPrice'); const maxPrice = getStringParam('maxPrice');
        if (minPrice || maxPrice) {
             const priceCondition: { $gte?: number; $lte?: number } = {};
             const minP = parseInt(minPrice || '0'); if (!isNaN(minP)) priceCondition.$gte = minP;
             const maxP = parseInt(maxPrice || ''); if (!isNaN(maxP) && maxP > 0 && maxP <= 10000) priceCondition.$lte = maxP;
             if (Object.keys(priceCondition).length > 0) query['price.basePrice'] = priceCondition;
        }
        const typesParam = getStringParam('types'); if (typesParam) {
            const typeKeys = typesParam.split(',').map(t => t.trim()).filter(t => t);
            if (typeKeys.length > 0) query.type = { $in: typeKeys.map(t => new RegExp(`^${t}$`, 'i')) };
        }
        const categoryParam = getStringParam('categories'); if (categoryParam) {
             const categoryKeys = categoryParam.split(',').map(c => c.trim()).filter(c => c);
             if (categoryKeys.length > 0) query.category = { $in: categoryKeys };
         }
        // Add other service-specific filters if needed

        // Sorting
        const sortOption = getStringParam('sort') || 'recommended';
        let sortQuery: any = { 'rating.average': -1 };
        if (sortOption === 'price-asc') sortQuery = { 'price.basePrice': 1 };
        else if (sortOption === 'price-desc') sortQuery = { 'price.basePrice': -1 };
        else if (sortOption === 'rating') sortQuery = { 'rating.average': -1 };
        else if (sortOption === 'recommended') sortQuery = { 'sponsored.isActive': -1, 'rating.average': -1 };

        // Execute Query
        const servicesDocs: IService[] = await ServiceModel.find(query)
            .sort(sortQuery)
            .limit(100)
            .exec(); // Fetch full docs

        // Convert to Plain Objects with Virtuals
        const serviceObjects = servicesDocs.map(doc => doc._doc);

        return serializeData(serviceObjects) as SerializedService[]; // Serialize and cast

    } catch (error) {
        console.error("Error fetching all services:", error);
        return [];
    }
}

// --- Action to get unique service types/cities if needed ---
export async function getDbServiceTypes(): Promise<{ id: string; label: string }[]> {
     try {
         await connectToDatabase();
         const types: string[] = await ServiceModel.distinct('type', { 'type': { $ne: null } }).exec();
         return types.sort().map(type => ({ id: type.toLowerCase(), label: type }));
     } catch (error) {
         console.error("Error fetching distinct service types:", error);
         return [];
     }
}

export async function getDbServiceCities(): Promise<{ value: string; label: string }[]> {
    try {
        await connectToDatabase();
        // Use distinct on the 'location.city' field for services
        const cities: string[] = await ServiceModel.distinct('location.city', {
             'location.city': { $ne: null } // Ensure city exists
        }).exec();
        return cities.sort().map(city => ({ value: city.toLowerCase(), label: city }));
    } catch (error) {
        console.error("Error fetching distinct service cities:", error);
        return [];
    }
}

export async function getFeaturedServices(limit: number = 4): Promise<SerializedService[]> {
    try {
        await connectToDatabase();

        // Find active services, sort by sponsored status then rating, limit results
        const servicesDocs: IService[] = await ServiceModel.find({ status: 'active' })
            .sort({ 'sponsored.isActive': -1, 'rating.average': -1 }) // Sponsored first, then highest rated
            .limit(limit)
            .exec(); // Fetch full docs

        // Convert to Plain Objects with Virtuals
        const serviceObjects = servicesDocs.map(doc => doc._doc);

        // console.log(`Found ${serviceObjects.length} featured services.`);
        return serializeData(serviceObjects) as SerializedService[];

    } catch (error) {
        console.error("Error fetching featured services:", error);
        return []; // Return empty array on error
    }
}