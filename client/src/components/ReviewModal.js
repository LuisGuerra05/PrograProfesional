import React, { useState } from 'react';
import { FaStar } from 'react-icons/fa';
import './ReviewModal.css';

const ReviewModal = ({ productId, onClose, hasReviewed = false }) => {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [hover, setHover] = useState(0);

  React.useEffect(() => {
    if (hasReviewed) {
        const token = localStorage.getItem('token');
        fetch(`http://localhost:5000/api/reviews/userReview/${productId}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
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

  const getUserIdFromToken = (token) => {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.id;
    } catch (e) {
      return null;
    }
  };

  const handleSubmit = async () => {
    if (rating === 0 || comment.length < 10) {
      alert('Por favor, completa la reseña con al menos 10 caracteres y una calificación.');
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
      alert(data.message || 'Reseña procesada con éxito');
      onClose();
    } else {
      alert('Error al enviar la reseña: ' + (data.message || '')); 
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h2>Comparte tu reseña</h2>
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
          <button onClick={handleSubmit}>{hasReviewed ? 'Actualizar Reseña' : 'Enviar Reseña'}</button>
          <button onClick={onClose}>Cerrar</button>
        </div>
      </div>
    </div>
  );
};

export default ReviewModal;
