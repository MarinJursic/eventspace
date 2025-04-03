import mongoose, { Document, Schema } from 'mongoose';

export interface IUser extends Document {
    name: string;
    email: string;
    password: string;
    emailVerified: boolean;
    isDeleted: boolean;
    role: 'admin' | 'vendor' | 'customer';
}

const UserSchema: Schema<IUser> = new Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    isDeleted: {type: Boolean, required: true},
    role: { type: String, enum: ['admin', 'vendor', 'customer'], default: 'customer' }
}, { timestamps: true });

const User = mongoose.models.User || mongoose.model<IUser>('User', UserSchema);
export default User;