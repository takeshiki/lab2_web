import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { OrderList } from './components/OrderList';
import { OrderForm } from './components/OrderForm';
import { PizzaView } from './components/PizzaView';
import { PizzaList } from './components/PizzaList';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <header className="app-header">
          <nav>
            <h1 className="app-title">Pizza Shop</h1>
            <div>
              <Link to="/" className="nav-link">Меню</Link>
              <Link to="/orders" className="nav-link">Замовлення</Link>
            </div>
          </nav>
        </header>
        <main className="app-container">
          <Routes>
            <Route path="/" element={<PizzaList />} />
            <Route path="/orders" element={<OrderList />} />
            <Route path="/orders/new" element={<OrderForm />} />
            <Route path="/orders/:id" element={<OrderForm />} />
            <Route path="/pizzas/:id" element={<PizzaView />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
