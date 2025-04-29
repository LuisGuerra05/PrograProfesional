import React, { useState, useEffect } from 'react';
import algoliasearch from 'algoliasearch/lite';
import {
  InstantSearch,
  SearchBox,
  Configure,
  Panel,
  Pagination,
  connectStateResults,
  connectHits
} from 'react-instantsearch-dom';
import { useTranslation } from 'react-i18next';
import '../../styles/pagination.css';
import '../../styles/search.css';
import { Spinner } from 'react-bootstrap';

import ProductList from '../product/ProductList';
import AlgoliaTeamFilter from '../search/AlgoliaTeamFilter';
import { useLocation } from 'react-router-dom';

const searchClient = algoliasearch(
  process.env.REACT_APP_ALGOLIA_APP_ID,
  process.env.REACT_APP_ALGOLIA_SEARCH_KEY
);

// Componente de resultados de productos
const CustomHits = connectHits(({ hits, searchState, searchResults }) => {
  const { t } = useTranslation();

  const hasTeamFilter = searchState?.refinementList?.team?.length > 0;
  const hasSearchText = searchState?.query?.trim()?.length > 0;
  const isLoading = searchResults?.isSearchStalled;
  const hasAnyFilter = hasTeamFilter || hasSearchText;

  if (hasAnyFilter && isLoading) return null;

  if (hasAnyFilter && hits.length === 0) {
    return (
      <div className="text-center py-5">
        <p>{t('no-products')}</p>
      </div>
    );
  }

  return <ProductList products={hits} />;
});

const AlgoliaWrapper = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const [teamParamReady, setTeamParamReady] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const teamParam = params.get('team');

    if (teamParam) {
      const timer = setTimeout(() => {
        setTeamParamReady(true);
      }, 300);
      return () => clearTimeout(timer);
    } else {
      setTeamParamReady(true);
    }
  }, [location.search]);

  const ResultsWithState = connectStateResults(({ searchState, searchResults }) => {
    if (!teamParamReady) {
      return (
        <div className="text-center py-5 d-flex justify-content-center align-items-center gap-2">
          <Spinner animation="border" role="status" size="sm" />
          <span>{t('loading-products')}</span>
        </div>
      );
    }

    return <CustomHits searchState={searchState} searchResults={searchResults} />;
  });

  return (
    <InstantSearch
      searchClient={searchClient}
      indexName={process.env.REACT_APP_ALGOLIA_INDEX_NAME}
    >
      <Configure hitsPerPage={20} />

      <div className="row" style={{ padding: '0 30px' }}>
        <div className="col-12 col-md-4 col-lg-3 mb-3">
          <Panel header="" collapsed={false}>
            <AlgoliaTeamFilter attribute="team" />
          </Panel>
        </div>

        <div className="col-12 col-md-8 col-lg-9">
          <div style={{ marginBottom: '10px' }}>
            <SearchBox
              translations={{ placeholder: t('searchPlaceholder') }}
              className="form-control mb-4"
            />
          </div>

          <ResultsWithState />

          {/* Logo requerido por el plan gratuito de Algolia */}
          <div className="text-center mt-4 mb-2">
            <a
              href="https://www.algolia.com"
              target="_blank"
              rel="noopener noreferrer"
              style={{ fontSize: '12px', color: '#aaa' }}
            >
              {t('search_powered_by')} <strong>Algolia</strong>
            </a>
          </div>

          <Pagination showLast={true} showFirst={true} padding={2} />
        </div>
      </div>
    </InstantSearch>
  );
};

export default AlgoliaWrapper;