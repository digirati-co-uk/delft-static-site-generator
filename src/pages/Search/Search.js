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

const removeDuplicates = results => {
  // take out the language duplicates
  return results;
};

const resolveThumbnail = node => {
  if (
    node.context &&
    node.context.items &&
    node.context.items[0] &&
    node.context.items[0].items &&
    node.context.items[0].items[0] &&
    node.context.items[0].items[0].items &&
    node.context.items[0].items[0].items[0] &&
    node.context.items[0].items[0].items[0].thumbnail &&
    node.context.items[0].items[0].items[0].thumbnail[0] &&
    node.context.items[0].items[0].items[0].thumbnail[0].id
  ) {
    return node.context.items[0].items[0].items[0].thumbnail[0].id;
  } else return '';
};

const resolveMetaDataEnglish = node => {
  if (node.context && node.context.metadata) {
    return node.context.metadata.map(value => value.en).join(' | ');
  }
};

const resolveMetaDataDutch = node => {
  if (node.context && node.context.metadata) {
    return node.context.metadata.map(value => value.nl).join(' | ');
  }
};

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
      metadata: node[0].context.metadata,
      title: resolveTitle(node[0], lang, type),
      type: type,
    };
  });

  return results;
};

const resolveTitle = node => {
  let otherLang = lang === 'en' ? 'nl' : 'en';
  const lang = node.path && node.path.split('/')[1];
  const type = node.path && node.path.split('/')[2];

  if (type === 'objects') {
    const title = node.context.metadata[0].value[lang];
    if (!title) return node.context.metadata[0].value[otherLang];
    return title;
  }
  if (type === 'collections') {
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
  const searchQuery =
    new URLSearchParams(location.search).get('keywords') || '';

  const mdResults = useLunr(
    `*${searchQuery}*`,
    data.localSearchMarkdown.index,
    data.localSearchMarkdown.store
  );

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
  const jsonResults =
    searchQuery !== ''
      ? mapToFE(
          idx.search(`*${searchQuery}*`),
          nonPublications,
          pageContext.pageLanguage
        )
      : [];

  useEffect(() => {
    const res = removeDuplicates([...mdResults, ...jsonResults]);
    setResults(res);
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
              }
            }
          }
        }
      }
    }
  }
`;
