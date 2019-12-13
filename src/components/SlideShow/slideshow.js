import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  Manifest,
  Fullscreen,
  RangeNavigationProvider,
  withBemClass,
} from '@canvas-panel/core';
import {
  SimpleSlideTransition,
  Slide,
  CanvasNavigation,
} from '@canvas-panel/slideshow';
import './slideshow.css';
import '../ManifestCabinet/ManifestCabinet.scss';


import { Grid } from 'react-virtualized';
import ContainerDimensions from 'react-container-dimensions';
import { thumbnailGetSize } from '../../utils';

class SlideShow extends Component {
  static propTypes = {
    jsonld: PropTypes.object.isRequired,
    renderPanel: PropTypes.func,
    bem: PropTypes.object,
  };

  static defaultProps = {
    renderPanel: () => {},
    bem: {},
  };

  constructor(props) {
    super(props);
    this.thumbnailCache = {};
  }

  calculateScrollLength = (width, count, index) => ((count * 116 < width) ? index : index + 116)

  getThumbnails = (manifest) => {
    const manifestId = manifest.id || manifest['@id'];
    if (this.thumbnailCache.hasOwnProperty(manifestId)) {
      return this.thumbnailCache[manifestId];
    }

    const thumbnails = manifest.getSequences().reduce(
      (sequenceThumbnails, sequence) => Object.assign(
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
          }, {}),
        ),
       {},
    );
    this.thumbnailCache[manifestId] = thumbnails;
    return thumbnails;
  };

  cellRenderer = ({
    columnIndex, key, rowIndex, style, width, height,
  }) => {
      const canvasId = this.canvasList[columnIndex];
      const thumbnail = this.allThumbnails[canvasId]
        ? thumbnailGetSize(this.allThumbnails[canvasId], null, height)
        : null;
      const isSelected = this.currentIndex === columnIndex;
      if (!thumbnail) {
        return '';
      }
      return (
        <div
          key={`${canvasId}--thumb--${isSelected}`}
          style={style}
        >
          <button
            onClick={() => this.goToRange(columnIndex)}
            type="button"
            className={
            `manifest-cabinet__thumb ${isSelected ? ` manifest-cabinet__thumb--selected` : ''} cutcorners`
          }
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
                src={thumbnail.replace('/full/full/', '/full/!100,100/')}
                className="manifest-cabinet__thumb-img"
                alt=""
              />
          ) : (
            <div className="manifest-cabinet__thumb-missing"> no thumb </div>
          )}
          </button>
        </div>
);
  };

  render() {
    const { jsonld, renderPanel, bem } = this.props;
    return (
      <div className={bem}>
        <Fullscreen>
          {({ ref, ...fullscreenProps }) => (
            <Manifest jsonLd={jsonld}>
              <RangeNavigationProvider>
                {(rangeProps) => {
                  const {
                    manifest,
                    canvas,
                    canvasList,
                    currentIndex,
                    previousRange,
                    nextRange,
                    region,
                    goToRange,
                  } = rangeProps;
                  this.canvasList = canvasList;
                  this.allThumbnails = this.getThumbnails(manifest);
                  this.currentIndex = currentIndex;
                  this.goToRange = goToRange;
                  return (
                    <React.Fragment>
                      <div className={bem.element('inner-frame')} ref={ref}>
                        <SimpleSlideTransition id={currentIndex}>
                          <Slide fullscreenProps={fullscreenProps} behaviors={canvas.__jsonld.behavior || []} manifest={manifest} canvas={canvas} region={region} renderPanel={renderPanel} />
                        </SimpleSlideTransition>
                        <CanvasNavigation previousRange={previousRange} nextRange={nextRange} canvasList={canvasList} currentIndex={currentIndex} />
                      </div>
                      {canvasList.length > 1 && (
                      <div className={bem.element('manifest-cabinet-holder')}>
                        <ContainerDimensions>
                          {({ width, height }) => (
                            <Grid
                              cellRenderer={
                                  this.cellRenderer
                                }
                              columnWidth={116}
                              columnCount={
                                  canvasList.length
                                }
                              height={124}
                              overscanColumnCount={5}
                              overscanRowCount={1}
                              rowHeight={116}
                              rowCount={1}
                              width={width}
                              scrollLeft={this.calculateScrollLength(
                                  width,
                                  canvasList.length,
                                  currentIndex,
                                )}
                            />
                            )}
                        </ContainerDimensions>
                      </div>
)}
                    </React.Fragment>
);
                }}
              </RangeNavigationProvider>
            </Manifest>
          )}
        </Fullscreen>
      </div>
    );
  }
}

// NOTE: this is because Gatsby.js client only hack...
export default typeof withBemClass === 'function' ? withBemClass('slideshow')(SlideShow) : SlideShow;
