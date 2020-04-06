import React, { useState, useEffect } from 'react';
import { PropTypes } from 'prop-types';

import DynamicCanvasModal from '../CanvasModal/DynamicCanvasModal';
import { StaticQuery, graphql } from 'gatsby';

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

const getGraphThumbnail = node => {
  if (!node.items) return [];
  let thumbnails = node && node.items ? node.items : [];
  thumbnails = thumbnails.map(item => {
    if (item && item.thumbnail && item.thumbnail[0] && item.thumbnail[0].id)
      return item.thumbnail[0].id;
  });
  return thumbnails;
};

const fixUrl = url => {
  return url
    .replace('thumbs', 'iiif-img')
    .replace('/full/full/0/default.jpg', '');
};

export const Illustration = ({ source, pageLanguage, children }) => {
  const [iiifmanifest, setIiifManifest] = useState({});
  const [thumbnailSrc, setThumbnailSrc] = useState('');
  const [showCanvasModal, setCanvasModal] = useState(false);
  const [annos, setAnnos] = useState([]);
  const [paths, setPaths] = useState([]);
  const [link, setLink] = useState('');
  useEffect(() => {
    setIiifManifest(fetchDataFromFile(source));
  }, []);

  useEffect(() => {
    const thumbnail = getThumbnail(iiifmanifest);
    const key = thumbnail.id ? fixUrl(thumbnail.id) : '';
    if (thumbnail.id) setThumbnailSrc(thumbnail.id);
    if (thumbnail.id) setAnnos({ [key]: link });
  }, [iiifmanifest, link]);

  const renderModal = data => {
    const obj = data.allSitePage.nodes.filter(node => {
      const thumbnails = getGraphThumbnail(node.context);
      return thumbnails.includes(thumbnailSrc);
    });
    setPaths(obj);
    let _link = '';
    if (paths.length > 1) {
      _link = paths.find(route =>
        route.path.split('/')[1].includes(pageLanguage)
      ).path;
    }
    _link = _link.replace('/en/', '');
    _link = _link.replace('/nl/', '');
    setLink(_link);
    setCanvasModal(!showCanvasModal);
  };

  const canvas =
    iiifmanifest && iiifmanifest.items && iiifmanifest.items[0]
      ? iiifmanifest.items[0]
      : {};

  return (
    <StaticQuery
      query={graphql`
        query MyQuery {
          allSitePage {
            nodes {
              path
              context {
                items {
                  thumbnail {
                    id
                  }
                }
              }
            }
          }
        }
      `}
      render={data => (
        <>
          <div className="cutcorners w-7 h-4">
            <img
              style={{
                objectFit: 'cover',
                cursor: 'pointer',
                width: '100%',
                height: '100%',
              }}
              src={thumbnailSrc}
              onClick={() => renderModal(data)}
            ></img>
          </div>
          {children ? <div className="info cutcorners">{children}</div> : <></>}
          {showCanvasModal ? (
            <DynamicCanvasModal
              manifest={iiifmanifest}
              selectedCanvas={canvas}
              annotationDetails={annos}
              hideCanvasDetails={() => setCanvasModal(false)}
              pageLanguage={pageLanguage}
            ></DynamicCanvasModal>
          ) : null}
        </>
      )}
    />
  );
};

Illustration.propTypes = {
  source: PropTypes.string,
};
