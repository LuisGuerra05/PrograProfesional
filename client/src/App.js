import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import Layout from './components/common/Layout';
import HomePage from './pages/HomePage/HomePage';
import Register from './components/user/Register';
import Login from './components/user/Login';
import UserList from './components/user/UserList';
import ProductPage from './pages/ProductsPage/ProductsPage';
import ProductDetail from './components/product/ProductDetail';
import Cart from './pages/Cart/Cart';
import Profile from './components/user/Profile';
import AboutUs from './pages/AboutUs/AboutUs';
import ProtectedRoute from './routes/ProtectedRoute';
import { CartProvider } from './context/CartProvider';


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
