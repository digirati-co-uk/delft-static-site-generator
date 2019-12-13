import React from 'react';
import PropTypes from 'prop-types';
import Layout from '../../components/Layout/layout';
import SlideShow from '../../components/SlideShow/slideshow';
import GithubLink from '../../components/GithubLink/GithubLink';
import { getTranslation as translate, getPageLanguage } from '../../utils';
import { IIIFLink } from '../../components/IIIFLink/IIIFLink';

const isHtml = val => val.match(/<[^>]+>/) !== null;

class ObjectPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      renderSlideShow: 'Loading...',
    };
  }

  componentDidMount() {
    const { pageContext } = this.props;
    // Client only hack
    this.setState({
      renderSlideShow: (<SlideShow jsonld={pageContext} />),
    });
  }

  render() {
    const { pageContext, '*': path } = this.props;
    const { renderSlideShow } = this.state;
    const pageLanguage = getPageLanguage(path);
    return (
      <Layout language={pageLanguage} path={path}>
        <div id="slideshow" style={{ width: '100%', height: '80vh' }}>
          { renderSlideShow }
        </div>
        <main>
          <div className="blocks blocks--auto-height">
            <aside className="w-4">
              <div className="block info cutcorners w-4 h-4 ">
                <div className="boxtitle">Part of Collections</div>
                <ol>
                  {(pageContext.collections || []).map(collection => (
                    <li key={`/${pageLanguage}/${collection[1]}`}>
                      <a href={`/${pageLanguage}/${collection[1]}`}>
                        {translate(collection[2], pageLanguage)}
                      </a>
                    </li>
                  ))}
                </ol>
              </div>
              <div className="block info cutcorners w-4 h-4 ">
                <div className="boxtitle">Part of Exhibitions</div>
                <ol>
                  {(pageContext.exhibitions || []).map(exhibition => (
                    <li key={`/${pageLanguage}/${exhibition[1]}`}>
                      <a href={`/${pageLanguage}/${exhibition[1]}`}>
                        {translate(exhibition[2], pageLanguage)}
                      </a>
                    </li>
                  ))}
                </ol>
              </div>
            </aside>
            <article className="w-8 block--align-right">
              <div className="w-7">
                <h1>
                  {
                    pageContext
                    && pageContext.label
                    && translate(pageContext.label, pageLanguage)
                  }
                  <GithubLink href={path} />
                  <IIIFLink href={path} />
                </h1>
                {
                pageContext
                && pageContext.metadata
                && pageContext.metadata.map(
                  (metadata, index) => {
                    const label = translate(metadata.label, pageLanguage);
                    const value = translate(metadata.value, pageLanguage);
                    const isLabelHTML = isHtml(label);
                    const isValueHTML = isHtml(value);
                    return (
                      <React.Fragment key={index}>
                        { isLabelHTML ? (
                          <dt
                            className="metadata-label"
                            dangerouslySetInnerHTML={{ __html: label }}
                          />
                        ) : (
                          <dt className="metadata-label">{ label }</dt>
                        )}
                        { isValueHTML ? (
                          <dd
                            className="metadata-value"
                            dangerouslySetInnerHTML={{ __html: value }}
                          />
                        ) : (
                          <dd className="metadata-value">{ value }</dd>
                        )}
                      </React.Fragment>
                    );
                  },
                )
              }
              </div>
            </article>
          </div>
        </main>
        {/* debug: <pre>{JSON.stringify(props, null, 2)}</pre> */}
      </Layout>
    );
  }
}

ObjectPage.propTypes = {
  pageContext: PropTypes.object.isRequired,
  '*': PropTypes.string.isRequired,
};

export default ObjectPage;
