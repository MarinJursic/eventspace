import mongoose, { Document, Schema } from 'mongoose';

export interface IPayment extends Document {
    booking: mongoose.Types.ObjectId;
    user: mongoose.Types.ObjectId;
    amount: number;
    method: 'credit_card' | 'paypal' | 'bank_transfer';
    status: 'pending' | 'completed' | 'failed';
    transactionDate: Date;
}

const PaymentSchema: Schema<IPayment> = new Schema({
    booking: { type: mongoose.Schema.Types.ObjectId, ref: 'Booking', required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    amount: { type: Number, required: true },
    method: { type: String, enum: ['credit_card', 'paypal', 'bank_transfer'], required: true },
    status: { type: String, enum: ['pending', 'completed', 'failed'], default: 'pending' },
    transactionDate: { type: Date, default: Date.now }
}, { timestamps: true });

export const Payment = mongoose.model<IPayment>('Payment', PaymentSchema);