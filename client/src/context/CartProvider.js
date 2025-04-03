// frontend/context/CartProvider.js

import React, { useState, useEffect } from 'react';
import axios from 'axios';

const CartContext = React.createContext();

const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('token'));

  // Verifica si el token es válido
  const validateToken = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      setIsLoggedIn(false);
      return;
    }

    try {
      await axios.get('http://localhost:5000/api/auth/validate-token', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setIsLoggedIn(true);
    } catch (error) {
      console.warn('Token inválido o expirado. Haciendo logout automático.');
      localStorage.clear();
      setIsLoggedIn(false);
      setCart([]);
    }
  };

  const isUserLoggedIn = () => {
    return !!localStorage.getItem('token');
  };

  const loadCartFromDatabase = () => {
    const token = localStorage.getItem('token');
    axios
      .get('http://localhost:5000/api/cart', {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        setCart(response.data.cartItems);
      })
      .catch((error) => {
        console.error('Error al cargar el carrito desde la base de datos:', error);
      });
  };

  useEffect(() => {
    validateToken(); // Revisión inicial del token al cargar

    if (isLoggedIn) {
      loadCartFromDatabase();
    } else {
      const storedCart = JSON.parse(localStorage.getItem('cart')) || [];
      setCart(storedCart);
    }
  }, [isLoggedIn]);

  const addToCart = (product, selectedSize) => {
    if (isUserLoggedIn()) {
      const token = localStorage.getItem('token');
      axios
        .post(
          'http://localhost:5000/api/cart/add',
          { productId: product.id, size: selectedSize, quantity: 1 },
          { headers: { Authorization: `Bearer ${token}` } }
        )
        .then(() => {
          loadCartFromDatabase();
        })
        .catch((error) => {
          console.error('Error al agregar el producto al carrito en la base de datos:', error);
        });
    } else {
      const existingIndex = cart.findIndex(
        (item) => item.product_id === product.id && item.size === selectedSize
      );

      let updatedCart;
      if (existingIndex >= 0) {
        updatedCart = cart.map((item, index) =>
          index === existingIndex
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        const cartItem = {
          product_id: product.id,
          name: product.name,
          team: product.team,
          brand: product.brand,
          price: product.price,
          size: selectedSize,
          quantity: 1,
        };
        updatedCart = [...cart, cartItem];
      }
      setCart(updatedCart);
      localStorage.setItem('cart', JSON.stringify(updatedCart));
    }
  };

  const removeFromCart = (productId, size) => {
    if (isUserLoggedIn()) {
      const token = localStorage.getItem('token');

      axios
        .post(
          'http://localhost:5000/api/cart/remove',
          { productId, size, quantity: 1 },
          { headers: { Authorization: `Bearer ${token}` } }
        )
        .then(() => {
          loadCartFromDatabase();
        })
        .catch((error) => {
          console.error('Error al disminuir la cantidad del producto en la base de datos:', error);
        });
    } else {
      const updatedCart = cart
        .map((item) => {
          if (item.product_id === productId && item.size === size) {
            const newQuantity = item.quantity - 1;
            return newQuantity > 0 ? { ...item, quantity: newQuantity } : null;
          }
          return item;
        })
        .filter((item) => item !== null);

      setCart(updatedCart);
      localStorage.setItem('cart', JSON.stringify(updatedCart));
    }
  };

  const removeProduct = (productId, size) => {
    if (isUserLoggedIn()) {
      const token = localStorage.getItem('token');

      axios
        .post(
          'http://localhost:5000/api/cart/removeAll',
          { productId, size },
          { headers: { Authorization: `Bearer ${token}` } }
        )
        .then(() => {
          loadCartFromDatabase();
        })
        .catch((error) => {
          console.error('Error al eliminar el producto del carrito en la base de datos:', error);
        });
    } else {
      const updatedCart = cart.filter(
        (item) => !(item.product_id === productId && item.size === size)
      );
      setCart(updatedCart);
      localStorage.setItem('cart', JSON.stringify(updatedCart));
    }
  };

  const clearCart = (clearInDatabase = true) => {
    if (isUserLoggedIn()) {
      if (clearInDatabase) {
        const token = localStorage.getItem('token');
        axios
          .post(
            'http://localhost:5000/api/cart/clear',
            {},
            { headers: { Authorization: `Bearer ${token}` } }
          )
          .then(() => {
            setCart([]);
          })
          .catch((error) => {
            console.error('Error al vaciar el carrito en la base de datos:', error);
          });
      } else {
        setCart([]);
      }
    } else {
      setCart([]);
      localStorage.removeItem('cart');
    }
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        removeProduct,
        clearCart,
        isLoggedIn,
        setIsLoggedIn,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export { CartContext, CartProvider };
