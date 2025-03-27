import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import Layout from './Layout';
import HomePage from './HomePage';
import Register from './components/Register';
import Login from './components/Login';
import UserList from './components/UserList';
import ProductPage from './components/ProductsPage';
import ProductDetail from './components/ProductDetail';
import Cart from './components/Cart';
import Profile from './components/Profile';
import AboutUs from './components/AboutUs';
import ProtectedRoute from './ProtectedRoute';
import { CartProvider } from './context/CartProvider'; // Importa el CartProvider


function App() {
  return (
    <CartProvider> {/* Envolver la aplicación con el CartProvider */}
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route path="/users" element={<UserList />} />
            <Route path="/products" element={<ProductPage />} />
            <Route path="/about" element={<AboutUs />} />
            <Route path="/product/:id" element={<ProductDetail />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/profile" element={<ProtectedRoute> <Profile /> </ProtectedRoute>} />
          </Routes>
        </Layout>
      </Router>
    </CartProvider>
  );
}

export default App;
