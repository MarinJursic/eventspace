import { NextRequest, NextResponse } from "next/server";
import Account from "@/lib/database/schemas/account";
import { createAccountSchema } from "@/lib/database/zod-schema-validators/account";

export async function GET() {
    try {
        const accounts = await Account.find();
        return NextResponse.json({ data: accounts }, { status: 200 });
    } catch (error) {
        console.error("GET /accounts error:", error);
        return NextResponse.json({ error: "Failed to fetch accounts" }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const parsed = createAccountSchema.safeParse(body);

        if (!parsed.success) {
            return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
        }

        const newAccount = await Account.create(parsed.data);
        return NextResponse.json({ message: "Account created", data: newAccount }, { status: 201 });
    } catch (error) {
        console.error("POST /accounts error:", error);
        return NextResponse.json({ error: "Failed to create account" }, { status: 500 });
    }
}
