import React from 'react';
import PropTypes from 'prop-types';
import { StaticQuery, graphql } from 'gatsby';
import './languageSelector.css';

const LanguageSelector = ({ data, path = '' }) => {
  const pathNoLocale = path.replace(/^(en|nl)/, '');
  const englishPath = `/en${pathNoLocale}`;
  const dutchPath = `/nl${pathNoLocale}`;
  let allowEnglish = false;
  let allowDutch = false;

  data.allSitePage.edges.forEach(site => {
    if (
      site.node.path === englishPath ||
      site.node.path === `${englishPath}/`
    ) {
      allowEnglish = true;
    }
    if (site.node.path === dutchPath || site.node.path === `${dutchPath}/`) {
      allowDutch = true;
    }
  });

  return (
    <span className="language-selector">
      {allowEnglish ? (
        <a
          href={allowEnglish ? englishPath : null}
          className="language-selector__translation"
        >
          EN
        </a>
      ) : null}
      {allowEnglish && allowDutch ? '/' : null}
      {allowDutch ? (
        <a
          href={allowDutch ? dutchPath : null}
          className="language-selector__translation"
        >
          NL
        </a>
      ) : null}
    </span>
  );
};

export default props => (
  <StaticQuery
    query={graphql`
      {
        allSitePage {
          edges {
            node {
              id
              path
            }
          }
        }
      }
    `}
    render={data => <LanguageSelector data={data} {...props} />}
  />
);

LanguageSelector.propTypes = {
  path: PropTypes.string.isRequired,
  data: PropTypes.shape({
    allSitePage: PropTypes.shape({
      edges: PropTypes.arrayOf(
        PropTypes.shape({
          node: PropTypes.shape({
            id: PropTypes.string,
            path: PropTypes.string,
          }).isRequired,
        })
      ).isRequired,
    }).isRequired,
  }).isRequired,
};
