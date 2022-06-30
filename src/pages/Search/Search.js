import React, { useEffect, useState } from 'react';
import Layout from '../../components/Layout/layout';
import { SearchResult } from '../../components/Search/SearchResults';
import { graphql } from 'gatsby';
import './Search.scss';

import {
  InstantSearch,
  SearchBox,
  Hits,
  connectStats,
  Pagination,
  ScrollTo,
  Highlight,
  connectHighlight,
} from 'react-instantsearch-dom';
import TypesenseInstantSearchAdapter from 'typesense-instantsearch-adapter';

const typesenseInstantsearchAdapter = new TypesenseInstantSearchAdapter({
  server: {
    apiKey: 'xyz', // Be sure to use the search-only-api-key
    nodes: [
      {
        host: 'localhost',
        port: '8108',
        protocol: 'http',
      },
    ],
  },
  // The following parameters are directly passed to Typesense's search API endpoint.
  //  So you can pass any parameters supported by the search endpoint below.
  //  queryBy is required.
  additionalSearchParameters: {
    queryBy: 'title,about,image,type,content,author',
  },
});
const searchClient = typesenseInstantsearchAdapter.searchClient;

const Stats = ({ nbHits }) => <p> {nbHits} results</p>;
const CustomStats = connectStats(Stats);

const CustomHits = () => <Hits hitComponent={SearchResult} />;

const CustomHighlight = connectHighlight(CustomHits);

const Search = ({ pageContext, path }) => {
  return (
    <Layout
      language={pageContext.pageLanguage}
      path={path}
      meta={{ description: 'Search' }}
    >
      <main>
        <InstantSearch searchClient={searchClient} indexName="pages_v1">
          <div className="search-content">
            <h1>Search</h1>
            <SearchBox />
            <CustomStats />
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

export default Search;

export const pageQuery = graphql`
  query {
    site {
      siteMetadata {
        title
      }
    }
  }
`;
