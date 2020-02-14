import React, { useState, useEffect } from 'react';
import { PropTypes } from 'prop-types';

import DynamicCanvasModal from '../CanvasModal/DynamicCanvasModal';

const fetchDataFromFile = source => {
  const json = require(`../../../content/illustrations/${source}`);
  return json;
};

const getThumbnail = manifest => {
  if (!manifest.items) return {};
  const thumbnail =
    manifest &&
    manifest.items &&
    manifest.items[0] &&
    manifest.items[0] &&
    manifest.items[0].items[0] &&
    manifest.items[0].items[0] &&
    manifest.items[0].items[0].items &&
    manifest.items[0].items[0].items[0].thumbnail &&
    manifest.items[0].items[0].items[0].thumbnail[0] &&
    manifest.items[0].items[0].items[0].thumbnail[0]
      ? manifest.items[0].items[0].items[0].thumbnail[0]
      : null;
  return thumbnail;
};

const fixUrl = url => {
  return url
    .replace('thumbs', 'iiif-img')
    .replace('/full/full/0/default.jpg', '');
};

export const Illustration = ({ source, pageLanguage, object, children }) => {
  const [iiifmanifest, setIiifManifest] = useState({});
  const [thumbnailSrc, setThumbnailSrc] = useState('');
  const [showCanvasModal, setCanvasModal] = useState(false);
  const [annos, setAnnos] = useState([]);
  useEffect(() => {
    setIiifManifest(fetchDataFromFile(source));
  }, []);

  const link = object ? `objects/${object}` : '';

  useEffect(() => {
    const thumbnail = getThumbnail(iiifmanifest);
    const key = thumbnail.id ? fixUrl(thumbnail.id) : '';
    if (thumbnail.id) setThumbnailSrc(thumbnail.id);
    if (thumbnail.id) setAnnos({ [key]: link });
  }, [iiifmanifest]);

  const renderModal = () => {
    setCanvasModal(!showCanvasModal);
  };

  const canvas =
    iiifmanifest && iiifmanifest.items && iiifmanifest.items[0]
      ? iiifmanifest.items[0]
      : {};
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
          annotationDetails={annos}
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
