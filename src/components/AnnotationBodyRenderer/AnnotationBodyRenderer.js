import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

const filterToPreferredChoices = (choices, pageLanguage = 'en') =>
  choices.filter(
    (choice) =>
      !choice.hasOwnProperty('language') ||
      (choice.hasOwnProperty('language') && choice.language === pageLanguage)
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
  body,
  position,
  annotation,
  canvas,
  canvasSize: canvasPhysicalSize = { width: 1200, height: 1200 },
}) => {
  if (!body) {
    return 'error';
  }
  if (body.id) {
    const imageRelativeSize = imageCanvasRealiveSize(body.id, canvas);
    canvasPhysicalSize.width /= imageRelativeSize.width;
    canvasPhysicalSize.height /= imageRelativeSize.height;
    return (
      <picture>
        <source
          media={'max-width: 980px'}
          srcSet={body.id.replace('/full/full/', `/full/!1000,1000/`)}
        />
        <source
          media={'max-width: 700px'}
          srcSet={body.id.replace('/full/full/', `/full/!800,800/`)}
        />
        <source
          media={'max-width: 600px'}
          srcSet={body.id.replace('/full/full/', `/full/!600,600/`)}
        />
        <source
          media={'max-width: 480px'}
          srcSet={body.id.replace('/full/full/', `/full/!500,500/`)}
        />
        <source
          media={'max-width: 320px'}
          srcSet={body.id.replace('/full/full/', `/full/!250,250/`)}
        />
        <img
          src={body.id.replace('/full/full/', `/full/!1000,1000/`)}
          style={position}
          alt={body.id}
        />
      </picture>
    );
  }
  if (body.service) {
    const service = Array.isArray(body.service)
      ? body.service[0]
      : body.service;
    const id = service['@id'] || service.id;
    return (
      <img
        src={`${id.replace('info.json', '')}/full/!${
          canvasPhysicalSize.width
        },${canvasPhysicalSize.height}/0/default.jpg`}
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

const IIIFVideoAnnotationCover = ({ body, position, annotation }) => {
  const [imageUrl, setImageUrl] = useState('');
  let url = body.id;

  useEffect(() => {
    if (body.id.includes('youtu.be') || body.id.includes('youtube')) {
      if (url.includes('watch')) {
        url = url.replace('watch?v=', 'embed/');
      } else {
        url = url.replace('youtube', 'youtube.com/embed');
        url = url.replace('youtu.be', 'youtube.com/embed');
      }
      if (body.selector && body.selector.value.includes('t=')) {
        url =
          url +
          `?start=${body.selector.value.split('t=')[1].split(',')[0]}&end=${
            body.selector.value.split('t=')[1].split(',')[1]
          }`;
      }
      setImageUrl(
        `https://img.youtube.com/vi/${
          url.split('/')[4].split('?')[0]
        }/maxresdefault.jpg`
      );
    }
    if (body.id.includes('vimeo')) {
      url = url.replace('vimeo.com', 'player.vimeo.com/video');
      if (body.selector && body.selector.value.includes('t=')) {
        url = url + `#${body.selector.value.split(',')[0]}`;
      }
      fetch(
        `https://vimeo.com/api/oembed.json?url=https%3A//vimeo.com/${
          url.split('/')[4].split('#')[0]
        }&width=1024&height=768`
      )
        .then((response) => response.json())
        .then((data) => setImageUrl(data.thumbnail_url));
    }
    if (annotation.thumbnail) {
      setImageUrl(annotation.thumbnail[0].id);
    }
  }, []);

  return (
    <picture>
      <img src={imageUrl} style={position} alt={imageUrl} />
    </picture>
  );
};

IIIFVideoAnnotationCover.propTypes = {
  body: AnnotationBodyType,
  position: AnnotationPositionType,
  annotation: PropTypes.any,
};

IIIFVideoAnnotationCover.defaultProps = {
  body: {},
  position: {},
};

const IIIFTextAnnotationCover = ({ body, position }) => (
  <div style={position}>{body.value}</div>
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
  body,
  position,
  pageLanguage,
  annotation,
  canvas,
  canvasSize,
}) => {
  switch (body.type) {
    case 'Choice':
      return filterToPreferredChoices(body.items, pageLanguage).map(
        (choice) => (
          <AnnotationBodyRenderer
            body={choice}
            position={position}
            annotation={annotation}
            canvas={canvas}
            canvasSize={canvasSize}
          />
        )
      );
    case 'Video':
      return (
        <IIIFVideoAnnotationCover
          body={body}
          position={position}
          annotation={annotation}
        />
      );
    case 'Image':
      return (
        <IIIFImageAnnotationCover
          body={body}
          position={position}
          annotation={annotation}
          canvas={canvas}
          canvasSize={canvasSize}
        />
      );
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
