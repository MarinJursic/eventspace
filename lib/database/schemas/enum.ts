import mongoose, { Document, Schema } from 'mongoose';

export interface IEnumValue {
  _id: mongoose.Types.ObjectId;
  key: string;
  label: string;
  icon: string;
}

export interface IEnum {
  _id: mongoose.Types.ObjectId;
  enumType: string;
  values: IEnumValue[];
  updatedAt: Date;
}

const EnumSchema: Schema = new Schema({
  enumType: { type: String, required: true },
  values: { type: [Schema.Types.Mixed], default: [] },
  updatedAt: { type: Date, default: Date.now }
});

const Enum = mongoose.models.Enum || mongoose.model<IEnum>('Enum', EnumSchema);
export default Enum;