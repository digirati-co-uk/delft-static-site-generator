import React, { useEffect, useState } from 'react';
import Layout from '../../components/Layout/layout';
import SearchForm from '../../components/Search/SearchForm';
import SearchResults from '../../components/Search/SearchResults';
import { useLunr } from 'react-lunr';
import { graphql } from 'gatsby';
import lunr from 'lunr';

const searchGraphQL = results => {
  return results.filter(node => {
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
    result => result.path.split('/')[1] === lang
  );

  const allOtherLang = results2.filter(
    result => result.path.split('/')[1] !== lang
  );

  const relevantOtherLang = [];

  allOtherLang.forEach(result => {
    let paths = resultsInCurrentLang.map(node => node.path);
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

const resolveThumbnail = node => {
  const nodeType = node.path.split('/')[2];
  if (nodeType === 'exhibitions') {
    return getExhbitionImage(node);
  }
  if (nodeType === 'objects') {
    return getObjectImage(node);
  }
  if (nodeType === 'collections') {
    return getCollectionsImage(node);
  }
};

const getCollectionsImage = node => {
  const collection = node.context.collection;
  let image =
    collection &&
    collection.items &&
    collection.items[0] &&
    collection.items[0].thumbnail &&
    collection.items[0].thumbnail[0] &&
    collection.items[0].thumbnail[0].id
      ? collection.items[0].thumbnail[0].id
      : null;
  return image;
};

const getObjectImage = node => {
  const items = node.context.items;
  let image =
    items &&
    items[0] &&
    items[0].items &&
    items[0].items[0] &&
    items[0].items[0].items &&
    items[0].items[0].items[0] &&
    items[0].items[0].items[0].body &&
    items[0].items[0].items[0].body.id
      ? items[0].items[0].items[0].body.id
      : null;
  return image;
};

const getExhbitionImage = node => {
  const items = node.context.items;
  let image =
    items &&
    items[0] &&
    items[0].items &&
    items[0].items[0] &&
    items[0].items[0].items &&
    items[0].items[0].items[0] &&
    items[0].items[0].items[0].thumbnail &&
    items[0].items[0].items[0].thumbnail[0] &&
    items[0].items[0].items[0].thumbnail[0].id
      ? items[0].items[0].items[0].thumbnail[0].id
      : null;

  // if no image, eg. first block sometimes an about block
  if (!image) {
    image =
      items &&
      items[1] &&
      items[1].items &&
      items[1].items[0] &&
      items[1].items[0].items &&
      items[1].items[0].items[0] &&
      items[1].items[0].items[0].thumbnail &&
      items[1].items[0].items[0].thumbnail[0] &&
      items[1].items[0].items[0].thumbnail[0].id
        ? items[1].items[0].items[0].thumbnail[0].id
        : null;
  }
  return image;
};

// const resolveMetaDataEnglish = node => {
//   if (node.context && node.context.metadata) {
//     return node.context.metadata.map(value => value.en).join(' | ');
//   }
// };

// const resolveMetaDataDutch = node => {
//   if (node.context && node.context.metadata) {
//     return node.context.metadata.map(value => value.nl).join(' | ');
//   }
// };

const mapToFE = (lunrResults, nonPublications) => {
  const sortedOut = lunrResults.map(result =>
    nonPublications.filter(item => item.path === result.ref)
  );

  const results = sortedOut.map(node => {
    const type = node[0].path && node[0].path.split('/')[2];
    const lang = node[0].path && node[0].path.split('/')[1];
    return {
      path: node[0].path,
      id: node[0].context && node[0].context.id,
      image: resolveThumbnail(node[0]),
      metadata: node[0].context && node[0].context.metadata,
      title: resolveTitle(node[0]),
      type: type,
    };
  });

  return results;
};

const resolveTitle = node => {
  const lang = node.path && node.path.split('/')[1];
  const type = node.path && node.path.split('/')[2];

  let otherLang = lang === 'en' ? 'nl' : 'en';

  if (type === 'objects') {
    const title = node.context.metadata[0].value[lang];
    if (!title) return node.context.metadata[0].value[otherLang];
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
      node.context &&
      node.context.collection &&
      node.context.collection.label[lang];
    return title
      ? title
      : node.context &&
          node.context.collection &&
          node.context.collection.label[otherLang];
  }
  if (type === 'exhibitions') {
    const title =
      node.context && node.context.label && node.context.label[lang];
    return title
      ? title
      : node.context && node.context.label && node.context.label[otherLang];
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

  var idx = lunr(function() {
    this.ref('path');
    this.field('path');
    this.field('id');
    this.field('title');
    this.field('image');
    this.field('type');

    nonPublications.forEach(function(doc) {
      this.add({
        path: doc.path,
        id: doc.context && doc.context.id,
        image: resolveThumbnail(doc),
        title: resolveTitle(doc),
        type: doc.path && doc.path.split('/')[2],
      });
    }, this);
  });

  const mdResults = useLunr(
    `${searchQuery}`,
    data.localSearchMarkdown.index,
    data.localSearchMarkdown.store
  );

  useEffect(() => {
    setJsonResults(
      searchQuery !== ''
        ? mapToFE(
            idx.search(`*${searchQuery}*`),
            nonPublications,
            pageContext.pageLanguage
          )
        : []
    );
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
        context {
          id
          metadata {
            label {
              en
              nl
            }
            value {
              en
              nl
            }
          }
          collection {
            items {
              thumbnail {
                id
              }
            }
            label {
              en
              nl
            }
          }
          label {
            en
          }
          items {
            items {
              items {
                thumbnail {
                  id
                }
                body {
                  id
                }
              }
            }
          }
        }
      }
    }
  }
`;
