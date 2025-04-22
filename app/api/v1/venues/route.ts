import { NextRequest, NextResponse } from "next/server";
import Venue from "@/lib/database/schemas/venue";
import { createVenueSchema } from "@/lib/database/zod-schema-validators/venue";
import connectToDatabase from "@/lib/database/mongodb";

export async function GET() {
    try {
        await connectToDatabase();
        const venues = await Venue.find({});
        return NextResponse.json({ data: venues }, { status: 200 });
    } catch (error) {
        console.error("GET /venues error:", error);
        return NextResponse.json({ error: "Failed to fetch venues" }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    try {
        await connectToDatabase();
        const body = await req.json();
        const parsed = createVenueSchema.safeParse(body);
        if (!parsed.success) {
            console.log(parsed.error);
            return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
        }

        const validatedData = parsed.data;
        const newVenue = await Venue.create(validatedData);

        return NextResponse.json({ message: "Venue created", data: newVenue, status: 201 }, { status: 201 });
    } catch (error) {
        console.error("POST /venues error:", error);
        return NextResponse.json({ error: "Failed to create venue" }, { status: 500 });
    }
}