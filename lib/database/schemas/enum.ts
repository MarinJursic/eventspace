import { Document, Schema, model } from 'mongoose';

// Define the TypeScript interface for a single enum item.
export interface IEnumItem {
  key: string;
  label: string;
  icon?: string; // Optional: Not all enums might require an icon.
}

// Define the TypeScript interface for the enum document.
// The _id field serves as the identifier for the enum type (e.g., "amenities").
export interface IEnum extends Document {
  _id: string; // enum type identifier: e.g., "amenities", "venueCategories", etc.
  values: IEnumItem[];
  updatedAt: Date;
}

// Create a separate schema for each enum item.
const EnumItemSchema: Schema = new Schema({
  key: { type: String, required: true },
  label: { type: String, required: true },
  icon: { type: String } // Optional field for icons.
});

// Create the unified enum schema.
// Each document represents a type of enum.
const EnumSchema: Schema = new Schema({
  _id: { type: String, required: true }, // Enum type identifier.
  values: { type: [EnumItemSchema], default: [] },
  updatedAt: { type: Date, default: Date.now }
});

// Export the model.
export const EnumModel = model<IEnum>('Enum', EnumSchema);
