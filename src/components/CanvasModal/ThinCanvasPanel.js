import React from 'react';
import PropTypes from 'prop-types';
import OpenSeadragon from 'openseadragon';
import ContainerDimensions from 'react-container-dimensions';
import './ThinCanvasPanel.scss';

const parseXYWH = (xywh) => {
  if (!xywh) {
    return {};
  }
  const [x, y, width, height] = xywh.split(',').map((v) => parseInt(v, 10));
  return {
    x,
    y,
    width,
    height,
  };
};

const getHashParams = (uri) => {
  const hashParams = uri.split('#')[1];
  if (hashParams) {
    return hashParams.split('&').reduce((result, item) => {
      const [_key, _value] = item.split('=');
      result[_key] = _value;
      return result;
    }, {});
  }
  return {};
};

const ensureInfoJson = (url) =>
  url.endsWith('/info.json') ? url : `${url}/info.json`;

const getTileSourceUrl = (service) => {
  if (Array.isArray(service)) {
    if (typeof service[0] === 'string') {
      return ensureInfoJson(service[0]);
    }
    return ensureInfoJson(service[0].id);
  }
  if (typeof service === 'string') {
    return ensureInfoJson(service);
  }
  return ensureInfoJson(service.id);
};

const createVideo = (body) => {
  let url = body.id;
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
        }
          &autoplay=1&modestbranding=1&rel=0`;
    } else {
      url = url + '?autoplay=1&modestbranding=1&rel=0';
    }
  }
  if (body.id.includes('vimeo')) {
    url = url.replace('vimeo.com', 'player.vimeo.com/video');
    if (body.selector && body.selector.value.includes('t=')) {
      url = url + `?autoplay=1#${body.selector.value.split(',')[0]}`;
    } else {
      url = url + '?autoplay=1';
    }
  }
  if (body.id.includes('archive.org')) {
    url = url.replace('/details/', '/embed/');
    url = url + `&autoplay=1`;
  }
  return (
    <div>
      <iframe
        src={url}
        width="100%"
        height="80%"
        crossOrigin="anonymous"
        type="text/html"
        allow="autoplay"
        style={{
          width: '100%',
          height: '100%',
          position: 'absolute',
          border: 'none',
        }}
      />
    </div>
  );
};

const createText = (text, active) => {
  const element = document.createElement('div');
  element.style.border = '1px dashed red';
  element.style.color = 'red';
  element.style.className = active || '';
  element.innerHTML = text;
  return element;
};

class ThinCanvasPanel extends React.Component {
  constructor(props) {
    super(props);
    this.id = this.props.currentNavItem;
    this.state = { video: false };
  }

  componentDidUpdate(prevProps) {
    const { currentNavItem, canvas, displayType } = this.props;
    if (currentNavItem === -1) {
      this.viewer.viewport.goHome(true);
    }
    if (
      currentNavItem !== prevProps.currentNavItem &&
      displayType === 'layout-viewport-focus' &&
      currentNavItem !== -1
    ) {
      this.setCurrentNavitemFocus(this.props.navItems[currentNavItem].target);
    }
  }

  setViewerRef = (el) => {
    this.viewerEl = el;
    this.createOsd();
    this.displayAnnotationsOnCanvas();
  };

  createOsd = () => {
    this.viewer = OpenSeadragon({
      id: this.id,
      visibilityRatio: 1,
      sequenceMode: false,
      toolbar: null,
      showHomeControl: false,
      showZoomControl: false,
      showFullPageControl: false,
      showRotationControl: false,
      showFlipControl: false,
      showSequenceControl: false,
      tileSouce: this.props.navItems,
    });
  };

  convertCoordsToViewportRelative = (bounds, viewportSize) => ({
    x: (bounds.x || 0) / viewportSize.width,
    y: (bounds.y || 0) / viewportSize.width,
    width: viewportSize.width
      ? (bounds.width || viewportSize.width) / viewportSize.width
      : 1,
    height: viewportSize.height
      ? (bounds.height || viewportSize.height) / viewportSize.width
      : 1,
  });

  addCanvasBackground = async () => {
    await this.viewer.addTiledImage({
      tileSource: {
        width: this.props.width,
        height: this.props.height,
        tileSize: 256,
        //not converted to a string here as firefox can't handle it and it crashes the site
        getTileUrl: () => '',
      },
    });
  };

