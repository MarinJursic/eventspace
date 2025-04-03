import { NextRequest, NextResponse } from "next/server";
import Booking from "@/lib/database/schemas/booking";
import { createBookingSchema } from "@/lib/database/zod-schema-validators/booking";

export async function GET() {
    try {
        const bookings = await Booking.find({ isDeleted: false });
        return NextResponse.json({ data: bookings }, { status: 200 });
    } catch (error) {
        console.error("GET /bookings error:", error);
        return NextResponse.json({ error: "Failed to fetch bookings" }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const parsed = createBookingSchema.safeParse(body);

        if (!parsed.success) {
            return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
        }

        const newBooking = await Booking.create(parsed.data);
        return NextResponse.json({ message: "Booking created", data: newBooking }, { status: 201 });
    } catch (error) {
        console.error("POST /bookings error:", error);
        return NextResponse.json({ error: "Failed to create booking" }, { status: 500 });
    }
}