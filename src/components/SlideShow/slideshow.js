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
  Slide,
  CanvasNavigation,
} from '@canvas-panel/slideshow';
import ManifestCabinet from '../ManifestCabinet/ManifestCabinet';
import './slideshow.css';

class SlideShow extends Component {
  state = {
    innerWidth: window.innerWidth,
  };

  static propTypes = {
    jsonld: PropTypes.object.isRequired,
    mobileBreakpoint: PropTypes.number,
    renderPanel: PropTypes.func,
    bem: PropTypes.object,
  };

  static defaultProps = {
    mobileBreakpoint: 767,
    renderPanel: () => {},
    bem: {},
  };

  constructor(props) {
    super(props);
    window.addEventListener('resize', this.setSize);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.setSize);
  }

  setSize = () => {
    this.setState({ innerWidth: window.innerWidth });
  };

  qualifiesForMobile = () => this.state.innerWidth <= this.props.mobileBreakpoint;

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
                  return (
                    <React.Fragment>
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
                        </React.Fragment>
                      )}
                      </div>
                      {
                      canvasList.length > 1 && (
                        <div className={bem.element('manifest-cabinet-holder')}>
                          <ManifestCabinet
                            currentCanvas={canvas}
                            manifest={manifest}
                            canvasList={canvasList}
                            height={80}
                            goToRange={goToRange}
                          >
                            <CanvasNavigation
                              previousRange={previousRange}
                              nextRange={nextRange}
                              canvasList={canvasList}
                              currentIndex={currentIndex}
                            />
                          </ManifestCabinet>
                        </div>
                      )
                    }
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
