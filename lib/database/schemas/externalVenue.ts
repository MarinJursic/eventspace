import mongoose, { Document, Schema } from 'mongoose';

export interface IExternalVenue extends Document {
    name: string;
    location: {
        address: string;
        city: string;
        street: string;
        houseNumber: number;
        country: string;
        postalCode: number;
    };
    bookedDates: {
        date: Date;
        bookingRef?: mongoose.Types.ObjectId;
    }[];
    owner: mongoose.Types.ObjectId;
}

const ExternalVenueSchema: Schema<IExternalVenue> = new Schema({
    name: { type: String, required: true },
    location: {
        address: { type: String, required: true },
        city: { type: String, required: true },
        street: { type: String, required: true },
        houseNumber: { type: Number, required: true },
        country: { type: String, required: true },
        postalCode: { type: Number, required: true },
    },
    bookedDates: [{
        date: { type: Date, required: true },
        bookingRef: { type: mongoose.Schema.Types.ObjectId, ref: 'Booking' }
    }],
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
}, { timestamps: true });

const ExternalValue = mongoose.models.ExternalVenue || mongoose.model<IExternalVenue>('ExternalVenue', ExternalVenueSchema);
export default ExternalValue;