import React, { useState, useEffect, useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { Card, Button, Container, Row, Col, Modal } from 'react-bootstrap';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './ProductList.css';
import { CartContext } from '../../context/CartProvider';
import { getImageUrl, getProductTranslationKey } from '../../utils/imageHelpers';

const ProductList = ({ products: externalProducts }) => {
  const { addToCart } = useContext(CartContext);
  const [, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedSize, setSelectedSize] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const { t } = useTranslation();

  useEffect(() => {
    if (externalProducts) {
      setProducts(externalProducts);
      setFilteredProducts(externalProducts);
    }
  }, [externalProducts]);

  const handleAddToCart = (e, product) => {
    e.stopPropagation();
    setSelectedProduct(product);
    setSelectedSize(null);
    setErrorMessage('');
  };

  const handleClose = () => {
    setSelectedProduct(null);
    setErrorMessage('');
  };

  const handleSizeSelect = (size) => {
    setSelectedSize(size);
    setErrorMessage('');
  };

  const handleConfirmAddToCart = () => {
    if (!selectedSize) {
      setErrorMessage(t('You must select a size'));
      return;
    }
    addToCart(selectedProduct, selectedSize);
    toast.success(t('Producto agregado al carrito con éxito'), {
      className: 'custom-toast',
      progressClassName: 'Toastify__progress-bar--blue',
      progressStyle: { backgroundColor: 'rgba(0, 123, 255, 0.85)' }
    });
    handleClose();
  };

  return (
    <Container fluid style={{ paddingTop: '45px' }}>
      <ToastContainer />
      <Row className="product-list-row">
        <Col xl={12} className="col-products">
          <Row>
            {filteredProducts.length > 0 ? (
              filteredProducts.map(product => (
                <Col key={product.id || product.objectID} xs={12} sm={12} md={6} lg={4} xl={3} className="mb-4">
                  <Card className="h-100 clickable-card" onClick={() => window.location.href = `/product/${product.id || product.objectID}`}>
                    <Card.Img
                      variant="top"
                      src={getImageUrl(product.team, product.name)}
                      alt={product.name}
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = '/images/default-product.png';
                      }}
                    />
                    <Card.Body>
                      <small>{product.brand}</small>
                      <Card.Title>{product.team}</Card.Title>
                      <Card.Text>{t(getProductTranslationKey(product.name))} 2024-2025</Card.Text>
                      <h4>${product.price}</h4>
                      <div className="d-flex justify-content-center mt-2">
                        <Button className="custom-blue-btn" onClick={(e) => handleAddToCart(e, product)}>
                          {t('add-to-cart')}
                        </Button>
                      </div>
                    </Card.Body>
                  </Card>
                </Col>
              ))
            ) : (
              <p style={{ paddingLeft: '15px' }}>{t('no-products')}</p>
            )}
          </Row>
        </Col>
      </Row>

      <Modal show={!!selectedProduct} onHide={handleClose} className="fixed-size-modal">
        <Modal.Header closeButton>
          <Modal.Title>
            <span style={{ fontSize: '1.2em' }}>{selectedProduct?.team}</span>
            <br />
            <span style={{ fontSize: '0.8em', color: '#555' }}>
              {t(getProductTranslationKey(selectedProduct?.name))} 2024-2025
            </span>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>{selectedProduct?.brand}</p>
          <p>{t('price')}: ${selectedProduct?.price}</p>

          <div>
            <strong>{t('select-size')}:</strong>
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

            {errorMessage && (
              <p style={{ color: 'red', marginTop: '10px' }}>{errorMessage}</p>
            )}
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>{t('Close')}</Button>
          <Button className="custom-blue-btn" onClick={handleConfirmAddToCart}>
            {t('add-to-cart')}
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default ProductList;
