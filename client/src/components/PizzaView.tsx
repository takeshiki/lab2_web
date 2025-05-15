import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Pizza } from '../types';
import { api } from '../services/api';

export const PizzaView: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [pizza, setPizza] = useState<Pizza | null>(null);
    const [error, setError] = useState<string>('');

    useEffect(() => {
        const loadPizza = async () => {
            try {
                const response = await api.getPizza(id!);
                // Мапінг id, якщо бекенд повертає _id
                const pizzaData = {
                    ...response.data,
                    id: response.data.id ?? (response.data as any)._id
                };
                setPizza(pizzaData);
            } catch (err) {
                setError('Помилка при завантаженні даних');
            }
        };
        loadPizza();
    }, [id]);

    if (error) {
        return <div className="error-message">{error}</div>;
    }

    if (!pizza) {
        return <div>Завантаження...</div>;
    }

    return (
        <div className="pizza-view">
            <h1>{pizza.name}</h1>
            <p>{pizza.description}</p>
            <p>Ціна: {pizza.price} грн</p>
            <img src={pizza.imageUrl} alt={pizza.name} />
        </div>
    );
}; 