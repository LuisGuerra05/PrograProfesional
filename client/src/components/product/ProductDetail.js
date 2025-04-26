import React, { useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';
import { Container, Row, Col, Button, Spinner } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import ProductCarousel from '../carousel/ProductCarousel';
import './ProductDetail.css';
import { CartContext } from '../../context/CartProvider';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ProductReviews from '../review/ProductReviews';
import ReviewModal from '../review/ReviewModal';
import { API_URL } from '../../utils/config';

const getProductTranslationKey = (name) => {
  if (name.includes('Local')) return 'Home Jersey';
  if (name.includes('Visita')) return 'Away Jersey';
  if (name.includes('Tercera')) return 'Third Jersey';
  if (name.includes('Cuarta')) return 'Fourth Jersey';
  return 'Goalkeeper Jersey';
};

const ProductDetail = () => {
  const { id } = useParams();
  const { t } = useTranslation();
  const { addToCart } = useContext(CartContext);

  const [product, setProduct] = useState(null);
  const [selectedSize, setSelectedSize] = useState(null);
  const [errorMessageKey, setErrorMessageKey] = useState('');
  const [showReviews, setShowReviews] = useState(false);
  const [hasReviewed, setHasReviewed] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [loadingImages, setLoadingImages] = useState(true);

  useEffect(() => {
    fetch(`${API_URL}/api/products/${id}`)
      .then((res) => res.json())
      .then((data) => setProduct(data))
      .catch((err) => console.error('Error al cargar el producto:', err));
  }, [id]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsLoggedIn(true);
      fetch(`${API_URL}/api/reviews/hasReviewed/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
        .then((res) => res.json())
        .then((data) => setHasReviewed(data.hasReviewed))
        .catch((err) => console.error('Error al verificar reseña:', err));
    }
  }, [id]);

  const handleSizeSelect = (size) => {
    setSelectedSize(size);
    setErrorMessageKey('');
  };

  const handleAddToCart = () => {
    if (!selectedSize) {
      setErrorMessageKey('You must select a size');
      return;
    }
    addToCart(product, selectedSize);
    toast.success(t('Product added to cart successfully'), {
      className: 'custom-toast',
      progressClassName: 'Toastify__progress-bar--blue',
      progressStyle: { backgroundColor: 'rgba(0, 123, 255, 0.85)' }
    });
    setSelectedSize(null);
    setErrorMessageKey('');
  };

  const productTranslationKey = getProductTranslationKey(product?.name || '');

  if (!product) {
    return (
      <Container className="text-center" style={{ marginTop: '50px' }}>
        <Spinner animation="border" role="status" />
        <p className="mt-3">{t('loading')}</p>
      </Container>
    );
  }

  return (
    <Container className="product-detail-container">
      <ToastContainer />
      <div style={{ border: '1px solid #ccc', borderRadius: '10px', padding: '30px', background: '#fff' }}>
        <Row>
          <Col md={6} style={{ position: 'relative' }}>
            {/* Aquí SIEMPRE montamos el carousel */}
            <ProductCarousel productId={product.id} onImagesLoaded={() => setLoadingImages(false)} />
            {/* Y el loader solo se muestra encima */}
            {loadingImages && (
              <div className="d-flex justify-content-center align-items-center"
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  backgroundColor: 'rgba(255,255,255,0.7)',
                  zIndex: 10,
                  borderRadius: '10px'
                }}>
                <Spinner animation="border" role="status" variant="primary" style={{ width: '3rem', height: '3rem' }} />
              </div>
            )}
          </Col>

          <Col md={6}>
            <div style={{ border: '1px solid #eee', borderRadius: '10px', padding: '20px' }}>
              <small>{product.brand}</small>
              <h2 className="product-title">{product.team}</h2>
              <p className="product-name">{t(productTranslationKey)} 2024-2025</p>
              <ProductReviews.ShowAverageStars productId={product.id} />
              <h3 className="product-price">${product.price}</h3>

              <div className="size-selection">
                <p>{t('select-size')}:</p>
                <div className="size-buttons">
                  {['S', 'M', 'L', 'XL'].map((size) => (
                    <Button
                      key={size}
                      variant={selectedSize === size ? 'dark' : 'outline-secondary'}
                      onClick={() => handleSizeSelect(size)}
                      className="size-btn"
                    >
                      {size}
                    </Button>
                  ))}
                </div>
              </div>

              <Button className="add-to-cart-btn" style={{ marginTop: '30px' }} onClick={handleAddToCart}>
                {t('add-to-cart')}
              </Button>

              <p style={{ marginTop: '40px', color: '#555' }}>
                {t('product-description', { team: product.team, brand: product.brand })}
              </p>

              {errorMessageKey && (
                <p style={{ color: 'red', marginTop: '10px' }}>{t(errorMessageKey)}</p>
              )}
            </div>

            {/* Botón para mostrar reseñas */}
            <div style={{ marginTop: '20px' }}>
              <Button
                variant="light"
                className="w-100 d-flex justify-content-between align-items-center"
                style={{ padding: '16px 20px', border: '1px solid #ddd', borderRadius: '6px', fontWeight: '500' }}
                onClick={() => setShowReviews(!showReviews)}
              >
                <span>{t('review-actions')}</span>
                <span style={{ fontSize: '18px' }}>{showReviews ? '▲' : '▼'}</span>
              </Button>

              {showReviews && (
                <div style={{ marginTop: '12px', border: '1px solid #ddd', borderRadius: '6px', padding: '10px' }}>
                  {isLoggedIn && (
                    <>
                      <Button
                        variant="light"
                        className="w-100 mb-2 text-start"
                        onClick={() => setShowReviewModal(true)}
                      >
                        {hasReviewed ? t('edit-review') : t('write-review')}
                      </Button>
                      {showReviewModal && (
                        <ReviewModal
                          productId={product.id}
                          hasReviewed={hasReviewed}
                          onClose={() => setShowReviewModal(false)}
                        />
                      )}
                    </>
                  )}
                  <Button
                    variant="light"
                    className="w-100 text-start"
                    onClick={() => setShowReviews(false)}
                  >
                    {t('hide-reviews')}
                  </Button>
                </div>
              )}
            </div>
          </Col>
        </Row>

        {showReviews && (
          <div style={{ marginTop: '30px' }}>
            <ProductReviews productId={product.id} />
          </div>
        )}
      </div>
    </Container>
  );
};

export default ProductDetail;
