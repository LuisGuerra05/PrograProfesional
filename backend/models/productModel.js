const db = require('./db'); // Asume que tienes un archivo 'db.js' para la conexión a la base de datos

const Product = {
  // Obtener producto por ID
  getProductById: (productId, callback) => {
    const sql = 'SELECT * FROM products WHERE id = ?';
    db.query(sql, [productId], (err, result) => {
      if (err) {
        return callback(err);
      }
      callback(null, result[0]);
    });
  },

  // Otra función de ejemplo
  getAllProducts: (callback) => {
    const sql = 'SELECT * FROM products';
    db.query(sql, (err, results) => {
      if (err) {
        return callback(err);
      }
      callback(null, results);
    });
  }
};

module.exports = Product;
