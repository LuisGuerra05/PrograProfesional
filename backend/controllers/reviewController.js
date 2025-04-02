const Review = require('../models/reviewModel');

exports.getReviewsByProduct = (req, res) => {
  const productId = req.params.productId;
  Review.getByProductId(productId, (err, results) => {
    if (err) return res.status(500).json({ message: 'Error al obtener reseñas' });
    res.json(results);
  });
};

exports.createReview = (req, res) => {
  const userId = req.user.id;
  const { productId, rating, comment } = req.body;

  if (!rating || rating < 1 || rating > 5) {
    return res.status(400).json({ message: 'Calificación inválida' });
  }

  Review.exists(userId, productId, (err, rows) => {
    if (err) return res.status(500).json({ message: 'Error al validar reseña existente' });
    if (rows.length > 0) return res.status(400).json({ message: 'Ya dejaste una reseña para este producto' });

    Review.create(userId, productId, rating, comment, (err) => {
      if (err) return res.status(500).json({ message: 'Error al crear reseña' });
      res.status(201).json({ message: 'Reseña creada con éxito' });
    });
  });
};

exports.getAverageRating = (req, res) => {
  const productId = req.params.productId;
  Review.getAverageRating(productId, (err, result) => {
    if (err) return res.status(500).json({ message: 'Error al obtener el promedio' });
    res.json({ average: result[0].average });
  });
};

exports.updateReview = (req, res) => {
  const userId = req.user.id;
  const { productId, rating, comment } = req.body;

  Review.update(userId, productId, rating, comment, (err, result) => {
    if (err) return res.status(500).json({ message: 'Error al actualizar la reseña' });
    if (result.affectedRows === 0) return res.status(404).json({ message: 'Reseña no encontrada' });
    res.json({ message: 'Reseña actualizada con éxito' });
  });
};

exports.getRatingDistribution = (req, res) => {
  const productId = req.params.productId;
  Review.getRatingDistribution(productId, (err, results) => {
    if (err) return res.status(500).json({ message: 'Error al obtener distribución' });
    const distribution = [1, 2, 3, 4, 5].reduce((acc, star) => {
      const found = results.find((r) => r.rating === star);
      acc[star] = found ? found.count : 0;
      return acc;
    }, {});
    res.json(distribution);
  });
};

exports.deleteReview = (req, res) => {
  const userId = req.user.id;
  const { productId } = req.body;

  Review.delete(userId, productId, (err, result) => {
    if (err) return res.status(500).json({ message: 'Error al eliminar la reseña' });
    if (result.affectedRows === 0) return res.status(404).json({ message: 'Reseña no encontrada' });
    res.json({ message: 'Reseña eliminada con éxito' });
  });
};

// Verificar si el usuario logeado ya hizo una reseña para ese producto
exports.hasUserReviewed = (req, res) => {
  const userId = req.user.id;
  const productId = req.params.productId;

  Review.exists(userId, productId, (err, rows) => {
    if (err) {
      console.error('Error al verificar reseña existente:', err);
      return res.status(500).json({ message: 'Error interno del servidor' });
    }

    const hasReviewed = rows.length > 0;
    res.json({ hasReviewed });
  });
};

exports.getUserReview = (req, res) => {
  const userId = req.user.id;
  const productId = req.params.productId;

  Review.exists(userId, productId, (err, rows) => {
    if (err) return res.status(500).json({ message: 'Error al obtener la reseña del usuario' });
    if (rows.length === 0) return res.status(404).json({ message: 'No hay reseña' });
    res.json(rows[0]);
  });
};
