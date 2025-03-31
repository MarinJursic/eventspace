import mongoose, { Document, Schema } from 'mongoose';

export interface IImage extends Document {
    imageData: Buffer;
    contentType: string;
    category: string; // "venue" or "service", cisto radi konteksta
    filename?: string;
    caption?: string;
}

const ImageSchema: Schema<IImage> = new Schema({
    imageData: { type: Buffer, required: true },
    contentType: { type: String, required: true },
    category: { type: String, required: true },
    filename: { type: String },
    caption: { type: String }
}, { timestamps: true });

export default mongoose.model<IImage>('Image', ImageSchema);
