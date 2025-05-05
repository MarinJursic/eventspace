/* eslint-disable @typescript-eslint/no-explicit-any */
// File: lib/actions/venueActions.ts
"use server"; // Mark this file as containing Server Actions

import { revalidatePath } from "next/cache";
// import { redirect } from "next/navigation"; // Uncomment if you want to redirect from action
import { getServerSession } from "next-auth/next";
import { Types, FilterQuery } from "mongoose";

import connectToDatabase from "../database/mongodb";
import VenueModel, { IVenue } from "../database/schemas/venue";
import EnumModel, { IEnum, IEnumValue } from "../database/schemas/enum";
import User from "../database/schemas/user";
import { createVenueSchema } from "../database/zod-schema-validators/venue";
import cloudinary from "../config/cloudinary";
import { authOptions } from "../config/nextAuthConfig";
import { serializeData } from "../utils/serializeData"; // Adjust path if needed
import Review from "../database/schemas/review";
import Enum from "../database/schemas/enum";
import {
  PopulatedAmenityClient,
  PopulatedOwnerInfo,
  SerializedPopulatedReview,
  SerializedPopulatedVenue,
  SerializedVenueListItem,
} from "@/types/venue.types";

// --- Define Types for Serialized Data (Client-Facing) ---
// TODO: Move these interfaces to a dedicated types file (e.g., types/shared.types.ts or types/venue.types.ts)

// --- Helper Function to Map Amenity/Enum IDs to Details ---
function mapEnumIdsToDetails(
  ids: (Types.ObjectId | string)[] = [],
  enumDoc: IEnum | null
): PopulatedAmenityClient[] {
  // Reusing PopulatedAmenityClient structure
  if (!enumDoc?.values || ids.length === 0) return [];
  const valueMap = new Map<string, IEnumValue>();
  enumDoc.values.forEach((val) => {
    if (val?._id) valueMap.set(val._id.toString(), val);
  });
  return ids
    .map((id) => valueMap.get(id?.toString()))
    .filter((value): value is IEnumValue => !!value)
    .map((value) => ({
      _id: value._id.toString(),
      id: value._id.toString(), // virtual id
      key: value.key,
      label: value.label,
      icon: value.icon,
    }));
}

