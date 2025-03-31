import mongoose, { Document, Schema } from 'mongoose';

export interface IAccount extends Document {
    provider: string;
    type: string;
    providerAccountId: string;
    accessToken: string;
    expiresAt: number,
    scope: string;
    tokenType: string;
    tokenId: string;
    userId: mongoose.Schema.Types.ObjectId;
}

const AccountSchema: Schema<IAccount> = new Schema({
    provider: {type: String, required: true},
    type: { type: String, required: true },
    providerAccountId: { type: String, required: true },
    accessToken: { type: String, required: true },
    expiresAt: { type: Number, required: true },
    scope: { type: String, required: true },
    tokenType: { type: String, required: true },
    tokenId: { type: String, required: true },
    userId: { type: mongoose.Schema.Types.ObjectId }
}, { timestamps: true });

export const User = mongoose.model<IAccount>('Account', AccountSchema);

