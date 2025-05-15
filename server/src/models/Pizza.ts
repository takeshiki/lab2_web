import mongoose, { Schema } from 'mongoose';
import { IPizza } from '../types';

const pizzaSchema = new Schema<IPizza>({
  name: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  imageUrl: {
    type: String,
    required: true
  }
}, { timestamps: true });

export default mongoose.model<IPizza>('Pizza', pizzaSchema); 