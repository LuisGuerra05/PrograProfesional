import React, { useState, useEffect } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import { FaStar } from 'react-icons/fa';
import './ReviewModal.css';

const ReviewModal = ({ productId, onClose, hasReviewed = false, onReviewSubmitted }) => {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [hover, setHover] = useState(0);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (hasReviewed) {
      const token = localStorage.getItem('token');
      fetch(`http://localhost:5000/api/reviews/userReview/${productId}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
        .then(res => res.json())
        .then(data => {
          if (data && data.rating && data.comment) {
            setRating(data.rating);
            setComment(data.comment);
          }
        })
        .catch(err => console.error('Error al cargar reseña existente:', err));
    }
  }, [hasReviewed, productId]);

  const handleSubmit = async () => {
    if (rating === 0 || comment.length < 10) {
      alert('Por favor, completa la reseña con al menos 10 caracteres y una calificación.');
      return;
    }

    setSubmitting(true);

    const token = localStorage.getItem('token');
    const url = 'http://localhost:5000/api/reviews';
    const method = hasReviewed ? 'PUT' : 'POST';

    const response = await fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ productId, rating, comment })
    });

    const data = await response.json();
    setSubmitting(false);

    if (response.ok) {
      if (onReviewSubmitted) onReviewSubmitted(); // ✅ recargar reseñas
      onClose();
    } else {
      alert('Error al enviar la reseña: ' + (data.message || ''));
    }
  };

  return (
    <Modal show onHide={onClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>{hasReviewed ? 'Editar Reseña' : 'Escribir Reseña'}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="star-rating mb-3">
          {[1, 2, 3, 4, 5].map((star) => (
            <FaStar
              key={star}
              className={`star ${star <= (hover || rating) ? 'active' : ''}`}
              onMouseEnter={() => setHover(star)}
              onMouseLeave={() => setHover(0)}
              onClick={() => setRating(star)}
            />
          ))}
        </div>

        <Form.Group controlId="reviewComment">
          <Form.Control
            as="textarea"
            rows={4}
            placeholder="Escribe tu reseña (mínimo 10 caracteres)"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />
        </Form.Group>
      </Modal.Body>
      <Modal.Footer className="modal-buttons">
        <Button variant="secondary" onClick={onClose}>
          Cerrar
        </Button>
        <Button variant="primary" onClick={handleSubmit} disabled={submitting}>
          {hasReviewed ? 'Actualizar Reseña' : 'Enviar Reseña'}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ReviewModal;
