import React from 'react';
import {
  Manifest,
  RangeNavigationProvider,
  
} from '@canvas-panel/core';
import {
  MobilePageView,
  SimpleSlideTransition,
  Slide,
  CanvasNavigation,
} from '@canvas-panel/slideshow';

import './CanvasModal.scss';

const CanvasModal = ({ canvas, hideCanvasDetails }) => (
    canvas 
      ? (
        <div className="canvas-modal">
          <div className="canvas-modal__content">
            <Manifest jsonLd={{
              "@context": [
                "http://www.w3.org/ns/anno.jsonld",
                "http://iiif.io/api/presentation/3/context.json"
              ],
              "type": "Manifest",
              "id": "http://digirati.com/iiif/v3/temporary/manifest",
              items: [
                canvas,
              ],
            }}>
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
                  return (
                    <div className={'canvas-modal__inner-frame'}>
                      {false ? (
                        <MobilePageView
                          manifest={manifest}
                          previousRange={previousRange}
                          nextRange={nextRange}
                          
                          {...rangeProps}
                        />
                      ) : (
                        <>
                        <div className={'canvas-modal__content-slide'}>
                          <SimpleSlideTransition id={currentIndex}>
                            <Slide
                              behaviors={canvas.__jsonld.behavior || []}
                              manifest={manifest}
                              canvas={canvas}
                              region={region}
                              fullscreenProps={{
                                isFullscreen: false,
                              }}
                            />
                          </SimpleSlideTransition>
                          </div>
                          <div className={'canvas-modal__info-and-nav'}>
                            <div className={'canvas-modal__info'}>
                              
                            </div>
                            <div className={'canvas-modal__nav'}>
                              <CanvasNavigation
                                previousRange={previousRange}
                                nextRange={nextRange}
                                canvasList={canvasList}
                                currentIndex={currentIndex}
                              />
                            </div>
                          </div>
                        </>
                      )}
                    </div>
                  );
                }}
              </RangeNavigationProvider>
            </Manifest>
            <button
              onClick={hideCanvasDetails}
              className="canvas-modal__close"
            >
            </button>
          </div>
        </div>
      )
      : ''
  );

  export default CanvasModal;