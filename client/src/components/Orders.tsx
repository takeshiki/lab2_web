import React, { useEffect, useState } from 'react';
import axios from 'axios';

interface Order {
  _id: string;
  customerName: string;
  items: {
    pizza: {
      name: string;
      price: number;
    };
    quantity: number;
  }[];
  totalAmount: number;
  status: string;
  createdAt: string;
}

const Orders: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get('http://localhost:3001/api/orders');
        setOrders(response.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch orders');
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  if (loading) return <div>Loading orders...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="orders-container">
      <h2>Orders</h2>
      {orders.length === 0 ? (
        <p>No orders found</p>
      ) : (
        <div className="orders-list">
          {orders.map((order) => (
            <div key={order._id} className="order-card">
              <h3>Order #{order._id}</h3>
              <p>Customer: {order.customerName}</p>
              <p>Status: {order.status}</p>
              <p>Total: ${order.totalAmount.toFixed(2)}</p>
              <div className="order-items">
                <h4>Items:</h4>
                {order.items.map((item, index) => (
                  <div key={index} className="order-item">
                    <span>{item.pizza.name}</span>
                    <span>x{item.quantity}</span>
                    <span>${(item.pizza.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>
              <p>Ordered on: {new Date(order.createdAt).toLocaleString()}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Orders; 