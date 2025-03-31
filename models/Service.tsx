import mongoose, { Schema, Document, Model } from 'mongoose';

interface IReview {
  user: mongoose.Schema.Types.ObjectId;
  rating: number;
  comment?: string;
  createdAt: Date;
}

export interface IService extends Document {
  name: string;
  location: string;
  pricePerDay: number;
  reviews: IReview[];
  description: string;
  features: string[]; // e.g., Full-Day Coverage, Professional Photographer, etc.
  policies: string;
  images: string[];
  availableDates: Date[];
  type: string;
  status: 'pending' | 'approved' | 'rejected';
  date: Date;
  owner: mongoose.Schema.Types.ObjectId;
  rating: number;
  createdAt: Date;
  updatedAt: Date;
}

const ReviewSchema: Schema = new Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  rating: { type: Number, required: true, min: 1, max: 5 },
  comment: { type: String },
  createdAt: { type: Date, default: Date.now },
});

const ServiceSchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    location: { type: String, required: true },
    pricePerDay: { type: Number, required: true },
    reviews: [ReviewSchema],
    description: { type: String },
    features: { type: [String], default: [] },
    policies: { type: String },
    images: { type: [String], default: [] },
    availableDates: { type: [Date], default: [] },
    type: { type: String, required: true },
    status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
    date: { type: Date, default: Date.now },
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    rating: { type: Number, default: 0 },
  },
  { timestamps: true }
);

const Service: Model<IService> = mongoose.models.Service || mongoose.model<IService>('Service', ServiceSchema);
export default Service;
