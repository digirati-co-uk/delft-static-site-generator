import React from 'react';
import PropTypes from 'prop-types';
import { withBemClass } from '@canvas-panel/core';
import { thumbnailGetSize } from '../../utils';
import './ManifestCabinet.scss';

class ManifestCabinet extends React.Component {
  thumbnailCache = {};

  componentDidUpdate(/* prevProps, prevState */) {
    if (this.selectedThumbnail) {
      const list = this.selectedThumbnail.parentNode.parentNode;
      const rect = this.selectedThumbnail.getBoundingClientRect();
      if (rect.x < 0) {
        list.scrollLeft = 0;
      } else if (list.offsetWidth - rect.width < rect.x) {
        list.scrollLeft =
          this.selectedThumbnail.offsetLeft - (list.offsetWidth - rect.width);
      }
    }
  }

  getThumbnails = (manifest) => {
    const manifestId = manifest.id || manifest['@id'];
    if (this.thumbnailCache.hasOwnProperty(manifestId)) {
      return this.thumbnailCache[manifestId];
    }

    const thumbnails = manifest.getSequences().reduce(
      (sequenceThumbnails, sequence) =>
        Object.assign(
          sequenceThumbnails,
          sequence.getCanvases().reduce((canvasThumbnails, canvas) => {
            let thumbnail = canvas.getThumbnail();
            if (!thumbnail) {
              canvas.getImages().forEach((image) => {
                thumbnail = image.getThumbnail();
                if (thumbnail) {
                  return true;
                }
              });
            }
            canvasThumbnails[canvas.id || canvas['@id']] = thumbnail;
            return canvasThumbnails;
          }, {})
        ),
      {}
    );
    this.thumbnailCache[manifestId] = thumbnails;
    return thumbnails;
  };

  render() {
    const {
      children,
      manifest,
      canvasList,
      currentCanvas,
      height,
      showControls,
      goToRange,
      bem,
    } = this.props;
    const allThumbnails = this.getThumbnails(manifest);

    return (
      <div style={{ height }} className={bem}>
        <div className={bem.element('scroll')}>
          <div
            style={{ height, width: (height + 16) * canvasList.length }}
            className={bem.element('thumb-list')}
          >
            {canvasList.map((canvasId, index) => {
              const isSelected =
                canvasId === (currentCanvas.id || currentCanvas['@id']);
              const thumbnail = allThumbnails[canvasId]
                ? thumbnailGetSize(allThumbnails[canvasId], null, height)
                : null;
              return (
                <button
                  key={`${canvasId}--thumb`}
                  onClick={() => goToRange(index)}
                  type="button"
                  className={`${bem.element('thumb').modifiers({
                    selected: isSelected,
                  })} cutcorners`}
                  style={{
                    width: height,
                    height,
                  }}
                >
                  {thumbnail ? (
                    <img
                      ref={(imageEl) => {
                        if (isSelected) {
                          this.selectedThumbnail = imageEl;
                        }
                      }}
                      src={thumbnail}
                      className={bem.element('thumb-img')}
                      alt=""
                    />
                  ) : (
                    <div className={bem.element('thumb-missing')}>
                      {' '}
                      no thumb{' '}
                    </div>
                  )}
                </button>
              );
            })}
          </div>
          {showControls && <>{children}</>}
        </div>
      </div>
    );
  }
}

ManifestCabinet.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]),
  manifest: PropTypes.object.isRequired,
  canvasList: PropTypes.array.isRequired,
  currentCanvas: PropTypes.object,
  height: PropTypes.number,
  goToRange: PropTypes.func,
  bem: PropTypes.object,
  showControls: PropTypes.bool,
};

ManifestCabinet.defaultProps = {
  goToRange: null,
  children: null,
  height: 116,
  showControls: false,
  currentCanvas: 0,
  bem: null,
};

// NOTE: this is gatsby.js specific.
export default typeof withBemClass === 'function'
  ? withBemClass('manifest-cabinet')(ManifestCabinet)
  : ManifestCabinet;
