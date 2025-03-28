// /app/api/complete-profile/route.ts
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { hash } from "bcryptjs";
import { authOptions } from "../[...nextauth]/route";
import { NextRequest } from "next/server";
import clientPromise from "@/lib/mongodb";

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { role, password } = await req.json();

  if (!role || !password) {
    return NextResponse.json(
      { error: "Role and password are required" },
      { status: 400 }
    );
  }

  try {
    const client = await clientPromise;
    const usersCollection = client.db().collection("users");

    // Hash the new password before saving.
    const hashedPassword = await hash(password, 10);

    await usersCollection.updateOne(
      { email: session.user.email },
      { $set: { role, password: hashedPassword } }
    );

    return NextResponse.json(
      { message: "Profile updated successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Error updating profile" },
      { status: 500 }
    );
  }
}
