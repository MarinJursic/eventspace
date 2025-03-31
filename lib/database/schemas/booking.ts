import mongoose, { Document, Schema } from 'mongoose';

export interface IBooking extends Document {
    user: mongoose.Types.ObjectId;
    venue?: mongoose.Types.ObjectId;  
    service?: mongoose.Types.ObjectId; 
    dateSpan?: {
        startDate: Date;
        endDate: Date;
    };
    datesBooked?: [Date];
    status: 'pending' | 'confirmed' | 'cancelled';
}

const BookingSchema: Schema<IBooking> = new Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    venue: { type: mongoose.Schema.Types.ObjectId, ref: 'Venue' },
    service: { type: mongoose.Schema.Types.ObjectId, ref: 'Service' },
    dateSpan:{
        startDate: { type: Date, required: true },
        endDate: { type: Date, required: true },
    },
    datesBooked: [{Date}],
    status: { type: String, enum: ['pending', 'confirmed', 'cancelled'], default: 'pending' }
}, { timestamps: true });

export const Booking = mongoose.model<IBooking>('Booking', BookingSchema);