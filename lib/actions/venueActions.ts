// lib/actions/venueActions.ts
"use server";

import connectToDatabase from "../database/mongodb"; // Using provided import path
import VenueModel, { IVenue } from "../database/schemas/venue"; // Using provided import path
import ReviewModel, { IReview } from "../database/schemas/review"; // Using provided import path
import EnumModel, { IEnum, IEnumValue } from "../database/schemas/enum"; // Using provided import path
import { FilterQuery, Types, Document } from 'mongoose'; // Added Document type
import { ReadonlyURLSearchParams } from "next/navigation"; // Keep this for type clarity if needed later

// --- Define Types for Serialized Data (Client-Facing) ---
// Structure expected by client components AFTER serialization

interface PopulatedAmenityClient {
    _id: string;
    id: string; // Mongoose virtual added via toObject/serialize
    key: string;
    label: string;
    icon?: string;
}
interface SerializedLocation {
    address: string; city?: string; street?: string; houseNumber?: number;
    country?: string; postalCode?: number; latitude?: number; longitude?: number;
}
interface SerializedPrice { basePrice: number; model: 'hour' | 'day' | 'week'; }
interface SerializedRating { average: number; count: number; }
interface SerializedSeating { seated: number; standing: number; }
interface SerializedImage { url: string; alt?: string; caption?: string; }
interface SerializedPolicyItem { name: string; description: string; }
interface SerializedPolicies { bannedServices?: string[]; listOfPolicies?: SerializedPolicyItem[]; }
interface SerializedBookedDate { date: string; bookingRef?: string; }
interface SerializedBlockedWeekday { weekday: string; recurrenceRule: 'weekly' | 'biweekly' | 'monthly'; }
interface SerializedAvailabilityRules { blockedWeekdays?: SerializedBlockedWeekday[]; }

export interface SerializedVenue {
    id: string; _id: string; name: string; location: SerializedLocation;
    price: SerializedPrice; seating?: SerializedSeating; description?: string;
    images: SerializedImage[]; amenities?: PopulatedAmenityClient[];
    reviews?: SerializedReview[]; // Reviews included in detail view
    policies?: SerializedPolicies; bookedDates?: SerializedBookedDate[];
    availabilityRules?: SerializedAvailabilityRules; category?: string; // Assuming ObjectId serialized to string
    type?: string; status: string; capacity?: number; owner: string; // Assuming ObjectId serialized to string
    rating: SerializedRating; sponsored?: { isActive: boolean; until?: string; planType?: string };
    createdAt?: string; updatedAt?: string;
}

export interface SerializedReview {
    id: string; _id: string; user: string; rating: number; comment?: string;
    target: string; targetModel: 'Venue' | 'Service'; isDeleted: boolean;
    createdAt: string; updatedAt: string;
}

// --- Helper for safe JSON serialization ---
function serializeData(data: any): any {
    try {
        if (data === null || data === undefined) return null;
        // Use replacer function to handle potential BigInt (though unlikely with Mongoose default IDs)
        return JSON.parse(JSON.stringify(data, (key, value) =>
            typeof value === 'bigint' ? value.toString() : value
        ));
    } catch (error) {
        console.error("Serialization Error in serializeData:", error);
        return Array.isArray(data) ? [] : null;
    }
}

// --- Helper Function to Map Amenity IDs to Details ---
function mapAmenities(
    amenityIds: (Types.ObjectId | string)[] = [],
    amenityEnumDoc: IEnum | null
): PopulatedAmenityClient[] {
    if (!amenityEnumDoc?.values || amenityIds.length === 0) return [];
    const amenityValueMap = new Map<string, IEnumValue>();
    amenityEnumDoc.values.forEach(val => { if (val?._id) amenityValueMap.set(val._id.toString(), val); });
    return amenityIds
        .map(id => amenityValueMap.get(id?.toString()))
        .filter((amenityValue): amenityValue is IEnumValue => !!amenityValue)
        .map(amenityValue => ({
            _id: amenityValue._id.toString(),
            id: amenityValue._id.toString(), // virtual id
            key: amenityValue.key,
            label: amenityValue.label,
            icon: amenityValue.icon,
        }));
}