  getAnnotationCrop = (annotation) => {
    if (annotation && annotation.body && annotation.body.id) {
      const iiifPathParts = annotation.body.id.split('/');
      const xywh = iiifPathParts[iiifPathParts.length - 4];
      if (xywh !== 'full' && xywh !== 'max') {
        return parseXYWH(xywh);
      }
    }
  };

  computeImageCords = (realCords, crop, annotation, canvas) => {
    if (!crop) {
      return this.convertCoordsToViewportRelative(realCords, canvas);
    }
    const ratioX = crop.width / annotation.body.width;
    const ratioD = realCords.width / crop.width;
    return this.convertCoordsToViewportRelative(
      {
        x: realCords.x - crop.x * ratioD, // parseInt((realCords.x / ratioX), 10),
        y: realCords.y - crop.y * ratioD, // parseInt((realCords.y / ratioY), 10),
        width: parseInt(realCords.width / ratioX, 10),
        height: parseInt(realCords.height / ratioX, 10),
      },
      canvas
    );
  };

  getRotation = (param) => {
    return parseInt(param.split('/')[9]);
  };

  getQuality = (param) => {
    return parseInt(param.split('/')[10]);
  };

  displayAnnotationsOnCanvas = () => {
    const { canvas } = this.props;

    // svg layer is required if multiple annotations, but if one not necessary/messes up cropped annotations
    if (this.props.navItems.length > 1) this.addCanvasBackground();
    this.annotations = this.props.getAnnotations();

    this.annotations.forEach((annotation) => {
      const coords = this.convertCoordsToViewportRelative(
        parseXYWH(getHashParams(annotation.target || '').xywh),
        canvas
      );
      switch (annotation.body.type) {
        case 'Image':
          const realCords = parseXYWH(
            getHashParams(annotation.target || '').xywh
          );
          const crop = this.getAnnotationCrop(annotation, canvas);
          const computedImageCords = this.computeImageCords(
            realCords,
            crop,
            annotation,
            canvas
          );
          delete computedImageCords.height;

          this.viewer.addTiledImage({
            tileSource: getTileSourceUrl(annotation.body.service),
            degrees: this.getRotation(annotation.body.id),
            tileQuality: this.getQuality(annotation.body.id),
            ...computedImageCords,
            ...(crop
              ? {
                  clip: new OpenSeadragon.Rect(
                    crop.x,
                    crop.y,
                    crop.width,
                    crop.height
                  ),
                }
              : {}),
          });
          break;
        case 'Video':
          this.setState({ video: true });
          break;
        case 'TextualBody':
        default:
          this.viewer.addOverlay(
            createText(
              annotation.motivation === 'layout-viewport-focus'
                ? ''
                : annotation.body.value
            ),
            new OpenSeadragon.Rect(
              coords.x,
              coords.y,
              coords.width,
              coords.height,
              0
            )
          );
      }
    });
  };

  setCurrentNavitemFocus = (canvasItem) => {
    const { canvas, currentNavItem } = this.props;
    const coords = this.convertCoordsToViewportRelative(
      parseXYWH(getHashParams(canvasItem || '').xywh),
      canvas
    );
    this.viewer.viewport.fitBounds(
      new OpenSeadragon.Rect(coords.x, coords.y, coords.width, coords.height, 0)
    );
  };

  render() {
    return (
      <ContainerDimensions>
        {({ width, height }) =>
          this.state.video ? (
            createVideo(this.annotations[0].body)
          ) : (
            <div
              id={this.id}
              ref={this.setViewerRef}
              style={{
                width,
                height,
              }}
            />
          )
        }
      </ContainerDimensions>
    );
  }
}

ThinCanvasPanel.propTypes = {
  canvas: PropTypes.object.isRequired,
  currentNavItem: PropTypes.number,
  getAnnotations: PropTypes.func,
  height: PropTypes.number,
  width: PropTypes.number,
  displayType: PropTypes.string,
  navItems: PropTypes.arrayOf(PropTypes.object),
};

ThinCanvasPanel.defaultProps = {
  currentNavItem: -1,
};

export default ThinCanvasPanel;
