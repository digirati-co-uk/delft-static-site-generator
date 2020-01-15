import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'gatsby';
import ContainerDimensions from 'react-container-dimensions';
import { Close } from '../Close/Close';
import { StaticQuery, graphql } from 'gatsby';
import { CanvasNav } from './CanvasNav';

import './CanvasModal.scss';
import { getTranslation } from '../../utils';

import ThinCanvasPanel from './ThinCanvasPanel';

class CanvasModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      navItems: [],
      currentNavIndex: 1,
      displayType: '',
    };
  }

  componentDidMount() {
    if (this.props.selectedCanvas.items[0].items.length > 1) {
      this.setState({
        navItems: this.props.selectedCanvas.items[0].items,
        displayType: 'mixed-media-canvas',
      });
    }
    const navItems = getAnnotations(
      this.props.selectedCanvas.items,
      this.props.selectedCanvas.annotations
    ).filter(annotation => annotation.motivation === 'layout-viewport-focus');
    // console.log(navItems);
    if (navItems.length > 0) {
      this.setState({
        navItems: navItems,
        displayType: 'layout-viewport-focus',
      });
    }
  }

  getModalObjectId = route => {
    let indexToFind = 0;
    const foundNode = this.props.data.find(node => {
      return node.path === `/en/${route}` || node.path === `/nl/${route}`;
    });
    if (foundNode) {
      foundNode.context.items.map((item, index) => {
        if (
          item.items[0].items[0].id.split('/')[6] ===
          this.props.selectedCanvas.items[0].items[0].body.id.split('/')[6]
        )
          indexToFind = index;
      });
    }
    return indexToFind;
  };

  renderSingleItemCanvas = () => {
    return (
      <ThinCanvasPanel
        getAnnotations={() =>
          getAnnotations(
            this.props.selectedCanvas.items,
            this.props.selectedCanvas.annotations
          )
        }
        canvas={this.props.selectedCanvas}
        height={this.props.selectedCanvas.height}
        width={this.props.selectedCanvas.width}
        {...this.state.navItems}
        navItemsCallBack={this.navItemsCallback}
        currentNavItem={this.state.currentNavIndex}
        displayType={this.state.displayType}
        navItems={this.state.navItems}
      />
    );
  };

  renderMultiCanvas = () => {
    return (
      <ThinCanvasPanel
        getAnnotations={() => [
          this.props.selectedCanvas.items[0].items[this.state.currentNavIndex],
        ]}
        canvas={
          this.props.selectedCanvas.items[0].items[this.state.currentNavIndex]
        }
        height={
          this.props.selectedCanvas.items[0].items[this.state.currentNavIndex]
            .body.height
        }
        width={
          this.props.selectedCanvas.items[0].items[this.state.currentNavIndex]
            .body.width
        }
        navItemsCallBack={this.navItemsCallback}
        currentNavItem={this.state.currentNavIndex}
        displayType={this.state.displayType}
      />
    );
  };

  render() {
    const annotations =
      this.props.selectedCanvas &&
      this.props.selectedCanvas.items &&
      this.props.selectedCanvas.items[0] &&
      this.props.selectedCanvas.items[0].items
        ? this.props.selectedCanvas.items[0].items
        : [];
    const activeAnnotationFallback =
      annotations && annotations.length && annotations[0] && annotations[0]
        ? annotations[0]
        : {};
    const currentLabelAndDescriptionSource =
      this.state.navItems.length > 0 && this.state.currentNavIndex !== -1
        ? this.state.navItems[this.state.currentNavIndex]
        : activeAnnotationFallback;
    const imageAnnotations = annotations.filter(
      annotation => annotation.body.type === 'Image'
    );
    const detailsLink =
      imageAnnotations.length === 1 &&
      this.props.annotationDetails[getAnnotationId(imageAnnotations[0])];

    return (
      <div className="canvas-modal">
        <ContainerDimensions>
          {({ width, height }) => (
            <div className="canvas-modal__content">
              {(this.props.selectedCanvas.behavior || []).indexOf('info') !==
              -1 ? (
                <div className="canvas-modal__essay">
                  {annotations.map(annotation => (
                    <main>
                      {annotation.label && (
                        <h3>
                          {getTranslation(
                            annotation.label,
                            this.props.pageLanguage
                          )}
                        </h3>
                      )}
                      {annotation.summary &&
                        getTranslation(
                          annotation.summary,
                          this.props.pageLanguage,
                          '\n'
                        )
                          .split('\n')
                          .map(paragraph => (
                            <p
                              key={`about__${paragraph}`}
                              dangerouslySetInnerHTML={{ __html: paragraph }}
                            ></p>
                          ))}
                    </main>
                  ))}
                </div>
              ) : (
                <div className="canvas-modal__inner-frame">
                  <div className="canvas-modal__content-slide">
                    <div className="canvas-modal__top-part">
                      {this.state.navItems.length > 1 &&
                      this.state.displayType === 'mixed-media-canvas'
                        ? this.renderMultiCanvas()
                        : this.renderSingleItemCanvas()}
                    </div>
                    <div className="canvas-modal__info-and-nav">
                      <div className="canvas-modal__info">
                        {currentLabelAndDescriptionSource.label ? (
                          <div className="canvas-modal__info-title">
                            {getTranslation(
                              currentLabelAndDescriptionSource.label,
                              this.props.pageLanguage
                            )}
                          </div>
                        ) : (
                          ''
                        )}
                        {currentLabelAndDescriptionSource.summary ? (
                          <p>
                            {getTranslation(
                              currentLabelAndDescriptionSource.summary,
                              this.props.pageLanguage
                            )}
                          </p>
                        ) : (
                          ''
                        )}
                      </div>
                      {detailsLink && (
                        <div className="canvas-modal__nav">
                          <Link
                            to={
                              this.props.pageLanguage +
                              '/' +
                              detailsLink +
                              `/?id=${this.getModalObjectId(detailsLink)}`
                            }
                          >
                            View Detail
                          </Link>
                        </div>
                      )}
                      <CanvasNav
                        totalItems={this.state.navItems.length}
                        currentIndex={this.state.currentNavIndex + 1}
                        backwardClick={() =>
                          this.setState({
                            currentNavIndex: this.state.currentNavIndex - 1,
                          })
                        }
                        forwardClick={() =>
                          this.setState({
                            currentNavIndex: this.state.currentNavIndex + 1,
                          })
                        }
                      />
                    </div>
                  </div>
                </div>
              )}
              <button
                onClick={this.props.hideCanvasDetails}
                className="canvas-modal__close"
                type="button"
              >
                <Close />
              </button>
            </div>
          )}
        </ContainerDimensions>
      </div>
    );
  }
}

