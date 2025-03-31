import { NextResponse } from "next/server";
import clientPromise from "@/lib/database/mongodb";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  const { name, email, password, role } = await req.json();

  if (!name || !email || !password || !["customer", "vendor"].includes(role)) {
    return NextResponse.json({ error: "Invalid input" }, { status: 400 });
  }

  const db = (await clientPromise).db();
  const existing = await db.collection("users").findOne({ email });

  if (existing) {
    return NextResponse.json({ error: "User already exists" }, { status: 409 });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const result = await db.collection("users").insertOne({
    name,
    email,
    password: hashedPassword,
    role,
    createdAt: new Date(),
  });

  return NextResponse.json(
    { message: "User created", id: result.insertedId },
    { status: 201 }
  );
}
