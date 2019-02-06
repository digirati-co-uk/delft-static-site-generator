import React from 'react';
import PropTypes from 'prop-types';
import Helmet from 'react-helmet';
import { StaticQuery, graphql } from 'gatsby';

import Header from '../Header/header';
import Footer from '../Footer/footer';
import './layout.css';
import '../delft-styles.scss';


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
        <Header siteTitle={data.site.siteMetadata.title} language={language} path={path} />
        {children}
        <Footer />
      </React.Fragment>
      )}
  />
);

Layout.propTypes = {
  children: PropTypes.node.isRequired,
  language: PropTypes.string.isRequired,
  path: PropTypes.string.isRequired,
};

export default Layout;
