/* eslint-disable @typescript-eslint/no-explicit-any */
// File: lib/actions/serviceActions.ts
"use server"; // Mark as Server Actions file

import { revalidatePath } from "next/cache";
import { getServerSession } from "next-auth/next";
import { Types, FilterQuery } from "mongoose"; // Import FilterQuery

import connectToDatabase from "../database/mongodb";
import Service, { IService } from "../database/schemas/service"; // Import Service model & interface
import Review from "../database/schemas/review"; // Import Review model for population
import Enum, { IEnum, IEnumValue } from "../database/schemas/enum"; // Import Enum model & interfaces
import User from "../database/schemas/user"; // Import User model for population
import { createServiceSchema } from "../database/zod-schema-validators/service"; // Import Service Zod schema
import { authOptions } from "@/app/api/auth/[...nextauth]/route"; // Adjust path if needed
import cloudinary from "../config/cloudinary";
import { serializeData } from "../utils/serializeData";

// --- Define Types for Serialized Data (Client-Facing) ---
// (These should ideally live in a shared types file, e.g., types/shared.types.ts)

interface SerializedLocation {
  address: string;
  city?: string;
  street?: string;
  houseNumber?: string; // Keep as string
  country?: string;
  postalCode?: string;
  latitude?: number;
  longitude?: number; // Keep as string
}
interface SerializedPrice {
  basePrice: number;
  model: "hour" | "day" | "week";
}
interface SerializedRating {
  average: number;
  count: number;
}
interface SerializedImage {
  url: string;
  alt?: string;
  caption?: string;
}
interface SerializedPolicyItem {
  name: string;
  description: string;
}
interface SerializedPolicies {
  listOfPolicies?: SerializedPolicyItem[];
}
interface SerializedBookedDate {
  date: string;
  bookingRef?: string;
} // Date as string
interface SerializedBlockedWeekday {
  weekday: string;
  recurrenceRule: "weekly" | "biweekly" | "monthly";
}
interface SerializedAvailabilityRules {
  blockedWeekdays?: SerializedBlockedWeekday[];
}

// Structure Expected by the Client for Populated Features (from Enum)
interface PopulatedFeatureClient {
  _id: string;
  id: string; // Mongoose virtual added via toObject/serialize
  key: string;
  label: string;
  icon?: string; // Optional icon name string from Enum
}

// Structure for serialized reviews with populated user
export interface SerializedPopulatedReview {
  id: string;
  _id: string;
  user: { _id: string; id: string; name: string }; // Populated user
  rating: number;
  comment?: string;
  target: string;
  targetModel: "Venue" | "Service";
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
}

// Main Serialized Service type reflecting populated fields for Detail View
export interface SerializedPopulatedService {
  id: string;
  _id: string;
  name: string;
  location: SerializedLocation;
  price: SerializedPrice;
  description?: string;
  features?: PopulatedFeatureClient[]; // Populated features
  images: SerializedImage[];
  policies?: SerializedPolicies;
  bookedDates?: SerializedBookedDate[];
  availabilityRules?: SerializedAvailabilityRules;
  category?: PopulatedFeatureClient; // Populated category (assuming single ref to Enum)
  type?: string;
  status: string;
  owner: { _id: string; id: string; name: string }; // Populated owner
  rating: SerializedRating;
  sponsored?: { isActive: boolean; until?: string; planType?: string };
  reviews?: SerializedPopulatedReview[]; // Populated reviews
  createdAt?: string;
  updatedAt?: string;
}

// Serialized type for List View (less populated)
export interface SerializedServiceListItem {
  id: string;
  _id: string;
  name: string;
  location: SerializedLocation;
  price: SerializedPrice;
  images: SerializedImage[];
  type?: string;
  rating: SerializedRating;
  sponsored?: { isActive: boolean };
  // Features might be string IDs or omitted for list view depending on needs
  features?: string[]; // Or PopulatedFeatureClient[] if needed, but less likely
}
// --- End Type Definitions ---

