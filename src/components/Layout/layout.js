import React from 'react';
import PropTypes from 'prop-types';
import Helmet from 'react-helmet';
import { StaticQuery, graphql } from 'gatsby';
import { TranslatorProvider } from 'react-translate';
import Header from '../Header/header';
import Footer from '../Footer/footer';
import './layout.css';
import '../delft-styles.scss';

import translations from '../../translations';

const Layout = ({ children, language, path }) => (
  <StaticQuery
    query={graphql`
        query SiteTitleQuery {
          site {
            siteMetadata {
              title
            }
          }
        }
      `}
    render={data => (
      <TranslatorProvider translations={translations[language] || translations.en}>
        <React.Fragment>
          <Helmet
            title={data.site.siteMetadata.title}
            meta={[
                { name: 'description', content: 'Sample' },
                { name: 'keywords', content: 'sample, something' },
              ]}
          >
            <html lang={language} />
          </Helmet>
          <Header language={language} path={path} />
          {children}
          <Footer />
        </React.Fragment>
      </TranslatorProvider>
      )}
  />
);

Layout.propTypes = {
  children: PropTypes.node.isRequired,
  language: PropTypes.string.isRequired,
  path: PropTypes.string.isRequired,
};

export default Layout;
