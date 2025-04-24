import React from 'react';
import algoliasearch from 'algoliasearch/lite';
import {
  InstantSearch,
  SearchBox,
  connectHits
} from 'react-instantsearch-dom';

import ProductList from '../product/ProductList';
import AlgoliaTeamFilter from '../search/AlgoliaTeamFilter'; // nuevo filtro

const searchClient = algoliasearch(
  process.env.REACT_APP_ALGOLIA_APP_ID,
  process.env.REACT_APP_ALGOLIA_SEARCH_KEY
);

const CustomHits = connectHits(({ hits }) => {
  return <ProductList products={hits} />;
});

const AlgoliaWrapper = () => {
  return (
    <InstantSearch
      searchClient={searchClient}
      indexName={process.env.REACT_APP_ALGOLIA_INDEX_NAME}
    >
      <div className="row" style={{ padding: '0 30px' }}>
        {/* Filtro de equipo (columna izquierda) */}
        <div className="col-xl-3 mb-3">
        <AlgoliaTeamFilter attribute="team" />
        </div>

        {/* Buscador + resultados (columna derecha) */}
        <div className="col-xl-9">
          <div style={{ marginBottom: '10px' }}>
            <SearchBox
              translations={{ placeholder: 'Buscar camisetas...' }}
              className="form-control mb-4"
            />
          </div>
          <CustomHits />
        </div>
      </div>
    </InstantSearch>
  );
};

export default AlgoliaWrapper;
