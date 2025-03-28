import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { MongoDBAdapter } from "@next-auth/mongodb-adapter";
import { compare, hash } from "bcryptjs";
import { NextAuthOptions } from "next-auth";
import clientPromise from "@/lib/mongodb";

export const authOptions: NextAuthOptions = {
  adapter: MongoDBAdapter(clientPromise),
  session: { strategy: "jwt" },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
        // These fields are expected for sign up only
        name: { label: "Name", type: "text" },
        role: { label: "Role", type: "text" },
        // A hidden flag to differentiate sign up vs sign in
        isSignUp: { label: "Is Sign Up", type: "text" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Email and password are required");
        }

        // Determine if this is a sign-up attempt.
        const isSignUp = credentials.isSignUp === "true";

        const client = await clientPromise;
        const usersCollection = client.db().collection("users");
        const existingUser = await usersCollection.findOne({
          email: credentials.email,
        });

        if (existingUser) {
          // If this is a sign-up attempt and the user exists, reject the signup.
          if (isSignUp) {
            throw new Error("Email already in use. Please sign in instead.");
          }
          // For a sign in attempt, verify that the account has a password.
          if (!existingUser.password) {
            throw new Error(
              "No password set for this account. Please complete your profile or sign in using OAuth."
            );
          }
          // Validate the provided password.
          const isValid = await compare(
            credentials.password,
            existingUser.password
          );
          if (!isValid) {
            throw new Error("Invalid email or password");
          }
          return {
            id: existingUser._id.toString(),
            email: existingUser.email,
            name: existingUser.name,
            role: existingUser.role,
          };
        } else {
          // If no user exists, this must be a sign-up attempt.
          if (!credentials.name || !credentials.role) {
            throw new Error("Name and role are required for signup");
          }
          const hashedPassword = await hash(credentials.password, 10);
          const newUser = {
            name: credentials.name,
            email: credentials.email,
            password: hashedPassword,
            role: credentials.role,
            createdAt: new Date(),
          };
          const result = await usersCollection.insertOne(newUser);
          return {
            id: result.insertedId.toString(),
            email: newUser.email,
            name: newUser.name,
            role: newUser.role,
          };
        }
      },
    }),
    GoogleProvider({
      allowDangerousEmailAccountLinking: true,
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    }),
  ],
  callbacks: {
    async signIn({ user, account }) {
      // For OAuth logins you might later add logic to enforce profile completion.

      // For OAuth providers (e.g. Google)
      if (account?.provider !== "credentials") {
        // Look up the user by email in the database
        const client = await clientPromise;
        const usersCollection = client.db().collection("users");
        const existingUser = await usersCollection.findOne({
          email: user.email,
        });
        if (existingUser) {
          // Set the user.id to the existing user's id
          user.id = existingUser._id.toString();
        }
      }
      return true;
    },
    async jwt({ token, user }) {
      if (user) {
        token.role = (user as any).role;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.sub;
        session.user.role = token.role;
      }
      return session;
    },
  },
  pages: {
    signIn: "/auth/signin",
    error: "/auth/error",
  },
  debug: process.env.NODE_ENV === "development",
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
