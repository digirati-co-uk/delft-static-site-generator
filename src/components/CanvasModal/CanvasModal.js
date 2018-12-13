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
              <svg 
                version="1.1"
                xmlns="http://www.w3.org/2000/svg" 
                x="0px" 
                y="0px"
                viewBox="0 0 16.5 16.5" 
                style={{
                  enableBackground: 'new 0 0 16.5 16.5',
                  width: 16,
                  height: 16,
                  cursor: 'pointer',
                }} 
                xmlSpace="preserve"
              >
                <polygon
                  style={{
                    fill:'#fff',
                  }}
                  points="14.8,0 8.2,6.6 1.7,0 0,1.7 6.6,8.2 0,14.8 1.7,16.5 8.2,9.9 14.8,16.5 16.5,14.8 9.9,8.2 16.5,1.7 "
                />
              </svg>
            </button>
          </div>
        </div>
      )
      : ''
  );

  export default CanvasModal;