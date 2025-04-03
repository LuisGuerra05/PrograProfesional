import React, { useState, useEffect } from 'react';
import { FaStar } from 'react-icons/fa';
import './ReviewModal.css';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ReviewModal = ({ productId, onClose, hasReviewed = false }) => {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [hover, setHover] = useState(0);

  // Cargar reseña existente si ya hizo una
  useEffect(() => {
    if (hasReviewed) {
      const token = localStorage.getItem('token');
      fetch(`http://localhost:5000/api/reviews/userReview/${productId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
        .then(res => res.json())
        .then(data => {
          if (data?.rating && data?.comment) {
            setRating(data.rating);
            setComment(data.comment);
          }
        })
        .catch(err => console.error('Error al cargar reseña existente:', err));
    }
  }, [hasReviewed, productId]);

  const handleSubmit = async () => {
    if (rating === 0 || comment.length < 10) {
      toast.error('Completa la reseña con al menos 10 caracteres y una calificación.');
      return;
    }

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

    if (response.ok) {
      toast.success(data.message || 'Reseña guardada con éxito');
      onClose();
    } else {
      toast.error(data.message || 'Error al enviar la reseña');
    }
  };

  const handleDeleteReview = async () => {
    const confirmDelete = window.confirm('¿Estás seguro de que deseas eliminar tu reseña?');
    if (!confirmDelete) return;

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
      toast.success('Reseña eliminada con éxito.');
      onClose();
      window.location.reload(); // Recargar para que el estado se actualice
    } else {
      toast.error('Error al eliminar la reseña: ' + data.message);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h2>{hasReviewed ? 'Edita tu reseña' : 'Comparte tu reseña'}</h2>

        <div className="rating">
          {[1, 2, 3, 4, 5].map((star) => (
            <FaStar
              key={star}
              className="star"
              color={star <= (hover || rating) ? '#FFD700' : '#ccc'}
              onMouseEnter={() => setHover(star)}
              onMouseLeave={() => setHover(0)}
              onClick={() => setRating(star)}
            />
          ))}
        </div>

        <textarea
          placeholder="Escribe tu reseña (mínimo 10 caracteres)"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        ></textarea>

        <div className="modal-buttons">
          <button onClick={handleSubmit}>
            {hasReviewed ? 'Actualizar Reseña' : 'Enviar Reseña'}
          </button>
          <button onClick={onClose}>Cerrar</button>
        </div>

        {hasReviewed && (
          <button
            onClick={handleDeleteReview}
            style={{
              marginTop: '10px',
              backgroundColor: '#f8d7da',
              color: '#721c24',
              border: '1px solid #f5c6cb',
              padding: '8px 12px',
              borderRadius: '5px',
              cursor: 'pointer',
              width: '100%'
            }}
          >
            Borrar reseña
          </button>
        )}
      </div>
    </div>
  );
};

export default ReviewModal;
