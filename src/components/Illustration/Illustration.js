import React, { useState, useEffect } from 'react';
import { PropTypes } from 'prop-types';

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

  useEffect(() => {
    setIiifManifest(fetchDataFromFile(source));
  }, []);

  useEffect(() => {
    setThumbnailSrc(getThumbnail(iiifmanifest));
  }, [iiifmanifest]);

  return (
    <>
      <img src={thumbnailSrc}></img>
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
