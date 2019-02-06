import React from 'react';
import PropTypes from 'prop-types';
import {
  Manifest,
  RangeNavigationProvider,

} from '@canvas-panel/core';
import {
  MobilePageView,
  SimpleSlideTransition,
  Slide,
  // CanvasNavigation,
} from '@canvas-panel/slideshow';
import { Arrow } from '../Arrow/Arrow';
import { Close } from '../Close/Close';

import './CanvasModal.scss';
import { getTranslation } from '../../utils';

const CanvasModal = ({ selectedCanvas, hideCanvasDetails }) => {
  const processedCanvases = [];
  if (selectedCanvas) {
    const mediaTypes = ['Image', 'Video'];
    let lastMediaCanvas = null;
    selectedCanvas.items[0].items.forEach((annotation, index) => {
      if (mediaTypes.indexOf(annotation.body.type) !== -1) {
        if (lastMediaCanvas !== null) {
          processedCanvases.push(lastMediaCanvas);
        }
        const copyAnnotation = JSON.parse(JSON.stringify(annotation));
        copyAnnotation.target = `canvas-${index}`;
        lastMediaCanvas = {
          id: `canvas-${index}`,
          type: 'Canvas',
          width: selectedCanvas.width || annotation.width,
          height: selectedCanvas.height || annotation.height,
          items: [{
            id: `annotation-page-${index}`,
            type: 'AnnotationPage',
            items: [copyAnnotation],
          }],
        };
      }
    });

    if (lastMediaCanvas !== null) {
      lastMediaCanvas.annotations = selectedCanvas.annotations;
      processedCanvases.push(lastMediaCanvas);
    }
  }

  const pseudoManifest = {
    '@context': [
      'http://www.w3.org/ns/anno.jsonld',
      'http://iiif.io/api/presentation/3/context.json',
    ],
    type: 'Manifest',
    id: 'http://digirati.com/iiif/v3/temporary/manifest',
    items: processedCanvases,
  };

  return (
    selectedCanvas
      ? (
        <div className="canvas-modal">
          <div className="canvas-modal__content">
            <Manifest jsonLd={pseudoManifest}>
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
                    // goToRange,
                  } = rangeProps;
                  return (
                    <div className="canvas-modal__inner-frame">
                      {false ? (
                        <MobilePageView
                          manifest={manifest}
                          previousRange={previousRange}
                          nextRange={nextRange}

                          {...rangeProps}
                        />
                      ) : (
                        <React.Fragment>
                          <div className="canvas-modal__content-slide">
                            <div className="canvas-modal__slide-transition-wrapper">
                              <SimpleSlideTransition id={currentIndex}>
                                {canvas.__jsonld
                              && canvas.__jsonld.items
                              && canvas.__jsonld.items.length > 0
                              && canvas.__jsonld.items[0].items
                              && canvas.__jsonld.items[0].items.length
                              && canvas.__jsonld.items[0].items[0]
                              && canvas.__jsonld.items[0].items[0].body
                              && canvas.__jsonld.items[0].items[0].body.type === 'Video' ? (
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
                                    autoPlay
                                  />
                                </div>
                              ) : (
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
                          <div className="canvas-modal__info-and-nav">
                            <div className="canvas-modal__info">
                              {canvas.__jsonld
                            && canvas.__jsonld.items
                            && canvas.__jsonld.items.length > 0
                            && canvas.__jsonld.items[0].items
                            && canvas.__jsonld.items[0].items.length
                            && canvas.__jsonld.items[0].items[0].label ? (
                              <h6>
                                {getTranslation(canvas.__jsonld.items[0].items[0].label, 'en')}
                              </h6>
                            ) : ''}
                              {canvas.__jsonld
                            && canvas.__jsonld.items
                            && canvas.__jsonld.items.length > 0
                            && canvas.__jsonld.items[0].items
                            && canvas.__jsonld.items[0].items.length
                            && canvas.__jsonld.items[0].items[0].summary ? (
                              <p>
                                {getTranslation(canvas.__jsonld.items[0].items[0].summary, 'en')}
                              </p>
                            ) : ''}
                            </div>
                            {canvasList.length > 1 ? (
                              <div className="canvas-modal__nav">
                                {currentIndex + 1}
                                {' / '}
                                {canvasList.length}
                              </div>
                            ) : ''}
                            {canvasList.length > 1 ? (
                              <div className="canvas-modal__nav">
                                <button
                                  className="arrow left"
                                  onClick={previousRange}
                                  type="button"
                                  style={{
                                    visibility: currentIndex === 0 ? 'hidden' : 'visible',
                                  }}
                                >
                                  <Arrow />
                                </button>
                                <button
                                  className="arrow right"
                                  onClick={nextRange}
                                  type="button"
                                  style={{
                                    visibility: currentIndex + 1 === canvasList.length ? 'hidden' : 'visible',
                                  }}
                                >
                                  <Arrow />
                                </button>
                              </div>
                            ) : ''}
                          </div>
                        </React.Fragment>
                      )}
                    </div>
                  );
                }}
              </RangeNavigationProvider>
            </Manifest>


            <button
              onClick={hideCanvasDetails}
              className="canvas-modal__close"
              type="button"
            >
              <Close />
            </button>
          </div>
        </div>
      )
      : ''
  );
};

CanvasModal.propTypes = {
  selectedCanvas: PropTypes.any,
  hideCanvasDetails: PropTypes.func.isRequired,
};

CanvasModal.defaultProps = {
  selectedCanvas: null,
};

export default CanvasModal;
