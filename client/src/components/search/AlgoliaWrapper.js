import React from 'react';
import algoliasearch from 'algoliasearch/lite';
import {
  InstantSearch,
  SearchBox,
  connectHits
} from 'react-instantsearch-dom';

import ProductList from '../product/ProductList';

const searchClient = algoliasearch(
  process.env.REACT_APP_ALGOLIA_APP_ID,
  process.env.REACT_APP_ALGOLIA_SEARCH_KEY
);

const CustomHits = connectHits(({ hits }) => {
  console.log("📦 Resultados desde Algolia:", hits);
  return <ProductList products={hits} />;
});

const AlgoliaWrapper = () => {
  return (
    <InstantSearch searchClient={searchClient} indexName={process.env.REACT_APP_ALGOLIA_INDEX_NAME}>
      <div style={{ padding: '0 30px', marginBottom: '10px' }}>
        <SearchBox
          translations={{ placeholder: 'Buscar camisetas...' }}
          className="form-control mb-4"
        />
      </div>
      <CustomHits />
    </InstantSearch>
  );
};

export default AlgoliaWrapper;