// --- Helper Function to Map Feature IDs to Details ---
// (Same as in venueActions, could be moved to a shared util if identical)
function mapFeatures(
  featureIds: (Types.ObjectId | string)[] = [],
  featureEnumDoc: IEnum | null
): PopulatedFeatureClient[] {
  if (!featureEnumDoc?.values || featureIds.length === 0) return [];
  const featureValueMap = new Map<string, IEnumValue>();
  featureEnumDoc.values.forEach((val) => {
    if (val?._id) featureValueMap.set(val._id.toString(), val);
  });
  return featureIds
    .map((id) => featureValueMap.get(id?.toString()))
    .filter((featureValue): featureValue is IEnumValue => !!featureValue)
    .map((featureValue) => ({
      _id: featureValue._id.toString(),
      id: featureValue._id.toString(), // virtual id
      key: featureValue.key,
      label: featureValue.label,
      icon: featureValue.icon,
    }));
}

// --- Define Return Type for Create Action ---
export type CreateServiceActionState = {
  success: boolean;
  message: string;
  errors?: {
    fieldErrors?: Record<string, string[] | undefined>;
    formErrors?: string[];
  };
  createdServiceId?: string;
};

// --- Helper to upload buffer to Cloudinary ---
async function uploadToCloudinary(
  buffer: Buffer,
  fileName: string
): Promise<{ url: string; public_id: string }> {
  return new Promise((resolve, reject) => {
    const uniquePublicId = `${Date.now()}_${fileName.split(".")[0]}`;
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: process.env.CLOUDINARY_FOLDER || "eventspace_uploads/services", // Service-specific folder
        resource_type: "image",
        public_id: uniquePublicId,
        overwrite: false,
      },
      (error, result) => {
        if (error) {
          console.error("Cloudinary Upload Error:", error);
          reject(new Error(`Cloudinary upload failed: ${error.message}`));
        } else if (result) {
          console.log(`Cloudinary Upload Success: ${result.public_id}`);
          resolve({ url: result.secure_url, public_id: result.public_id });
        } else {
          reject(new Error("Cloudinary upload failed unexpectedly."));
        }
      }
    );
    uploadStream.end(buffer);
  });
}
// --- End Cloudinary Helper ---

