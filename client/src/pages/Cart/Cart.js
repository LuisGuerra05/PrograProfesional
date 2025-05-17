// frontend/components/Cart.js

import React, { useContext, useState } from 'react';
import { CartContext } from '../../context/CartProvider';
import { Button, Container, Row, Col, Card, Modal } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { FaTrash } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import '../../styles/App.css';
import { getImageUrl, getProductTranslationKey } from '../../utils/imageHelpers';

const Cart = () => {
  const { cart, addToCart, removeFromCart, removeProduct, clearCart } = useContext(CartContext);
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [showModal, setShowModal] = useState(false); // Modal para vaciar el carrito
  const [showLoginModal, setShowLoginModal] = useState(false); // Modal para login requerido

  const isAuthenticated = !!localStorage.getItem('token');

  const handlePurchase = () => {
    if (!isAuthenticated) {
      setShowLoginModal(true); // Mostrar modal bonito
    } else {
      alert(t('Thank you for your purchase'));
      clearCart();
    }
  };

  const calculateTotal = () => {
    return cart
      .reduce((total, product) => total + parseFloat(product.price || 0) * product.quantity, 0)
      .toFixed(2);
  };

  const handleClearCart = () => {
    setShowModal(true);
  };

  const confirmClearCart = () => {
    clearCart();
    setShowModal(false);
  };

  return (
    <Container className="cart-page" style={{ marginTop: '50px' }}>
      <h1 style={{ textAlign: 'left' }}>{t('cart')}</h1>
      {cart.length === 0 ? (
        <Card className="shadow-sm p-3 mb-4">
          <Card.Body>
            <h3 style={{ textAlign: 'center' }}>{t('cart-empty')}</h3>
            <p style={{ textAlign: 'center' }}>{t('cart-no-products')}</p>
          </Card.Body>
        </Card>
      ) : (
        <>
          {cart.map((product) => {
            const { product_id, size } = product;
            const productTranslationKey = getProductTranslationKey(product.name);
            return (
              <Card key={`${product_id}-${size}`} className="mb-4 shadow-sm" style={{ minHeight: '150px', padding: '15px' }}>
                <Row className="align-items-center">
                  <Col xs={12} sm={2} className="d-flex align-items-center justify-content-center mb-3 mb-sm-0">
                    <img
                      src={getImageUrl(product.team, product.name)}
                      alt={t(productTranslationKey)}
                      style={{ maxWidth: '100px', maxHeight: '100px', objectFit: 'contain', padding: '5px' }}
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = '/images/default-product.png';
                      }}
                    />
                  </Col>

                  <Col xs={12} sm={6} className="text-center text-sm-left mb-3 mb-sm-0">
                    <h5>{product.team}: {t(productTranslationKey)} 2024-2025</h5>
                    <p>{t('size')}: {product.size}</p>
                    <p style={{ fontSize: '1.2em', fontWeight: 'bold' }}>${product.price}</p>
                  </Col>

                  <Col xs={12} sm={4} className="text-center text-sm-right d-flex align-items-center justify-content-sm-end">
                    <Button
                      variant="secondary"
                      onClick={() => removeFromCart(product_id, size)}
                      style={{ padding: '4px 10px', fontSize: '16px' }}
                    >
                      -
                    </Button>
                    <p className="mb-0 mx-2">{t('quantity')}: {product.quantity}</p>
                    <Button
                      variant="secondary"
                      onClick={() => addToCart({
                        id: product_id,
                        name: product.name,
                        team: product.team,
                        brand: product.brand,
                        price: product.price
                      }, size)}
                      style={{ padding: '4px 10px', fontSize: '16px' }}
                    >
                      +
                    </Button>
                    <Button
                      className="custom-trash-button"
                      onClick={() => removeProduct(product_id, size)}
                      style={{ marginLeft: '10px' }}
                    >
                      <FaTrash color="#6c757d" />
                    </Button>
                  </Col>
                </Row>
              </Card>
            );
          })}

          <Row className="mt-4 cart-footer">
            <Col xs={6}>
              <h4>{t('Total')}: ${calculateTotal()}</h4>
            </Col>
          </Row>

          <Row className="mt-4 cart-footer">
            <Col>
              <Button variant="secondary" onClick={handleClearCart}>
                {t('cart-clear')}
              </Button>
            </Col>
            <Col className="text-right">
              <Button className="custom-blue-btn" onClick={handlePurchase}>
                {t('Buy')}
              </Button>
            </Col>
          </Row>
        </>
      )}

      {/* Modal para confirmar vaciado de carrito */}
      <Modal show={showModal} className="clear-cart-modal" onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>{t('confirm')}</Modal.Title>
        </Modal.Header>
        <Modal.Body>{t('cart-clear-confirm')}</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            {t('Cancel')}
          </Button>
          <Button className="custom-blue-btn" onClick={confirmClearCart}>
            {t('cart-clear-confirm-btn')}
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Modal para login requerido */}
      <Modal show={showLoginModal} onHide={() => setShowLoginModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>{t('Login required')}</Modal.Title>
        </Modal.Header>
        <Modal.Body
          style={{
            padding: '8px 16px',
            marginBottom: 20,
            height: 'auto',
            minHeight: 'unset',
            maxHeight: 'none',
            display: 'flex',
            alignItems: 'center'
          }}
        >
          <span >{t('You must log in to complete the purchase')}</span>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowLoginModal(false)}>
            {t('Cancel')}
          </Button>
          <Button className="custom-blue-btn" onClick={() => {
            setShowLoginModal(false);
            navigate('/login');
          }}>
            {t('Login')}
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default Cart;
