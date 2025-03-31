import mongoose, { Schema, Document, Model } from 'mongoose';

interface IReview {
  user: mongoose.Schema.Types.ObjectId;
  rating: number;
  comment?: string;
  createdAt: Date;
}

export interface IVenue extends Document {
  name: string;
  location: string;
  pricePerDay: number;
  reviews: IReview[];
  seating: {
    seated: number;
    standing: number;
  };
  description: string;
  amenities: string[];
  policies: string;
  images: string[];
  availableDates: Date[];
  type: string; // e.g., wedding, business, etc.
  status: 'pending' | 'approved' | 'rejected';
  capacity: number;
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

const VenueSchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    location: { type: String, required: true },
    pricePerDay: { type: Number, required: true },
    reviews: [ReviewSchema],
    seating: {
      seated: { type: Number, default: 0 },
      standing: { type: Number, default: 0 },
    },
    description: { type: String },
    amenities: { type: [String], default: [] },
    policies: { type: String },
    images: { type: [String], default: [] },
    availableDates: { type: [Date], default: [] },
    type: { type: String, required: true },
    status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
    capacity: { type: Number, required: true },
    date: { type: Date, default: Date.now },
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    rating: { type: Number, default: 0 },
  },
  { timestamps: true }
);

const Venue: Model<IVenue> = mongoose.models.Venue || mongoose.model<IVenue>('Venue', VenueSchema);
export default Venue;
