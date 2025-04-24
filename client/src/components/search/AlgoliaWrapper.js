// 🔁 AlgoliaWrapper.js (con paginación)
import React from 'react';
import algoliasearch from 'algoliasearch/lite';
import {
  InstantSearch,
  SearchBox,
  connectHits,
  Configure,
  Panel,
  Pagination
} from 'react-instantsearch-dom';
import { useTranslation } from 'react-i18next';
import '../../styles/pagination.css'; // Ajusta la ruta relativa


import ProductList from '../product/ProductList';
import AlgoliaTeamFilter from '../search/AlgoliaTeamFilter';

const searchClient = algoliasearch(
  process.env.REACT_APP_ALGOLIA_APP_ID,
  process.env.REACT_APP_ALGOLIA_SEARCH_KEY
);

const CustomHits = connectHits(({ hits }) => {
  return <ProductList products={hits} />;
});

const AlgoliaWrapper = () => {
  const { t } = useTranslation();

  return (
    <InstantSearch
      searchClient={searchClient}
      indexName={process.env.REACT_APP_ALGOLIA_INDEX_NAME}
    >
      <Configure hitsPerPage={20} /> {/* Limitar los productos a mostrar por página */}

      <div className="row" style={{ padding: '0 30px' }}>
        {/* Filtro de equipo (izquierda) */}
        <div className="col-12 col-md-4 col-lg-3 mb-3">
          <Panel header="" collapsed={false}>
            <AlgoliaTeamFilter attribute="team" />
          </Panel>
        </div>

        {/* Resultados (derecha) */}
        <div className="col-12 col-md-8 col-lg-9">
          <div style={{ marginBottom: '10px' }}>
            <SearchBox
              translations={{ placeholder: t('searchPlaceholder') }}
              className="form-control mb-4"
            />
          </div>
          <CustomHits />
          {/* Paginación */}
          <Pagination
            showLast={true}
            showFirst={true}
            padding={2}
          />
        </div>
      </div>
    </InstantSearch>
  );
};

export default AlgoliaWrapper;
