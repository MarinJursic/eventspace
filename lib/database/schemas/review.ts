import mongoose, { Document, Schema } from 'mongoose';

export interface IReview extends Document {
    user: mongoose.Types.ObjectId;
    rating: number;
    comment?: string;
    target: mongoose.Types.ObjectId; // Referenca na venue ili service
    targetModel: 'Venue' | 'Service';
}

const ReviewSchema: Schema<IReview> = new Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    rating: { type: Number, required: true, min: 0, max: 5, default: 0 },
    comment: { type: String },
    // Using refPath allows dynamic reference to either Venue or Service based on targetModel field
    target: { type: mongoose.Schema.Types.ObjectId, required: true, refPath: 'targetModel' },
    targetModel: { type: String, required: true, enum: ['Venue', 'Service'] }
}, { timestamps: true });

export const Review = mongoose.model<IReview>('Review', ReviewSchema);