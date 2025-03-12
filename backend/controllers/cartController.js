// backend/controllers/cartController.js

const Cart = require('../models/cartModel');

exports.getCart = (req, res) => {
  const userId = req.user.id;
  Cart.getCart(userId, (err, cartItems) => {
    if (err) return res.status(500).json({ message: 'Error al obtener el carrito' });
    res.json({ cartItems });
  });
};

exports.addToCart = (req, res) => {
  const userId = req.user.id;
  const { productId, size, quantity } = req.body;
  Cart.addToCart(userId, productId, size, quantity, (err) => {
    if (err) return res.status(500).json({ message: 'Error al agregar al carrito' });
    res.json({ message: 'Producto agregado al carrito' });
  });
};

exports.removeFromCart = (req, res) => {
  const userId = req.user.id;
  const { productId, size, quantity = 1 } = req.body;
  Cart.removeItemFromCart(userId, productId, size, quantity, (err) => {
    if (err) return res.status(500).json({ message: 'Error al eliminar del carrito' });
    res.json({ message: 'Cantidad actualizada en el carrito' });
  });
};

exports.removeAllFromCart = (req, res) => {
  const userId = req.user.id;
  const { productId, size } = req.body;
  Cart.removeAllItemsFromCart(userId, productId, size, (err) => {
    if (err) return res.status(500).json({ message: 'Error al eliminar del carrito' });
    res.json({ message: 'Producto eliminado del carrito' });
  });
};

exports.clearCart = (req, res) => {
  const userId = req.user.id;
  Cart.clearCart(userId, (err) => {
    if (err) return res.status(500).json({ message: 'Error al vaciar el carrito' });
    res.json({ message: 'Carrito vaciado' });
  });
};

// Nueva función para combinar carritos
exports.mergeCarts = (req, res) => {
  const userId = req.user.id;
  const guestCart = req.body.guestCart;

  if (!Array.isArray(guestCart) || guestCart.length === 0) {
    return res.status(400).json({ message: 'El carrito de invitado está vacío.' });
  }

  Cart.mergeCarts(userId, guestCart, (err) => {
    if (err) {
      console.error('Error al combinar los carritos:', err);
      return res.status(500).json({ message: 'Error al combinar los carritos.' });
    }
    res.json({ message: 'Carritos combinados exitosamente.' });
  });
};
