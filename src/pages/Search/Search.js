import React from 'react';
import Layout from '../../components/Layout/layout';
import { SearchResult } from '../../components/Search/SearchResults';
import { graphql } from 'gatsby';
import { orderBy } from 'lodash';
import './Search.scss';

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

const Search = ({ pageContext, path }) => {
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
  });
  const searchClient = typesenseInstantsearchAdapter.searchClient;

  const Stats = ({ nbHits }) => <p> {nbHits} results</p>;
  const CustomStats = connectStats(Stats);

  const CustomHits = () => (
    <Hits
      hitComponent={({ hit }) => <SearchResult hit={hit} page_path={path} />}
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
        <InstantSearch searchClient={searchClient} indexName="pages_v1">
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
