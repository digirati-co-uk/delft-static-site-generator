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
import { getTranslation } from '../../utils';

const CanvasModal = ({ canvas, hideCanvasDetails }) => {


  const processedCanvases = [];
  if (canvas) {
    const mediaTypes = ['Image', 'Video'];
    let lastMediaCanvas = null;
    canvas.items[0].items.forEach((annotation, index) => {
      
      if (mediaTypes.indexOf(annotation.body.type) !== -1) {
        if (lastMediaCanvas !== null) {
          processedCanvases.push(lastMediaCanvas);
        }
        const copyAnnotation = JSON.parse(JSON.stringify(annotation));
        copyAnnotation.target = `canvas-${index}`;
        lastMediaCanvas = {
          id: `canvas-${index}`,
          type: 'Canvas',
          width: canvas.width || annotation.width,
          height: canvas.height || annotation.height,
          items: [{
            id: `annotation-page-${index}`,
            type: 'AnnotationPage',
            items: [copyAnnotation],
          }]
        }
      }
    });

    if (lastMediaCanvas !== null) {
      lastMediaCanvas.annotations = canvas.annotations;
      processedCanvases.push(lastMediaCanvas);
    }
  }

  const pseudoManifest = {
    "@context": [
      "http://www.w3.org/ns/anno.jsonld",
      "http://iiif.io/api/presentation/3/context.json"
    ],
    "type": "Manifest",
    "id": "http://digirati.com/iiif/v3/temporary/manifest",
    items: processedCanvases,
  };

  console.log(pseudoManifest);

  return (
    canvas 
      ? (
        <div className="canvas-modal">
          <div className="canvas-modal__content">
            <Manifest jsonLd={pseudoManifest}>
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
                          <div className={'canvas-modal__slide-transition-wrapper'}>
                          <SimpleSlideTransition id={currentIndex}>
                            {canvas.__jsonld && 
                            canvas.__jsonld.items && 
                            canvas.__jsonld.items.length > 0 &&
                            canvas.__jsonld.items[0].items &&
                            canvas.__jsonld.items[0].items.length &&
                            canvas.__jsonld.items[0].items[0] && 
                            canvas.__jsonld.items[0].items[0].body &&
                            canvas.__jsonld.items[0].items[0].body.type === 'Video' ? (
                              <div
                                style={{
                                  width: '100%',
                                  height: '100%',
                                  display: 'flex',
                                  justifyContent: 'center',
                                  alignItems: 'center',
                                  background: 'rgb(55, 55, 55)',
                                }}
                              >
                                <video 
                                  src={canvas.__jsonld.items[0].items[0].body.id} 
                                  width={canvas.width} 
                                  height={canvas.height}
                                  controls
                                  autoplay
                                />
                              </div>
                            ): (
                              <Slide
                                behaviors={canvas.__jsonld.behavior || []}
                                manifest={manifest}
                                canvas={canvas}
                                region={region}
                                fullscreenProps={{
                                  isFullscreen: false,
                                }}
                              />
                            )}
                          </SimpleSlideTransition>
                          </div>
                          </div>
                          <div className={'canvas-modal__info-and-nav'}>
                            <div className={'canvas-modal__info'}>
                            {canvas.__jsonld && 
                            canvas.__jsonld.items && 
                            canvas.__jsonld.items.length > 0 &&
                            canvas.__jsonld.items[0].items &&
                            canvas.__jsonld.items[0].items.length &&
                            canvas.__jsonld.items[0].items[0].label ? (
                              <h6>
                                {getTranslation(canvas.__jsonld.items[0].items[0].label, 'en')}
                              </h6>
                            ) : ''}
                            {canvas.__jsonld && 
                            canvas.__jsonld.items && 
                            canvas.__jsonld.items.length > 0 &&
                            canvas.__jsonld.items[0].items &&
                            canvas.__jsonld.items[0].items.length &&
                            canvas.__jsonld.items[0].items[0].summary ? (
                              <p>
                                {getTranslation(canvas.__jsonld.items[0].items[0].summary, 'en')}
                              </p>
                            ) : ''}
                            </div>
                            {canvasList.length > 1 ? (
                              <div className={'canvas-modal__nav'}>
                                {currentIndex + 1} / {canvasList.length}
                              </div>
                            ) : ''}
                            {canvasList.length > 1 ? (
                              <div className={'canvas-modal__nav'}>
                                {previousRange && (
                                  <button className="arrow left" onClick={previousRange}>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                                      <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/>
                                    </svg>
                                  </button>
                                )}
                                {nextRange && (
                                  <button className="arrow right" onClick={nextRange}>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                                      <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/>
                                    </svg>
                                  </button>
                                )}
                              </div>
                            ) : ''}
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
}

export default CanvasModal;