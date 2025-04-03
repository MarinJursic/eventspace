import mongoose, { Document, Schema } from 'mongoose';

export interface ITransaction extends Document {
    booking: mongoose.Types.ObjectId;
    user: mongoose.Types.ObjectId;
    amount: number;
    currency: string;
    method: 'credit_card' | 'paypal' | 'bank_transfer';
    status: 'pending' | 'completed' | 'failed';
    transactionDate: Date;
    updatedAt: Date;
    recepientUrl: string;
    refundAmount: number;
    refundDate: Date;
    isRefunded: boolean;
}

const TransactionSchema: Schema<ITransaction> = new Schema({
    booking: { type: mongoose.Schema.Types.ObjectId, ref: 'Booking', required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    amount: { type: Number, required: true },
    currency: {type: String, required: true},
    method: { type: String, enum: ['credit_card', 'paypal', 'bank_transfer'], required: true },
    status: { type: String, enum: ['pending', 'completed', 'failed'], default: 'pending' },
    transactionDate: { type: Date, default: Date.now },
    updatedAt: {type: Date, default: null}, 
    recepientUrl: { type: String, required: true },
    refundAmount: { type: Number, required: true },
    refundDate: { type: Date, required: true },
    isRefunded: { type: Boolean, required: true },
}, { timestamps: true });

const Transaction = mongoose.models.Payment || mongoose.model<ITransaction>('Transaction', TransactionSchema);
export default Transaction;
