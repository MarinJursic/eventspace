import mongoose, { Document, Schema } from 'mongoose';

export interface IVenue extends Document {
    name: string;
    location: string;
    pricePerDay: number;
    reviews: mongoose.Types.ObjectId[];
    seating: {
        seated: number;
        standing: number;
    };
    description?: string;
    amenities: string[];
    policies?: string;
    images: mongoose.Types.ObjectId[];
    bookedDates: Date[];
    type?: string;
    status: 'pending' | 'approved' | 'rejected';
    capacity?: number;
    owner: mongoose.Types.ObjectId;
    rating: number;
}

const VenueSchema: Schema<IVenue> = new Schema({
    name: { type: String, required: true },
    location: { type: String, required: true },
    pricePerDay: { type: Number, required: true },
    reviews: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Review'
    }],
    seating: {
        seated: { type: Number, default: 0 },
        standing: { type: Number, default: 0 }
    },
    description: { type: String },
    amenities: [{
        type: String
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
    capacity: { type: Number },
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

export default mongoose.model<IVenue>('Venue', VenueSchema);
