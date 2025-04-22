import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/database/mongodb";
import Enum from "@/lib/database/schemas/enum";

export async function GET(req: NextRequest) {
    const splitHref = req.nextUrl.href.split("/");
    const id = splitHref[splitHref.length - 1];
    try {
        await connectToDatabase();
        const enumResult = await Enum.findById(id);
        return NextResponse.json({ data: enumResult }, { status: 200 });
    } catch (error) {
        console.error(`GET /${id} error:`, error);
        return NextResponse.json({ error: `Failed to fetch enum` }, { status: 500 });
    }
}