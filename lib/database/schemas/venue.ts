import { Types, Schema, models, model } from "mongoose";

export interface IVenue {
  toObject(arg0: { virtuals: boolean }): unknown;
  _id?: string;
  name: string;
  location: {
    address: string;
    city: string;
    street: string;
    houseNumber: string;
    country: string;
    postalCode: string;
    lat?: number;
    lng?: number;
  };
  price: {
    basePrice: number;
    model: string;
  };
  reviews: Types.ObjectId[];
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
  amenities?: Types.ObjectId[];
  services: Types.ObjectId[];
  policies?: {
    bannedServices: string[];
    listOfPolicies: {
      name: string;
      description: string;
    }[];
  };
  bookedDates: {
    date: Date;
    bookingRef?: Types.ObjectId;
  }[];
  availabilityRules?: {
    blockedWeekdays: {
      weekday: string;
      recurrenceRule: string;
    }[];
  };
  category?: Types.ObjectId;
  type: string;
  status:
    | "pending"
    | "approved"
    | "rejected"
    | "softDeleted"
    | "deleted"
    | "active"
    | "inactive";
  capacity: number;
  owner: Types.ObjectId;
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

const VenueSchema: Schema<IVenue> = new Schema(
  {
    name: { type: String, required: true },
    location: {
      address: { type: String, required: true },
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
      model: { type: String, enum: ["hour", "day", "week"], default: "day" },
    },
    reviews: [{ type: Schema.Types.ObjectId, ref: "Review" }],
    seating: {
      seated: { type: Number, default: 0 },
      standing: { type: Number, default: 0 },
    },
    description: { type: String },
    images: [
      {
        url: { type: String, required: true },
        alt: { type: String, required: true },
        width: { type: Number },
        height: { type: Number },
        caption: { type: String, required: true },
      },
    ],
    amenities: [{ type: Schema.Types.ObjectId, ref: "Enum" }],
    services: [{ type: Schema.Types.ObjectId, ref: "Enum" }],
    policies: {
      bannedServices: [{ type: Schema.Types.ObjectId, ref: "Enum" }],
      listOfPolicies: [
        {
          name: { type: String, required: true },
          description: { type: String, required: true },
        },
      ],
    },
    bookedDates: [
      {
        date: { type: Date, required: true },
        bookingRef: { type: Schema.Types.ObjectId, ref: "Booking" },
      },
    ],
    availabilityRules: {
      blockedWeekdays: [
        {
          weekday: { type: String, required: true },
          recurrenceRule: {
            type: String,
            enum: ["weekly", "biweekly", "monthly"],
            required: true,
          },
        },
      ],
    },
    category: [{ type: Schema.Types.ObjectId, ref: "Enum" }],
    type: { type: String },
    status: {
      type: String,
      enum: [
        "pending",
        "approved",
        "rejected",
        "softDeleted",
        "deleted",
        "active",
        "inactive",
      ],
      default: "pending",
    },
    capacity: { type: Number },
    owner: { type: Schema.Types.ObjectId, ref: "User", required: true },
    rating: {
      average: { type: Number, min: 0, max: 5, default: 0 },
      count: { type: Number, default: 0 },
    },
    sponsored: {
      isActive: { type: Boolean, default: false },
      until: { type: Date },
      planType: { type: String },
    },
  },
  { timestamps: true }
);

const Venue = models.Venue || model<IVenue>("Venue", VenueSchema);
export default Venue;
