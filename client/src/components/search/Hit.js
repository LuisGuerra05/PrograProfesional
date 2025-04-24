import React from 'react';
import { Card, Button } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { getProductTranslationKey } from '../../utils/imageHelpers';
import './SearchBar.css';

const Hit = ({ hit }) => {
  const { t } = useTranslation();

  return (
    <Card className="h-100 clickable-card search-hit-card" onClick={() => window.location.href = `/product/${hit.id}`}>
      <Card.Img
        variant="top"
        src={hit.image || '/images/default-product.png'}
        alt={hit.name}
        onError={(e) => {
          e.target.onerror = null;
          e.target.src = '/images/default-product.png';
        }}
      />
      <Card.Body>
        <small>{hit.brand}</small>
        <Card.Title>{hit.team}</Card.Title>
        <Card.Text>{t(getProductTranslationKey(hit.name))} 2024-2025</Card.Text>
        <h4>${hit.price}</h4>
        <div className="d-flex justify-content-center mt-2">
          <Button className="custom-blue-btn">{t('view-product')}</Button>
        </div>
      </Card.Body>
    </Card>
  );
};

export default Hit;
