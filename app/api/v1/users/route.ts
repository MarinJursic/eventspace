import { NextRequest, NextResponse } from "next/server";
import User from "@/lib/database/schemas/user";
import { createUserSchema } from "@/lib/database/zod-schema-validators/user";
import connectToDatabase from "@/lib/database/mongodb";

export async function GET(req: NextRequest) {
    try {
        const email = req.nextUrl.searchParams.get("email");
        await connectToDatabase();
        let users;
        if(email){
            users = await User.findOne({email: email});
        }else{
            users = await User.find();
        }
        return NextResponse.json({ data: users }, { status: 200 });
    } catch (error) {
        console.error("GET /users error:", error);
        return NextResponse.json({ error: "Failed to fetch users" }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const parsed = createUserSchema.safeParse(body);

        if (!parsed.success) {
            return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
        }

        const newUser = await User.create(parsed.data);
        return NextResponse.json({ message: "User created", data: newUser }, { status: 201 });
    } catch (error) {
        console.error("POST /users error:", error);
        return NextResponse.json({ error: "Failed to create user" }, { status: 500 });
    }
}