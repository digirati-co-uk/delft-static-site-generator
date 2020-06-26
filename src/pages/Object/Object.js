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
      id: this.props.pageContext.id,
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

  getRelatedPublications = (allPub, allIll) => {
    //first get the ids of the illustion id from the illustrations
    const illustationIds = allIll
      .filter(illustration => {
        if (illustration.context.id === this.state.id) {
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
      .map(publication => publication.node.frontmatter.path);
    return publications;
  };

  getPageMetaData = () => {
    const id =
      this.props.location && this.props.location.search
        ? this.props.location.search.split('?id=')[1]
        : 0;
    const href =
      this.props.pageContext &&
      this.props.pageContext.items &&
      this.props.pageContext.items[id] &&
      this.props.pageContext.items[id].thumbnail &&
      this.props.pageContext.items[id].thumbnail[0]
        ? this.props.pageContext.items[id].thumbnail[0].id
        : null;
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
      image: href,
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
                <div className="boxtitle">Part of Collections</div>
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
                <div className="boxtitle">Part of Exhibitions</div>
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
                <div className="boxtitle">Part of Publications</div>
                <ol>
                  {(this.state.publications || []).map(publication => (
                    <li key={publication}>
                      <Link
                        to={publication}
                        style={{ textTransform: 'capitalize' }}
                      >
                        {publication
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
                  <GithubLink href={path} />
                  <IIIFLink href={path} />
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
          }
        }
      }
    }
    allSitePage(filter: { context: {}, path: { regex: "/illustrations/" } }) {
      nodes {
        path
        context {
          items {
            id
          }
          id
        }
      }
    }
  }
`;

ObjectPage.propTypes = {
  pageContext: PropTypes.object.isRequired,
  path: PropTypes.string.isRequired,
};

export default ObjectPage;
