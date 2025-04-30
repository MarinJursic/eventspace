// lib/actions/serviceActions.ts
"use server";

import connectToDatabase from "../database/mongodb"; // Adjust path if needed
import ServiceModel, { IService } from "../database/schemas/service"; // Adjust path
import ReviewModel, { IReview } from "../database/schemas/review"; // Adjust path
import EnumModel, { IEnum, IEnumValue } from "../database/schemas/enum"; // Adjust path
import { FilterQuery, Types, Document } from 'mongoose';
import { ReadonlyURLSearchParams } from "next/navigation";

// --- Define Types for Serialized Data (Client-Facing) ---
// These interfaces define the plain object structure expected by client components
// AFTER data is fetched, processed (features/reviews populated), and serialized.

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

// Define the Structure Expected by the Client for Populated Features
interface PopulatedFeatureClient {
    _id: string;
    id: string; // Mongoose virtual added via toObject/serialize
    key: string;
    label: string;
    icon?: string; // Optional icon name string from Enum
}

export interface SerializedReview { // Export if needed by client directly
    id: string; _id: string; user: string; rating: number; comment?: string;
    target: string; targetModel: 'Venue' | 'Service'; isDeleted: boolean;
    createdAt: string; updatedAt: string;
}

export interface SerializedService { // Export if needed by client directly
    id: string; _id: string; name: string; location: SerializedLocation;
    price: SerializedPrice; description?: string;
    features?: PopulatedFeatureClient[]; // Changed from string[] to populated type
    images: SerializedImage[]; policies?: SerializedPolicies;
    bookedDates?: SerializedBookedDate[]; availabilityRules?: SerializedAvailabilityRules;
    category?: string[]; type?: string; status: string; owner: string; // Owner as string
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
        console.error("Serialization Error in serializeData:", error);
        return Array.isArray(data) ? [] : null;
    }
}

// --- Helper Function to Map Feature IDs to Details ---
function mapFeatures(
    featureIds: (Types.ObjectId | string)[] = [],
    featureEnumDoc: IEnum | null // Pass the 'serviceFeature' Enum document
): PopulatedFeatureClient[] {
    if (!featureEnumDoc?.values || featureIds.length === 0) return [];
    const featureValueMap = new Map<string, IEnumValue>();
    featureEnumDoc.values.forEach(val => { if (val?._id) featureValueMap.set(val._id.toString(), val); });
    return featureIds
        .map(id => featureValueMap.get(id?.toString()))
        .filter((featureValue): featureValue is IEnumValue => !!featureValue)
        .map(featureValue => ({
            _id: featureValue._id.toString(),
            id: featureValue._id.toString(), // virtual id
            key: featureValue.key,
            label: featureValue.label,
            icon: featureValue.icon, // Include icon if stored in Enum
        }));
}


// --- Fetch Single Service By ID (Includes Reviews & Populated Features) ---
export async function getServiceById(id: string): Promise<SerializedService | null> {
    // Validate ID format
    if (!id || !id.match(/^[0-9a-fA-F]{24}$/)) {
      console.error("Invalid ID format provided to getServiceById:", id);
      return null;
    }
    try {
        await connectToDatabase(); // Ensure database connection

        // Fetch service, reviews, and feature enum concurrently
        const [serviceDoc, reviews, featureEnumDoc] = await Promise.all([
            ServiceModel.findById(id).exec(), // Fetch full Mongoose doc
            ReviewModel.find({
                target: new Types.ObjectId(id), // Ensure querying with ObjectId
                targetModel: 'Service',
                isDeleted: { $ne: true }
            })
            .sort({ createdAt: -1 })
            .limit(20)
            .lean({ virtuals: true }) // Lean reviews is fine, include virtuals
            .exec(),
            // Fetch feature enum only if service might have features
            EnumModel.findOne({ enumType: 'serviceFeature' }).lean().exec() as Promise<IEnum | null>
        ]).catch(err => {
            console.error(`[getServiceById] Error during Promise.all for Service ID ${id}:`, err);
            return [null, null, null]; // Return nulls on error
        });

        // Handle service not found
        if (!serviceDoc) {
            console.log(`Service with ID ${id} not found.`);
            return null;
        }

        // Map Features
        let populatedFeatures: PopulatedFeatureClient[] = [];
        if (serviceDoc.features && serviceDoc.features.length > 0 && featureEnumDoc) {
            populatedFeatures = mapFeatures(serviceDoc.features, featureEnumDoc);
        } else if (serviceDoc.features && serviceDoc.features.length > 0 && !featureEnumDoc) {
            console.warn(`Could not find 'serviceFeature' Enum document for service ${id}.`);
            // Optionally map to basic objects if needed, or leave as empty array
            // populatedFeatures = serviceDoc.features.map(fId => ({ _id: fId.toString(), id: fId.toString(), key: 'unknown', label: 'Unknown Feature' }));
        }

        // Convert Mongoose doc to plain object including virtuals
        const serviceObject = serviceDoc.toObject({ virtuals: true });

        // Combine with fetched reviews and populated features
        const finalData = {
            ...serviceObject,
            reviews: Array.isArray(reviews) ? reviews : [], // Add reviews array
            features: populatedFeatures, // Replace IDs with populated objects
        };

        // Serialize and cast
        return serializeData(finalData) as SerializedService | null;

    } catch (error) {
        // Catch potential Mongoose CastError for invalid ID formats during findById
        if (error instanceof Error && error.name === 'CastError') {
            console.error("Invalid ID format during findById (Service):", id);
        } else {
            console.error(`Error fetching service ${id}:`, error);
        }
        return null; // Return null on errors
    }
}

