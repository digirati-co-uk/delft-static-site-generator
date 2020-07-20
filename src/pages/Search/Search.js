import React, { useEffect, useState } from 'react';
import Layout from '../../components/Layout/layout';
import SearchForm from '../../components/Search/SearchForm';
import SearchResults from '../../components/Search/SearchResults';
import { useLunr } from 'react-lunr';
import { useStaticQuery, graphql } from 'gatsby';

const Search = ({ data, location, pageContext, path }) => {
  const [results, setResults] = useState([]);
  console.log(data);
  const searchQuery =
    new URLSearchParams(location.search).get('keywords') || '';

  const mdResults = useLunr(
    searchQuery,
    data.localSearchMarkdown.index,
    data.localSearchMarkdown.store
  );
  const jsonResults = useLunr(
    searchQuery,
    data.localSearchPages.index,
    data.localSearchPages.store
  );

  useEffect(() => {
    setResults([...mdResults, ...jsonResults]);
  }, [location.search]);

  return (
    <Layout
      language={pageContext.pageLanguage}
      path={path}
      meta={{ desciption: 'Search' }}
    >
      <main>
        <SearchForm
          pageLanguage={pageContext.pageLanguage}
          query={searchQuery}
          showTitle={true}
        />
        <SearchResults query={searchQuery} results={results} />
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
    localSearchMarkdown {
      index
      store
    }
    localSearchPages {
      index
      store
    }
  }
`;