// --- Server Action: Create Service ---
export async function createServiceAction(
  previousState: CreateServiceActionState | null,
  formData: FormData
): Promise<CreateServiceActionState> {
  console.log("createServiceAction: Triggered.");
  const session = await getServerSession(authOptions);

  // 1. Authorization
  if (!session?.user?.id) {
    return { success: false, message: "Unauthorized: Not logged in." };
  }
  if (!["vendor", "admin"].includes(session.user.role)) {
    return { success: false, message: "Forbidden: Insufficient permissions." };
  }
  console.log(
    `createServiceAction: Authorized user ${session.user.id} (${session.user.role}).`
  );

  // 2. Extract Data
  const imageFiles: File[] = formData
    .getAll("files")
    .filter((f) => f instanceof File && f.size > 0) as File[];
  const imageCaptions: string[] = imageFiles.map((f) => f.name);
  const getString = (key: string): string =>
    (formData.get(key) as string | null) ?? "";
  const getFloat = (key: string): number | undefined => {
    const v = formData.get(key) as string | null;
    if (v == null || v.trim() === "") return undefined;
    const n = parseFloat(v);
    return isNaN(n) ? undefined : n;
  };
  const getStringArray = (key: string): string[] => {
    const v = formData.get(key) as string | null;
    return v
      ? v
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean)
      : [];
  };
  const getJsonParsed = (key: string, defaultValue: any = []) => {
    const v = formData.get(key) as string | null;
    if (!v) return defaultValue;
    try {
      return JSON.parse(v);
    } catch (e) {
      console.warn(`JSON Parse Error key ${key}:`, v, e);
      return defaultValue;
    }
  };

  // 3. Image Upload
  const uploadedImages: { url: string; alt: string; caption: string }[] = [];
  if (imageFiles.length > 0) {
    console.log(
      `createServiceAction: Uploading ${imageFiles.length} images...`
    );
    try {
      const uploadPromises = imageFiles.map(async (file, index) => {
        const buffer = Buffer.from(await file.arrayBuffer());
        const result = await uploadToCloudinary(buffer, file.name);
        return {
          url: result.url,
          alt: `Image for ${getString("name") || "service"} ${index + 1}`,
          caption: imageCaptions[index] || file.name,
        };
      });
      uploadedImages.push(...(await Promise.all(uploadPromises)));
      console.log(
        "createServiceAction: Images Uploaded:",
        uploadedImages.map((img) => img.url)
      );
    } catch (error) {
      console.error("createServiceAction: Image upload failed:", error);
      return {
        success: false,
        message: `Image upload failed: ${error instanceof Error ? error.message : "Unknown error"}`,
      };
    }
  } else {
    console.log("createServiceAction: No images provided.");
  }

  // 4. Prepare Data for Validation
  const dataToValidate = {
    name: getString("name"),
    description: getString("description") || undefined, // Ensure undefined if empty
    type: getString("type") || undefined,
    category: getString("category"), // Expecting ObjectId string
    location: {
      address: getString("location.address"),
      city: getString("location.city"),
      street: getString("location.street"),
      houseNumber: getString("location.houseNumber"),
      country: getString("location.country"),
      postalCode: getString("location.postalCode"),
      lat: getFloat("location.lat"),
      lng: getFloat("location.lng"),
    },
    price: {
      basePrice: getFloat("price.basePrice"), // Will be validated by Zod
      model: getString("price.model") || "day",
    },
    features: getStringArray("features"), // Array of ObjectId strings
    policies: {
      listOfPolicies: getJsonParsed("policies.listOfPolicies", []),
    },
    availabilityRules: {
      blockedWeekdays: getJsonParsed("availabilityRules.blockedWeekdays", []),
    },
    images: uploadedImages,
    owner: session.user.id,
    status: "pending",
    rating: { average: 0, count: 0 },
    reviews: [],
    sponsored: { isActive: false },
    bookedDates: [],
  };

  console.log(
    "createServiceAction: Data Prepared for Validation:",
    dataToValidate
  );

  // 5. Validate Data with Zod
  const parsed = createServiceSchema.safeParse(dataToValidate);

  if (!parsed.success) {
    console.error(
      "Service Creation Zod Validation Error:",
      parsed.error.flatten()
    );
    console.error("Data that failed validation:", dataToValidate);
    return {
      success: false,
      message: "Validation failed.",
      errors: parsed.error.flatten(),
    };
  }
  const validatedData = parsed.data;
  console.log("createServiceAction: Validation successful.");

  // 6. Database Interaction
  try {
    await connectToDatabase();
    const newService = await Service.create(validatedData);
    console.log(
      `createServiceAction: Service Created in DB. ID: ${newService._id}`
    );

    // 7. Revalidation
    revalidatePath("/vendor/venues"); // Revalidate combined listings
    revalidatePath("/services"); // Revalidate public listings
    console.log("createServiceAction: Paths revalidated.");

    // 8. Return Success
    return {
      success: true,
      message: "Service created successfully and submitted for approval!",
      createdServiceId: newService._id.toString(),
    };
  } catch (error) {
    console.error("createServiceAction: Database Error:", error);
    let errorMessage = "Internal Server Error: Could not create service.";
    if (
      error instanceof Error &&
      error.name === "MongoServerError" &&
      (error as any).code === 11000
    ) {
      errorMessage =
        "A service with this name or other unique identifier might already exist.";
    } else if (error instanceof Error) {
      errorMessage = `Database error: ${error.message}`;
    }
    return { success: false, message: errorMessage };
  }
}