// --- Fetch All Services (with Filtering) ---
export async function getAllServices(
    searchParams: { [key: string]: string | string[] | undefined }
): Promise<SerializedService[]> {
    try {
        await connectToDatabase();
        const query: FilterQuery<IService> = { status: 'active' }; // Base query

        // --- Apply Filters ---
        const getStringParam = (key: string): string | null => {
            const value = searchParams[key]; return typeof value === 'string' ? value : null;
        };

        // Apply filters (search, location, price, type, category, rating etc.)
        const searchTerm = getStringParam('q'); if (searchTerm) query.name = { $regex: searchTerm, $options: 'i' };
        const location = getStringParam('location'); if (location) query['location.city'] = new RegExp(`^${location}$`, 'i');
        const minPrice = getStringParam('minPrice'); const maxPrice = getStringParam('maxPrice');
        if (minPrice || maxPrice) {
            const priceCondition: { $gte?: number; $lte?: number } = {};
            const minP = parseInt(minPrice || '0'); if (!isNaN(minP)) priceCondition.$gte = minP;
            const maxP = parseInt(maxPrice || ''); if (!isNaN(maxP) && maxP > 0 && maxP <= 10000) priceCondition.$lte = maxP; // Adjust max price limit
            if (Object.keys(priceCondition).length > 0) query['price.basePrice'] = priceCondition;
        }
        const typesParam = getStringParam('types'); if (typesParam) {
            const typeKeys = typesParam.split(',').map(t => t.trim()).filter(t => t);
            if (typeKeys.length > 0) query.type = { $in: typeKeys.map(t => new RegExp(`^${t}$`, 'i')) };
        }
        const categoryParam = getStringParam('categories'); if (categoryParam) {
             const categoryKeys = categoryParam.split(',').map(c => c.trim()).filter(c => c);
             if (categoryKeys.length > 0) query.category = { $in: categoryKeys }; // Assuming category is string array
         }
         const minRatingParam = getStringParam('minRating'); if (minRatingParam) {
            const minR = parseInt(minRatingParam);
            if (!isNaN(minR) && minR >= 1 && minR <= 5) query['rating.average'] = { $gte: minR };
        }
        // Note: Filtering by features (which are ObjectIds) would require fetching the Enum doc first, similar to amenities in getAllVenues

        // --- Sorting ---
        const sortOption = getStringParam('sort') || 'recommended';
        let sortQuery: any = { 'rating.average': -1 };
        if (sortOption === 'price-asc') sortQuery = { 'price.basePrice': 1 };
        else if (sortOption === 'price-desc') sortQuery = { 'price.basePrice': -1 };
        else if (sortOption === 'rating') sortQuery = { 'rating.average': -1 };
        else if (sortOption === 'recommended') sortQuery = { 'sponsored.isActive': -1, 'rating.average': -1 };

        // --- Execute Query ---
        // console.log("Executing Service Query:", JSON.stringify(query, null, 2));
        const servicesDocs: IService[] = await ServiceModel.find(query)
            .sort(sortQuery)
            .limit(100)
            .exec(); // Fetch full docs

        // --- Convert to Plain Objects with Virtuals ---
        // We are NOT populating features here for the list view for performance.
        // The SerializedService type should reflect this (features?: string[] or features?: PopulatedFeatureClient[] but often empty/not included)
        const serviceObjects = servicesDocs.map(doc => {
            const serviceObject = doc._doc;
            // Ensure reviews is not included or is empty for list view serialization
            delete serviceObject.reviews; // Or set serviceObject.reviews = [];
            // If features are ObjectIds in schema, keep them as strings for list view client
            serviceObject.features = (serviceObject.features || []).map((id: { toString: () => any; }) => id.toString());
            return serviceObject;
        });

        // console.log(`Found and processed ${serviceObjects.length} services.`);
        return serializeData(serviceObjects) as SerializedService[]; // Serialize and cast

    } catch (error) {
        console.error("Error fetching all services:", error);
        return [];
    }
}

// --- Action to get unique service types ---
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

// --- Action to get unique service cities ---
export async function getDbServiceCities(): Promise<{ value: string; label: string }[]> {
    try {
        await connectToDatabase();
        const cities: string[] = await ServiceModel.distinct('location.city', {
             'location.city': { $ne: null }
        }).exec();
        return cities.sort().map(city => ({ value: city.toLowerCase(), label: city }));
    } catch (error) {
        console.error("Error fetching distinct service cities:", error);
        return [];
    }
}

// --- Action to get featured services (includes populated features) ---
export async function getFeaturedServices(limit: number = 4): Promise<SerializedService[]> {
     try {
         await connectToDatabase();
         // Fetch Enum doc once for mapping
         const featureEnumDoc = await EnumModel.findOne({ enumType: 'serviceFeature' }).lean().exec() as IEnum | null;

         const servicesDocs: IService[] = await ServiceModel.find({ status: 'active' })
             .sort({ 'sponsored.isActive': -1, 'rating.average': -1 })
             .limit(limit)
             .exec();

         // Manually "Populate" Features & Convert
         const serviceObjects = servicesDocs.map((doc) => {
              const populated = mapFeatures(doc._doc.features || [], featureEnumDoc);
              return {
                  ...doc._doc,
                  features: populated, // Add populated features
                  reviews: [], // Exclude reviews for featured list
              };
          });

         return serializeData(serviceObjects) as SerializedService[];

     } catch (error) {
         console.error("Error fetching featured services:", error);
         return [];
     }
 }