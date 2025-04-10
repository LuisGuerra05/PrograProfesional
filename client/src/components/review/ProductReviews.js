import React, { useEffect, useState, useCallback } from 'react';
import { FaStar, FaRegStar } from 'react-icons/fa';
import { useTranslation } from 'react-i18next';
import ReviewModal from './ReviewModal';

const BLUE = '#007bff';

const renderStars = (rating) => {
  const fullStars = Math.round(rating);
  return (
    <>
      {[...Array(5)].map((_, index) =>
        index < fullStars ? (
          <FaStar key={index} color={BLUE} />
        ) : (
          <FaRegStar key={index} color="#ccc" />
        )
      )}
    </>
  );
};

const ShowAverageStars = ({ productId }) => {
  const [average, setAverage] = useState(null);

  useEffect(() => {
    fetch(`http://localhost:5000/api/reviews/average/${productId}`)
      .then((res) => res.json())
      .then((data) => setAverage(Number(data.average || 0)))
      .catch((err) => console.error('Error promedio:', err));
  }, [productId]);

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
      {renderStars(average || 0)}
      <span style={{ fontWeight: '500', color: '#333' }}>
        {average ? average.toFixed(1) : '0.0'}
      </span>
    </div>
  );
};

const ProductReviews = ({ productId }) => {
  const { t, i18n } = useTranslation();
  const [reviews, setReviews] = useState([]);
  const [average, setAverage] = useState(0);
  const [distribution, setDistribution] = useState({});
  const [totalRatings, setTotalRatings] = useState(0);
  const [showModal, setShowModal] = useState(false);

  const fetchReviewData = useCallback(() => {
    const token = localStorage.getItem('token');
    const url = token
      ? `http://localhost:5000/api/reviews/${productId}`
      : `http://localhost:5000/api/reviews/public/${productId}`;

    fetch(url, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    })
      .then((res) => res.json())
      .then((data) => setReviews(data))
      .catch((err) => console.error('Error reseñas:', err));

    fetch(`http://localhost:5000/api/reviews/average/${productId}`)
      .then((res) => res.json())
      .then((data) => setAverage(Number(data.average || 0)))
      .catch((err) => console.error('Error promedio:', err));

    fetch(`http://localhost:5000/api/reviews/distribution/${productId}`)
      .then((res) => res.json())
      .then((data) => {
        setDistribution(data);
        const total = Object.values(data).reduce((acc, curr) => acc + curr, 0);
        setTotalRatings(total);
      })
      .catch((err) => console.error('Error distribución:', err));
  }, [productId]);

  useEffect(() => {
    fetchReviewData();
  }, [fetchReviewData]);

  return (
    <div className="product-reviews" style={{ marginTop: '30px' }}>
      <h3 style={{ marginBottom: '30px' }}>{t('product-review-title')}</h3>

      {showModal && (
        <ReviewModal
          productId={productId}
          hasReviewed={true}
          onClose={() => setShowModal(false)}
          onReviewSubmitted={fetchReviewData}
        />
      )}

      <div className="row">
        <div className="col-md-6">
          <h5 style={{ marginBottom: '15px' }}>{t('reviews')}</h5>
          <div className="reviews-list">
            {reviews.length > 0 ? (
              reviews.map((review) => {
                const formattedDate = new Date(review.created_at).toLocaleDateString(i18n.language, {
                  year: 'numeric',
                  month: 'short',
                  day: '2-digit',
                });

                return (
                  <div key={review.id} className="review-item" style={{ marginBottom: '15px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <div style={{ display: 'flex', gap: '5px', alignItems: 'center' }}>
                        {renderStars(review.rating)}
                        {review.isUserReview && (
                          <span style={{
                            fontSize: '0.8em',
                            color: '#555',
                            fontWeight: '600',
                            marginLeft: '8px'
                          }}>
                            {t('your-review')}
                          </span>
                        )}
                      </div>
                      <small style={{ color: '#666' }}>{formattedDate}</small>
                    </div>
                    <p style={{ marginBottom: '5px', marginTop: '5px' }}>{review.comment}</p>
                  </div>
                );
              })
            ) : (
              <p>{t('no-reviews')}</p>
            )}
          </div>
        </div>

        <div className="col-md-6">
          <div style={{ border: '1px solid #ddd', borderRadius: '8px', padding: '20px' }}>
            <h5 style={{ marginBottom: '15px' }}>{t('overall-rating')}</h5>

            <div style={{ fontSize: '32px', fontWeight: 'bold', color: BLUE }}>
              {average.toFixed(1)}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '5px', marginBottom: '10px' }}>
              {[...Array(5)].map((_, i) => (
                <span key={i} style={{ color: BLUE }}>★</span>
              ))}
              <span style={{ marginLeft: '10px' }}>{totalRatings} {t('ratings')}</span>
            </div>

            {[5, 4, 3, 2, 1].map((star) => {
              const count = distribution[star] || 0;
              const percent = totalRatings > 0 ? (count / totalRatings) * 100 : 0;

              return (
                <div key={star} style={{ display: 'flex', alignItems: 'center', marginBottom: '5px' }}>
                  <div style={{ flex: 1, background: '#eee', height: '6px', marginRight: '10px' }}>
                    <div style={{ width: `${percent}%`, height: '100%', background: BLUE }} />
                  </div>
                  <span>{star} ★</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

ProductReviews.ShowAverageStars = ShowAverageStars;
export default ProductReviews;
