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
      currentNavIndex: -1,
      displayType: '',
    };
  }
  componentDidMount() {
    if (this.props.selectedCanvas.items[0].items.length > 1) {
      this.setState({
        navItems: this.props.selectedCanvas.items[0].items,
        displayType: 'layout-viewport-focus',
      });
    }
    const navItems = getAnnotations(
      this.props.selectedCanvas.items,
      this.props.selectedCanvas.annotations
    ).filter(annotation => annotation.motivation === 'layout-viewport-focus');
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
          this.props.selectedCanvas.items[0].items[
            this.state.currentNavIndex
          ].body.id.split('/')[6]
        )
          indexToFind = index;
      });
    }
    return indexToFind;
  };

  renderSingleItemCanvas = (items, annotations) => {
    const getAnno =
      this.state.displayType === 'mixed-media-canvas'
        ? () => [items]
        : () => getAnnotations(items, annotations);
    return (
      <ThinCanvasPanel
        getAnnotations={getAnno}
        canvas={this.props.selectedCanvas}
        height={this.props.selectedCanvas.height}
        width={this.props.selectedCanvas.width}
        currentNavItem={this.state.currentNavIndex}
        displayType={this.state.displayType}
        navItems={this.state.navItems}
      />
    );
  };

  getModalObjectId = route => {
    let indexToFind = 0;
    const lookingForIndex =
      this.state.currentNavIndex === -1 ? 0 : this.state.currentNavIndex;
    const foundNode = this.props.data.find(node => {
      return node.path === `/en/${route}` || node.path === `/nl/${route}`;
    });
    if (foundNode) {
      foundNode.context.items.map((item, index) => {
        if (
          item.items[0].items[0].id.split('/')[6] ===
          this.props.selectedCanvas.items[0].items[
            lookingForIndex
          ].body.id.split('/')[6]
        )
          indexToFind = index;
      });
    }
    return indexToFind;
  };

  getCurrentLabelAndDescription(fallback) {
    if (this.state.currentNavIndex !== -1) {
      return this.state.navItems[this.state.currentNavIndex];
    } else if (
      this.state.currentNavIndex === -1 &&
      this.state.navItems.length > 0
    ) {
      return this.props.selectedCanvas.summary
        ? this.props.selectedCanvas
        : fallback;
    } else return fallback;
  }

  getDetailsLink = imageAnnotations => {
    if (imageAnnotations.length < 1) return false;
    if (this.state.currentNavIndex === -1 && this.state.navItems.length > 0)
      return false;
    let index = this.state.navItems.length > 1 ? this.state.currentNavIndex : 0;
    return this.props.annotationDetails[
      getAnnotationId(imageAnnotations[index])
    ];
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
    const currentLabelAndDescriptionSource = this.getCurrentLabelAndDescription(
      activeAnnotationFallback
    );

    const imageAnnotations = annotations.filter(
      annotation => annotation.body.type === 'Image'
    );
    const detailsLink = this.getDetailsLink(imageAnnotations);
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
                        ? this.renderSingleItemCanvas(
                            this.props.selectedCanvas.items[0].items[
                              this.state.currentNavIndex
                            ]
                          )
                        : this.renderSingleItemCanvas(
                            this.props.selectedCanvas.items,
                            this.props.selectedCanvas.annotations
                          )}
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
                              `/?id=${this.getModalObjectId(detailsLink)}` +
                              `/`
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
  if (!annotation) {
    return false;
  }
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
