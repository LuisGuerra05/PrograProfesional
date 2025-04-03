const express = require('express');
const router = express.Router();
const reviewController = require('../controllers/reviewController');
const authenticate = require('../middleware/authenticate');

// ✅ Ruta pública (sin login) para obtener reseñas
router.get('/public/:productId', reviewController.getReviewsByProduct);

// 🔒 Ruta protegida: reseñas con identificación del usuario (para mostrar "Tu reseña")
router.get('/:productId', authenticate, reviewController.getReviewsByProduct);

// Obtener promedio de calificación
router.get('/average/:productId', reviewController.getAverageRating);

// Crear nueva reseña (requiere login)
router.post('/', authenticate, reviewController.createReview);

// Actualizar una reseña existente (requiere login)
router.put('/', authenticate, reviewController.updateReview);

// Eliminar una reseña (requiere login)
router.delete('/', authenticate, reviewController.deleteReview);

// Obtener distribución de calificaciones
router.get('/distribution/:productId', reviewController.getRatingDistribution);

// Verificar si el usuario ya hizo una reseña
router.get('/hasReviewed/:productId', authenticate, reviewController.hasUserReviewed);

// Obtener reseña específica del usuario logeado
router.get('/userReview/:productId', authenticate, reviewController.getUserReview);

module.exports = router;
