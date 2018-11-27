import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withBemClass } from '@canvas-panel/core';
import './ManifestCabinet.scss';

const thumbnailGetSize = (thumbnail, pWidth, pHeight) => {
  const thumb = thumbnail.__jsonld;
  if ((pWidth || pHeight) && thumb.hasOwnProperty('sizes')) {
     //TODO: compute the sizes properly
    let thumbUrlParts = (thumb.id || thumb['@id']).split('/');
    thumbUrlParts[thumbUrlParts.length-3] = ',100';
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
  // TODO: finalize this without set timeout
  setTimeout(()=> {
    const selectedThumb = document.querySelector('.manifest-cabinet__thumb--selected');
    selectedThumb.parentNode.parentNode.scrollLeft = 
      selectedThumb.offsetLeft > selectedThumb.parentNode.parentNode.offsetWidth - selectedThumb.offsetWidth 
        ? selectedThumb.offsetLeft - (selectedThumb.parentNode.parentNode.offsetWidth - selectedThumb.offsetWidth)
        : 0;
  },100);
  return (
    <div style={{ height: height }} className={bem}>
      <div className={bem.element('scroll')}>
        <div style={{ height: height }} className={bem.element('thumb-list')}>
          {canvasList.map((canvasId, index) =>(
            <img src={ thumbnailGetSize(allThumbnails[canvasId], null, height) } 
              className={
                bem.element('thumb').modifiers({
                  selected: canvasId === (currentCanvas.id || currentCanvas['@id']) 
                })
              }
              onClick={()=>goToRange(index)}
            />
          ))}
        </div>
        { showControls && (
          <>{children}</>
          )}
      </div>
    </div>
  );
}

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

  
export default withBemClass('manifest-cabinet')(ManifestCabinet);