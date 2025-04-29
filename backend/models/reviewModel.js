const db = require('./db.promise');

const Review = {
  // Obtener todas las reseñas de un producto
  getByProductId: async (productId) => {
    const [rows] = await db.query(
      'SELECT * FROM reviews WHERE product_id = ? ORDER BY created_at DESC',
      [productId]
    );
    return rows;
  },

  // Crear una nueva reseña
  create: async (userId, productId, rating, comment) => {
    const [result] = await db.query(
      'INSERT INTO reviews (user_id, product_id, rating, comment) VALUES (?, ?, ?, ?)',
      [userId, productId, rating, comment]
    );
    return result;
  },

  // Actualizar una reseña existente
  update: async (userId, productId, rating, comment) => {
    const [result] = await db.query(
      'UPDATE reviews SET rating = ?, comment = ?, created_at = CURRENT_TIMESTAMP WHERE user_id = ? AND product_id = ?',
      [rating, comment, userId, productId]
    );
    return result;
  },

  // Eliminar una reseña
  delete: async (userId, productId) => {
    const [result] = await db.query(
      'DELETE FROM reviews WHERE user_id = ? AND product_id = ?',
      [userId, productId]
    );
    return result;
  },

  // Verificar si existe una reseña de un usuario para un producto
  exists: async (userId, productId) => {
    const [rows] = await db.query(
      'SELECT * FROM reviews WHERE user_id = ? AND product_id = ?',
      [userId, productId]
    );
    return rows;
  },

  // Obtener el promedio de calificaciones de un producto
  getAverageRating: async (productId) => {
    const [rows] = await db.query(
      'SELECT AVG(rating) as average FROM reviews WHERE product_id = ?',
      [productId]
    );
    return rows[0];
  },

  // Obtener la distribución de calificaciones (cuántas reseñas hay de 1, 2, 3, 4 y 5 estrellas)
  getRatingDistribution: async (productId) => {
    const [rows] = await db.query(
      `
      SELECT rating, COUNT(*) as count
      FROM reviews
      WHERE product_id = ?
      GROUP BY rating
      `,
      [productId]
    );
    return rows;
  }
};

module.exports = Review;
