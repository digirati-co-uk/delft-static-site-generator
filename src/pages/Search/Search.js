import React, { useEffect, useState } from 'react';
import Layout from '../../components/Layout/layout';
import SearchForm from '../../components/Search/SearchForm';
import SearchResults from '../../components/Search/SearchResults';
import { Link, navigate } from 'gatsby';

const Search = data => {
  const [results, setResults] = useState([]);
  const searchQuery =
    new URLSearchParams(data.location.search).get('keywords') || '';

  useEffect(() => {
    if (searchQuery && window.__LUNR__) {
      window.__LUNR__.__loaded.then(lunr => {
        const refs = lunr.en.index.search(searchQuery);
        const posts = refs.map(({ ref }) => lunr.en.store[ref]);
        setResults(posts);
      });
    }
  }, [data.location.search]);

  return (
    <Layout
      language={data.pageContext.pageLanguage}
      path={data.path}
      meta={{ desciption: 'Search' }}
    >
      <main>
        <SearchForm
          pageLanguage={data.pageContext.pageLanguage}
          query={searchQuery}
        />
        <SearchResults query={searchQuery} results={results} />
      </main>
    </Layout>
  );
};

export default Search;
