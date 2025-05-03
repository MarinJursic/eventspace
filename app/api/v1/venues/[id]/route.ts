import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/database/mongodb";
import Venue from "@/lib/database/schemas/venue";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { updateVenueSchema } from "@/lib/database/zod-schema-validators/venue"; // Adjust path if needed
import { serializeData } from "../../../../../lib/utils/serializeData";
import { isValidObjectId } from "@/lib/utils/isValidObject";

// --- GET Handler ---
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = params;

  if (!isValidObjectId(id)) {
    return NextResponse.json(
      { error: "Invalid Venue ID format" },
      { status: 400 }
    );
  }

  try {
    await connectToDatabase();

    // --- Population ---
    // Decide which fields to populate for the detail view API consumer.
    // Populating reviews and owner (limited fields) is common.
    // Populating amenities/services requires fetching the Enum docs, which adds complexity here.
    // Consider if the Server Action `getVenueById` is the primary source for detailed views.
    // If this API route *must* return populated data, you'd add .populate() here.
    // Example (populate owner name/email and recent reviews):
    const venue = await Venue.findById(id);
    // .populate('owner', 'name email') // Example: Populate owner fields
    // .populate({ // Example: Populate recent reviews
    //     path: 'reviews',
    //     options: { sort: { createdAt: -1 }, limit: 5 }
    // });
    // For now, let's keep it simple and not populate here, assuming Server Action is primary.
    // If you need population, uncomment and adjust the populate calls.

    if (
      !venue ||
      venue.status === "deleted" ||
      venue.status === "softDeleted"
    ) {
      return NextResponse.json({ error: "Venue not found" }, { status: 404 });
    }

    // --- Serialization ---
    // Serialize the data before sending it back.
    const serializedVenue = serializeData(venue);

    console.log("Serialized Venue:", serializedVenue);

    return NextResponse.json({ data: serializedVenue }, { status: 200 });
  } catch (error) {
    console.error(`GET /venues/${id} error:`, error);
    return NextResponse.json(
      { error: "Failed to fetch venue" },
      { status: 500 }
    );
  }
}

// --- PUT Handler ---
export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = params;
  const session = await getServerSession(authOptions);

  if (!isValidObjectId(id)) {
    return NextResponse.json(
      { error: "Invalid Venue ID format" },
      { status: 400 }
    );
  }

  if (!session?.user) {
    return NextResponse.json(
      { error: "Unauthorized: Not logged in" },
      { status: 401 }
    );
  }

  try {
    await connectToDatabase();

    // Fetch venue to check ownership *before* validation/update
    const existingVenue = await Venue.findById(id);
    if (!existingVenue) {
      return NextResponse.json({ error: "Venue not found" }, { status: 404 });
    }

    // --- Authorization Check ---
    const isOwner = existingVenue.owner.toString() === session.user.id;
    const isAdmin = session.user.role === "admin";

    if (!isOwner && !isAdmin) {
      return NextResponse.json(
        { error: "Forbidden: You do not have permission to update this venue" },
        { status: 403 }
      );
    }
    // --- End Authorization ---

    const body = await req.json();

    // --- Validation ---
    const parsed = updateVenueSchema.safeParse(body);
    if (!parsed.success) {
      // Log the detailed validation errors on the server for debugging
      console.error("Venue Update Validation Error:", parsed.error.flatten());
      return NextResponse.json(
        { error: "Invalid data provided", details: parsed.error.flatten() },
        { status: 400 }
      );
    }
    const validatedData = parsed.data;
    // --- End Validation ---

    // Recalculate capacity if seating is updated
    if (validatedData.seating) {
      const currentSeating = existingVenue.seating || {
        seated: 0,
        standing: 0,
      };
      const newSeated = validatedData.seating.seated ?? currentSeating.seated;
      const newStanding =
        validatedData.seating.standing ?? currentSeating.standing;
      validatedData.capacity = newSeated + newStanding;
    } else if (validatedData.capacity !== undefined && existingVenue.seating) {
      // If capacity is directly updated, maybe clear specific seating? Or disallow direct capacity update?
      // For simplicity, let's assume seating drives capacity. If capacity is sent without seating, ignore it or handle as needed.
      // delete validatedData.capacity; // Example: ignore direct capacity update if seating exists
    }

    // Prevent owner field from being updated via this route
    if ("owner" in validatedData) {
      delete validatedData.owner;
    }

    const updatedVenue = await Venue.findByIdAndUpdate(id, validatedData, {
      new: true,
    });

    if (!updatedVenue) {
      // Should be caught by the initial findById, but good failsafe
      return NextResponse.json(
        { error: "Venue not found after update attempt" },
        { status: 404 }
      );
    }

    // --- Serialization ---
    const serializedUpdatedVenue = serializeData(updatedVenue);

    return NextResponse.json(
      { message: "Venue updated", data: serializedUpdatedVenue },
      { status: 200 }
    );
  } catch (error) {
    console.error(`PUT /venues/${id} error:`, error);
    return NextResponse.json(
      { error: "Failed to update venue" },
      { status: 500 }
    );
  }
}

// --- DELETE Handler ---
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = params;
  const session = await getServerSession(authOptions);

  if (!isValidObjectId(id)) {
    return NextResponse.json(
      { error: "Invalid Venue ID format" },
      { status: 400 }
    );
  }

  if (!session?.user) {
    return NextResponse.json(
      { error: "Unauthorized: Not logged in" },
      { status: 401 }
    );
  }

  try {
    await connectToDatabase();

    // Fetch venue to check ownership
    const venueToDelete = await Venue.findById(id);
    if (!venueToDelete) {
      return NextResponse.json({ error: "Venue not found" }, { status: 404 });
    }

    // --- Authorization Check ---
    const isOwner = venueToDelete.owner.toString() === session.user.id;
    const isAdmin = session.user.role === "admin";

    if (!isOwner && !isAdmin) {
      return NextResponse.json(
        { error: "Forbidden: You do not have permission to delete this venue" },
        { status: 403 }
      );
    }
    // --- End Authorization ---

    // --- Perform Soft Delete ---
    // Update status to 'softDeleted' or set an 'isDeleted' flag
    const result = await Venue.findByIdAndUpdate(
      id,
      { status: "softDeleted" /* or isDeleted: true */ },
      { new: true }
    );

    // --- OR Perform Hard Delete (Use with caution!) ---
    // const result = await Venue.findByIdAndDelete(id);

    if (!result) {
      // Should be caught by findById, but good failsafe
      return NextResponse.json(
        { error: "Venue not found during delete" },
        { status: 404 }
      );
    }

    // For soft delete, status 200 is appropriate. For hard delete, 204 No Content is common.
    return NextResponse.json(
      { message: "Venue marked as deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error(`DELETE /venues/${id} error:`, error);
    return NextResponse.json(
      { error: "Failed to delete venue" },
      { status: 500 }
    );
  }
}
