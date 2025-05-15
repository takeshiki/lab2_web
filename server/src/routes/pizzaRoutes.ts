import express, { Request, Response } from 'express';
import Pizza from '../models/Pizza';

const router = express.Router();

router.get('/', async (_req: Request, res: Response) => {
  try {
    const pizzas = await Pizza.find();
    res.json(pizzas);
  } catch (error) {
    res.status(500).json({ message: error instanceof Error ? error.message : 'Unknown error' });
  }
});

router.get('/:id', async (req: Request, res: Response) => {
  try {
    const pizza = await Pizza.findById(req.params.id);
    if (!pizza) {
      return res.status(404).json({ message: 'Pizza not found' });
    }
    res.json(pizza);
  } catch (error) {
    res.status(500).json({ message: error instanceof Error ? error.message : 'Unknown error' });
  }
});

router.post('/', async (req: Request, res: Response) => {
  const pizza = new Pizza({
    name: req.body.name,
    description: req.body.description,
    price: req.body.price
  });

  try {
    const newPizza = await pizza.save();
    res.status(201).json(newPizza);
  } catch (error) {
    res.status(400).json({ message: error instanceof Error ? error.message : 'Unknown error' });
  }
});

router.patch('/:id', async (req: Request, res: Response) => {
  try {
    const pizza = await Pizza.findById(req.params.id);
    if (!pizza) {
      return res.status(404).json({ message: 'Pizza not found' });
    }

    if (req.body.name) pizza.name = req.body.name;
    if (req.body.description) pizza.description = req.body.description;
    if (req.body.price) pizza.price = req.body.price;

    const updatedPizza = await pizza.save();
    res.json(updatedPizza);
  } catch (error) {
    res.status(400).json({ message: error instanceof Error ? error.message : 'Unknown error' });
  }
});

router.delete('/:id', async (req: Request, res: Response) => {
  try {
    const pizza = await Pizza.findById(req.params.id);
    if (!pizza) {
      return res.status(404).json({ message: 'Pizza not found' });
    }
    await pizza.deleteOne();
    res.json({ message: 'Pizza deleted' });
  } catch (error) {
    res.status(500).json({ message: error instanceof Error ? error.message : 'Unknown error' });
  }
});

export default router; 