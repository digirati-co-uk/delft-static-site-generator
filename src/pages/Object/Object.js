import React from 'react';
import PropTypes from 'prop-types';
import Layout from '../../components/Layout/layout';
import GithubLink from '../../components/GithubLink/GithubLink';
import { getTranslation as translate, getPageLanguage } from '../../utils';
import { IIIFLink } from '../../components/IIIFLink/IIIFLink';
import { graphql, Link } from 'gatsby';

import DynamicSlideShow from '../../components/SlideShow/dynamic-slideshow';

const isHtml = val => val.match(/<[^>]+>/) !== null;

class ObjectPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      renderSlideShow: 'Loading...',
      publications: [],
      ids: (this.props.pageContext.items || []).map(
        item => item.thumbnail && item.thumbnail[0] && item.thumbnail[0].id
      ),
    };
  }

  componentDidMount() {
    const { pageContext } = this.props;
    const allPublications = this.props.data.allMarkdownRemark.edges;
    const allIllustrations = this.props.data.allSitePage.nodes;
    this.setState({
      renderSlideShow: <DynamicSlideShow context={pageContext} />,
    });

    const publications = this.getRelatedPublications(
      allPublications,
      allIllustrations
    );
    this.setState({ publications: publications });
  }

  getThumbnailsFromIllustration = illustration => {
    if (
      illustration &&
      illustration.context &&
      illustration.context.items &&
      illustration.context.items[0] &&
      illustration.context.items[0].items &&
      illustration.context.items[0].items[0] &&
      illustration.context.items[0].items[0].items
    ) {
      return illustration.context.items[0].items[0].items.map(
        item => item.thumbnail && item.thumbnail[0] && item.thumbnail[0].id
      );
    }
  };

  getRelatedPublications = (allPub, allIll) => {
    //first get the ids of the illustion id from the illustrations
    const illustationIds = allIll
      .filter(illustration => {
        let thumbnailId = this.getThumbnailsFromIllustration(illustration);
        if (
          thumbnailId &&
          this.state.ids.filter(id => thumbnailId.includes(id)).length > 0
        ) {
          return illustration;
        }
      })
      .map(illus => illus.path.split('/').pop());

    const publications = allPub
      .filter(publication => {
        if (publication.node && publication.node.rawMarkdownBody) {
          return illustationIds.some(path =>
            publication.node.rawMarkdownBody.includes(path)
          );
        }
      })
      .map(publication => {
        return {
          title: publication.node.frontmatter.title,
          path: publication.node.frontmatter.path,
        };
      });
    return publications;
  };

  getPageMetaData = () => {
    const id =
      this.props.location && this.props.location.search
        ? this.props.location.search.split('?id=')[1].replace('/', '')
        : 0;
    const image = this.state.ids[id];
    const summary =
      this.props.pageContext &&
      this.props.pageContext.metadata &&
      this.props.pageContext.metadata[0]
        ? this.props.pageContext.metadata[0].value
        : null;
    const language = this.props.location.pathname
      ? this.props.location.pathname.split('/')[1]
      : 'nl';
    const meta = {
      image: image,
      description: summary ? summary[language] : null,
    };
    return meta;
  };

  render() {
    const { pageContext, path } = this.props;

    const { renderSlideShow } = this.state;
    const pageLanguage = getPageLanguage(path);

    return (
      <Layout language={pageLanguage} path={path} meta={this.getPageMetaData()}>
        <div id="slideshow" style={{ width: '100%', height: '80vh' }}>
          {renderSlideShow}
        </div>
        <main>
          <div className="blocks blocks--auto-height">
            <aside className="w-4">
              <div className="block info cutcorners w-4 h-4 ">
                <div className="caption">Part of Collections</div>
                <ol>
                  {(pageContext.collections || []).map(collection => (
                    <li key={`/${pageLanguage}/${collection[1]}`}>
                      <Link to={`/${pageLanguage}/${collection[1]}`}>
                        {translate(collection[2], pageLanguage)}
                      </Link>
                    </li>
                  ))}
                </ol>
              </div>
              <div className="block info cutcorners w-4 h-4 ">
                <div className="caption">Part of Exhibitions</div>
                <ol>
                  {(pageContext.exhibitions || []).map(exhibition => (
                    <li key={`/${pageLanguage}/${exhibition[1]}`}>
                      <Link to={`/${pageLanguage}/${exhibition[1]}`}>
                        {translate(exhibition[2], pageLanguage)}
                      </Link>
                    </li>
                  ))}
                </ol>
              </div>
              <div className="block info cutcorners w-4 h-4 ">
                <div className="caption">Part of Publications</div>
                <ol>
                  {(this.state.publications || []).map(publication => (
                    <li key={publication.path}>
                      <Link
                        to={publication.path}
                        style={{ textTransform: 'capitalize' }}
                      >
                        {publication.title
                          .split('/')
                          .pop()
                          .replace('-', ' ')}
                      </Link>
                    </li>
                  ))}
                </ol>
              </div>
            </aside>
            <article className="w-8 block--align-right">
              <div className="w-7">
                <h1>
                  {pageContext &&
                    pageContext.label &&
                    translate(pageContext.label, pageLanguage)}
                  <GithubLink
                    href={
                      pageContext.fileRoute
                        ? pageContext.fileRoute
                            .replace('.json', '')
                            .replace('content', '/' + pageLanguage)
                        : ''
                    }
                  />
                  <IIIFLink
                    href={
                      pageContext.fileRoute
                        ? pageContext.fileRoute
                            .replace('.json', '')
                            .replace('content', '/' + pageLanguage)
                        : ''
                    }
                  />
                </h1>
                {pageContext &&
                  pageContext.metadata &&
                  pageContext.metadata.map((metadata, index) => {
                    const label = translate(metadata.label, pageLanguage);
                    const value = translate(metadata.value, pageLanguage);
                    const isLabelHTML = isHtml(label);
                    const isValueHTML = isHtml(value);
                    return (
                      <React.Fragment key={index}>
                        {isLabelHTML ? (
                          <dt
                            className="metadata-label"
                            dangerouslySetInnerHTML={{ __html: label }}
                          />
                        ) : (
                          <dt className="metadata-label">{label}</dt>
                        )}
                        {isValueHTML ? (
                          <dd
                            className="metadata-value"
                            dangerouslySetInnerHTML={{ __html: value }}
                          />
                        ) : (
                          <dd className="metadata-value">{value}</dd>
                        )}
                      </React.Fragment>
                    );
                  })}
              </div>
            </article>
          </div>
        </main>
        {/* debug: <pre>{JSON.stringify(props, null, 2)}</pre> */}
      </Layout>
    );
  }
}

export const query = graphql`
  query {
    allMarkdownRemark(
      filter: { fileAbsolutePath: { regex: "/publications/" } }
    ) {
      edges {
        node {
          rawMarkdownBody
          frontmatter {
            path
            title
          }
        }
      }
    }
    allSitePage(filter: { path: { regex: "/illustrations/" } }) {
      nodes {
        path
        id
        pageContext
      }
    }
  }
`;

ObjectPage.propTypes = {
  pageContext: PropTypes.object.isRequired,
  path: PropTypes.string.isRequired,
};

export default ObjectPage;
