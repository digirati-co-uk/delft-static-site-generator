import React from 'react';
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

import { navigate } from 'gatsby';

import { Grid } from './Grid';
import './slideshow.css';
import '../ManifestCabinet/ManifestCabinet.scss';
import ContainerDimensions from 'react-container-dimensions';

class SlideShow extends React.Component {
  static propTypes = {
    jsonld: PropTypes.object.isRequired,
    renderPanel: PropTypes.func,
    bem: PropTypes.object,
    pathname: PropTypes.string,
    id: PropTypes.string,
    location: PropTypes.string,
  };

  static defaultProps = {
    renderPanel: () => {},
    bem: {},
  };
  constructor(props) {
    super(props);
    this.thumbnailCache = {};
    this.canvasList = [];
  }

  componentDidMount() {
    if (
      !this.props.id ||
      this.canvasList.length <= this.props.id ||
      this.props.id <= 0 ||
      !parseInt(this.props.id)
    ) {
      this.goToRange(0);
      navigate(`${this.props.pathname}?id=0`, { replace: true });
      return;
    }
    if (this.props.id !== this.currentIndex) {
      this.goToRange(parseInt(this.props.id));
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

  getThumbnailsArray = () => {
    const thumbnails = this.props.jsonld.items.map(
      (item) => item.thumbnail[0].id
    );
    return thumbnails;
  };

  goToRange = (newIndex) => {
    if (newIndex !== this.currentIndex)
      navigate(`${this.props.pathname}?id=${newIndex}`);
  };
  render() {
    const { jsonld, renderPanel, bem } = this.props;

    return (
      <div className={this.props.bem}>
        <Fullscreen>
          {({ ref, ...fullscreenProps }) => (
            <Manifest jsonLd={this.props.jsonld}>
              <RangeNavigationProvider>
                {(rangeProps) => {
                  const {
                    manifest,
                    canvas,
                    canvasList,
                    previousRange,
                    currentIndex,
                    nextRange,
                    region,
                    goToRange,
                  } = rangeProps;
                  this.canvasList = canvasList;
                  this.allThumbnails = this.getThumbnails(manifest);
                  this.currentIndex = currentIndex;
                  this.goToRange = goToRange;
                  this.nextRange = () => {
                    nextRange();
                    if (!(currentIndex >= canvasList.length - 1))
                      navigate(
                        `${this.props.pathname}?id=${
                          parseInt(currentIndex) + 1
                        }`
                      );
                  };
                  this.previousRange = () => {
                    previousRange();
                    if (!(currentIndex === 0))
                      navigate(`${this.props.pathname}?id=${currentIndex - 1}`);
                  };

                  return (
                    <React.Fragment>
                      <div className={bem.element('inner-frame')} ref={ref}>
                        <SimpleSlideTransition id={this.props.id}>
                          <Slide
                            fullscreenProps={fullscreenProps}
                            behaviors={canvas.__jsonld.behavior || []}
                            manifest={manifest}
                            canvas={canvas}
                            region={region}
                            renderPanel={renderPanel}
                          />
                        </SimpleSlideTransition>
                        <CanvasNavigation
                          currentIndex={currentIndex}
                          previousRange={this.previousRange}
                          nextRange={this.nextRange}
                          canvasList={canvasList}
                        />
                      </div>
                      {canvasList.length > 1 && (
                        <div className={bem.element('manifest-cabinet-holder')}>
                          <ContainerDimensions>
                            {({ width, height }) => (
                              <Grid
                                onClick={(index) => goToRange(index)}
                                thumbnails={this.getThumbnailsArray(manifest)}
                                selected={this.props.id}
                                pathname={this.props.pathname}
                                height={height}
                                width={width}
                                count={canvasList.count}
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

export default typeof withBemClass === 'function'
  ? withBemClass('slideshow')(SlideShow)
  : SlideShow;
