import React, { useEffect, useState, useRef } from 'react';
import Layout from '../../components/Layout/layout';
import { SearchResult } from '../../components/Search/SearchResults';
import { graphql } from 'gatsby';
import { orderBy } from 'lodash';
import { navigate } from 'gatsby';
import qs from 'qs';
import './Search.scss';
import withLocation from '../../components/withLocation/withLocation';

import {
  InstantSearch,
  SearchBox,
  Hits,
  connectStats,
  Pagination,
  connectHighlight,
  RefinementList,
  Configure,
} from 'react-instantsearch-dom';
import TypesenseInstantSearchAdapter from 'typesense-instantsearch-adapter';
const DEBOUNCE_TIME = 400;
const createURL = (state) => `?${qs.stringify(state)}`;

const searchStateToUrl = (searchState) =>
  searchState ? createURL(searchState) : '';

const urlToSearchState = ({ search }) => qs.parse(search.slice(1));

const Search = ({ pageContext, path, location }) => {
  const [isSearching, setIsSearching] = useState(false);
  const [searchState, setSearchState] = useState(urlToSearchState(location));

  const debouncedSetStateRef = useRef(null);

  function onSearchStateChange(updatedSearchState) {
    clearTimeout(debouncedSetStateRef.current);

    debouncedSetStateRef.current = setTimeout(() => {
      navigate(searchStateToUrl(updatedSearchState), { replace: true });
    }, DEBOUNCE_TIME);

    setSearchState(updatedSearchState);
  }

  useEffect(() => {
    setSearchState(urlToSearchState(location));
  }, [location]);

  useEffect(() => {
    if (searchState.query !== '' && searchState.query) {
      setIsSearching(true);
    } else {
      setIsSearching(false);
    }
  }, [searchState]);

  const typesenseInstantsearchAdapter = new TypesenseInstantSearchAdapter({
    server: {
      apiKey: 'AOXs2nQnRYi5Cs9NvCiUPyLPXAWSdIeJ', // Be sure to use the search-only-api-key
      nodes: [
        {
          host: '63flhve71t2un5xgp-1.a1.typesense.net',
          port: '443',
          protocol: 'https',
        },
      ],
    },
    // The following parameters are directly passed to Typesense's search API endpoint.
    //  So you can pass any parameters supported by the search endpoint below.
    //  queryBy is required.
    additionalSearchParameters: {
      query_by: 'title,about,image,type,content,author',
    },
    attributesToSnippet: ['content'],
  });
  const searchClient = typesenseInstantsearchAdapter.searchClient;

  const Stats = ({ nbHits }) => <p> {nbHits} results</p>;
  const CustomStats = connectStats(Stats);

  const CustomHits = () => (
    <Hits
      hitComponent={({ hit }) => (
        <SearchResult hit={hit} page_path={path} isSearching={isSearching} />
      )}
    />
  );

  const CustomHighlight = connectHighlight(CustomHits);

  return (
    <Layout
      language={pageContext.pageLanguage}
      path={path}
      meta={{ description: 'Search' }}
    >
      <main>
        <InstantSearch
          searchClient={searchClient}
          indexName="pages_v1"
          searchState={searchState}
          onSearchStateChange={onSearchStateChange}
          createURL={createURL}
        >
          <div className="search-content">
            <h1>Search</h1>
            <SearchBox />
            <CustomStats />
            <RefinementList
              attribute="type"
              // sortBy={['name:asc']}
              facetOrdering={false}
              transformItems={(items) => orderBy(items, 'label', 'asc')}
            />
            <Configure hitsPerPage={20} attributesToSnippet={['content']} />

            <CustomHighlight />
            <Pagination
              // Optional parameters
              showFirst={true}
              showPrevious={true}
              showNext={true}
              showLast={true}
            />
          </div>
        </InstantSearch>
      </main>
    </Layout>
  );
};

export const pageQuery = graphql`
  query {
    site {
      siteMetadata {
        title
      }
    }
  }
`;

export default withLocation(Search);
