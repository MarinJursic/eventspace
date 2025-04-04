import { NextRequest, NextResponse } from "next/server";
import Transaction from "@/lib/database/schemas/transaction";
import { createTransactionSchema } from "@/lib/database/zod-schema-validators/transaction";

export async function GET() {
    try {
        const transactions = await Transaction.find();
        return NextResponse.json({ data: transactions }, { status: 200 });
    } catch (error) {
        console.error("GET /transactions error:", error);
        return NextResponse.json({ error: "Failed to fetch transactions" }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const parsed = createTransactionSchema.safeParse(body);

        if (!parsed.success) {
            return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
        }

        const newTransaction = await Transaction.create(parsed.data);
        return NextResponse.json({ message: "Transaction created", data: newTransaction }, { status: 201 });
    } catch (error) {
        console.error("POST /transactions error:", error);
        return NextResponse.json({ error: "Failed to create transaction" }, { status: 500 });
    }
}
