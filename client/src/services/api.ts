import axios from 'axios';
import { Order, Pizza } from '../types';

const API_URL = 'http://localhost:3001';

export const api = {
    getPizzas: () => axios.get<Pizza[]>(`${API_URL}/api/pizzas`),
    getPizza: (id: string) => axios.get<Pizza>(`${API_URL}/api/pizzas/${id}`),

    getOrders: () => axios.get<Order[]>(`${API_URL}/api/orders`),
    getOrder: (id: string) => axios.get<Order>(`${API_URL}/api/orders/${id}`),
    createOrder: (order: Omit<Order, 'id' | 'createdAt'>) => 
        axios.post<Order>(`${API_URL}/api/orders`, order),
    updateOrder: (id: string, order: Partial<Order>) => 
        axios.patch<Order>(`${API_URL}/api/orders/${id}`, order),
    deleteOrder: (id: string) => 
        axios.delete(`${API_URL}/api/orders/${id}`),
}; 