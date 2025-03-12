const express = require('express');
const { getAllProducts, getProductById, getProductImages } = require('../controllers/productController');
const router = express.Router();

// Rutas para obtener productos e imágenes
router.get('/products', getAllProducts); // Obtener todos los productos
router.get('/products/:id', getProductById); // Obtener un producto por su ID
router.get('/products/:id/images', getProductImages); // Obtener imágenes de un producto por su ID

module.exports = router;