import React from 'react';
import AlgoliaWrapper from '../../components/search/AlgoliaWrapper';

const ProductsPage = () => {
  return (
    <div className="main-content" style={{ padding: '30px' }}>
      <AlgoliaWrapper />
    </div>
  );
};

export default ProductsPage;
