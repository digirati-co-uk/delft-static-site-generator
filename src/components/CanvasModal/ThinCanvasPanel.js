import React from 'react';
import PropTypes from 'prop-types';
import OpenSeadragon from 'openseadragon';
import ContainerDimensions from 'react-container-dimensions';
import './ThinCanvasPanel.scss';

const parseXYWH = xywh => {
  if (!xywh) {
    return {};
  }
  const [x, y, width, height] = xywh.split(',').map(v => parseInt(v, 10));
  return {
    x,
    y,
    width,
    height,
  };
};

const getHashParams = uri => {
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

const ensureInfoJson = url =>
  url.endsWith('/info.json') ? url : `${url}/info.json`;

const getTileSourceUrl = service => {
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

const parseVideo = url => {
  // - Supported YouTube URL formats:
  //   - http://www.youtube.com/watch?v=My2FRPA3Gf8
  //   - http://youtu.be/My2FRPA3Gf8
  //   - https://youtube.googleapis.com/v/My2FRPA3Gf8
  // - Supported Vimeo URL formats:
  //   - http://vimeo.com/25451551
  //   - http://player.vimeo.com/video/25451551
  // - Also supports relative URLs:
  //   - //player.vimeo.com/video/25451551

  url.match(
    /(http:|https:|)\/\/(player.|www.)?(vimeo\.com|youtu(be\.com|\.be|be\.googleapis\.com)|dailymotion.com)\/(video\/|embed\/|watch\?v=|v\/)?([A-Za-z0-9._%-]*)(&\S+)?/
  );

  if (RegExp.$3.indexOf('youtu') > -1) {
    return {
      type: 'youtube',
      id: RegExp.$6,
      src: `//www.youtube.com/embed/${RegExp.$6}`,
      thumbnail: `//img.youtube.com/vi/${RegExp.$6}/maxresdefault.jpg`,
    };
  }
  if (RegExp.$3.indexOf('vimeo') > -1) {
    return {
      type: 'vimeo',
      id: RegExp.$6,
      src: `//player.vimeo.com/video/${RegExp.$6}`,
      thumbnail: cb => {
        fetch(`http://vimeo.com/api/v2/video/${RegExp.$6}.json`)
          .then(response => response.json())
          .then(data => cb(data[0].thumbnail_large));
      },
    };
  }
  if (RegExp.$3.indexOf('dailymotion.com') > -1) {
    return {
      type: 'dailymotion',
      id: RegExp.$6,
      src: `//www.dailymotion.com/embed/video/${RegExp.$6}`,
      thumbnail: `//www.dailymotion.com/thumbnail/video/${RegExp.$6}`,
    };
  }
};

const createVideo = url => {
  const element = document.createElement('div');
  const videoServiceResult = parseVideo(url);
  if (videoServiceResult && videoServiceResult.type) {
    element.innerHTML = `<iframe
      src="${videoServiceResult.src}"
      title="${`external-video: ${annotation.id}`}"
      class="canvas-panel__video-styles"
    />`;
  } else {
    element.innerHTML = `<video autoplay controls><source src="${url}" class="canvas-panel__video-styles"style="" /></video>`;
  }
  return element;
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
    this.id = `canvas_panel__${new Date().getTime()}`;
    console.log(this.props);
    this.state = {
      ref: () => this.setViewerRef(),
    };
  }

  componentDidUpdate(prevProps) {
    const { currentNavItem, canvas, displayType } = this.props;
    if (
      prevProps.canvas.id !== canvas.id &&
      displayType === 'mixed-media-canvas'
    ) {
      console.log(this.viewer);
      this.displayAnnotationsOnCanvas();
    }
    if (
      currentNavItem !== prevProps.currentNavItem &&
      displayType === 'layout-viewport-focus'
    ) {
      this.setCurrentNavitemFocus();
    }
  }

  setViewerRef = el => {
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
    });
  };

  convertCoordsToViewportRelative = (bounds, viewportSize) => ({
    x: (bounds.x || 0) / viewportSize.width,
    y: (bounds.y || 0) / viewportSize.height,
    width: viewportSize.width
      ? (bounds.width || viewportSize.width) / viewportSize.width
      : 1,
    height: viewportSize.height
      ? (bounds.height || viewportSize.height) / viewportSize.height
      : 1,
  });

  addCanvasBackground = () => {
    this.viewer.addTiledImage({
      tileSource: {
        width: this.props.width,
        height: this.props.height,
        tileSize: 256,
        getTileUrl: () =>
          `data:image/svg+xml;base64,${btoa(
            `<?xml version="1.0" encoding="utf-8"?>\
                <svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" \
          x="0px" y="0px" viewBox="0 0 256 256" style="enable-background:new 0 0 256 256;" xml:space="preserve">\
          <g>\
            <rect x="0" y="0" style="fill:#353535;" width="256" height="256"/>\
            </g>\
          </svg>`
          )}`,
      },
    });
  };

  getAnnotationCrop = annotation => {
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

  displayAnnotationsOnCanvas = () => {
    const { canvas } = this.props;

    this.addCanvasBackground();
    console.log(this.viewer);
    this.annotations = this.props.getAnnotations();

    this.annotations.forEach(annotation => {
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
          this.viewer.addOverlay(
            createVideo(annotation.body.id),
            new OpenSeadragon.Rect(
              coords.x,
              coords.y,
              coords.width,
              coords.height,
              0
            )
          );
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

  setCurrentNavitemFocus = () => {
    const { canvas, currentNavItem } = this.props;
    const coords = this.convertCoordsToViewportRelative(
      parseXYWH(
        getHashParams(this.props.navItems[currentNavItem].target || '').xywh
      ),
      canvas
    );
    this.viewer.viewport.fitBounds(
      new OpenSeadragon.Rect(coords.x, coords.y, coords.width, coords.height, 0)
    );
  };

  render() {
    return (
      <ContainerDimensions>
        {({ width, height }) => (
          <div
            id={this.id}
            ref={this.setViewerRef}
            style={{
              width,
              height,
            }}
          />
        )}
      </ContainerDimensions>
    );
  }
}

ThinCanvasPanel.propTypes = {
  canvas: PropTypes.any.isRequired,
  currentNavItem: PropTypes.number,
};

ThinCanvasPanel.defaultProps = {
  currentNavItem: -1,
};

export default ThinCanvasPanel;
