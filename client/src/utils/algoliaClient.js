import algoliasearch from 'algoliasearch/lite';

const client = algoliasearch(
  process.env.REACT_APP_ALGOLIA_APP_ID,
  process.env.REACT_APP_ALGOLIA_SEARCH_KEY
);

const index = client.initIndex(process.env.REACT_APP_ALGOLIA_INDEX_NAME);

export default index;
