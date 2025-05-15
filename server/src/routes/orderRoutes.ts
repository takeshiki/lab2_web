import express, { Request, Response } from 'express';
import mongoose from 'mongoose';
import Order from '../models/Order';
import { IOrder } from '../types';

const router = express.Router();

router.get('/', async (_req: Request, res: Response) => {
  try {
    const orders = await Order.find().populate('pizzas.pizzaId');
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error instanceof Error ? error.message : 'Unknown error' });
  }
});

router.get('/:id', async (req: Request, res: Response) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: 'Invalid order ID' });
    }
    const order = await Order.findById(req.params.id).populate('pizzas.pizzaId');
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    res.json(order);
  } catch (error) {
    res.status(500).json({ message: error instanceof Error ? error.message : 'Unknown error' });
  }
});

router.post('/', async (req: Request, res: Response) => {
  const order = new Order({
    customerName: req.body.customerName,
    customerPhone: req.body.customerPhone,
    address: req.body.address,
    status: req.body.status || 'pending',
    pizzas: req.body.pizzas,
    totalPrice: req.body.totalPrice
  });

  try {
    const newOrder = await order.save();
    res.status(201).json(newOrder);
  } catch (error) {
    res.status(400).json({ message: error instanceof Error ? error.message : 'Unknown error' });
  }
});

router.patch('/:id', async (req: Request, res: Response) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: 'Invalid order ID' });
    }
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    if (req.body.customerName) order.customerName = req.body.customerName;
    if (req.body.customerPhone) order.customerPhone = req.body.customerPhone;
    if (req.body.address) order.address = req.body.address;
    if (req.body.status) order.status = req.body.status;
    if (req.body.pizzas) order.pizzas = req.body.pizzas;
    if (req.body.totalPrice) order.totalPrice = req.body.totalPrice;

    const updatedOrder = await order.save();
    res.json(updatedOrder);
  } catch (error) {
    res.status(400).json({ message: error instanceof Error ? error.message : 'Unknown error' });
  }
});

router.delete('/:id', async (req: Request, res: Response) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: 'Invalid order ID' });
    }
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    await order.deleteOne();
    res.json({ message: 'Order deleted' });
  } catch (error) {
    res.status(500).json({ message: error instanceof Error ? error.message : 'Unknown error' });
  }
});

export default router; 