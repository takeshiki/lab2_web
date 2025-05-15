export interface Pizza {
    id: number;
    name: string;
    description: string;
    price: number;
    imageUrl: string;
}

export interface Order {
    id: string;
    customerName: string;
    customerPhone: string;
    address: string;
    status: 'pending' | 'preparing' | 'delivering' | 'completed';
    pizzas: OrderPizza[];
    totalPrice: number;
    createdAt: string;
}

export interface OrderPizza {
    pizzaId: string;
    quantity: number;
    pizza?: Pizza;
} 