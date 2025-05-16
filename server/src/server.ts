import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import pizzaRoutes from './routes/pizzaRoutes';
import orderRoutes from './routes/orderRoutes';
import Pizza from './models/Pizza';

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGODB_URI || 'error')
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Could not connect to MongoDB:', err));

app.use('/api/pizzas', pizzaRoutes);
app.use('/api/orders', orderRoutes);

const seedInitialData = async (): Promise<void> => {
  try {
    const count = await Pizza.countDocuments();
    if (count === 0) {
      const initialPizzas = [
        {
          name: "Маргарита",
          description: "Класична піца з томатним соусом, моцарелою та базиліком",
          price: 199,
          imageUrl: "https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?w=500"
        },
        {
          name: "Пепероні",
          description: "Томатний соус, моцарела та пепероні",
          price: 229,
          imageUrl: "https://images.unsplash.com/photo-1628840042765-356cda07504e?w=500"
        },
        {
          name: "Чотири сири",
          description: "Піца з чотирма видами сиру: моцарела, горгонзола, фонтана та пармезан",
          price: 259,
          imageUrl: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=500"
        },
        {
          name: "Гавайська",
          description: "Томатний соус, моцарела, шинка та ананаси",
          price: 239,
          imageUrl: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=500"
        },
        {
          name: "Карбонара",
          description: "Вершковий соус, моцарела, бекон, цибуля та пармезан",
          price: 249,
          imageUrl: "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=500"
        }
      ];
      
      await Pizza.insertMany(initialPizzas);
      console.log('Initial pizza data seeded');
    } else {
      const pizzas = await Pizza.find();
      for (const pizza of pizzas) {
        if (!pizza.imageUrl) {
          pizza.imageUrl = "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=500";
          await pizza.save();
        }
      }
    }
  } catch (error) {
    console.error('Error seeding initial data:', error);
  }
};

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  seedInitialData();
}); 