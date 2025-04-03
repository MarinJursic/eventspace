import mongoose, { Schema, Document, Model } from 'mongoose';

// DELETE THIS BECAUSE WE HAVE THE REVIEW SCHEMA AND ITS REFERENCE IN VENUE SCHEMA?
// interface IReview {
//   user: mongoose.Schema.Types.ObjectId;
//   rating: number;
//   comment?: string;
//   createdAt: Date;
// }

// const ReviewSchema: Schema = new Schema({
//   user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
//   rating: { type: Number, required: true, min: 1, max: 5 },
//   comment: { type: String },
//   createdAt: { type: Date, default: Date.now },
// });


interface IVenue extends Document {
    name: string;
    location: {
        address: string;
        city: string;
        street: string;
        houseNumber: number;
        country: string;
        postalCode: number;
    };
    geo?: {
        type: string,
        locationValue?:string
        lat?: number,
        lng?: number,
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
    availabilityRules: {
        blockedWeekdays: {
            weekday: string;
            recurrenceRule: string;
        }[];
        blockedDates: {
            date: Date;
            recurrenceRule: string;
        }[];
    };
    category: string;
    type?: string;
    status: 'pending' | 'approved' | 'rejected';
    capacity: number;
    owner: mongoose.Types.ObjectId;
    rating: {
        average: number;
        count: number;
    };
    isDeleted: boolean;
    isActive: boolean;
    sponsored: {
        isActive: boolean;
        until?: Date;
        planType?: string;
    };
}

const VenueSchema: Schema<IVenue> = new Schema({
    name: { type: String, required: true },
    location: {
        mapLink: { type: String },
        city: { type: String, required: true },
        houseNumber: { type: Number, required: true },
        country: { type: String, required: true },
        postalCode: { type: Number, required: true },
    },
    geo: {
        type:{type:String, required:true},
        locationValue: {type:String},
        lat:{type:Number},
        lng:{type:Number}
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
    amenities: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Service' }],
    policies: {
        bannedServices: [{ type: String }],
        listOfPolicies: [{
            name: { type: String, required: true },
            description: { type: String, required: true }
        }]
    },
    bookedDates: [{
        date: { type: Date, required: true },
        from: { type: Date },
        to: { type: Date },
        bookingRef: { type: mongoose.Schema.Types.ObjectId, ref: 'Booking' }
    }],
    availabilityRules: {
        blockedWeekdays: [{
            weekday: { type: String, required: true },
            recurrenceRule: { type: String, required: true }
        }],
        blockedDates: [{
            date: { type: Date, required: true },
            recurrenceRule: { type: String, required: true }
        }]
    },
    category: { type: String },
    type: { type: String },
    status: {
        type: String,
        enum: ['pending', 'approved', 'rejected'],
        default: 'pending'
    },
    capacity: { type: Number },
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    rating: {
        average: { type: Number, min: 0, max: 5, default: 0 },
        count: { type: Number, default: 0 }
    },
    isDeleted: { type: Boolean, default: false },
    sponsored: {
        isActive: { type: Boolean, default: false },
        until: { type: Date },
        planType: { type: String }
    }
}, { timestamps: true });

const Venue: Model<IVenue> = mongoose.models.Venue || mongoose.model<IVenue>('Venue', VenueSchema);
export default Venue;