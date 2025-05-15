"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const pizzaRoutes_1 = __importDefault(require("./routes/pizzaRoutes"));
const orderRoutes_1 = __importDefault(require("./routes/orderRoutes"));
const Pizza_1 = __importDefault(require("./models/Pizza"));
dotenv_1.default.config();
const app = (0, express_1.default)();
// Middleware
app.use((0, cors_1.default)());
app.use(express_1.default.json());
// MongoDB Connection
mongoose_1.default.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/pizza_shop')
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('Could not connect to MongoDB:', err));
// Routes
app.use('/api/pizzas', pizzaRoutes_1.default);
app.use('/api/orders', orderRoutes_1.default);
// Initial data seeding
const seedInitialData = async () => {
    try {
        const count = await Pizza_1.default.countDocuments();
        if (count === 0) {
            const initialPizzas = [
                {
                    name: "Margherita",
                    description: "Classic tomato sauce, mozzarella, and basil",
                    price: 12.99
                },
                {
                    name: "Pepperoni",
                    description: "Tomato sauce, mozzarella, and pepperoni",
                    price: 14.99
                },
                {
                    name: "Quattro Formaggi",
                    description: "Four cheese pizza with mozzarella, gorgonzola, fontina, and parmesan",
                    price: 16.99
                }
            ];
            await Pizza_1.default.insertMany(initialPizzas);
            console.log('Initial pizza data seeded');
        }
    }
    catch (error) {
        console.error('Error seeding initial data:', error);
    }
};
// Start server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    seedInitialData();
});
