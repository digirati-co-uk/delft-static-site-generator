import React, { useState, useEffect } from 'react';
import { PropTypes } from 'prop-types';

import CanvasModal from '../CanvasModal/CanvasModal';

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

export const Illustration = ({ source, children }) => {
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

  return (
    <>
      <img
        src={thumbnailSrc}
        style={{ cursor: 'pointer' }}
        onClick={() => renderModal()}
      ></img>
      {showCanvasModal ? (
        <CanvasModal
          selectedCanvas={iiifmanifest.items[0]}
          annotations={[]}
          hideCanvasDetails={() => setCanvasModal(false)}
        ></CanvasModal>
      ) : null}
      {children}
    </>
  );
};

Illustration.propTypes = {
  source: PropTypes.string,
};

// I need it to render a thumbnail image,
// this image will have an onClick event which renders the Modal.
// Check for a required statement
// Check for a label
