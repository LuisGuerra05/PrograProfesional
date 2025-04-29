const db = require('../models/db.promise');

const Cart = {
  // Obtener todos los productos del carrito de un usuario
  getCart: async (userId) => {
    const sql = `
      SELECT ci.product_id, ci.quantity, ci.size, p.name, p.team, p.brand, p.price
      FROM cart_items ci
      JOIN carts c ON ci.cart_id = c.id
      JOIN products p ON ci.product_id = p.id
      WHERE c.user_id = ?
    `;
    const [rows] = await db.query(sql, [userId]);
    return rows;
  },

  // Agregar un producto al carrito (crea carrito si no existe)
  addToCart: async (userId, productId, size, quantity) => {
    // Buscar carrito del usuario
    const [cartRows] = await db.query('SELECT id FROM carts WHERE user_id = ?', [userId]);
    let cartId = cartRows.length > 0 ? cartRows[0].id : null;

    // Si no existe, crear carrito nuevo
    if (!cartId) {
      const [result] = await db.query('INSERT INTO carts (user_id) VALUES (?)', [userId]);
      cartId = result.insertId;
    }

    // Buscar si el ítem ya existe en el carrito
    const [itemRows] = await db.query(
      'SELECT id FROM cart_items WHERE cart_id = ? AND product_id = ? AND size = ?',
      [cartId, productId, size]
    );

    // Si existe, actualizar cantidad
    if (itemRows.length > 0) {
      await db.query(
        'UPDATE cart_items SET quantity = quantity + ? WHERE cart_id = ? AND product_id = ? AND size = ?',
        [quantity, cartId, productId, size]
      );
    } else {
      // Si no existe, insertar nuevo ítem
      await db.query(
        'INSERT INTO cart_items (cart_id, product_id, size, quantity) VALUES (?, ?, ?, ?)',
        [cartId, productId, size, quantity]
      );
    }
  },

  // Remover una cantidad específica de un producto del carrito
  removeItemFromCart: async (userId, productId, size, quantity) => {
    // Disminuir la cantidad
    await db.query(`
      UPDATE cart_items ci
      JOIN carts c ON ci.cart_id = c.id
      SET ci.quantity = ci.quantity - ?
      WHERE c.user_id = ? AND ci.product_id = ? AND ci.size = ? AND ci.quantity >= ?
    `, [quantity, userId, productId, size, quantity]);

    // Eliminar el ítem si la cantidad llegó a 0
    await db.query(`
      DELETE ci FROM cart_items ci
      JOIN carts c ON ci.cart_id = c.id
      WHERE c.user_id = ? AND ci.product_id = ? AND ci.size = ? AND ci.quantity <= 0
    `, [userId, productId, size]);
  },

  // Eliminar por completo un producto del carrito (sin importar cantidad)
  removeAllItemsFromCart: async (userId, productId, size) => {
    await db.query(`
      DELETE ci FROM cart_items ci
      JOIN carts c ON ci.cart_id = c.id
      WHERE c.user_id = ? AND ci.product_id = ? AND ci.size = ?
    `, [userId, productId, size]);
  },

  // Vaciar completamente el carrito del usuario
  clearCart: async (userId) => {
    await db.query(`
      DELETE ci FROM cart_items ci
      JOIN carts c ON ci.cart_id = c.id
      WHERE c.user_id = ?
    `, [userId]);
  },

  // Combinar el carrito de invitado con el carrito del usuario registrado
  mergeCarts: async (userId, guestCart) => {
    // Buscar o crear carrito del usuario
    const [cartRows] = await db.query('SELECT id FROM carts WHERE user_id = ?', [userId]);
    let cartId = cartRows.length > 0 ? cartRows[0].id : null;

    if (!cartId) {
      const [result] = await db.query('INSERT INTO carts (user_id) VALUES (?)', [userId]);
      cartId = result.insertId;
    }

    // Insertar o actualizar cada ítem del carrito de invitado
    for (const item of guestCart) {
      const { product_id, size, quantity } = item;
      const [existingRows] = await db.query(
        'SELECT id FROM cart_items WHERE cart_id = ? AND product_id = ? AND size = ?',
        [cartId, product_id, size]
      );

      if (existingRows.length > 0) {
        await db.query(
          'UPDATE cart_items SET quantity = quantity + ? WHERE cart_id = ? AND product_id = ? AND size = ?',
          [quantity, cartId, product_id, size]
        );
      } else {
        await db.query(
          'INSERT INTO cart_items (cart_id, product_id, size, quantity) VALUES (?, ?, ?, ?)',
          [cartId, product_id, size, quantity]
        );
      }
    }
  }
};

module.exports = Cart;
