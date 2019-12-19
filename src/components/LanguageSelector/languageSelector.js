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

  data.allSitePage.edges.forEach((site) => {
    if (site.node.path === englishPath) {
      console.log(site);
      allowEnglish = true;
    }
    if (site.node.path === dutchPath) {
      console.log(site);
      allowDutch = true;
    }
  });


  return (
    <span className="language-selector">
      <a href={allowEnglish ? englishPath : null} className="language-selector__translation" disabled={!allowEnglish}>
        EN
      </a>
      /
      <a href={allowDutch ? dutchPath : null} className="language-selector__translation">
        NL
      </a>
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
};

// export default LanguageSelector;
