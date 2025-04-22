import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/database/mongodb";
import Enum from "@/lib/database/schemas/enum";
import { createEnumSchema } from "@/lib/database/zod-schema-validators/enum";

export async function GET() {
    try {
        await connectToDatabase();
        const enums = await Enum.find({});
        return NextResponse.json({ data: enums }, { status: 200 });
    } catch (error) {
        console.error("GET /enums error:", error);
        return NextResponse.json({ error: "Failed to fetch enums" }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    try {
        await connectToDatabase();
        const body = await req.json();
        const parsed = createEnumSchema.safeParse(body);
        if (!parsed.success) {
            console.log(parsed.error);
            return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
        }

        const validatedData = parsed.data;
        const newEnum = await Enum.create(validatedData);

        return NextResponse.json({ message: "Enum created", data: newEnum }, { status: 201 });
    } catch (error) {
        console.error("POST /enums error:", error);
        return NextResponse.json({ error: "Failed to create enum" }, { status: 500 });
    }
}
