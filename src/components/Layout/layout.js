import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import Helmet from 'react-helmet';
import { StaticQuery, graphql } from 'gatsby';
import { TranslatorProvider } from 'react-translate';
import Header from '../Header/header';
import Footer from '../Footer/footer';

import './layout.css';
import '../delft-styles.scss';

import translations from '../../translations';

const Layout = ({ children, language, path }) => {
  const [firstImage, setFirstImage] = useState('');

  const getFirstImage = () => {
    setFirstImage(document.images[0].src);
  };

  useEffect(() => {
    getFirstImage();
  }, []);

  return (
    <StaticQuery
      query={graphql`
        query SiteTitleQuery {
          site {
            siteMetadata {
              title
              url
              twitterHandle
            }
          }
        }
      `}
      render={data => (
        <TranslatorProvider
          translations={translations[language] || translations.en}
        >
          <React.Fragment>
            <Helmet
              title={data.site.siteMetadata.title}
              meta={[
                {
                  name: 'description',
                  content:
                    'Explore the history of Delft University of Technology and the Special Collections of TU Delft Library.',
                },
                {
                  name: 'keywords',
                  content:
                    'academic heritage, heritage, special collections, library, history, technology, iiif, open source',
                },
                { name: 'twitter:image', content: `${firstImage}` },
                {
                  name: 'twitter:title',
                  content: data.site.siteMetadata.title,
                },
                {
                  name: 'twitter:description',
                  content:
                    'Explore the history of Delft University of Technology and the Special Collections of TU Delft Library.',
                },
                { name: 'twitter:card', content: 'summary_large_image' },
                { name: 'og:url', content: 'https://erfgoed.tudelft.nl/en' },
                { name: 'og:type', content: 'website' },
                { name: 'og:title', content: data.site.siteMetadata.title },
                { name: 'og:image', content: `${firstImage}` },
                {
                  name: 'og:description',
                  content:
                    'Explore the history of Delft University of Technology and the Special Collections of TU Delft Library.',
                },
              ]}
            >
              <html lang={language} />
            </Helmet>
            <Header language={language} path={path} />
            {children}
            <Footer
              path={path}
              title={data.site.siteMetadata.title}
              url={data.site.siteMetadata.url}
              twitterHandle={data.site.siteMetadata.twitterHandle}
            />
          </React.Fragment>
        </TranslatorProvider>
      )}
    />
  );
};

Layout.propTypes = {
  children: PropTypes.node.isRequired,
  language: PropTypes.string.isRequired,
  path: PropTypes.string.isRequired,
};

export default Layout;
