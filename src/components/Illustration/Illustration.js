import React, { useState, useEffect } from 'react';
import { PropTypes } from 'prop-types';

import DynamicCanvasModal from '../CanvasModal/DynamicCanvasModal';

const fetchDataFromFile = source => {
  const json = require(`../../../content/illustrations/${source}`);
  return json;
};

const getThumbnail = manifest => {
  if (!manifest.items) return '';
  const thumbnail_src =
    manifest &&
    manifest.items &&
    manifest.items[0] &&
    manifest.items[0] &&
    manifest.items[0].items[0] &&
    manifest.items[0].items[0] &&
    manifest.items[0].items[0].items &&
    manifest.items[0].items[0].items[0].thumbnail &&
    manifest.items[0].items[0].items[0].thumbnail[0] &&
    manifest.items[0].items[0].items[0].thumbnail[0].id
      ? manifest.items[0].items[0].items[0].thumbnail[0].id
      : null;
  return thumbnail_src;
};

export const Illustration = ({ source, pageLanguage, children }) => {
  const [iiifmanifest, setIiifManifest] = useState({});
  const [thumbnailSrc, setThumbnailSrc] = useState('');
  const [showCanvasModal, setCanvasModal] = useState(false);

  useEffect(() => {
    setIiifManifest(fetchDataFromFile(source));
  }, []);

  useEffect(() => {
    setThumbnailSrc(getThumbnail(iiifmanifest));
  }, [iiifmanifest]);

  const renderModal = () => {
    setCanvasModal(!showCanvasModal);
  };

  const canvas =
    iiifmanifest && iiifmanifest.items && iiifmanifest.items[0]
      ? iiifmanifest.items[0]
      : {};
  console.log(canvas);
  return (
    <>
      <img
        src={thumbnailSrc}
        style={{ cursor: 'pointer' }}
        onClick={() => renderModal()}
      ></img>
      {showCanvasModal ? (
        <DynamicCanvasModal
          manifest={iiifmanifest}
          selectedCanvas={canvas}
          annotations={canvas.items}
          hideCanvasDetails={() => setCanvasModal(false)}
          pageLanguage={pageLanguage}
        ></DynamicCanvasModal>
      ) : null}
      {children}
    </>
  );
};

Illustration.propTypes = {
  source: PropTypes.string,
};
