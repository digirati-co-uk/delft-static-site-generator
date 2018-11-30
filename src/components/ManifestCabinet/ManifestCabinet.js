import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import { withBemClass } from '@canvas-panel/core';
import './ManifestCabinet.scss';

const thumbnailGetSize = (thumbnail, pWidth, pHeight) => {
  const thumb = thumbnail.__jsonld;
  if (
    (pWidth || pHeight) && 
    thumb.hasOwnProperty('service') && 
    thumb.service.hasOwnProperty('sizes')
  ) {
    let closestSizeIndex = -1;
    let minDistanceX = Number.MAX_SAFE_INTEGER;
    let minDistanceY = Number.MAX_SAFE_INTEGER; 
    thumb.service.sizes.forEach((size, index) => {
      if (pWidth) {
        const xDistance = Math.abs(size.width - pWidth);
        if (minDistanceX >= xDistance) {
          closestSizeIndex = index;
          minDistanceX = xDistance;
        }
      };
      if (pHeight) {
        const yDistance = Math.abs(size.height - pHeight);
        if (minDistanceY >= yDistance) {
          closestSizeIndex = index;
          minDistanceY = yDistance;
        }
      }
    });
    let thumbUrlParts = (thumb.id || thumb['@id']).split('/');
    if (closestSizeIndex !== -1) {
      const size = thumb.service.sizes[closestSizeIndex];
      thumbUrlParts[thumbUrlParts.length-3] = [size.width, size.height].join(',');
    }
    return thumbUrlParts.join('/');
  } else {
    return (thumb.id || thumb['@id']);
  }
};

const ManifestCabinet = ({
    children,
    allThumbnails,
    canvasList, 
    currentCanvas,
    height,
    showControls,
    goToRange,
    bem
  }) => {
  
  return (
    <div style={{ height: height }} className={bem}>
      <div className={bem.element('scroll')}>
        <div style={{ height: height }} className={bem.element('thumb-list')}>
          {canvasList.map((canvasId, index) => {
            const isSelected = canvasId === (currentCanvas.id || currentCanvas['@id']);
            if (isSelected) {
              setTimeout(()=>{
                let selectedThumbnail = document.querySelector('.' + bem.element('thumb') + '--selected');
                // Jumping all across the screen...
                //selectedThumbnail.scrollIntoView({behavior: "smooth", block: 'nearest', inline: "nearest"}) 
                const list = selectedThumbnail.parentNode.parentNode;
                const rect = selectedThumbnail.getBoundingClientRect();
                if (rect.x < 0) {
                  list.scrollLeft = 0;
                } else if (selectedThumbnail.parentNode.parentNode.offsetWidth - rect.width < rect.x ) {
                  list.scrollLeft = selectedThumbnail.offsetLeft - (selectedThumbnail.parentNode.parentNode.offsetWidth - rect.width);
                }
              },100);
            }
            return (
              <img
                key={`${canvasId}--thumb`}
                src={thumbnailGetSize(allThumbnails[canvasId], null, height)} 
                className={
                  bem.element('thumb').modifiers({
                    selected: isSelected 
                  })
                }
                onClick={()=>goToRange(index)}
              />
            );
          })}
        </div>
        { showControls && (
          <>{children}</>
          )}
      </div>
    </div>
  );
}; 




ManifestCabinet.propTypes = {
  allThumbnails: PropTypes.object.isRequired,
  canvasList: PropTypes.array.isRequired, 
  currentCanvas: PropTypes.object,
  height: PropTypes.number,
  previousRange: PropTypes.func,
  nextRange: PropTypes.func,
  showControls: PropTypes.bool,
};

ManifestCabinet.defaultProps = {
  height: 116,
  showControls: false,
};

// NOTE: this is gatsby.js specific.
export default typeof withBemClass === 'function' 
  ? withBemClass('manifest-cabinet')(ManifestCabinet)
  : ManifestCabinet;