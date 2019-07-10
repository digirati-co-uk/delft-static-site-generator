import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'gatsby';
import ContainerDimensions from 'react-container-dimensions';
import { Arrow } from '../Arrow/Arrow';
import { Close } from '../Close/Close';

import './CanvasModal.scss';
import { getTranslation } from '../../utils';

import ThinCanvasPanel from './ThinCanvasPanel';

const getAnnotationId = (annotation) => {
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
    if (annotationId === annotation.id && typeof annotation.body.id === 'string') {
      annotationId = annotation.body.id;
    }
  }
  return annotationId;
};

class CanvasModal extends React.Component {
  state = {
    navItems: [],
    currentNavItem: 0,
  };

  navItemsCallback = (navItems, currentNavItem) => {
    this.setState({
      navItems,
      currentNavItem,
    });
  };

  render() {
    const {
      selectedCanvas,
      hideCanvasDetails,
      pageLanguage,
      annotationDetails,
    } = this.props;
    const { navItems, currentNavItem } = this.state;
    const annotations = selectedCanvas
      && selectedCanvas.items
      && selectedCanvas.items[0]
      && selectedCanvas.items[0].items
        ? selectedCanvas.items[0].items
        : [];
    const activeAnnotationFallback = (annotations
      && annotations.length
      && annotations[0]
      && annotations[0] ? annotations[0] : {});
    const currentLabelAndDescriptionSource = navItems.length > 0 && currentNavItem !== -1
        ? navItems[currentNavItem]
          : activeAnnotationFallback;
    const imageAnnotations = annotations.filter(annotation => annotation.body.type === 'Image');
    const detailsLink = imageAnnotations.length === 1
      && annotationDetails[getAnnotationId(imageAnnotations[0])];
    return (
      selectedCanvas
        ? (
          <div className="canvas-modal">
            <ContainerDimensions>
              {({ width, height }) => (
                // <div className="canvas-modal__content" style={{ width: width - 64, height: Math.floor(height - 64) }}>
                <div className="canvas-modal__content">

                  {(selectedCanvas.behavior || []).indexOf('info') !== -1 ? (
                    <div className="canvas-modal__essay">
                      {annotations.map(annotation => (
                        <main>
                          { annotation.label && (
                            <h3>{getTranslation(annotation.label, pageLanguage)}</h3>
                          )}
                          { annotation.summary && getTranslation(annotation.summary, pageLanguage, '\n')
                            .split('\n')
                            .map(paragraph => <p key={`about__${paragraph}`}>{paragraph}</p>)
                          }
                        </main>
                      ))}
                    </div>
                  ) : (
                    
                    <div className="canvas-modal__inner-frame">
                      <div className="canvas-modal__content-slide">
                        <div className="canvas-modal__top-part">
                          <ThinCanvasPanel
                            canvas={selectedCanvas}
                            navItemsCallback={this.navItemsCallback}
                            currentNavItem={currentNavItem}
                          />
                        </div>
                        <div className="canvas-modal__info-and-nav">
                          <div className="canvas-modal__info">
                            {currentLabelAndDescriptionSource.label ? (
                              <div className="canvas-modal__info-title">
                                {getTranslation(
                                  currentLabelAndDescriptionSource.label,
                                  pageLanguage,
                                )}
                              </div>
                            ) : '' }
                            {currentLabelAndDescriptionSource.summary ? (
                              <p>
                                {getTranslation(
                                  currentLabelAndDescriptionSource.summary, pageLanguage,
                                )}
                              </p>
                            ) : ''}
                          </div>
                          {detailsLink && (
                            <div className="canvas-modal__nav">
                              <Link to={[pageLanguage, detailsLink].join('/')}>View Details</Link>
                            </div>
                          )}
                          {navItems.length > 1 ? (
                            <div className="canvas-modal__nav">
                              {currentNavItem + 1}
                              {' / '}
                              {navItems.length}
                            </div>
                                ) : ''}
                          {navItems.length > 1 ? (
                            <div className="canvas-modal__nav">
                              <button
                                className="arrow left"
                                onClick={
                                  () => this.setState({ currentNavItem: currentNavItem - 1 })
                                }
                                type="button"
                                style={{
                                    visibility: currentNavItem === 0 ? 'hidden' : 'visible',
                                  }}
                              >
                                <Arrow />
                              </button>
                              <button
                                className="arrow right"
                                onClick={
                                  () => this.setState({ currentNavItem: currentNavItem + 1 })
                                }
                                type="button"
                                style={{
                                  visibility:
                                    currentNavItem + 1 === navItems.length
                                      ? 'hidden'
                                      : 'visible',
                                }}
                              >
                                <Arrow />
                              </button>
                            </div>
                                ) : ''}
                        </div>
                      </div>
                    </div>
                  )}
                  <button
                    onClick={hideCanvasDetails}
                    className="canvas-modal__close"
                    type="button"
                  >
                    <Close />
                  </button>
                </div>
            )}
            </ContainerDimensions>
          </div>
        )
        : ''
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

export default CanvasModal;
