import { NextRequest, NextResponse } from "next/server";
import Service from "@/lib/database/schemas/service";
import { createServiceSchema } from "@/lib/database/zod-schema-validators/service";

export async function GET() {
    try {
        const services = await Service.find({ isDeleted: false });
        return NextResponse.json({ data: services }, { status: 200 });
    } catch (error) {
        console.error("GET /services error:", error);
        return NextResponse.json({ error: "Failed to fetch services" }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const parsed = createServiceSchema.safeParse(body);

        if (!parsed.success) {
            console.error(parsed.error)
            return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
        }

        const newService = await Service.create(parsed.data);
        return NextResponse.json({ message: "Service created", data: newService, status: 201 }, { status: 201 });
    } catch (error) {
        console.error("POST /services error:", error);
        return NextResponse.json({ error: "Failed to create service" }, { status: 500 });
    }
}
