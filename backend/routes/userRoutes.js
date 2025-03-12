const express = require('express');
const { getAllUsers, deleteUser } = require('../controllers/userController'); // Importar funciones del controlador
const router = express.Router();

// Rutas de usuarios
router.get('/users', getAllUsers);
router.delete('/users/:id', deleteUser);

module.exports = router;