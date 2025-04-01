const db = require('./db');

const Review = {
  getByProductId: (productId, callback) => {
    const sql = 'SELECT * FROM reviews WHERE product_id = ? ORDER BY created_at DESC';
    db.query(sql, [productId], callback);
  },

  create: (userId, productId, rating, comment, callback) => {
    const sql = 'INSERT INTO reviews (user_id, product_id, rating, comment) VALUES (?, ?, ?, ?)';
    db.query(sql, [userId, productId, rating, comment], callback);
  },

  update: (userId, productId, rating, comment, callback) => {
    const sql = 'UPDATE reviews SET rating = ?, comment = ?, created_at = CURRENT_TIMESTAMP WHERE user_id = ? AND product_id = ?';
    db.query(sql, [rating, comment, userId, productId], callback);
  },

  delete: (userId, productId, callback) => {
    const sql = 'DELETE FROM reviews WHERE user_id = ? AND product_id = ?';
    db.query(sql, [userId, productId], callback);
  },

  exists: (userId, productId, callback) => {
    const sql = 'SELECT * FROM reviews WHERE user_id = ? AND product_id = ?';
    db.query(sql, [userId, productId], callback);
  },

  getAverageRating: (productId, callback) => {
    const sql = 'SELECT AVG(rating) as average FROM reviews WHERE product_id = ?';
    db.query(sql, [productId], callback);
  }
};

module.exports = Review;