CanvasModal.propTypes = {
  selectedCanvas: PropTypes.any,
  hideCanvasDetails: PropTypes.func.isRequired,
  pageLanguage: PropTypes.string.isRequired,
  annotationDetails: PropTypes.any,
};

CanvasModal.defaultProps = {
  selectedCanvas: null,
  annotationDetails: {},
};

export default props => (
  <StaticQuery
    query={graphql`
      query {
        allSitePage {
          nodes {
            id
            path
            context {
              items {
                items {
                  items {
                    id
                    target
                  }
                }
              }
            }
          }
        }
      }
    `}
    render={data => <CanvasModal data={data.allSitePage.nodes} {...props} />}
  />
);

const getAnnotationId = annotation => {
  let annotationId = annotation.id;
  if (annotation.body && annotation.body.type === 'Image') {
    if (annotation.body.service) {
      const service = Array.isArray(annotation.body.service)
        ? annotation.body.service[0]
        : annotation.body.service;
      if (typeof service === 'string') {
        annotationId = service;
      } else if (typeof service.id === 'string') {
        annotationId = service.id;
      }
    }
    if (
      annotationId === annotation.id &&
      typeof annotation.body.id === 'string'
    ) {
      annotationId = annotation.body.id;
    }
  }
  return annotationId;
};

const getAnnotations = (items, annotations) => {
  return (items || [])
    .reduce((_annotations, annotationPage) => {
      if (
        annotationPage.hasOwnProperty('items') &&
        annotationPage.items.length > 0
      ) {
        _annotations = _annotations.concat(annotationPage.items);
      }
      return _annotations;
    }, [])
    .concat(
      (annotations || []).reduce((_annotations, annotationPage) => {
        if (
          annotationPage.hasOwnProperty('items') &&
          annotationPage.items.length > 0
        ) {
          _annotations = _annotations.concat(annotationPage.items);
        }
        return _annotations;
      }, [])
    );
};
