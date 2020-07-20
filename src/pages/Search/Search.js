import React, { useEffect, useState } from 'react';
import Layout from '../../components/Layout/layout';
import SearchForm from '../../components/Search/SearchForm';
import SearchResults from '../../components/Search/SearchResults';
import { useLunr } from 'react-lunr';
import lunr, { Index } from 'lunr';
import { Link, navigate } from 'gatsby';

const Search = ({ data, location, pageContext, path }) => {
  // const [results, setResults] = useState([]);

  const searchQuery =
    new URLSearchParams(location.search).get('keywords') || '';
  console.log(data);
  const results = useLunr(
    searchQuery,
    data.localSearchMarkdown.index,
    data.localSearchMarkdown.store
  );

  console.log(results);

  // useEffect(() => {
  //   const { store } = data.localSearchMarkdown;
  //   // Lunr in action here
  //   const index = Index.load(data.LunrIndex.index);
  //   console.log(index);
  //   let found = [];
  //   try {
  //     // Search is a lunr method
  //     found = index.search(searchQuery).map(({ ref }) => {
  //       // Map search results to an array of {slug, title, excerpt} objects
  //       return {
  //         path: ref,
  //         ...store[ref],
  //       };
  //     });
  //   } catch (error) {
  //     console.log(error);
  //   }
  //   setResults(found);
  // }, [location.search]);

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
