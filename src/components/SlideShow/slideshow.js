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
import { Link, navigate } from 'gatsby';


import { Grid } from 'react-virtualized';
import ContainerDimensions from 'react-container-dimensions';
import { thumbnailGetSize } from '../../utils';

import './slideshow.css';

class SlideShow extends Component {
  static propTypes = {
    jsonld: PropTypes.object.isRequired,
    renderPanel: PropTypes.func,
    bem: PropTypes.object,
    pathname: PropTypes.string,
    id: PropTypes.string,
  };

  static defaultProps = {
    renderPanel: () => {},
    bem: {},
  };

  constructor(props) {
    super(props);
    this.thumbnailCache = {};
  }

  componentDidMount() {
    if (!this.props.id || this.canvasList.length <= this.props.id || this.props.id <= 0 || !parseInt(this.props.id)) {
      this.goToRange(0);
      navigate(this.props.pathname)
      return;
    };
    if (this.props.id !== this.currentIndex) {
      this.goToRange(parseInt(this.props.id))
    }
  }

  calculateScrollLength = (width, count, index, columnWidth) => {
    const array = Array.apply(null, {length: count}).map(Number.call, Number)
    const indexToStopAt = array.find(i => (((count - i )* columnWidth) < width));
    // needs to go left by very slightly under columnWidth
    const pixels = columnWidth * 0.999;
    // need to change by very small number to trigger rerender of the grid component (so selected value shown)
    if (((count - index )* columnWidth) < width) return ((indexToStopAt * pixels) + (index * 0.01))
    if (count * columnWidth < width) return index;
    if (count * columnWidth > width) return index * columnWidth;
  };

  getID = (url) => {
    return url.split("=").pop();
  }

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
      return <div key={`${canvasId}--thumb--${isSelected}`} style={style}>
          <Link style={{ borderBottom: 'none' }} to={`${this.props.pathname}?id=${this.getID(canvasId)}`}>
            <button onClick={() => this.goToRange(columnIndex)} type="button" className={`manifest-cabinet__thumb ${isSelected ? ` manifest-cabinet__thumb--selected` : ''} cutcorners`} style={isSelected ? { width: height, height, borderBottom: '5px solid #1d1c73' } : { width: height, height }}>
              {thumbnail ? <img ref={imageEl => {
                    if (isSelected) {
                      this.selectedThumbnail = imageEl;
                    }
                  }} src={thumbnail.replace('/full/full/', '/full/!100,100/')} className="manifest-cabinet__thumb-img" alt="" /> : <div className="manifest-cabinet__thumb-missing">
                  {' '}
                  no thumb{' '}
                </div>}
            </button>
          </Link>
        </div>;
  };

  render() {
    const { jsonld, renderPanel, bem } = this.props;
    return <div className={bem}>
        <Fullscreen>
          {({ ref, ...fullscreenProps }) => <Manifest jsonLd={jsonld}>
              <RangeNavigationProvider>
                {rangeProps => {
                  const { manifest, canvas, canvasList, previousRange, currentIndex, nextRange, region, goToRange } = rangeProps;
                  this.canvasList = canvasList;
                  this.allThumbnails = this.getThumbnails(manifest);
                  this.currentIndex = currentIndex;
                  this.goToRange = goToRange;
                  this.nextRange = () => {
                    nextRange();
                    if (!(currentIndex >= canvasList.length - 1)) navigate(`${this.props.pathname}?id=${parseInt(currentIndex) + 1}`);
                  };
                  this.previousRange = () => {
                    previousRange();
                    if (!(currentIndex === 0)) navigate(`${this.props.pathname}?id=${currentIndex - 1}`);
                  };

                  return <React.Fragment>
                      <div className={bem.element('inner-frame')} ref={ref}>
                        <SimpleSlideTransition id={this.props.id}>
                          <Slide fullscreenProps={fullscreenProps} behaviors={canvas.__jsonld.behavior || []} manifest={manifest} canvas={canvas} region={region} renderPanel={renderPanel} />
                        </SimpleSlideTransition>
                        <CanvasNavigation currentIndex={currentIndex} previousRange={this.previousRange} nextRange={this.nextRange} canvasList={canvasList} />
                      </div>
                      {canvasList.length > 1 && <div className={bem.element('manifest-cabinet-holder')}>
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
                                overscanRowCount={0}
                                rowHeight={116}
                                rowCount={1}
                                width={width}
                                scrollToAlignment={"center"}
                                scrollLeft={this.calculateScrollLength(
                                  width,
                                  canvasList.length,
                                  this.currentIndex,
                                  116
                                )}
                              />
                            )}
                          </ContainerDimensions>
                        </div>}
                    </React.Fragment>;
                }}
              </RangeNavigationProvider>
            </Manifest>}
        </Fullscreen>
      </div>;
  }
}

// NOTE: this is because Gatsby.js client only hack...
export default typeof withBemClass === 'function' ? withBemClass('slideshow')(SlideShow) : SlideShow;
