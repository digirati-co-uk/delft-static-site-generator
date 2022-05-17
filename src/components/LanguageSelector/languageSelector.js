import React from 'react';
import PropTypes from 'prop-types';
import { StaticQuery, graphql } from 'gatsby';
import { Link } from 'gatsby';
import './languageSelector.scss';

const LanguageSelector = ({ data, path = '' }) => {
  const pathNoLocale = path.replace(/^\/(en|nl)/, '');
  const englishPath = `/en${pathNoLocale}`;
  const dutchPath = `/nl${pathNoLocale}`;
  let allowEnglish = false;
  let allowDutch = false;

  data.allSitePage.edges.forEach((site) => {
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
        <Link
          to={allowEnglish ? englishPath : null}
          className="language-selector__translation"
        >
          EN
        </Link>
      ) : (
        <p
          title="An English translation of this page is not available"
          className="language-selector__translation--not-allowed"
        >
          EN
        </p>
      )}{' '}
      /{' '}
      {allowDutch ? (
        <Link
          to={allowDutch ? dutchPath : null}
          className="language-selector__translation"
        >
          NL
        </Link>
      ) : (
        <p
          title="Een Nederlandse vertaling van deze pagina is niet beschikbaar"
          className="language-selector__translation--not-allowed"
        >
          NL
        </p>
      )}
    </span>
  );
};

export default (props) => (
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
    render={(data) => <LanguageSelector data={data} {...props} />}
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
