// frontend/components/Cart.js

import React, { useContext, useState } from 'react';
import { CartContext } from '../context/CartProvider';
import { Button, Container, Row, Col, Card, Modal } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { FaTrash } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import '../App.css';

// Diccionario de mapeo entre nombres de equipos y nombres de carpetas
const teamFolderMap = {
  'FC Barcelona': 'Barca',
  'Atlético de Madrid': 'Atletico',
  'Real Madrid': 'Madrid',
  'Athletic Club': 'Bilbao',
  'Celta de Vigo': 'Calta',
  'Espanyol': 'Espanyol',
  'Getafe': 'Getafe',
  'Girona': 'Girona',
  'Leganés': 'Leganes',
  'Deportivo Alavés': 'Alaves',
  'Osasuna': 'Osasuna',
  'RCD Mallorca': 'Mallorca',
  'Rayo Vallecano': 'Rayo',
  'Real Betis': 'Betis',
  'Real Sociedad': 'Sociedad',
  'Sevilla FC': 'Sevilla',
  'U.D. Las Palmas': 'Palmas',
  'Valencia': 'Valencia',
  'Real Valladolid': 'Valladolid',
  'Villarreal': 'Villarreal'
};

// Función para generar la URL de la imagen
const getImageUrl = (team, name) => {
  const basePath = '/images';
  const teamFolder = teamFolderMap[team] || team.replace(/\s+/g, '').toLowerCase();
  const productType = name.includes('Local') ? 'Local' :
                      name.includes('Visita') ? 'Visita' :
                      name.includes('Tercera') ? 'Tercera' : 
                      name.includes('Cuarta') ? 'Cuarta' : 'Portero';
  const fileName = `${teamFolder}_${productType}_24_1.jpg`;
  return `${basePath}/${teamFolder}/${productType}/${fileName}`;
};

// Función para obtener la clave de traducción según el nombre del producto
const getProductTranslationKey = (name) => {
  if (name.includes('Local')) {
    return 'Home Jersey';
  } else if (name.includes('Visita')) {
    return 'Away Jersey';
  } else if (name.includes('Tercera')) {
    return 'Third Jersey';
  } else if (name.includes('Cuarta')) {
    return 'Fourth Jersey';
  } else {
    return 'Goalkeeper Jersey';
  }
};

const Cart = () => {
  const { cart, addToCart, removeFromCart, removeProduct, clearCart } = useContext(CartContext);
  const { t } = useTranslation();
  const navigate = useNavigate(); // Para navegar a la página de login
  const [showModal, setShowModal] = useState(false); // Estado para mostrar/ocultar el modal

  // Verificar si el usuario está autenticado
  const isAuthenticated = !!localStorage.getItem('token');

  const handlePurchase = () => {
    if (!isAuthenticated) {
      // Si no está autenticado, redirigir al login
      alert(t('You must log in to complete the purchase'));
      navigate('/login');
    } else {
      // Si está autenticado, completar la compra
      alert(t('Thank you for your purchase'));
      clearCart();
    }
  };

  // Calcular el total de la compra
  const calculateTotal = () => {
    return cart
      .reduce((total, product) => total + parseFloat(product.price || 0) * product.quantity, 0)
      .toFixed(2);
  };

  // Función para manejar la acción de vaciar el carrito
  const handleClearCart = () => {
    setShowModal(true); // Mostrar el modal de confirmación
  };

  // Función para confirmar la acción de vaciar el carrito
  const confirmClearCart = () => {
    clearCart();
    setShowModal(false); // Ocultar el modal después de vaciar el carrito
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
                  {/* Imagen */}
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
                  
                  {/* Detalles del producto */}
                  <Col xs={12} sm={6} className="text-center text-sm-left mb-3 mb-sm-0">
                    <h5>{product.team}: {t(productTranslationKey)} 2024-2025</h5>
                    <p>{t('size')}: {product.size}</p>
                    {/* Precio debajo de la talla */}
                    <p style={{ fontSize: '1.2em', fontWeight: 'bold' }}>${product.price}</p>
                  </Col>

                  {/* Cantidad y acciones */}
                  <Col xs={12} sm={4} className="text-center text-sm-right d-flex align-items-center justify-content-sm-end">
                    {/* Botón de disminuir cantidad */}
                    <Button 
                      variant="outline-secondary" 
                      onClick={() => removeFromCart(product_id, size)} 
                    >
                      -
                    </Button>
                    <p className="mb-0 mx-2">{t('quantity')}: {product.quantity}</p>
                    {/* Botón de aumentar cantidad */}
                    <Button 
                      variant="outline-secondary" 
                      onClick={() => addToCart({
                        id: product_id,
                        name: product.name,
                        team: product.team,
                        brand: product.brand,
                        price: product.price
                      }, size)}
                    >
                      +
                    </Button>
                    {/* Botón de eliminar producto */}
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

          {/* Mostrar el total de la compra */}
          <Row className="mt-4 cart-footer">
            <Col xs={6}>
              <h4>{t('Total')}: ${calculateTotal()}</h4>
            </Col>
          </Row>

          {/* Botones debajo del carrito */}
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

      {/* Modal de confirmación para vaciar el carrito */}
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
    </Container>
  );
};

export default Cart;
