import mongoose, { Document, Schema } from 'mongoose';

export interface IBooking extends Document {
    user: mongoose.Types.ObjectId;
    venue: mongoose.Types.ObjectId;
    service?: mongoose.Types.ObjectId[];
    isExternalVenue: boolean;
    datesBooked?: Date[];
    status: 'pending' | 'confirmed' | 'cancelled' | 'softDelete' | 'delete';
}

const BookingSchema: Schema<IBooking> = new Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    venue: { type: mongoose.Schema.Types.ObjectId },  
    service: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Service' }],
    isExternalVenue: {type: Boolean, required: true},
    datesBooked: [{Date}],
    status: { type: String, enum: ['pending', 'confirmed', 'cancelled','softDelete','delete'], default: 'pending' },
}, { timestamps: true });

const Booking = mongoose.models.Booking || mongoose.model<IBooking>('Booking', BookingSchema);
export default Booking;
