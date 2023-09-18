import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'gatsby';
import GithubLink from '../../components/GithubLink/GithubLink';
import { IIIFLink } from '../../components/IIIFLink/IIIFLink';
import Layout from '../../components/Layout/layout';

import { getTranslation as translate, getPageLanguage } from '../../utils';
import { Modal } from '../../components/Modal/Modal';

const getThumbnailImageSource = (thumbnail) => {
  if (typeof thumbnail === 'string') {
    return thumbnail;
  }
  return Array.isArray(thumbnail)
    ? getThumbnailImageSource(thumbnail[0])
    : thumbnail.id || thumbnail['@id'];
};

const getMetatataIfExist = (allMetadata, key, lang, prependKey = false) => {
  const matching = allMetadata.filter(
    (metadata) =>
      Object.values(metadata.label)
        .map((value) => value.join(''))
        .indexOf(key) !== -1
  );
  if (matching.length > 0) {
    if (matching[0].value) {
      return (
        (prependKey ? `${translate(matching[0].label, lang)} ` : '') +
        translate(matching[0].value, lang)
      );
    }
  }
  return '';
};

class CollectionPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      renderCanvasModal: false,
      objectsToShow: 50,
    };
  }

  hideSummary = () => {
    this.setState({
      renderCanvasModal: false,
    });
  };

  getPageMetaData = () => {
    const summary = this.props.pageContext.collection.summary;
    const language = this.props.path.split('/')[1];

    const meta = {
      image: this.props.pageContext.collection.items[0].thumbnail[0].id,
      description: summary[language] ? summary[language][0] : null,
    };

    return meta;
  };

  render() {
    const { collection, objectLinks } = this.props.pageContext;
    if (!collection) {
      return 'Error: collection not defined, please check the source manifest.';
    }
    const path = this.props.path;
    const pageLanguage = getPageLanguage(path);
    const title = translate(collection.label, pageLanguage);
    const curator = getMetatataIfExist(
      collection.metadata || [],
      'Curated By',
      'none',
      true
    );
    const summary = translate(collection.summary, pageLanguage, '\n')
      .split('\n')
      .map((paragraph) => (
        <p dangerouslySetInnerHTML={{ __html: paragraph }}></p>
      ));
    const items = (collection.items || []).filter(
      (resource) => resource.type === 'Manifest'
    );
    this.summary = summary;

    const externalResource = () => {
      let route = path.split('/');
      route.splice(3, 0, this.props.pageContext.collectionGroup);
      return route.join('/');
    };

    return (
      <Layout language={pageLanguage} path={path} meta={this.getPageMetaData()}>
        <main>
          {this.state.renderCanvasModal ? (
            <Modal modalContent={this.summary} close={this.hideSummary} />
          ) : null}
          <div className="blocks blocks--auto-height">
            <aside className="w-min-4">
              <div className="block title cutcorners w-4 h-4 title--fountain-blue">
                <div className="boxtitle">Collection</div>
                <div className="maintitle">
                  {title}
                  <GithubLink href={externalResource()} />
                  <IIIFLink href={externalResource()} />
                </div>
                <div className="caption">{curator}</div>
              </div>
              <div className="block info cutcorners w-min-4">
                {summary[0]}
                <p>
                  {summary.length > 1 ? (
                    <button
                      className="readmore"
                      onClick={() => this.setState({ renderCanvasModal: true })}
                    >
                      Read More
                    </button>
                  ) : (
                    ''
                  )}
                </p>
              </div>
            </aside>
            <article className="w-8">
              {items.slice(0, this.state.objectsToShow).map((manifest) =>
                !objectLinks[manifest.id || manifest['@id']] ? null : (
                  <div
                    key={`collection__${
                      objectLinks[manifest.id || manifest['@id']]
                    }`}
                    className="w-4 h-min-6 block--align-right"
                  >
                    <div className="block collection-item w-3 h-min-4">
                      <Link
                        to={`/${pageLanguage}/objects/${
                          objectLinks[manifest.id || manifest['@id']]
                        }/`}
                      >
                        <div className="block aspectratio-square image cutcorners w-3 h-3">
                          <img
                            src={getThumbnailImageSource(manifest.thumbnail)}
                            className="object-link__image"
                            alt=""
                          />
                        </div>
                        <p className="collection-list__label">
                          {translate(manifest.label, pageLanguage)}
                        </p>
                        {manifest.summary
                          ? translate(manifest.summary, pageLanguage, '\n')
                              .split('\n')
                              .map((paragraph) => (
                                <p className="collection-list__summary">
                                  {paragraph}
                                </p>
                              ))
                          : ''}
                      </Link>
                    </div>
                  </div>
                )
              )}
              {items.length > this.state.objectsToShow ? (
                <button
                  class="block w-4 h-min-6 block--align-right"
                  style={{
                    border: 'none',
                    backgroundColor: 'transparent',
                    cursor: 'pointer',
                    padding: '1rem',
                  }}
                  onClick={() =>
                    this.setState({
                      objectsToShow: this.state.objectsToShow + 50,
                    })
                  }
                >
                  {`Show more... ${
                    items.length - this.state.objectsToShow < 50
                      ? '(' + (items.length - this.state.objectsToShow) + ')'
                      : '(50)'
                  }`}
                </button>
              ) : (
                ''
              )}
            </article>
          </div>
        </main>
        {/* debug: <pre>{JSON.stringify(props, null, 2)}</pre> */}
      </Layout>
    );
  }
}

CollectionPage.propTypes = {
  pageContext: PropTypes.object.isRequired,
  path: PropTypes.string.isRequired,
};

export default CollectionPage;
