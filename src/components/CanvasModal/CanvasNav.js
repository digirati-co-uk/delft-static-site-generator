import React from 'react';
import PropTypes from 'prop-types';
import { Arrow } from '../Arrow/Arrow';
import './CanvasModal.scss';

export const CanvasNav = ({
  forwardClick,
  backwardClick,
  totalItems,
  currentIndex,
}) =>
  totalItems > 1 ? (
    <React.Fragment>
      <div className="canvas-modal__nav">
        {currentIndex} {' / '} {totalItems}
      </div>
      <div className="canvas-modal__nav">
        <button
          className="arrow left"
          onClick={backwardClick}
          type="button"
          style={{
            visibility: currentIndex === 0 ? 'hidden' : 'visible',
          }}
        >
          <Arrow />
        </button>
        <button
          className="arrow right"
          onClick={forwardClick}
          type="button"
          style={{
            visibility: currentIndex === totalItems ? 'hidden' : 'visible',
          }}
        >
          <Arrow />
        </button>
      </div>
    </React.Fragment>
  ) : null;

CanvasNav.propTypes = {
  forwardClick: PropTypes.func,
  backwardClick: PropTypes.func,
  totalItems: PropTypes.number,
  currentIndex: PropTypes.number,
};
