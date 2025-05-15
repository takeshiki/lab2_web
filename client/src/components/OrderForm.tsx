import React, { useEffect, useState, ChangeEvent } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Order, Pizza, OrderPizza } from '../types';
import { api } from '../services/api';
import './OrderForm.css';

export const OrderForm: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [error, setError] = useState<string>('');
    const [pizzas, setPizzas] = useState<Pizza[]>([]);
    const [order, setOrder] = useState<Partial<Order>>({
        customerName: '',
        customerPhone: '',
        address: '',
        status: 'pending',
        pizzas: [],
        totalPrice: 0,
    });

    useEffect(() => {
        const loadData = async () => {
            try {
                const pizzasResponse = await api.getPizzas();
                const pizzasData = pizzasResponse.data.map((p: any) => ({
                    ...p,
                    id: p.id ?? p._id
                }));
                setPizzas(pizzasData);

                if (id && id !== 'new') {
                    const orderResponse = await api.getOrder(id);
                    const orderData = orderResponse.data;
                    // Map the populated pizza data to the correct format
                    const mappedPizzas = orderData.pizzas.map((p: any) => ({
                        pizzaId: p.pizzaId._id || p.pizzaId,
                        quantity: p.quantity,
                        pizza: {
                            id: p.pizzaId._id || p.pizzaId,
                            name: p.pizzaId.name,
                            description: p.pizzaId.description,
                            price: p.pizzaId.price,
                            imageUrl: p.pizzaId.imageUrl
                        }
                    }));
                    setOrder({
                        ...orderData,
                        pizzas: mappedPizzas
                    });
                }
            } catch (err) {
                setError('Помилка при завантаженні даних');
            }
        };
        loadData();
    }, [id]);

    const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setOrder(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleAddPizza = () => {
        if (pizzas.length === 0 || !pizzas[0].id) {
            setError('Список піц некоректний');
            return;
        }
        setOrder(prev => ({
            ...prev,
            pizzas: [...(prev.pizzas || []), { pizzaId: pizzas[0].id.toString(), quantity: 1 }]
        }));
    };

    const handlePizzaChange = (index: number, field: keyof OrderPizza, value: string | number) => {
        setOrder(prev => {
            const newPizzas = [...(prev.pizzas || [])];
            newPizzas[index] = { ...newPizzas[index], [field]: value };
            return { ...prev, pizzas: newPizzas };
        });
    };

    const handleRemovePizza = (index: number) => {
        setOrder(prev => ({
            ...prev,
            pizzas: prev.pizzas?.filter((_, i) => i !== index)
        }));
    };

    const calculateTotal = () => {
        return order.pizzas?.reduce((total, orderPizza) => {
            const pizza = pizzas.find(p => p.id.toString() === orderPizza.pizzaId.toString());
            return total + (pizza?.price || 0) * orderPizza.quantity;
        }, 0) || 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const orderData = {
                ...order,
                totalPrice: calculateTotal()
            };

            if (id && id !== 'new') {
                await api.updateOrder(id, orderData);
            } else {
                await api.createOrder(orderData as Omit<Order, 'id' | 'createdAt'>);
            }
            navigate('/orders');
        } catch (err) {
            setError('Помилка при збереженні замовлення');
        }
    };

    return (
        <div className="order-form-container">
            <form onSubmit={handleSubmit} className="order-form">
                <h1>{id && id !== 'new' ? 'Редагувати замовлення' : 'Нове замовлення'}</h1>
                
                {error && <div className="error-message">{error}</div>}

                <div className="form-group">
                    <label htmlFor="customerName">Ім'я клієнта</label>
                    <input
                        type="text"
                        id="customerName"
                        name="customerName"
                        value={order.customerName}
                        onChange={handleInputChange}
                        required
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="customerPhone">Телефон</label>
                    <input
                        type="tel"
                        id="customerPhone"
                        name="customerPhone"
                        value={order.customerPhone}
                        onChange={handleInputChange}
                        required
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="address">Адреса</label>
                    <input
                        type="text"
                        id="address"
                        name="address"
                        value={order.address}
                        onChange={handleInputChange}
                        required
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="status">Статус</label>
                    <select
                        id="status"
                        name="status"
                        value={order.status}
                        onChange={handleInputChange}
                    >
                        <option value="pending">Очікує</option>
                        <option value="preparing">Готується</option>
                        <option value="delivering">Доставляється</option>
                        <option value="completed">Завершено</option>
                    </select>
                </div>

                <div className="pizzas-section">
                    <h2>Піци</h2>
                    <button
                        type="button"
                        className="add-pizza-button"
                        onClick={handleAddPizza}
                    >
                        Додати піцу
                    </button>

                    <div className="pizzas-list">
                        {order.pizzas?.map((orderPizza, index) => (
                            <div key={index} className="pizza-item">
                                <div className="pizza-select">
                                    <select
                                        value={orderPizza.pizzaId}
                                        onChange={(e) => handlePizzaChange(index, 'pizzaId', e.target.value)}
                                    >
                                        {pizzas.map((pizza) => (
                                            <option key={pizza.id} value={pizza.id.toString()}>
                                                {pizza.name} - {pizza.price} грн
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div className="pizza-quantity">
                                    <input
                                        type="number"
                                        min="1"
                                        value={orderPizza.quantity}
                                        onChange={(e) => handlePizzaChange(index, 'quantity', Number(e.target.value))}
                                    />
                                </div>
                                <button
                                    type="button"
                                    className="remove-pizza-button"
                                    onClick={() => handleRemovePizza(index)}
                                >
                                    ×
                                </button>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="total-price">
                    <h2>Загальна сума: {calculateTotal()} грн</h2>
                </div>

                <div className="form-actions">
                    <button type="submit" className="submit-button">
                        {id && id !== 'new' ? 'Зберегти зміни' : 'Створити замовлення'}
                    </button>
                    <button
                        type="button"
                        className="cancel-button"
                        onClick={() => navigate('/orders')}
                    >
                        Скасувати
                    </button>
                </div>
            </form>
        </div>
    );
}; 