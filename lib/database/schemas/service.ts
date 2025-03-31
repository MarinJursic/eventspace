import mongoose, { Document, Schema } from 'mongoose';

export interface IService extends Document {
    name: string;
    location: string;
    pricePerDay: number;
    reviews: mongoose.Types.ObjectId[];
    description?: string;
    features: string[];
    policies?: string;
    images: mongoose.Types.ObjectId[];
    bookedDates: Date[];
    type?: string;
    status: 'pending' | 'approved' | 'rejected';
    owner: mongoose.Types.ObjectId;
    rating: number;
}

const ServiceSchema: Schema<IService> = new Schema({
    name: { type: String, required: true },
    location: { type: String, required: true },
    pricePerDay: { type: Number, required: true },
    reviews: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Review'
    }],
    description: { type: String },
    features: [{
        type: String,
        required: true
    }],
    policies: { type: String },
    images: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Image'
    }],
    bookedDates: [{
        type: Date
    }],
    type: { type: String },
    status: {
        type: String,
        enum: ['pending', 'approved', 'rejected'],
        default: 'pending'
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    rating: {
        type: Number,
        min: 0,
        max: 5,
        default: 0
    }
}, { timestamps: true });

export default mongoose.model<IService>('Service', ServiceSchema);
