import mongoose, { Schema } from 'mongoose';

export interface IService {
    _id?: string;
    name: string;
    location: {
        address: string;
        city: string;
        street: string;
        houseNumber: string;
        country: string;
        postalCode: string;
        lat?: number,
        lng?: number,
    };
    price: {
        basePrice: number,
        model: string;
    };
    reviews: mongoose.Types.ObjectId[];
    description?: string;
    features: mongoose.Types.ObjectId[];
    images: {
        url: string;
        alt: string;
        width?: number;
        height?: number;
        caption: string;
    }[];
    policies?: {
        listOfPolicies: {
            name: string;
            description: string;
        }[];
    };
    bookedDates: {
        date: Date;
        bookingRef?: mongoose.Types.ObjectId;
    }[];
    availabilityRules: {
        blockedWeekdays: {
            weekday: string;
            recurrenceRule: string;
        }[];
    };
    category:mongoose.Types.ObjectId,
    type?: string;
    status: 'pending' | 'approved' | 'rejected' | 'softDeleted' | 'deleted' | 'active' | 'inactive';
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
    createdAt?: string;
    updatedAt?: string;
}

const ServiceSchema: Schema<IService> = new Schema({
    name: { type: String, required: true },
    location: {
        address: {type: String, requried: true},
        city: { type: String, required: true },
        street: { type: String, required: true },
        houseNumber: { type: String, required: true },
        country: { type: String, required: true },
        postalCode: { type: String, required: true },
        lat: { type: Number, required: false },
        lng: { type: Number, required: false },
    },
    price: {
        basePrice: { type: Number, required: true },
        model: { type: String, enum: ['hour', 'day', 'week'], default: 'day' }
    },
    reviews: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Review' }],
    description: { type: String },
    features: [{ type: String, required: true }],
    images: [{
        url: { type: String, required: true },
        alt: { type: String, required: true },
        width: { type: Number },
        height: { type: Number },
        caption: { type: String, required: true }
    }],
    policies: {
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
            recurrenceRule: { type: String, enum: ['weekly', 'biweekly', 'monthly'], required: true },
        }],
    },
    category:[{ type: mongoose.Schema.Types.ObjectId, ref: "Enum" }],
    type: { type: String },
    status: {
        type: String,
        enum: ['pending', 'approved', 'rejected', 'softDeleted', 'deleted', 'active', 'inactive'],
        default: 'pending'
    },
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

const Service = mongoose.models.Service || mongoose.model<IService>('Service', ServiceSchema);
export default Service;