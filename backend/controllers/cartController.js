const Cart = require('../models/cartModel');

// Obtener carrito del usuario autenticado
exports.getCart = async (req, res) => {
  try {
    const cartItems = await Cart.getCart(req.user.id);
    res.json({ cartItems });
  } catch (err) {
    console.error('Error al obtener el carrito:', err);
    res.status(500).json({ message: 'Error al obtener el carrito' });
  }
};

// Agregar producto al carrito del usuario
exports.addToCart = async (req, res) => {
  try {
    const { productId, size, quantity } = req.body;
    await Cart.addToCart(req.user.id, productId, size, quantity);
    res.json({ message: 'Producto agregado al carrito' });
  } catch (err) {
    console.error('Error al agregar al carrito:', err);
    res.status(500).json({ message: 'Error al agregar al carrito' });
  }
};

// Remover cantidad de un producto del carrito
exports.removeFromCart = async (req, res) => {
  try {
    const { productId, size, quantity = 1 } = req.body;
    await Cart.removeItemFromCart(req.user.id, productId, size, quantity);
    res.json({ message: 'Cantidad actualizada en el carrito' });
  } catch (err) {
    console.error('Error al eliminar del carrito:', err);
    res.status(500).json({ message: 'Error al eliminar del carrito' });
  }
};

// Eliminar un producto completo del carrito
exports.removeAllFromCart = async (req, res) => {
  try {
    const { productId, size } = req.body;
    await Cart.removeAllItemsFromCart(req.user.id, productId, size);
    res.json({ message: 'Producto eliminado del carrito' });
  } catch (err) {
    console.error('Error al eliminar producto del carrito:', err);
    res.status(500).json({ message: 'Error al eliminar del carrito' });
  }
};

// Vaciar el carrito completo
exports.clearCart = async (req, res) => {
  try {
    await Cart.clearCart(req.user.id);
    res.json({ message: 'Carrito vaciado' });
  } catch (err) {
    console.error('Error al vaciar el carrito:', err);
    res.status(500).json({ message: 'Error al vaciar el carrito' });
  }
};

// Combinar carrito de invitado con carrito de usuario autenticado
exports.mergeCarts = async (req, res) => {
  try {
    const guestCart = req.body.guestCart;

    if (!Array.isArray(guestCart) || guestCart.length === 0) {
      return res.status(400).json({ message: 'El carrito de invitado está vacío.' });
    }

    await Cart.mergeCarts(req.user.id, guestCart);
    res.json({ message: 'Carritos combinados exitosamente.' });
  } catch (err) {
    console.error('Error al combinar los carritos:', err);
    res.status(500).json({ message: 'Error al combinar los carritos.' });
  }
};