// --- Define Return Type for Create Action ---
export type CreateVenueActionState = {
  success: boolean;
  message: string;
  errors?: {
    fieldErrors?: Record<string, string[] | undefined>;
    formErrors?: string[];
  };
  createdVenueId?: string;
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
        folder: process.env.CLOUDINARY_FOLDER || "eventspace_uploads/venues", // Venue-specific folder
        resource_type: "image",
        public_id: uniquePublicId,
        overwrite: false, // Prevent overwriting files with same generated name (though timestamp makes it unlikely)
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

// --- Server Action: Create Venue ---
export async function createVenueAction(
  previousState: CreateVenueActionState | null,
  formData: FormData
): Promise<CreateVenueActionState> {
  console.log("createVenueAction: Triggered.");
  const session = await getServerSession(authOptions);

  // 1. Authorization
  if (!session?.user?.id) {
    return { success: false, message: "Unauthorized: Not logged in." };
  }
  if (!session.user.role || !["vendor", "admin"].includes(session.user.role)) {
    return { success: false, message: "Forbidden: Insufficient permissions." };
  }
  console.log(
    `createVenueAction: Authorized user ${session.user.id} (${session.user.role}).`
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
  const getInt = (key: string): number | undefined => {
    const v = formData.get(key) as string | null;
    if (v == null || v.trim() === "") return undefined;
    const n = parseInt(v, 10);
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
  const getJsonParsed = <T>(key: string, defaultValue: T): T => {
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
    console.log(`createVenueAction: Uploading ${imageFiles.length} images...`);
    try {
      const uploadPromises = imageFiles.map(async (file, index) => {
        const buffer = Buffer.from(await file.arrayBuffer());
        const result = await uploadToCloudinary(buffer, file.name);
        return {
          url: result.url,
          alt: `Image for ${getString("name") || "venue"} ${index + 1}`,
          caption: imageCaptions[index] || file.name,
        };
      });
      uploadedImages.push(...(await Promise.all(uploadPromises)));
      console.log(
        "createVenueAction: Images Uploaded:",
        uploadedImages.map((img) => img.url)
      );
    } catch (error) {
      console.error("createVenueAction: Image upload failed:", error);
      return {
        success: false,
        message: `Image upload failed: ${error instanceof Error ? error.message : "Unknown error"}`,
      };
    }
  } else {
    console.log("createVenueAction: No images provided.");
    // Check if Zod schema requires images
    const imageValidation = createVenueSchema.shape.images.safeParse([]);
    if (!imageValidation.success) {
      return {
        success: false,
        message: "Validation failed.",
        errors: {
          fieldErrors: { images: ["At least one image is required."] },
        },
      };
    }
  }

  // 4. Prepare Data for Validation
  const dataToValidate = {
    name: getString("name"),
    description: getString("description") || undefined,
    type: getString("type") || undefined,
    category: getString("category"), // Expecting ObjectId string
    location: {
      address: getString("location.address"),
      city: getString("location.city"),
      street: getString("location.street"),
      houseNumber: getString("location.houseNumber"), // Schema expects string
      country: getString("location.country"),
      postalCode: getString("location.postalCode"), // Schema expects string
      lat: getFloat("location.lat"),
      lng: getFloat("location.lng"),
    },
    price: {
      basePrice: getFloat("price.basePrice"), // Zod expects number
      model: getString("price.model") || "day",
    },
    seating: {
      seated: getInt("seating.seated") ?? 0,
      standing: getInt("seating.standing") ?? 0,
    },
    amenities: getStringArray("amenities"), // Array of ObjectId strings
    services: getStringArray("services"), // Array of ObjectId strings
    policies: {
      bannedServices: getStringArray("policies.bannedServices"), // Array of ObjectId strings
      listOfPolicies: getJsonParsed<{ name: string; description: string }[]>(
        "policies.listOfPolicies",
        []
      ),
    },
    availabilityRules: {
      blockedWeekdays: getJsonParsed<
        { weekday: string; recurrenceRule: string }[]
      >("availabilityRules.blockedWeekdays", []),
    },
    images: uploadedImages,
    owner: session.user.id, // Will be converted to ObjectId before saving
    status: "pending",
    capacity:
      (getInt("seating.seated") ?? 0) + (getInt("seating.standing") ?? 0),
    // Defaults set here, Zod validates structure
    rating: { average: 0, count: 0 },
    reviews: [],
    sponsored: { isActive: false },
    bookedDates: [],
  };

  // 5. Validate Data with Zod
  const parsed = createVenueSchema.safeParse(dataToValidate);

  if (!parsed.success) {
    console.error(
      "Venue Creation Zod Validation Error:",
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
  console.log("createVenueAction: Validation successful.");

  // 6. Database Interaction
  try {
    await connectToDatabase();
    // Convert string IDs to ObjectIds before saving
    const dataToSave = {
      ...validatedData,
      owner: new Types.ObjectId(validatedData.owner),
      amenities: validatedData.amenities?.map((id) => new Types.ObjectId(id)),
      services: validatedData.services?.map((id) => new Types.ObjectId(id)),
      policies: {
        ...validatedData.policies,
        bannedServices: validatedData.policies?.bannedServices?.map(
          (id) => new Types.ObjectId(id)
        ),
      },
    };

    const newVenue = await VenueModel.create(dataToSave);
    console.log(`createVenueAction: Venue Created in DB. ID: ${newVenue._id}`);

    // 7. Revalidation
    revalidatePath("/vendor/venues");
    revalidatePath("/venues");
    console.log("createVenueAction: Paths revalidated.");

    // 8. Return Success
    return {
      success: true,
      message: "Venue created successfully and submitted for approval!",
      createdVenueId: newVenue._id.toString(),
    };
  } catch (error) {
    console.error("createVenueAction: Database Error:", error);
    let errorMessage = "Internal Server Error: Could not create venue.";
    if (
      error instanceof Error &&
      error.name === "MongoServerError" &&
      (error as any).code === 11000
    ) {
      errorMessage =
        "A venue with this name or other unique identifier might already exist.";
    } else if (error instanceof Error) {
      errorMessage = `Database error: ${error.message}`;
    }
    return { success: false, message: errorMessage };
  }
}

// --- Fetch Featured Venues ---
export async function getFeaturedVenues(
  limit: number = 4
): Promise<SerializedVenueListItem[]> {
  try {
    await connectToDatabase();
    const amenityEnumDoc = (await EnumModel.findOne({
      enumType: "venueAmenity",
    })
      .lean()
      .exec()) as IEnum | null;

    const venuesData = await VenueModel.find({ status: "active" })
      .select(
        "name location price images type capacity owner rating sponsored amenities seating description category services policies bookedDates availabilityRules status createdAt updatedAt"
      ) // Select fields needed
      .sort({ "sponsored.isActive": -1, "rating.average": -1 })
      .limit(limit)
      .lean({ virtuals: true })
      .exec();

    // Map amenities using the plain venue objects
    const venuesWithPopulatedAmenities = venuesData.map((venue) => {
      const populated = mapEnumIdsToDetails(
        venue.amenities || [],
        amenityEnumDoc
      ); // Use generic mapper
      return { ...venue, amenities: populated, reviews: [] };
    });

    return serializeData(
      venuesWithPopulatedAmenities
    ) as SerializedVenueListItem[];
  } catch (error) {
    console.error("Error fetching featured venues:", error);
    return [];
  }
}

// --- Fetch Single Venue By ID (Populated) ---
export async function getVenueById(
  id: string
): Promise<SerializedPopulatedVenue | null> {
  if (!id || !Types.ObjectId.isValid(id)) {
    console.error("Invalid ID format provided to getVenueById:", id);
    return null;
  }
  try {
    await connectToDatabase();

    // Fetch venue and populate related data
    const venueDoc = await VenueModel.findById(id)
      .populate<{ owner: PopulatedOwnerInfo }>({
        path: "owner",
        select: "name email",
        model: User,
      }) // Added email back for potential use
      .populate<{ reviews: SerializedPopulatedReview[] }>({
        path: "reviews",
        match: { isDeleted: { $ne: true } },
        options: { sort: { createdAt: -1 }, limit: 20 },
        model: Review,
        populate: { path: "user", select: "name", model: User },
      })
      .populate<{ amenities: PopulatedAmenityClient[] }>({
        path: "amenities",
        model: Enum,
      })
      .populate<{ services: PopulatedAmenityClient[] }>({
        path: "services",
        model: Enum,
      }) // Assuming services are also Enums
      .populate<{ category: PopulatedAmenityClient }>({
        path: "category",
        model: Enum,
      }) // Assuming category is an Enum
      .populate<{ policies: { bannedServices?: PopulatedAmenityClient[] } }>({
        path: "policies.bannedServices",
        model: Enum,
      })
      .exec(); // Get full Mongoose doc

    if (
      !venueDoc ||
      venueDoc.status === "deleted" ||
      venueDoc.status === "softDeleted"
    ) {
      return null;
    }

    // Serialize the Mongoose document (includes populated fields)
    return serializeData(venueDoc) as SerializedPopulatedVenue | null;
  } catch (error) {
    console.error(`Error fetching venue ${id}:`, error);
    return null;
  }
}

// --- Fetch All Venues (List View) ---
export async function getAllVenues(searchParams: {
  [key: string]: string | string[] | undefined;
}): Promise<SerializedVenueListItem[]> {
  try {
    await connectToDatabase();
    const query: FilterQuery<IVenue> = { status: "active" };
    const amenityEnumDoc = (await EnumModel.findOne({
      enumType: "venueAmenity",
    })
      .lean()
      .exec()) as IEnum | null;

    // --- Apply Filters ---
    const getStringParam = (key: string): string | null => {
      const v = searchParams[key];
      return typeof v === "string" ? v : null;
    };
    const amenitiesParam = getStringParam("amenities");
    if (amenitiesParam) {
      const amenityKeys = amenitiesParam
        .split(",")
        .map((k) => k.trim())
        .filter((k) => k);
      if (amenityKeys.length > 0) {
        if (!amenityEnumDoc?.values) {
          return [];
        }
        const requiredAmenityIds = amenityEnumDoc.values
          .filter((v: any) => v?.key && amenityKeys.includes(v.key))
          .map((v: any) => v._id);
        if (requiredAmenityIds.length === 0 && amenityKeys.length > 0) {
          return [];
        } // If keys were specified but none found in Enum
        if (requiredAmenityIds.length > 0)
          query.amenities = { $all: requiredAmenityIds };
      }
    }
    // ... (rest of filter logic: searchTerm, location, price, types, capacities - ensure it's correct) ...
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
      if (!isNaN(maxP) && maxP > 0 && maxP <= 10000) priceCondition.$lte = maxP;
      if (Object.keys(priceCondition).length > 0)
        query["price.basePrice"] = priceCondition;
    }
    const typesParam = getStringParam("types");
    if (typesParam) {
      const typeKeys = typesParam
        .split(",")
        .map((t) => t.trim())
        .filter((t) => t);
      if (typeKeys.length > 0)
        query.type = { $in: typeKeys.map((t) => new RegExp(`^${t}$`, "i")) };
    }
    const capacitiesParam = getStringParam("capacities");
    if (capacitiesParam) {
      const capacityLabels = capacitiesParam
        .split(",")
        .map((c) => c.trim())
        .filter((c) => c);
      const capacityOrConditions: FilterQuery<IVenue>[] = [];
      capacityLabels.forEach((capLabel) => {
        if (capLabel === "small")
          capacityOrConditions.push({ capacity: { $lt: 50 } });
        else if (capLabel === "medium")
          capacityOrConditions.push({ capacity: { $gte: 50, $lte: 150 } });
        else if (capLabel === "large")
          capacityOrConditions.push({ capacity: { $gte: 151, $lte: 300 } });
        else if (capLabel === "xlarge")
          capacityOrConditions.push({ capacity: { $gt: 300 } });
      });
      if (capacityOrConditions.length > 0) {
        if (!query.$and) query.$and = [];
        query.$and.push({ $or: capacityOrConditions });
      }
    }

    // --- Sorting ---
    const sortOption = getStringParam("sort") || "recommended";
    let sortQuery: any = { "rating.average": -1 };
    // ... (rest of sorting logic) ...
    if (sortOption === "price-asc") sortQuery = { "price.basePrice": 1 };
    else if (sortOption === "price-desc") sortQuery = { "price.basePrice": -1 };
    else if (sortOption === "rating") sortQuery = { "rating.average": -1 };
    else if (sortOption === "recommended")
      sortQuery = { "sponsored.isActive": -1, "rating.average": -1 };

    // --- Execute Query ---
    const venuesData = await VenueModel.find(query)
      .select(
        "name location price images type capacity owner rating sponsored amenities seating description category services policies bookedDates availabilityRules status createdAt updatedAt"
      ) // Select fields needed
      .sort(sortQuery)
      .limit(100)
      .lean({ virtuals: true }) // Use lean()
      .exec();

    // --- Map Amenities using lean results ---
    const venuesWithPopulatedAmenities = venuesData.map((venue) => {
      const populated = mapEnumIdsToDetails(
        venue.amenities || [],
        amenityEnumDoc
      ); // Use generic mapper
      return { ...venue, amenities: populated, reviews: [] };
    });

    return serializeData(
      venuesWithPopulatedAmenities
    ) as SerializedVenueListItem[];
  } catch (error) {
    console.error("Error fetching all venues:", error);
    return [];
  }
}

// --- Action to get unique cities ---
export async function getDbCities(): Promise<
  { value: string; label: string }[]
> {
  try {
    await connectToDatabase();
    const cities: string[] = await VenueModel.distinct("location.city", {
      "location.city": { $ne: null },
    }).exec(); // Exclude null/empty
    return cities
      .sort()
      .map((city) => ({ value: city.toLowerCase(), label: city }));
  } catch (error) {
    console.error("Error fetching distinct cities:", error);
    return [];
  }
}
