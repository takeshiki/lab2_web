import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Order } from '../types';
import { api } from '../services/api';
import './OrderList.css';

export const OrderList: React.FC = () => {
    const [orders, setOrders] = useState<Order[]>([]);
    const [error, setError] = useState<string>('');
    const navigate = useNavigate();

    const loadOrders = async () => {
        try {
            const response = await api.getOrders();
            const ordersData = response.data.map((order: any) => ({
                ...order,
                id: order.id ?? order._id
            }));
            setOrders(ordersData);
            setError('');
        } catch (err) {
            setError('Помилка при завантаженні замовлень');
        }
    };

    useEffect(() => {
        loadOrders();
    }, []);

    const handleDelete = async (id: string) => {
        try {
            await api.deleteOrder(id);
            await loadOrders();
            setError('');
        } catch (err) {
            setError('Помилка при видаленні замовлення');
        }
    };

    return (
        <div className="order-list-container">
            <div className="order-list-header">
                <h1>Список замовлень</h1>
                
                {error && (
                    <div className="error-message">
                        {error}
                    </div>
                )}

                <button 
                    className="create-button"
                    onClick={() => navigate('/orders/new')}
                >
                    Створити нове замовлення
                </button>
            </div>

            <div className="table-container">
                <table className="orders-table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Ім'я клієнта</th>
                            <th>Телефон</th>
                            <th>Статус</th>
                            <th>Загальна сума</th>
                            <th>Дії</th>
                        </tr>
                    </thead>
                    <tbody>
                        {orders.map((order) => (
                            <tr key={order.id}>
                                <td>{order.id}</td>
                                <td>{order.customerName}</td>
                                <td>{order.customerPhone}</td>
                                <td>{order.status}</td>
                                <td>{order.totalPrice} грн</td>
                                <td>
                                    <button 
                                        className="view-button"
                                        onClick={() => order.id ? navigate(`/orders/${order.id}`) : setError('ID замовлення відсутній')}
                                    >
                                        Переглянути
                                    </button>
                                    <button 
                                        className="delete-button"
                                        onClick={() => handleDelete(order.id)}
                                    >
                                        Видалити
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}; 