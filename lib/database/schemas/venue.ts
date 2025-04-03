import mongoose, { Document, Schema } from 'mongoose';

export interface IVenue extends Document {
    name: string;
    location: {
        address: string;
        city: string;
        street: string;
        houseNumber: number;
        country: string;
        postalCode: number;
    };
    price: {
        basePrice: number,
        model: string;
    };
    reviews: mongoose.Types.ObjectId[];
    seating?: {
        seated: number;
        standing: number;
    };
    description?: string;
    images: {
        url: string;
        alt: string;
        width?: number;
        height?: number;
        caption: string;
    }[];
    amenities?: mongoose.Types.ObjectId[];
    services: mongoose.Types.ObjectId[];
    policies?: {
        bannedServices: string[];
        listOfPolicies: {
            name: string;
            description: string;
        }[];
    };
    bookedDates: {
        date: Date;
        bookingRef?: mongoose.Types.ObjectId;
    }[];
    availabilityRules?: {
        blockedWeekdays: {
            weekday: string;
            recurrenceRule: string;
        }[];
    };
    category: string;
    type?: string;
    status: 'pending' | 'approved' | 'rejected' | 'softDeleted' | 'deleted' | 'active' | 'inactive';
    capacity: number;
    owner: mongoose.Types.ObjectId;
    rating: {
        average: number;
        count: number;
    };
    sponsored: {
        isActive: boolean;
        until?: Date;
        planType?: string;
    };
}

const VenueSchema: Schema<IVenue> = new Schema({
    name: { type: String, required: true },
    location: {
        address: { type: String, required: true },
        city: { type: String, required: true },
        street: { type: String, required: true },
        houseNumber: { type: Number, required: true },
        country: { type: String, required: true },
        postalCode: { type: Number, required: true },
    },
    price: {
        basePrice: { type: Number, required: true },
        model: { type: String, enum: ['hour', 'day', 'week'], default: 'day' }
    },
    reviews: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Review' }],
    seating: {
        seated: { type: Number, default: 0 },
        standing: { type: Number, default: 0 }
    },
    description: { type: String },
    images: [{
        url: { type: String, required: true },
        alt: { type: String, required: true },
        width: { type: Number },
        height: { type: Number },
        caption: { type: String, required: true }
    }],
    amenities:  [{ type: mongoose.Schema.Types.ObjectId, ref: 'Enum' }],
    services: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Enum' }],
    policies: {
        bannedServices: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Enum' }],
        listOfPolicies: [{
            name: { type: String, required: true },
            description: { type: String, required: true }
        }]
    },
    bookedDates: [{
        date: { type: Date, required: true },
        bookingRef: { type: mongoose.Schema.Types.ObjectId, ref: 'Booking' }
    }],
    availabilityRules: {
        blockedWeekdays: [{
            weekday: { type: String, required: true },
            recurrenceRule: { type: String,enum: ['weekly', 'biweekly', 'monthly'], required: true }
        }]
    },
    category: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Enum' }],
    type: { type: String },
    status: {
        type: String,
        enum: ['pending', 'approved', 'rejected','softDeleted','deleted','active','inactive'],
        default: 'pending'
    },
    capacity: { type: Number },
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    rating: {
        average: { type: Number, min: 0, max: 5, default: 0 },
        count: { type: Number, default: 0 }
    },
    sponsored: {
        isActive: { type: Boolean, default: false },
        until: { type: Date },
        planType: { type: String }
    }
}, { timestamps: true });

const Venue = mongoose.models.Venue || mongoose.model<IVenue>('Venue', VenueSchema);
export default Venue;