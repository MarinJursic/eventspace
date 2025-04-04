import mongoose, { Mongoose } from 'mongoose';

const MONGODB_URI: string | undefined = process.env.MONGODB_URI;

export default async function connectToDatabase(): Promise<Mongoose> {
  try {
    if (!MONGODB_URI) {
      throw new Error("Incorrect or no MONGODB_URI");
    }
    const mongooseClient: Mongoose = await mongoose.connect(MONGODB_URI, {
      maxPoolSize: 10,
    });
    console.error("Connected to MongoDB");
    return mongooseClient;
  } catch (error){
    console.error("MongoDB connection error: ", error);
    throw new Error(error as string)
  }
}