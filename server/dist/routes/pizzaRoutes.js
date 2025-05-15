"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const Pizza_1 = __importDefault(require("../models/Pizza"));
const router = express_1.default.Router();
// Get all pizzas
router.get('/', async (_req, res) => {
    try {
        const pizzas = await Pizza_1.default.find();
        res.json(pizzas);
    }
    catch (error) {
        res.status(500).json({ message: error instanceof Error ? error.message : 'Unknown error' });
    }
});
// Get one pizza
router.get('/:id', async (req, res) => {
    try {
        const pizza = await Pizza_1.default.findById(req.params.id);
        if (!pizza) {
            return res.status(404).json({ message: 'Pizza not found' });
        }
        res.json(pizza);
    }
    catch (error) {
        res.status(500).json({ message: error instanceof Error ? error.message : 'Unknown error' });
    }
});
// Create pizza
router.post('/', async (req, res) => {
    const pizza = new Pizza_1.default({
        name: req.body.name,
        description: req.body.description,
        price: req.body.price
    });
    try {
        const newPizza = await pizza.save();
        res.status(201).json(newPizza);
    }
    catch (error) {
        res.status(400).json({ message: error instanceof Error ? error.message : 'Unknown error' });
    }
});
// Update pizza
router.patch('/:id', async (req, res) => {
    try {
        const pizza = await Pizza_1.default.findById(req.params.id);
        if (!pizza) {
            return res.status(404).json({ message: 'Pizza not found' });
        }
        if (req.body.name)
            pizza.name = req.body.name;
        if (req.body.description)
            pizza.description = req.body.description;
        if (req.body.price)
            pizza.price = req.body.price;
        const updatedPizza = await pizza.save();
        res.json(updatedPizza);
    }
    catch (error) {
        res.status(400).json({ message: error instanceof Error ? error.message : 'Unknown error' });
    }
});
// Delete pizza
router.delete('/:id', async (req, res) => {
    try {
        const pizza = await Pizza_1.default.findById(req.params.id);
        if (!pizza) {
            return res.status(404).json({ message: 'Pizza not found' });
        }
        await pizza.deleteOne();
        res.json({ message: 'Pizza deleted' });
    }
    catch (error) {
        res.status(500).json({ message: error instanceof Error ? error.message : 'Unknown error' });
    }
});
exports.default = router;
