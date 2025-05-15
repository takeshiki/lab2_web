import mongoose, { Schema } from 'mongoose';
import { IOrder } from '../types';

const orderSchema = new Schema<IOrder>({
  customerName: {
    type: String,
    required: true
  },
  customerPhone: {
    type: String,
    required: true
  },
  address: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'preparing', 'delivering', 'delivered'],
    default: 'pending'
  },
  pizzas: [{
    pizzaId: {
      type: Schema.Types.ObjectId,
      ref: 'Pizza',
      required: true
    },
    quantity: {
      type: Number,
      required: true,
      min: 1
    }
  }],
  totalPrice: {
    type: Number,
    required: true
  }
}, { timestamps: true });

export default mongoose.model<IOrder>('Order', orderSchema); 