import React from 'react';
import PropTypes from 'prop-types';
import Layout from '../../components/Layout/layout';
import SlideShow from '../../components/SlideShow/slideshow';
import { getTranslation as translate, getPageLanguage } from '../../utils';

const isHtml = val => val.match(/<[^>]+>/) !== null;

class ObjectPage extends React.Component {
  propTypes = {
    pageContext: PropTypes.object.isRequired,
    '*': PropTypes.string.isRequired,
  };

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
        <div id="slideshow" style={{ width: '100vw', height: '80vh' }}>
          { renderSlideShow }
        </div>
        <main>
          <div className="blocks blocks--auto-height">
            <aside className="w-4">
              <div className="block info cutcorners w-4 h-4 ">
                <div className="boxtitle">Part of Collections</div>
                <ol>
                  <li>Test collection</li>
                </ol>
              </div>
              <div className="block info cutcorners w-4 h-4 ">
                <div className="boxtitle">Part of Exhibitions</div>
                <ol>
                  <li>Test Exhibition</li>
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
                </h1>
                {
                pageContext
                && pageContext.metadata
                && pageContext.metadata.map(
                  (metadata) => {
                    const label = translate(metadata.label, pageLanguage);
                    const value = translate(metadata.value, pageLanguage);
                    const isLabelHTML = isHtml(label);
                    const isValueHTML = isHtml(value);
                    return (
                      <React.Fragment>
                        { isLabelHTML ? (
                          <dt dangerouslySetInnerHTML={{ __html: label }} />
                        ) : (
                          <dt>{ label }</dt>
                        )}
                        { isValueHTML ? (
                          <dd dangerouslySetInnerHTML={{ __html: value }} />
                        ) : (
                          <dd>{ value }</dd>
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

export default ObjectPage;
