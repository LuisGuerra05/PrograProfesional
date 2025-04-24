// src/components/search/AlgoliaSearch.js
import React from 'react';
import algoliasearch from 'algoliasearch/lite';
import {
  InstantSearch,
  SearchBox,
  Hits
} from 'react-instantsearch-dom';

const searchClient = algoliasearch(
  process.env.REACT_APP_ALGOLIA_APP_ID,
  process.env.REACT_APP_ALGOLIA_SEARCH_KEY
);

const Hit = ({ hit }) => (
  <div className="card" style={{ width: '15rem', margin: '10px' }}>
    <img
      src={hit.image}
      className="card-img-top"
      alt={hit.name}
      onError={(e) => (e.target.src = '/images/default-product.png')}
    />
    <div className="card-body">
      <h5 className="card-title">{hit.team}</h5>
      <p className="card-text">{hit.name}</p>
      <p className="card-text">{hit.brand}</p>
      <p className="card-text">${hit.price}</p>
    </div>
  </div>
);

const AlgoliaSearch = () => (
  <InstantSearch searchClient={searchClient} indexName={process.env.REACT_APP_ALGOLIA_INDEX_NAME}>
    <div style={{ maxWidth: '400px', margin: '10px auto' }}>
      <SearchBox translations={{ placeholder: 'Buscar camisetas...' }} />
    </div>
    <div className="d-flex flex-wrap justify-content-center">
      <Hits hitComponent={Hit} />
    </div>
  </InstantSearch>
);

export default AlgoliaSearch;
