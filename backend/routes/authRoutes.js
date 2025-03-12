// authRoutes.js

const express = require('express');
const { register, login, updateAddress } = require('../controllers/authController');
const authenticate = require('../middleware/authenticate');
const router = express.Router();

// Ruta para registrar un nuevo usuario
router.post('/register', register);

// Ruta para iniciar sesión
router.post('/login', login);

// Ruta para actualizar la dirección del usuario
router.put('/update-address', authenticate, updateAddress);

module.exports = router;