// --- Fetch Single Service By ID (Includes Reviews & Populated Features) ---
export async function getServiceById(
  id: string
): Promise<SerializedPopulatedService | null> {
  if (!id || !Types.ObjectId.isValid(id)) {
    console.error("Invalid ID format provided to getServiceById:", id);
    return null;
  }
  try {
    await connectToDatabase();

    // Fetch service, reviews, and feature enum concurrently
    const [serviceDoc, reviews, featureEnumDoc, categoryEnumDoc] =
      await Promise.all([
        Service.findById(id)
          .populate<{
            owner: { _id: Types.ObjectId; name: string };
          }>({ path: "owner", select: "name", model: User })
          .exec(), // Fetch full Mongoose doc first
        Review.find({
          target: new Types.ObjectId(id),
          targetModel: "Service",
          isDeleted: { $ne: true },
        })
          .sort({ createdAt: -1 })
          .limit(20)
          .populate<{ user: { _id: Types.ObjectId; name: string } }>({
            path: "user",
            select: "name",
            model: User,
          }) // Populate user in reviews
          .lean({ virtuals: true })
          .exec(),
        Enum.findOne({ enumType: "serviceFeature" })
          .lean()
          .exec() as Promise<IEnum | null>,
        Enum.findOne({ enumType: "serviceCategory" })
          .lean()
          .exec() as Promise<IEnum | null>, // Fetch category enum
      ]).catch((err) => {
        console.error(
          `[getServiceById] Error during Promise.all for Service ID ${id}:`,
          err
        );
        return [null, null, null, null];
      });

    if (!serviceDoc) {
      console.log(`Service with ID ${id} not found.`);
      return null;
    }

    // Map Features
    const populatedFeatures = mapFeatures(
      serviceDoc.features || [],
      featureEnumDoc
    );

    // Map Category (assuming single category stored as ObjectId string)
    let populatedCategory: PopulatedFeatureClient | undefined = undefined;
    if (serviceDoc.category && categoryEnumDoc?.values) {
      const categoryValue = categoryEnumDoc.values.find(
        (val) => val?._id?.toString() === serviceDoc.category.toString()
      );
      if (categoryValue) {
        populatedCategory = {
          _id: categoryValue._id.toString(),
          id: categoryValue._id.toString(),
          key: categoryValue.key,
          label: categoryValue.label,
          icon: categoryValue.icon,
        };
      } else {
        console.warn(
          `Category Enum value not found for ID: ${serviceDoc.category}`
        );
      }
    } else if (serviceDoc.category && !categoryEnumDoc) {
      console.warn(
        `Could not find 'serviceCategory' Enum document for service ${id}.`
      );
    }

    // Convert Mongoose doc to plain object including virtuals and populated fields
    const serviceObject = serviceDoc.toObject({ virtuals: true });

    // Combine with fetched reviews and populated features/category
    const finalData = {
      ...serviceObject,
      reviews: Array.isArray(reviews) ? reviews : [],
      features: populatedFeatures,
      category: populatedCategory, // Add populated category object
    };

    return serializeData(finalData) as SerializedPopulatedService | null;
  } catch (error) {
    console.error(`Error fetching service ${id}:`, error);
    if (error instanceof Error && error.name === "CastError") {
      console.error("Invalid ID format during findById (Service):", id);
    }
    return null;
  }
}

// --- Fetch All Services (List View) ---
export async function getAllServices(searchParams: {
  [key: string]: string | string[] | undefined;
}): Promise<SerializedServiceListItem[]> {
  // Return type for list items
  try {
    await connectToDatabase();
    const query: FilterQuery<IService> = { status: "active" };

    // --- Apply Filters (similar to getAllVenues, adjust fields for Service) ---
    const getStringParam = (key: string): string | null => {
      const v = searchParams[key];
      return typeof v === "string" ? v : null;
    };
    const searchTerm = getStringParam("q");
    if (searchTerm) query.name = { $regex: searchTerm, $options: "i" };
    const location = getStringParam("location");
    if (location) query["location.city"] = new RegExp(`^${location}$`, "i");
    const minPrice = getStringParam("minPrice");
    const maxPrice = getStringParam("maxPrice");
    if (minPrice || maxPrice) {
      const priceCondition: { $gte?: number; $lte?: number } = {};
      const minP = parseInt(minPrice || "0");
      if (!isNaN(minP)) priceCondition.$gte = minP;
      const maxP = parseInt(maxPrice || "");
      if (!isNaN(maxP) && maxP > 0 && maxP <= 5000) priceCondition.$lte = maxP; // Adjust max for services
      if (Object.keys(priceCondition).length > 0)
        query["price.basePrice"] = priceCondition;
    }
    const typesParam = getStringParam("types");
    if (typesParam) {
      // Filter by service 'type' field
      const typeKeys = typesParam
        .split(",")
        .map((t) => t.trim())
        .filter((t) => t);
      if (typeKeys.length > 0)
        query.type = { $in: typeKeys.map((t) => new RegExp(`^${t}$`, "i")) };
    }
    // Filter by Category (assuming category is ObjectId ref to Enum)
    const categoryParam = getStringParam("categories");
    if (categoryParam) {
      const categoryKeys = categoryParam
        .split(",")
        .map((c) => c.trim())
        .filter((c) => c);
      if (categoryKeys.length > 0) {
        // Need to fetch Enum doc to get ObjectIds for keys
        const categoryEnumDoc = (await Enum.findOne({
          enumType: "serviceCategory",
        })
          .lean()
          .exec()) as IEnum | null;
        if (categoryEnumDoc?.values) {
          const categoryIds = categoryEnumDoc.values
            .filter((v) => v?.key && categoryKeys.includes(v.key))
            .map((v) => v._id);
          if (categoryIds.length > 0) {
            query.category = { $in: categoryIds };
          } else {
            return [];
          } // No matching categories found
        } else {
          return [];
        } // Enum doc not found
      }
    }
    const minRatingParam = getStringParam("minRating");
    if (minRatingParam) {
      const minR = parseInt(minRatingParam);
      if (!isNaN(minR) && minR >= 1 && minR <= 5)
        query["rating.average"] = { $gte: minR };
    }
    // Filtering by features for list view might be complex/slow - consider if essential

    // --- Sorting ---
    const sortOption = getStringParam("sort") || "recommended";
    let sortQuery: any = { "rating.average": -1 };
    if (sortOption === "price-asc") sortQuery = { "price.basePrice": 1 };
    else if (sortOption === "price-desc") sortQuery = { "price.basePrice": -1 };
    else if (sortOption === "rating") sortQuery = { "rating.average": -1 };
    else if (sortOption === "recommended")
      sortQuery = { "sponsored.isActive": -1, "rating.average": -1 };

    // --- Execute Query ---
    // Select only fields needed for the list view + lean()
    const servicesDocs = await Service.find(query)
      .select("name location price images type rating sponsored features") // Select necessary fields
      .sort(sortQuery)
      .limit(100) // Apply limit
      .lean({ virtuals: true }) // Use lean for performance
      .exec();

    // console.log(`Found and processed ${servicesDocs.length} services for list view.`);
    // Cast to the list item type
    return serializeData(servicesDocs) as SerializedServiceListItem[];
  } catch (error) {
    console.error("Error fetching all services:", error);
    return [];
  }
}

