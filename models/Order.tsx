import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IOrderItem {
  item: mongoose.Schema.Types.ObjectId;
  itemType: 'Venue' | 'Service';
  bookingDates: Date[];
  quantity: number;
  price: number;
}

export interface IOrder extends Document {
  user: mongoose.Schema.Types.ObjectId;
  items: IOrderItem[];
  totalPrice: number;
  status: 'pending' | 'confirmed' | 'cancelled';
  paymentMethod: string;
  createdAt: Date;
  updatedAt: Date;
}

const OrderItemSchema: Schema = new Schema({
  item: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    refPath: 'items.itemType',
  },
  itemType: { type: String, required: true, enum: ['Venue', 'Service'] },
  bookingDates: { type: [Date], default: [] },
  quantity: { type: Number, default: 1 },
  price: { type: Number, required: true },
});

const OrderSchema: Schema = new Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    items: [OrderItemSchema],
    totalPrice: { type: Number, required: true },
    status: { type: String, enum: ['pending', 'confirmed', 'cancelled'], default: 'pending' },
    paymentMethod: { type: String, default: 'card' },
  },
  { timestamps: true }
);

const Order: Model<IOrder> = mongoose.models.Order || mongoose.model<IOrder>('Order', OrderSchema);
export default Order;
