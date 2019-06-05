import React from 'react';
import PropTypes from 'prop-types';

const filterToPreferredChoices = (choices, pageLanguage = 'en') => choices.filter(
    choice => !choice.hasOwnProperty('language')
      || (choice.hasOwnProperty('language') && choice.language === pageLanguage),
  );

const AnnotationBodyType = PropTypes.shape({
  id: PropTypes.string,
  service: PropTypes.array,
  type: PropTypes.string,
  value: PropTypes.any,
});

const AnnotationPositionType = PropTypes.shape({
  top: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  left: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  width: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  height: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
});

const convertBehaviourToPhysicalSize = canvas => (canvas ? canvas.behaviors || [] : [])
    .reduce((_canvasSize, behaviour) => {
    if (behaviour.startsWith('w-')) {
      _canvasSize.width = parseInt(behaviour.subStr(2), 10) * 100;
    } else if (behaviour.startsWith('h-')) {
      _canvasSize.height = parseInt(behaviour.subStr(2), 10) * 100;
    }
    return _canvasSize;
  }, {
    width: 1200,
    height: 1200,
  });

const imageCanvasRealiveSize = (bodyId, canvas) => {
  const pathParts = bodyId.split('/');
  const xywh = pathParts[pathParts.length - 4];
  if (xywh !== 'full') {
    const [x, y, w, h] = xywh.split(',');
    return {
      width: parseInt(w, 10) / parseInt(canvas.width, 10),
      height: parseInt(h, 10) / parseInt(canvas.height, 10),
    };
  }
  return {
    width: 1,
    height: 1,
  };
};

const IIIFImageAnnotationCover = ({
 body, position, annotation, canvas,
}) => {
  if (!body) {
    return ('error');
  }
  // console.log('IIIFImageAnnotationCover', body, position, annotation, canvas);
  const canvasPhysicalSize = convertBehaviourToPhysicalSize(canvas);
  if (body.id) {
    const imageRelativeSize = imageCanvasRealiveSize(body.id, canvas);
    canvasPhysicalSize.width /= imageRelativeSize.width;
    canvasPhysicalSize.height /= imageRelativeSize.height;
    return (
      <img
        src={
          body.id.replace('/full/0/default.jpg', `/!${parseInt(canvasPhysicalSize.width, 10)},${parseInt(canvasPhysicalSize.height, 10)}/0/default.jpg`)
        }
        style={position}
        alt={body.id}
      />
    );
  }
  if (body.service) {
    const service = (Array.isArray(body.service) ? body.service[0] : body.service);
    const id = service['@id'] || service.id;
    return (
      <img
        src={
          `${id.replace('info.json', '')}/full/!${canvasPhysicalSize.width},${canvasPhysicalSize.height}/0/default.jpg`
        }
        style={position}
        alt={id}
      />
    );
  }
};

IIIFImageAnnotationCover.propTypes = {
  body: AnnotationBodyType,
  position: AnnotationPositionType,
  canvas: PropTypes.any,
  annotation: PropTypes.any,
};

IIIFImageAnnotationCover.defaultProps = {
  body: {},
  position: {
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    position: 'absolute',
  },
};

const IIIFVideoAnnotationCover = ({ body, position }) => (
  <div style={position}>
    <video
      src={body.id}
      width="100%"
      height="100%"
      controls
      style={{
        width: '100%',
        height: '100%',
        // objectFit: 'cover'
    }}
    />
  </div>
);

IIIFVideoAnnotationCover.propTypes = {
  body: AnnotationBodyType,
  position: AnnotationPositionType,
};

IIIFVideoAnnotationCover.defaultProps = {
  body: {},
  position: {},
};

const IIIFTextAnnotationCover = ({ body, position }) => (
  <div style={position}>
    {body.value}
  </div>
);

IIIFTextAnnotationCover.propTypes = {
  body: AnnotationBodyType,
  position: AnnotationPositionType,
};

IIIFTextAnnotationCover.defaultProps = {
  body: {},
  position: {},
};


export const AnnotationBodyRenderer = ({
 body, position, pageLanguage, annotation, canvas,
}) => {
  switch (body.type) {
    case 'Choice':
      return filterToPreferredChoices(body.items, pageLanguage).map(
        choice => <AnnotationBodyRenderer body={choice} position={position} annotation={annotation} canvas={canvas} />,
      );
    case 'Video':
      return <IIIFVideoAnnotationCover body={body} position={position} />;
    case 'Image':
      return <IIIFImageAnnotationCover body={body} position={position} annotation={annotation} canvas={canvas} />;
    case 'Text':
      return <IIIFTextAnnotationCover style={position} body={body} />;
    default:
      return '';
  }
};

AnnotationBodyRenderer.propTypes = {
  body: AnnotationBodyType,
  position: AnnotationPositionType,
  pageLanguage: PropTypes.string,
  annotation: PropTypes.any,
  canvas: PropTypes.any,
};

AnnotationBodyRenderer.defaultProps = {
  body: {},
  position: {},
  pageLanguage: 'en',
};
