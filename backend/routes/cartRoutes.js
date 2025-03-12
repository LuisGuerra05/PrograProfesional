// backend/routes/cartRoutes.js

const express = require('express');
const router = express.Router();
const authenticate = require('../middleware/authenticate');
const cartController = require('../controllers/cartController');

// Rutas existentes
router.get('/', authenticate, cartController.getCart);
router.post('/add', authenticate, cartController.addToCart);
router.post('/remove', authenticate, cartController.removeFromCart);
router.post('/removeAll', authenticate, cartController.removeAllFromCart);
router.post('/clear', authenticate, cartController.clearCart);

// Nueva ruta para combinar carritos
router.post('/merge', authenticate, cartController.mergeCarts);

module.exports = router;
