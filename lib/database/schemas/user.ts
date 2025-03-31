import mongoose, { Document, Schema } from 'mongoose';

export interface IUser extends Document {
    name: string;
    email: string;
    password: string;
    emailVerified: boolean;
    role: 'admin' | 'vendor' | 'customer';
}

const UserSchema: Schema<IUser> = new Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['admin', 'vendor', 'customer'], default: 'customer' }
}, { timestamps: true });

export const User = mongoose.model<IUser>('User', UserSchema);

