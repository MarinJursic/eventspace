// lib/database/mongodb.ts
import mongoose, { Mongoose } from "mongoose";

const MONGODB_URI: string | undefined = process.env.MONGODB_URI;

// --- Augment the NodeJS Global type ---
// This tells TypeScript about the 'mongoose' property we're adding to the global scope.
declare global {
  // eslint-disable-next-line no-var
  var mongoose: {
    promise: Promise<Mongoose> | null;
    conn: Mongoose | null;
  };
}

/**
 * Global is used here to maintain a cached connection across hot reloads
 * in development. This prevents connections growing exponentially
 * during API Route usage or Server Actions.
 */
let cached = global.mongoose;

if (!cached) {
  // Initialize the cache if it doesn't exist
  cached = global.mongoose = { conn: null, promise: null };
}

async function connectToDatabase(): Promise<Mongoose> {
  if (!MONGODB_URI) {
    throw new Error(
      "Please define the MONGODB_URI environment variable inside .env.local"
    );
  }

  // If a connection already exists, return it
  if (cached.conn) {
    console.log("Using cached MongoDB connection."); // Uncomment for debugging
    return cached.conn;
  }

  // If a connection promise doesn't exist, create one
  if (!cached.promise) {
    const opts = {
      bufferCommands: false, // Recommended to disable buffering
      // Consider adding other options like maxPoolSize if needed
      // maxPoolSize: 10,
    };

    console.log("Creating new MongoDB connection promise.");
    cached.promise = mongoose
      .connect(MONGODB_URI, opts)
      .then((mongooseInstance) => {
        console.log("MongoDB Connected.");
        return mongooseInstance;
      })
      .catch((error) => {
        console.error(
          "MongoDB connection error during initial connect:",
          error
        );
        cached.promise = null; // Reset promise on error so retry is possible
        throw error; // Re-throw the error to be caught by the caller
      });
  }

  // Await the connection promise and cache the connection instance
  try {
    // console.log("Awaiting MongoDB connection promise."); // Uncomment for debugging
    cached.conn = await cached.promise;
    return cached.conn;
  } catch (error) {
    // If the promise was rejected (e.g., connection failed),
    // ensure the promise cache is cleared so the next attempt tries again.
    console.error("MongoDB connection error while awaiting promise:", error);
    cached.promise = null;
    throw error; // Re-throw error for the caller (API route/Server Action) to handle
  }
}

export default connectToDatabase;