export async function getFeaturedVenues(limit: number = 4): Promise<SerializedVenue[]> {
    try {
        await connectToDatabase();

        // Fetch Amenity Enum Doc Once for mapping later
        const amenityEnumDoc = await EnumModel.findOne({ enumType: 'venueAmenity' }).lean().exec() as IEnum | null;

        // Find active venues, sort by sponsored status then rating, limit results
        const venuesDocs: IVenue[] = await VenueModel.find({ status: 'active' })
            .sort({ 'sponsored.isActive': -1, 'rating.average': -1 }) // Sponsored first, then highest rated
            .limit(limit)
            .exec(); // Fetch full docs

        // Manually "Populate" Amenities & Convert
        const venuesWithPopulatedAmenities = venuesDocs.map((venueDoc: IVenue) => {
             const populated = mapAmenities(venueDoc._doc.amenities || [], amenityEnumDoc);
             return { ...venueDoc._doc, amenities: populated };
         });

        return serializeData(venuesWithPopulatedAmenities) as SerializedVenue[];

    } catch (error) {
        console.error("Error fetching featured venues:", error);
        return []; // Return empty array on error
    }
}

// --- Fetch Single Venue By ID ---
export async function getVenueById(id: string): Promise<SerializedVenue | null> {
    // Validate ID format early
    if (!id || !id.match(/^[0-9a-fA-F]{24}$/)) {
      console.error("Invalid ID format provided to getVenueById:", id);
      return null;
    }
    try {
        await connectToDatabase();

        // 1. Fetch venue and associated reviews concurrently
        const [venueDoc, reviews] = await Promise.all([
            VenueModel.findById(id).exec(), // Fetch full Mongoose doc
            ReviewModel.find({ target: id, targetModel: 'Venue', isDeleted: { $ne: true } })
                       .sort({ createdAt: -1 })
                       .limit(20)
                       .lean({ virtuals: true })
                       .exec()
        ]);

        console.log(id, reviews);

        // Handle venue not found
        if (!venueDoc) {
            console.log(`Venue with ID ${id} not found.`);
            return null;
        }

        // 2. Fetch Amenity Enum document (only if needed)
        let populatedAmenities: PopulatedAmenityClient[] = [];
        if (venueDoc.amenities && venueDoc.amenities.length > 0) {
            try {
                const amenityEnumDoc = await EnumModel.findOne({ enumType: 'venueAmenity' }).lean().exec() as IEnum | null;
                if (amenityEnumDoc) {
                    populatedAmenities = mapAmenities(venueDoc.amenities, amenityEnumDoc);
                } else {
                    console.warn(`Could not find 'venueAmenity' Enum document for venue ${id}.`);
                }
            } catch (enumError) {
                 console.error(`Error fetching amenity Enum for venue ${id}:`, enumError);
                 // Continue without populated amenities if Enum fetch fails
            }
        }

        // 3. Convert main venue doc to plain object *after* amenity mapping prep
        const venueObject = venueDoc.toObject({ virtuals: true });

        // 4. Combine venue data, populated amenities, and fetched reviews
        const finalData = {
            ...venueObject,
            amenities: populatedAmenities,
            reviews: reviews, // Add fetched (and already lean) reviews
        };

        // 5. Serialize the final combined object
        return serializeData(finalData) as SerializedVenue | null;

    } catch (error) {
        // Catch potential Mongoose CastError for invalid ID formats during findById
        if (error instanceof Error && error.name === 'CastError') {
            console.error("Invalid ID format during findById:", id);
        } else {
            console.error(`Error fetching venue ${id}:`, error);
        }
        return null; // Return null on errors
    }
}


