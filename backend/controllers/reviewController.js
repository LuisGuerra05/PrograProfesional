const Review = require('../models/reviewModel');
const { moderateComment } = require('../helpers/openai');
const { containsPersonalInfo } = require('../helpers/personalInfo');

// Obtener reseñas de un producto
exports.getReviewsByProduct = async (req, res) => {
  const productId = req.params.productId;
  const currentUserId = req.user?.id;

  try {
    const reviews = await Review.getByProductId(productId);

    const reviewsWithUserFlag = reviews.map((review) => ({
      ...review,
      isUserReview: currentUserId ? review.user_id === currentUserId : false
    }));

    res.json(reviewsWithUserFlag);
  } catch (err) {
    console.error('Error al obtener reseñas:', err);
    res.status(500).json({ message: 'Error al obtener reseñas' });
  }
};

// Crear una reseña nueva
exports.createReview = async (req, res) => {
  const userId = req.user.id;
  const { productId, rating, comment } = req.body;

  if (!rating || rating < 1 || rating > 5) {
    return res.status(400).json({ message: 'Calificación inválida' });
  }

  try {
    const existingReviews = await Review.exists(userId, productId);
    if (existingReviews.length > 0) {
      return res.status(400).json({ message: 'Ya dejaste una reseña para este producto' });
    }

    if (containsPersonalInfo(comment)) {
      return res.status(400).json({ message: 'Tu comentario contiene información personal (correo o teléfono).' });
    }

    const moderationResult = await moderateComment(comment);
    if (moderationResult.flagged) {
      return res.status(400).json({
        message: 'Tu comentario fue bloqueado por contenido inapropiado.',
        detalles: moderationResult.categories
      });
    }

    await Review.create(userId, productId, rating, comment);
    res.status(201).json({ message: 'Reseña creada con éxito' });

  } catch (err) {
    console.error('Error al crear reseña:', err);
    res.status(500).json({ message: 'Error al crear reseña' });
  }
};

// Obtener promedio de rating de un producto
exports.getAverageRating = async (req, res) => {
  const productId = req.params.productId;

  try {
    const averageResult = await Review.getAverageRating(productId);
    res.json({ average: averageResult.average });
  } catch (err) {
    console.error('Error al obtener el promedio:', err);
    res.status(500).json({ message: 'Error al obtener el promedio' });
  }
};

// Actualizar una reseña existente
exports.updateReview = async (req, res) => {
  const userId = req.user.id;
  const { productId, rating, comment } = req.body;

  if (!rating || rating < 1 || rating > 5) {
    return res.status(400).json({ message: 'Calificación inválida' });
  }

  try {
    if (containsPersonalInfo(comment)) {
      return res.status(400).json({ message: 'Tu comentario contiene información personal (correo o teléfono).' });
    }

    const moderationResult = await moderateComment(comment);
    if (moderationResult.flagged) {
      return res.status(400).json({
        message: 'Tu comentario fue bloqueado por contenido inapropiado.',
        detalles: moderationResult.categories
      });
    }

    const result = await Review.update(userId, productId, rating, comment);
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Reseña no encontrada' });
    }

    res.json({ message: 'Reseña actualizada con éxito' });

  } catch (err) {
    console.error('Error al actualizar reseña:', err);
    res.status(500).json({ message: 'Error al actualizar reseña' });
  }
};

// Obtener distribución de ratings
exports.getRatingDistribution = async (req, res) => {
  const productId = req.params.productId;

  try {
    const results = await Review.getRatingDistribution(productId);

    const distribution = [1, 2, 3, 4, 5].reduce((acc, star) => {
      const found = results.find((r) => r.rating === star);
      acc[star] = found ? found.count : 0;
      return acc;
    }, {});

    res.json(distribution);
  } catch (err) {
    console.error('Error al obtener distribución:', err);
    res.status(500).json({ message: 'Error al obtener distribución' });
  }
};

// Eliminar una reseña
exports.deleteReview = async (req, res) => {
  const userId = req.user.id;
  const { productId } = req.body;

  try {
    const result = await Review.delete(userId, productId);
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Reseña no encontrada' });
    }

    res.json({ message: 'Reseña eliminada con éxito' });
  } catch (err) {
    console.error('Error al eliminar reseña:', err);
    res.status(500).json({ message: 'Error al eliminar reseña' });
  }
};

// Verificar si el usuario ya hizo reseña
exports.hasUserReviewed = async (req, res) => {
  const userId = req.user.id;
  const productId = req.params.productId;

  try {
    const reviews = await Review.exists(userId, productId);
    const hasReviewed = reviews.length > 0;
    res.json({ hasReviewed });
  } catch (err) {
    console.error('Error al verificar reseña existente:', err);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

// Obtener la reseña del usuario para un producto
exports.getUserReview = async (req, res) => {
  const userId = req.user.id;
  const productId = req.params.productId;

  try {
    const reviews = await Review.exists(userId, productId);
    if (reviews.length === 0) {
      return res.status(404).json({ message: 'No hay reseña' });
    }
    res.json(reviews[0]);
  } catch (err) {
    console.error('Error al obtener la reseña del usuario:', err);
    res.status(500).json({ message: 'Error al obtener la reseña del usuario' });
  }
};
