import React, { useEffect, useState } from 'react';
import Layout from '../../components/Layout/layout';
import SearchForm from '../../components/Search/SearchForm';
import SearchResults from '../../components/Search/SearchResults';
import { useLunr } from 'react-lunr';
import { graphql } from 'gatsby';
import lunr from 'lunr';

const searchGraphQL = (results, searchQuery) => {
  return results.filter(node => {
    const nodeType = node.path.split('/')[2];
    return (
      nodeType !== 'publications' &&
      nodeType !== 'about' &&
      nodeType !== 'search' &&
      nodeType !== 'illustrations'
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

const Search = ({ data, location, pageContext, path }) => {
  const [results, setResults] = useState([]);
  const searchQuery =
    new URLSearchParams(location.search).get('keywords') || '';

  const mdResults = useLunr(
    searchQuery,
    data.localSearchMarkdown.index,
    data.localSearchMarkdown.store
  );

  const nonPublications = searchGraphQL(data.allSitePage.nodes, searchQuery);

  var idx = lunr(function() {
    this.ref('path');
    this.field('path');
    this.field('id');
    this.field('thumbnail');
    this.field('type');
    this.field('metadataEnglish');
    this.field('metadataDutch');

    nonPublications.forEach(function(doc) {
      this.add({
        path: doc.path,
        id: doc.context.id,
        thumbnail: resolveThumbnail(doc),
        metadataEnglish: resolveMetaDataEnglish(doc),
        metadataDutch: resolveMetaDataDutch(doc),
        type: doc.path.split('/')[2],
      });
    }, this);
  });

  const jsonResults = searchQuery !== '' ? idx.search(`*${searchQuery}*`) : [];

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
