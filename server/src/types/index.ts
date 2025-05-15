import { Document } from 'mongoose';

export interface IPizza extends Document {
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IOrderPizza {
  pizzaId: string;
  quantity: number;
}

export interface IOrder extends Document {
  customerName: string;
  customerPhone: string;
  address: string;
  status: 'pending' | 'preparing' | 'delivering' | 'delivered';
  pizzas: IOrderPizza[];
  totalPrice: number;
  createdAt: Date;
  updatedAt: Date;
} 