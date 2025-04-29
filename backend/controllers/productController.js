const db = require('../models/db.promise'); // Usamos el pool de mysql2/promise

// Obtener todos los productos
const getAllProducts = async (req, res) => {
  try {
    const [results] = await db.query('SELECT * FROM products');
    res.json(results);
  } catch (err) {
    console.error('🔥 Error en GET /api/products:', err);
    res.status(500).json({ message: 'Error en el servidor' });
  }
};

// Obtener un producto por ID
const getProductById = async (req, res) => {
  const productId = req.params.id;
  try {
    const [result] = await db.query('SELECT * FROM products WHERE id = ?', [productId]);
    if (result.length === 0) {
      return res.status(404).json({ message: 'Producto no encontrado' });
    }
    res.json(result[0]);
  } catch (err) {
    console.error('🔥 Error obteniendo producto:', err);
    res.status(500).json({ message: 'Error en el servidor' });
  }
};

// Obtener las imágenes de un producto por su ID
const getProductImages = async (req, res) => {
  const productId = req.params.id;
  try {
    const [results] = await db.query('SELECT image_url FROM product_images WHERE product_id = ?', [productId]);
    res.json(results);
  } catch (err) {
    console.error('🔥 Error obteniendo las imágenes del producto:', err);
    res.status(500).json({ message: 'Error en el servidor' });
  }
};

module.exports = {
  getAllProducts,
  getProductById,
  getProductImages
};