// --- Fetch All Venues ---
export async function getAllVenues(
    searchParams: { [key: string]: string | string[] | undefined }
): Promise<SerializedVenue[]> {
    try {
        await connectToDatabase();
        const query: FilterQuery<IVenue> = { status: 'active' }; // Base query

        // --- Fetch Amenity Enum Doc Once ---
        const amenityEnumDoc = await EnumModel.findOne({ enumType: 'venueAmenity' }).lean().exec() as IEnum | null;

        // --- Apply Filters ---
        const getStringParam = (key: string): string | null => {
            const value = searchParams[key]; return typeof value === 'string' ? value : null;
        };

        // Amenities Filter
        const amenitiesParam = getStringParam('amenities');
        if (amenitiesParam) {
            const amenityKeys = amenitiesParam.split(',').map(k => k.trim()).filter(k => k);
            if (amenityKeys.length > 0) {
                if (!amenityEnumDoc?.values) { return []; } // Enum doc needed for filtering
                const requiredAmenityIds = amenityEnumDoc.values
                    .filter((v: any) => v?.key && amenityKeys.includes(v.key))
                    .map((v: any) => v._id);
                if (requiredAmenityIds.length !== amenityKeys.length) { return []; } // Not all keys found
                query.amenities = { $all: requiredAmenityIds };
            }
        }

        // Other filters
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
        const capacitiesParam = getStringParam('capacities'); if (capacitiesParam) {
            const capacityLabels = capacitiesParam.split(',').map(c => c.trim()).filter(c => c);
            const capacityOrConditions: FilterQuery<IVenue>[] = [];
            capacityLabels.forEach(capLabel => {
                 if (capLabel === 'small') capacityOrConditions.push({ capacity: { $lt: 50 } });
                 else if (capLabel === 'medium') capacityOrConditions.push({ capacity: { $gte: 50, $lte: 150 } });
                 else if (capLabel === 'large') capacityOrConditions.push({ capacity: { $gte: 151, $lte: 300 } });
                 else if (capLabel === 'xlarge') capacityOrConditions.push({ capacity: { $gt: 300 } });
            });
            if (capacityOrConditions.length > 0) {
                if (!query.$and) query.$and = [];
                query.$and.push({ $or: capacityOrConditions });
            }
        }

        // --- Sorting ---
        const sortOption = getStringParam('sort') || 'recommended';
        let sortQuery: any = { 'rating.average': -1 };
        if (sortOption === 'price-asc') sortQuery = { 'price.basePrice': 1 };
        else if (sortOption === 'price-desc') sortQuery = { 'price.basePrice': -1 };
        else if (sortOption === 'rating') sortQuery = { 'rating.average': -1 };
        else if (sortOption === 'recommended') sortQuery = { 'sponsored.isActive': -1, 'rating.average': -1 };

        // --- Execute Query (Fetch Full Docs) ---
        // console.log("Executing Venue Query:", JSON.stringify(query, null, 2));
        const venuesDocs: IVenue[] = await VenueModel.find(query)
            .sort(sortQuery)
            .limit(100)
            .exec(); // No .lean()

        // --- Manually "Populate" Amenities & Convert ---
        const venuesWithPopulatedAmenities = venuesDocs.map((venueDoc: IVenue) => {
             const populated = mapAmenities(venueDoc._doc.amenities || [], amenityEnumDoc);
             return {
                 ...venueDoc._doc,
                 amenities: populated, // Replace IDs with populated objects
                 reviews: [], // Add empty reviews array for SerializedVenue type consistency if needed
             };
         });

        // console.log(`Found and processed ${venuesWithPopulatedAmenities.length} venues.`);
        return serializeData(venuesWithPopulatedAmenities) as SerializedVenue[]; // Serialize and cast

    } catch (error) {
        console.error("Error fetching all venues:", error);
        return [];
    }
}

// --- Action to get unique cities ---
export async function getDbCities(): Promise<{ value: string; label: string }[]> {
     try {
         await connectToDatabase();
         const cities: string[] = await VenueModel.distinct('location.city', { 'location.city': { $ne: null } }).exec();
         return cities.sort().map(city => ({ value: city.toLowerCase(), label: city }));
     } catch (error) {
         console.error("Error fetching distinct cities:", error);
         return [];
     }
}

// --- (Removed getReviewsForVenue as it's now integrated into getVenueById for the detail page) ---