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

const IIIFImageAnnotationCover = ({ body, position }) => {
  if (!body.service) {
    return (
      <img
        src={body.id}
        style={position}
        alt=""
      />
    );
  }
  const service = (Array.isArray(body.service) ? body.service[0] : body.service);
  const id = service['@id'] || service.id;
  return (
    <img
      src={`${id.replace('info.json', '')}/full/full/0/default.jpg`}
      style={position}
      alt=""
    />
  );
};

IIIFImageAnnotationCover.propTypes = {
  body: AnnotationBodyType,
  position: AnnotationPositionType,
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


export const AnnotationBodyRenderer = ({ body, position, pageLanguage }) => {
  switch (body.type) {
    case 'Choice':
      return filterToPreferredChoices(body.items, pageLanguage).map(
        choice => <AnnotationBodyRenderer body={choice} position={position} />,
      );
    case 'Video':
      return <IIIFVideoAnnotationCover body={body} position={position} />;
    case 'Image':
      return <IIIFImageAnnotationCover body={body} position={position} />;
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
};

AnnotationBodyRenderer.defaultProps = {
  body: {},
  position: {},
  pageLanguage: 'en',
};
