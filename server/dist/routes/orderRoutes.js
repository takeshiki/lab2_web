"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const Order_1 = __importDefault(require("../models/Order"));
const router = express_1.default.Router();
// Get all orders
router.get('/', async (_req, res) => {
    try {
        const orders = await Order_1.default.find().populate('pizzas.pizzaId');
        res.json(orders);
    }
    catch (error) {
        res.status(500).json({ message: error instanceof Error ? error.message : 'Unknown error' });
    }
});
// Get one order
router.get('/:id', async (req, res) => {
    try {
        const order = await Order_1.default.findById(req.params.id).populate('pizzas.pizzaId');
        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }
        res.json(order);
    }
    catch (error) {
        res.status(500).json({ message: error instanceof Error ? error.message : 'Unknown error' });
    }
});
// Create order
router.post('/', async (req, res) => {
    const order = new Order_1.default({
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
    }
    catch (error) {
        res.status(400).json({ message: error instanceof Error ? error.message : 'Unknown error' });
    }
});
// Update order
router.patch('/:id', async (req, res) => {
    try {
        const order = await Order_1.default.findById(req.params.id);
        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }
        if (req.body.customerName)
            order.customerName = req.body.customerName;
        if (req.body.customerPhone)
            order.customerPhone = req.body.customerPhone;
        if (req.body.address)
            order.address = req.body.address;
        if (req.body.status)
            order.status = req.body.status;
        if (req.body.pizzas)
            order.pizzas = req.body.pizzas;
        if (req.body.totalPrice)
            order.totalPrice = req.body.totalPrice;
        const updatedOrder = await order.save();
        res.json(updatedOrder);
    }
    catch (error) {
        res.status(400).json({ message: error instanceof Error ? error.message : 'Unknown error' });
    }
});
// Delete order
router.delete('/:id', async (req, res) => {
    try {
        const order = await Order_1.default.findById(req.params.id);
        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }
        await order.deleteOne();
        res.json({ message: 'Order deleted' });
    }
    catch (error) {
        res.status(500).json({ message: error instanceof Error ? error.message : 'Unknown error' });
    }
});
exports.default = router;
