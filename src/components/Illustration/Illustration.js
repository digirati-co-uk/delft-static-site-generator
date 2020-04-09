import React, { useState, useEffect } from 'react';
import { PropTypes } from 'prop-types';

import DynamicCanvasModal from '../CanvasModal/DynamicCanvasModal';
import { StaticQuery, graphql } from 'gatsby';

const fetchDataFromFile = source => {
  const json = require(`../../../content/illustrations/${source}`);
  return json;
};

const convertArrayToObject = (array, key) =>
  array.reduce(
    (obj, item) => ({
      ...obj,
      [item[key]]: item,
    }),
    {}
  );

const getThumbnails = manifest => {
  if (!manifest.items) return [];
  const items =
    manifest &&
    manifest.items &&
    manifest.items[0] &&
    manifest.items[0] &&
    manifest.items[0].items[0] &&
    manifest.items[0].items[0] &&
    manifest.items[0].items[0].items
      ? manifest.items[0].items[0].items
      : [];
  const thumbnails = items.map(item => {
    if (item && item.thumbnail[0] && item.thumbnail[0].id)
      return item.thumbnail[0].id;
  });
  return thumbnails;
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

const getPath = (objects, path) => {
  let link = '';
  const objectPath = objects.find(object => {
    return getGraphThumbnail(object.context).includes(path);
  });
  if (objectPath && objectPath.path) {
    link = objectPath.path;
  }

  link = link.replace('/en/', '');
  link = link.replace('/nl/', '');
  return link;
};

const fixUrl = url => {
  return url
    .replace('thumbs', 'iiif-img')
    .replace('/full/full/0/default.jpg', '');
};

const IllustrationComponent = ({ source, pageLanguage, children, data }) => {
  const [iiifmanifest, setIiifManifest] = useState({});
  const [thumbnailSrc, setThumbnailSrc] = useState([]);
  const [showCanvasModal, setCanvasModal] = useState(false);
  const [annos, setAnnos] = useState({});

  useEffect(() => {
    const manifest = fetchDataFromFile(source);
    //thumbnails from the manifest
    setIiifManifest(manifest);

    const thumbnails = getThumbnails(manifest);

    // objects which have the same thumbnails
    const linkedObjects = data.allSitePage.nodes.filter(node => {
      //thumbnails from the linked objects
      const thumbs = getGraphThumbnail(node.context);
      const intersection = thumbnails.filter(el => thumbs.includes(el));
      return intersection.length >= 1;
    });

    let languaged = [];
    if (linkedObjects.length >= 1) {
      languaged = linkedObjects.filter(route =>
        route.path.split('/')[1].includes(pageLanguage)
      );
    }
    let annotations = {};
    if (thumbnails.length >= 1) {
      //use the first thumbnail for the annotation.
      setThumbnailSrc(thumbnails[0]);
      thumbnails.map(thumb => {
        const key = thumb ? fixUrl(thumb) : '';
        const path = getPath(languaged, thumb);
        annotations = { ...annotations, [key]: path };
      });
    }
    setAnnos(annotations);
  }, []);

  const canvas =
    iiifmanifest && iiifmanifest.items && iiifmanifest.items[0]
      ? iiifmanifest.items[0]
      : {};

  return (
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
          onClick={() => setCanvasModal(true)}
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
  );
};

IllustrationComponent.propTypes = {
  source: PropTypes.string,
};

export const Illustration = props => (
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
    render={data => <IllustrationComponent data={data} {...props} />}
  />
);
