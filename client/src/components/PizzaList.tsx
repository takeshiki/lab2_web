import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Pizza } from '../types';
import { api } from '../services/api';
import './PizzaList.css';

export const PizzaList: React.FC = () => {
    const [pizzas, setPizzas] = useState<Pizza[]>([]);
    const [error, setError] = useState<string>('');

    useEffect(() => {
        const loadPizzas = async () => {
            try {
                const response = await api.getPizzas();
                const pizzasData = response.data.map((p: any) => ({
                    ...p,
                    id: p.id ?? p._id
                }));
                setPizzas(pizzasData);
            } catch (err) {
                setError('Помилка при завантаженні піц');
            }
        };
        loadPizzas();
    }, []);

    if (error) {
        return <div className="error-message">{error}</div>;
    }

    return (
        <div className="pizza-list">
            <h1>Наше меню</h1>
            <div className="pizza-grid">
                {pizzas.map((pizza) => (
                    <Link to={`/pizzas/${pizza.id}`} key={pizza.id} className="pizza-card">
                        <div className="pizza-image">
                            <img src={pizza.imageUrl} alt={pizza.name} />
                        </div>
                        <div className="pizza-info">
                            <h2>{pizza.name}</h2>
                            <p>{pizza.description}</p>
                            <p className="pizza-price">{pizza.price} грн</p>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
}; 