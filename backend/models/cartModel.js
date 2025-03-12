// backend/models/cartModel.js

const db = require('../models/db');
const async = require('async');

const Cart = {
  getCart: (userId, callback) => {
    const sql = `
      SELECT ci.product_id, ci.quantity, ci.size, p.name, p.team, p.brand, p.price
      FROM cart_items ci
      JOIN carts c ON ci.cart_id = c.id
      JOIN products p ON ci.product_id = p.id
      WHERE c.user_id = ?
    `;
    db.query(sql, [userId], callback);
  },

  addToCart: (userId, productId, size, quantity, callback) => {
    // Verificar si el usuario ya tiene un carrito
    const sqlCheckCart = 'SELECT id FROM carts WHERE user_id = ?';
    db.query(sqlCheckCart, [userId], (err, results) => {
      if (err) return callback(err);

      let cartId;
      if (results.length > 0) {
        cartId = results[0].id;
      } else {
        // Crear un nuevo carrito
        const sqlCreateCart = 'INSERT INTO carts (user_id) VALUES (?)';
        db.query(sqlCreateCart, [userId], (err, result) => {
          if (err) return callback(err);
          cartId = result.insertId;
        });
      }

      // Verificar si el producto ya está en el carrito
      const sqlCheckItem = `
        SELECT id FROM cart_items 
        WHERE cart_id = ? AND product_id = ? AND size = ?
      `;
      db.query(sqlCheckItem, [cartId, productId, size], (err, results) => {
        if (err) return callback(err);

        if (results.length > 0) {
          // Actualizar la cantidad
          const sqlUpdateItem = `
            UPDATE cart_items 
            SET quantity = quantity + ? 
            WHERE cart_id = ? AND product_id = ? AND size = ?
          `;
          db.query(sqlUpdateItem, [quantity, cartId, productId, size], callback);
        } else {
          // Insertar el nuevo item
          const sqlInsertItem = `
            INSERT INTO cart_items (cart_id, product_id, size, quantity)
            VALUES (?, ?, ?, ?)
          `;
          db.query(sqlInsertItem, [cartId, productId, size, quantity], callback);
        }
      });
    });
  },

  removeItemFromCart: (userId, productId, size, quantity, callback) => {
    const sqlUpdate = `
      UPDATE cart_items ci
      JOIN carts c ON ci.cart_id = c.id
      SET ci.quantity = ci.quantity - ?
      WHERE c.user_id = ? AND ci.product_id = ? AND ci.size = ? AND ci.quantity >= ?
    `;
    db.query(sqlUpdate, [quantity, userId, productId, size, quantity], (err, result) => {
      if (err) return callback(err);

      // Si la cantidad es menor o igual a cero, eliminamos el registro
      const sqlDelete = `
        DELETE ci FROM cart_items ci
        JOIN carts c ON ci.cart_id = c.id
        WHERE c.user_id = ? AND ci.product_id = ? AND ci.size = ? AND ci.quantity <= 0
      `;
      db.query(sqlDelete, [userId, productId, size], callback);
    });
  },

  removeAllItemsFromCart: (userId, productId, size, callback) => {
    const sql = `
      DELETE ci FROM cart_items ci
      JOIN carts c ON ci.cart_id = c.id
      WHERE c.user_id = ? AND ci.product_id = ? AND ci.size = ?
    `;
    db.query(sql, [userId, productId, size], callback);
  },

  clearCart: (userId, callback) => {
    const sql = `
      DELETE ci FROM cart_items ci
      JOIN carts c ON ci.cart_id = c.id
      WHERE c.user_id = ?
    `;
    db.query(sql, [userId], callback);
  },

  // Nueva función para combinar carritos
  mergeCarts: (userId, guestCart, callback) => {
    // Primero, obtenemos el carrito actual del usuario
    const getCartIdSql = 'SELECT id FROM carts WHERE user_id = ?';
    db.query(getCartIdSql, [userId], (err, results) => {
      if (err) return callback(err);

      let cartId;
      if (results.length > 0) {
        // El usuario ya tiene un carrito
        cartId = results[0].id;
      } else {
        // El usuario no tiene carrito, creamos uno nuevo
        const createCartSql = 'INSERT INTO carts (user_id) VALUES (?)';
        db.query(createCartSql, [userId], (err, result) => {
          if (err) return callback(err);
          cartId = result.insertId;
        });
      }

      // Una vez que tenemos el cartId, procedemos a combinar los carritos
      const tasks = guestCart.map((item) => {
        return (cb) => {
          const { product_id, size, quantity } = item;

          // Verificamos si el producto ya existe en el carrito del usuario
          const checkItemSql = `
            SELECT * FROM cart_items 
            WHERE cart_id = ? AND product_id = ? AND size = ?
          `;
          db.query(checkItemSql, [cartId, product_id, size], (err, results) => {
            if (err) return cb(err);

            if (results.length > 0) {
              // Si existe, actualizamos la cantidad
              const updateItemSql = `
                UPDATE cart_items 
                SET quantity = quantity + ? 
                WHERE cart_id = ? AND product_id = ? AND size = ?
              `;
              db.query(updateItemSql, [quantity, cartId, product_id, size], cb);
            } else {
              // Si no existe, lo insertamos
              const insertItemSql = `
                INSERT INTO cart_items (cart_id, product_id, size, quantity) 
                VALUES (?, ?, ?, ?)
              `;
              db.query(insertItemSql, [cartId, product_id, size, quantity], cb);
            }
          });
        };
      });

      // Ejecutamos las tareas en serie
      async.series(tasks, callback);
    });
  },
};

module.exports = Cart;
