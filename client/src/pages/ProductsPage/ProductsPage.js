// src/routes/ProductsPage.js

import React from 'react';
import AlgoliaWrapper from '../../components/search/AlgoliaWrapper';

const ProductsPage = () => {
  return (
    <div className="main-content" style={{ padding: '30px' }}>
      <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>Camisetas Disponibles</h2>
      <AlgoliaWrapper />
    </div>
  );
};

export default ProductsPage;
