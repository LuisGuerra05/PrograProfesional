import React, { useState, useEffect } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import { FaStar } from 'react-icons/fa';
import './ReviewModal.css';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';

const ReviewModal = ({ productId, onClose, hasReviewed = false, onReviewSubmitted }) => {
  const { t } = useTranslation();
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [hover, setHover] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState(''); // Nuevo estado para errores

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
      setErrorMessage(t('review-validation'));
      return;
    }

    setErrorMessage('');
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
      onClose();
      window.location.reload();
    } else {
      console.error('❌ Comentario bloqueado o error:', data.message);
      if (data.detalles) {
        console.log('📋 Categorías detectadas por la IA:', data.detalles);
      }
      setErrorMessage('Error al enviar la reseña: ' + (data.message || ''));
    }    
  };

  const handleDeleteReview = async () => {

    const token = localStorage.getItem('token');
    const response = await fetch('http://localhost:5000/api/reviews', {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ productId })
    });

    const data = await response.json();

    if (response.ok) {
      toast.success(t('review-deleted-success'), {
        autoClose: 3000, // Mostrar el toast por 3 segundos
      });
    
      onClose();
    
      setTimeout(() => {
        window.location.reload();
      }, 3000); // Recargar justo después que el toast se oculta
    } else {
      toast.error('Error al eliminar la reseña: ' + (data.message || ''));
    }    
  };

  return (
    <Modal show onHide={onClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>{hasReviewed ? t('edit-review') : t('write-review')}</Modal.Title>
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
            placeholder={t('review-placeholder')}
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />
        </Form.Group>

        {errorMessage && (
          <div style={{ fontSize: '0.9rem', marginTop: '0.5rem', color: 'red' }}>
            {errorMessage}
          </div>
        )}

      </Modal.Body>

      <Modal.Footer className="d-flex justify-content-between align-items-center w-100">
        {hasReviewed ? (
          <Button id="delete-review-btn" variant="outline-danger" onClick={handleDeleteReview} className="py-2">
            {t('delete-review')}
          </Button>
        ) : (
          <div />
        )}

        <div>
          <Button variant="secondary" onClick={onClose} className="me-2 py-2">
            {t('Cancel')}
          </Button>
          <Button variant="primary" onClick={handleSubmit} disabled={submitting} className="py-2">
            {hasReviewed ? t('update-review') : t('submit-review')}
          </Button>
        </div>
      </Modal.Footer>
    </Modal>
  );
};

export default ReviewModal;
