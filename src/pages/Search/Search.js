import React, { useEffect, useState } from 'react';
import Layout from '../../components/Layout/layout';
import SearchForm from '../../components/Search/SearchForm';
import SearchResults from '../../components/Search/SearchResults';
import { useLunr } from 'react-lunr';
import { graphql } from 'gatsby';
import lunr from 'lunr';

const searchGraphQL = (results) => {
  return results.filter((node) => {
    const nodeType = node.path.split('/')[2];
    return (
      nodeType !== 'publications' &&
      nodeType !== 'Publications' &&
      nodeType !== 'about' &&
      nodeType !== 'search' &&
      nodeType !== 'illustrations' &&
      nodeType !== 'markdown' &&
      nodeType !== 'Object' &&
      nodeType !== 'Canvas'
    );
  });
};

const removeDuplicates = (results, lang) => {
  let results2 = [...results];

  let resultsInCurrentLang = results2.filter(
    (result) => result.path.split('/')[1] === lang
  );

  const allOtherLang = results2.filter(
    (result) => result.path.split('/')[1] !== lang
  );

  const relevantOtherLang = [];

  allOtherLang.forEach((result) => {
    let paths = resultsInCurrentLang.map((node) => node.path);
    let otherLangPath = result.path.split('/');
    let otherLang = otherLangPath[1] === 'en' ? 'nl' : 'en';
    otherLangPath[1] = otherLang;
    otherLangPath = otherLangPath.join('/');
    if (!paths.includes(otherLangPath)) {
      relevantOtherLang.push(result);
    }
  });
  return [...resultsInCurrentLang, ...relevantOtherLang];
};

// const resolveMetaDataEnglish = node => {
//   if (node.pageContext && node.pageContext.metadata) {
//     return node.pageContext.metadata.map(value => value.en).join(' | ');
//   }
// };

// const resolveMetaDataDutch = node => {
//   if (node.pageContext && node.pageContext.metadata) {
//     return node.pageContext.metadata.map(value => value.nl).join(' | ');
//   }
// };

const mapToFE = (lunrResults, nonPublications) => {
  const sortedOut = lunrResults
    ? lunrResults.map((result) =>
        nonPublications.filter((item) => item.path === result.ref)
      )
    : [];

  const results = sortedOut.map((node) => {
    const type = node[0].path && node[0].path.split('/')[2];
    const lang = node[0].path && node[0].path.split('/')[1];
    return {
      path: node[0].path,
      id: node[0].pageContext && node[0].pageContext.id,
      metadata: node[0].pageContext && node[0].pageContext.metadata,
      title: resolveTitle(node[0]),
      type: type,
    };
  });

  return results;
};

const resolveTitle = (node) => {
  const lang = node.path && node.path.split('/')[1];
  const type = node.path && node.path.split('/')[2];

  let otherLang = lang === 'en' ? 'nl' : 'en';

  if (type === 'objects') {
    if (!node.pageContext) return '';
    const title = node.pageContext.metadata[0].value[lang];
    if (!title) return node.pageContext.metadata[0].value[otherLang];
    return title;
  }
  if (type === 'collections') {
    if (node.path === '/en/collections') {
      return 'Collections';
    }
    if (node.path === '/nl/collections') {
      return 'Collecties';
    }
    const title =
      node.pageContext &&
      node.pageContext.collection &&
      node.pageContext.collection.label[lang][0];
    return title
      ? title
      : node.pageContext &&
          node.pageContext.collection &&
          node.pageContext.collection.label[otherLang][0];
  }
  if (type === 'exhibitions') {
    const title =
      node.pageContext &&
      node.pageContext.label &&
      node.pageContext.label[lang];
    return title
      ? title
      : node.pageContext &&
          node.pageContext.label &&
          node.pageContext.label[otherLang];
  }
};

const Search = ({ data, location, pageContext, path }) => {
  const [results, setResults] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [jsonResults, setJsonResults] = useState([]);

  useEffect(() => {
    setSearchQuery(new URLSearchParams(location.search).get('keywords') || '');
  }, [location.search]);

  const nonPublications = searchGraphQL(data.allSitePage.nodes, searchQuery);

  var idx = lunr(function () {
    this.ref('path');
    this.field('path');
    this.field('id');
    this.field('title');
    this.field('type');

    nonPublications.forEach(function (doc) {
      this.add({
        path: doc.path,
        id: doc.pageContext && doc.pageContext.id,
        title: resolveTitle(doc),
        type: doc.path && doc.path.split('/')[2],
      });
    }, this);
  });

  const useLunrSearch = () => {
    try {
      return useLunr(
        `${searchQuery}`,
        data.localSearchMarkdown.index,
        data.localSearchMarkdown.store
      );
    } catch (error) {
      console.log('Something went wrong on the Search query');
      setSearchQuery('');
      return [];
    }
  };

  const mdResults = useLunrSearch();

  const lunrSearch = (query) => {
    try {
      const res = idx.search(`*${query}*`);
      return res;
    } catch (error) {
      console.log('Something went wrong on the Search query');
      setSearchQuery('');
      return [];
    }
  };

  useEffect(() => {
    const found =
      searchQuery !== ''
        ? mapToFE(
            lunrSearch(searchQuery),
            nonPublications,
            pageContext.pageLanguage
          )
        : [];

    const cleaned = found.filter((res) => {
      return (
        res.path !== '/Exhibition/Exhibition/' &&
        !((res.path === '/en/exhibitions' || '/nl/exhibitions') && !res.title)
      );
    });
    setJsonResults(cleaned);
  }, [searchQuery]);

  useEffect(() => {
    if (searchQuery === '') {
      setResults([]);
    } else {
      const res = removeDuplicates(
        [...jsonResults, ...mdResults],
        location.pathname.split('/')[1]
      );
      setResults(res);
    }
  }, [jsonResults, mdResults]);

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
    allSitePage {
      nodes {
        path
        pageContext
      }
    }
  }
`;
