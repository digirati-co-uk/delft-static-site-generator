import React from 'react';
import PropTypes from 'prop-types';
import ContainerDimensions from 'react-container-dimensions';
import { Arrow } from '../Arrow/Arrow';
import { Close } from '../Close/Close';

import './CanvasModal.scss';
import { getTranslation } from '../../utils';

import ThinCanvasPanel from './ThinCanvasPanel';

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
    const { selectedCanvas, hideCanvasDetails, pageLanguage } = this.props;
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
    return (
      selectedCanvas
        ? (
          <div className="canvas-modal">
            <ContainerDimensions>
              {({ width, height }) => (
                <div className="canvas-modal__content" style={{ width: width - 64, height: Math.floor(height - 64) }}>
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
                            <h6>
                              {getTranslation(currentLabelAndDescriptionSource.label, pageLanguage)}
                            </h6>
                          ) : '' }
                          {currentLabelAndDescriptionSource.summary ? (
                            <p>
                              {getTranslation(
                                currentLabelAndDescriptionSource.summary, pageLanguage,
                              )}
                            </p>
                          ) : ''}
                        </div>
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
                              onClick={() => this.setState({ currentNavItem: currentNavItem - 1 })}
                              type="button"
                              style={{
                                  visibility: currentNavItem === 0 ? 'hidden' : 'visible',
                                }}
                            >
                              <Arrow />
                            </button>
                            <button
                              className="arrow right"
                              onClick={() => this.setState({ currentNavItem: currentNavItem + 1 })}
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
};

CanvasModal.defaultProps = {
  selectedCanvas: null,
};

export default CanvasModal;
