import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  Manifest,
  Fullscreen,
  RangeNavigationProvider,
  withBemClass,
  Responsive,
} from '@canvas-panel/core';
import {
  MobilePageView,
  SimpleSlideTransition,
  ProgressIndicator,
  Slide,
  CanvasNavigation,
} from '@canvas-panel/slideshow';

import './slideshow.css';

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
}

const ManifestCabinet = ({
  children,
  allThumbnails,
  canvasList, 
  currentCanvas,
  height,
  showControls,
  goToRange,
}) => {
  // TODO: finalize this without set timeout
  setTimeout(()=> {
    const selectedThumb = document.querySelector('.selected-thumbnail');
    selectedThumb.parentNode.parentNode.scrollLeft = 
      selectedThumb.offsetLeft > selectedThumb.parentNode.parentNode.offsetWidth - selectedThumb.offsetWidth 
        ? selectedThumb.offsetLeft - (selectedThumb.parentNode.parentNode.offsetWidth - selectedThumb.offsetWidth)
        : 0;
  },100);
  return (
    <div
      style={{
        height: height,
        position: 'relative',
        bottom: 0,
        left: 0,
        right: 0,
      }}
    >
      <div
        style={{
          width: '100%',
          height: '100%',
          overflowX: 'auto',
        }}
      >
        <div
          style={{
            display: 'flex',
            height: height,
          }}
        >
          {canvasList.map((canvasId, index) =>(
            <img src={ thumbnailGetSize(allThumbnails[canvasId], null, height) } 
              style={{
                border: canvasId === (currentCanvas.id || currentCanvas['@id']) ? '8px solid white' : '8px solid black',
                margin: 0,
                height: '100%',
              }}
              className={canvasId === (currentCanvas.id || currentCanvas['@id']) ? 'selected-thumbnail' : ''}
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

class SlideShow extends Component {
  state = {
    innerWidth: window.innerWidth,
  };

  static propTypes = {
    jsonld: PropTypes.object,
    mobileBreakpoint: PropTypes.number,
  };

  static defaultProps = {
    mobileBreakpoint: 767,
  };

  componentWillMount() {
    window.addEventListener('resize', this.setSize);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.setSize);
  }

  setSize = () => {
    this.setState({ innerWidth: window.innerWidth });
  };

  qualifiesForMobile = () => {
    return this.state.innerWidth <= this.props.mobileBreakpoint;
  };

  render() {
    const { jsonld, renderPanel, bem } = this.props;
    return (
      <div
        className={bem.modifiers({
          isMobile: Responsive.md.phone(),
        })}
      >
        <Fullscreen>
          {({ ref, ...fullscreenProps }) => (
            <Manifest jsonLd={jsonld}>
              <RangeNavigationProvider>
                {rangeProps => {
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
                  console.log(manifest);
                  const allThumbnails = manifest.getSequences().reduce(
                    (sequenceThumbnails, sequence) => 
                      Object.assign(
                        sequenceThumbnails, 
                        sequence.getCanvases().reduce((canvasThumbnails, canvas) => { 
                          canvasThumbnails[canvas.id || canvas['@id']] = canvas.getThumbnail();
                          return canvasThumbnails;
                        }, {})
                      )
                    , {});
                        
                  return (
                    <>
                    <div className={bem.element('inner-frame')} ref={ref}>
                      {this.qualifiesForMobile() ? (
                        <MobilePageView
                          manifest={manifest}
                          previousRange={previousRange}
                          nextRange={nextRange}
                          fullscreenProps={fullscreenProps}
                          {...rangeProps}
                        />
                      ) : (
                        <React.Fragment>
                          <SimpleSlideTransition id={currentIndex}>
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
                            previousRange={previousRange}
                            nextRange={nextRange}
                            canvasList={canvasList}
                            currentIndex={currentIndex}
                          />
                          <ProgressIndicator
                            currentCanvas={currentIndex}
                            totalCanvases={canvasList.length}
                          />
                        </React.Fragment>
                      )}
                    </div>
                    <ManifestCabinet 
                      currentCanvas={canvas}
                      allThumbnails={allThumbnails}
                      canvasList={canvasList}
                      height={116}
                      goToRange={goToRange}
                    >
                      <CanvasNavigation
                        previousRange={previousRange}
                        nextRange={nextRange}
                        canvasList={canvasList}
                        currentIndex={currentIndex}
                      />
                    </ManifestCabinet>
                    </>
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