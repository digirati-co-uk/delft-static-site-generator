import React from 'react';
import PropTypes from 'prop-types';
import Helmet from 'react-helmet';
import { StaticQuery, graphql } from 'gatsby';
import { TranslatorProvider } from 'react-translate';
import Header from '../Header/header';
import Footer from '../Footer/footer';
import './layout.css';
import '../delft-styles.scss';
import defaultImage from '../../images/defaultSocial.jpg';

import translations from '../../translations';

class Layout extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      firstImage: '',
    };
  }

  componentDidMount() {
    const pattern = /^((http|https):\/\/)/;
    if (document.images && document.images.length > 1) {
      const firstImage = pattern.test(document.images[0])
        ? document.images[0].src
        : document.images[1].src;
      this.setState({ firstImage });
    } else {
      this.setState({ firstImage: defaultImage });
    }
  }

  render() {
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
            translations={translations[this.props.language] || translations.en}
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
                  {
                    name: 'twitter:image',
                    content: `${this.state.firstImage}`,
                  },
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
                  { name: 'og:image', content: `${this.state.firstImage}` },
                  {
                    name: 'og:description',
                    content:
                      'Explore the history of Delft University of Technology and the Special Collections of TU Delft Library.',
                  },
                ]}
              >
                <html lang={this.props.language} />
              </Helmet>
              <Header language={this.props.language} path={this.props.path} />
              {this.props.children}
              <Footer
                path={this.props.path}
                title={data.site.siteMetadata.title}
                url={data.site.siteMetadata.url}
                twitterHandle={data.site.siteMetadata.twitterHandle}
              />
            </React.Fragment>
          </TranslatorProvider>
        )}
      />
    );
  }
}

Layout.propTypes = {
  children: PropTypes.node.isRequired,
  language: PropTypes.string.isRequired,
  path: PropTypes.string.isRequired,
};

export default Layout;