// --- Action to get unique service types (distinct values from 'type' field) ---
export async function getDbServiceTypes(): Promise<
  { id: string; label: string }[]
> {
  try {
    await connectToDatabase();
    // Use the 'type' field which seems to store the string representation
    const types: string[] = await Service.distinct("type", {
      type: { $exists: true, $ne: null },
    }).exec();
    return types
      .sort()
      .map((type) => ({ id: type.toLowerCase(), label: type }));
  } catch (error) {
    console.error("Error fetching distinct service types:", error);
    return [];
  }
}

// --- Action to get unique service cities ---
export async function getDbServiceCities(): Promise<
  { value: string; label: string }[]
> {
  try {
    await connectToDatabase();
    const cities: string[] = await Service.distinct("location.city", {
      "location.city": { $exists: true, $ne: null },
    }).exec();
    return cities
      .sort()
      .map((city) => ({ value: city.toLowerCase(), label: city }));
  } catch (error) {
    console.error("Error fetching distinct service cities:", error);
    return [];
  }
}

// --- Action to get featured services (includes populated features) ---
export async function getFeaturedServices(
  limit: number = 4
): Promise<SerializedServiceListItem[]> {
  // Return list item type
  try {
    await connectToDatabase();
    // Fetch Enum doc once for mapping features if needed for display card
    // const featureEnumDoc = await EnumModel.findOne({ enumType: 'serviceFeature' }).lean().exec() as IEnum | null;

    const servicesDocs = await Service.find({ status: "active" })
      .select("name location price images type rating sponsored features") // Select fields for card
      .sort({ "sponsored.isActive": -1, "rating.average": -1 })
      .limit(limit)
      .lean({ virtuals: true }) // Use lean
      .exec();

    // No complex population needed for featured list usually
    // const serviceObjects = servicesDocs.map((doc) => {
    //      // Optionally map features if needed by VenueCard/ServiceCard
    //      // const populatedFeatures = mapFeatures(doc.features || [], featureEnumDoc);
    //      return {
    //          ...doc,
    //          // features: populatedFeatures, // Or keep as string IDs:
    //          features: (doc.features || []).map(id => id.toString()),
    //          reviews: [], // Exclude reviews
    //      };
    //  });

    return serializeData(servicesDocs) as SerializedServiceListItem[];
  } catch (error) {
    console.error("Error fetching featured services:", error);
    return [];
  }
}

// --- Placeholder for Update/Delete Service Actions ---
// export async function updateServiceAction(...) { ... }
// export async function deleteServiceAction(...) { ... }
