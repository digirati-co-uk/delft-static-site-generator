// You can delete this file if you're not using it
const path = require('path');
const fs = require('fs');
const Upgrader = require('iiif-prezi2to3');

const upgrader = new Upgrader({ 'deref_links ': false });
const TRANSLATIONS = ['en', 'nl'];
const IIIF_PRESENTATION_V3_CONTEXT_NAMESPACE =
  'http://iiif.io/api/presentation/3/context.json';

const createTranslatedPage = (params, createPage) =>
  TRANSLATIONS.forEach(language =>
    createPage({
      ...params,
      path: `${language}/${params.path}`,
    })
  );

const convertToV3ifNecessary = manifest => {
  const context = manifest['@context'];
  const isNotP3 =
    context &&
    ((context.constructor === Array &&
      context.filter(
        namespace => namespace === IIIF_PRESENTATION_V3_CONTEXT_NAMESPACE
      ).length === 0) ||
      (context.constructor === String &&
        !context !== IIIF_PRESENTATION_V3_CONTEXT_NAMESPACE));
  if (isNotP3) {
    return upgrader.processResource(manifest, true);
  }
  return manifest;
};

const getManifestContext = itemPath => {
  const split = itemPath.split('/');
  let formatted = `${split[1]}/${split.pop()}`;
  formatted = formatted.replace(/\.json$/, '');
  let json;
  try {
    json = JSON.parse(fs.readFileSync(itemPath));
  } catch (e) {
    console.log(`ERROR IN JSON at ${itemPath} error: ${e}`);
  }
  return [formatted, convertToV3ifNecessary(json)];
};

const getCollectionGroup = itemPath => {
  // Get the collection by filename
  return itemPath.split('/')[2];
};
const checkifFolder = filepath =>
  fs.existsSync(filepath) && fs.lstatSync(filepath).isDirectory();

const checkifSubfolder = root => fs.statSync(path.join(root)).isDirectory();

const checkifJSON = filepath =>
  fs.statSync(filepath).isFile() && path.extname(filepath) === '.json';

const getFiles = filepath =>
  fs.readdirSync(filepath).map(item => path.join(filepath, item));

const getJSONFilesUnderPath = filepath => {
  const files = [];
  const allDirectory = getFiles(filepath);
  allDirectory.forEach(item => {
    if (checkifJSON(item)) {
      files.push(item);
    } else if (checkifSubfolder(path.join(item))) {
      const subfiles = getFiles(item);
      subfiles.forEach(file => {
        // eslint-disable-next-line no-unused-expressions
        checkifJSON(file)
          ? files.push(file)
          : getFiles(file).forEach(subfile => {
              if (checkifJSON(subfile)) files.push(subfile);
            });
      });
    }
  });
  return files;
};

const getCollections = filepath => {
  const files = [];
  const allDirectory = getFiles(filepath);
  allDirectory.forEach(item => {
    if (checkifJSON(item)) {
      files.push(item);
    } else if (checkifSubfolder(path.join(item))) {
      const subfiles = getFiles(item);
      subfiles.forEach(file => {
        if (checkifJSON(file)) files.push(file);
      });
    }
  });
  return files;
};

const getObjectsInCollection = items => {
  const formatted = [];
  items.map((item, index) => {
    const [collectionItemPath, collectionItemContext] = getManifestContext(
      item
    );

    const labels = { en: [''], nl: [''] };

    collectionItemContext.metadata.map(data => {
      if (data.label && data.label.en && data.label.en[0] === 'Title') {
        labels.en =
          data.value && data.value.en && data.value.en[0]
            ? [data.value.en[0]]
            : [''];
      }
      if (data.label && data.label.nl && data.label.nl[0] === 'Titel') {
        labels.nl =
          data.value && data.value.nl && data.value.nl[0]
            ? [data.value.nl[0]]
            : [''];
      }
    });

    formatted.push({
      id: collectionItemContext.id,
      type: collectionItemContext.type,
      thumbnail: collectionItemContext.items[0].thumbnail,
      label: labels,
    });
  });
  return formatted;
};

const getAllAnnotationsFromManifest = (manifest, manifestPath, _annotations) =>
  (manifest.items || []).reduce((annotations, canvas) => {
    const processAnnotationPage = annotationPage => {
      (annotationPage.items || []).forEach(annotation => {
        let annotationId = annotation.id;
        if (annotation.body && annotation.body.type === 'Image') {
          if (annotation.body.service) {
            const service = Array.isArray(annotation.body.service)
              ? annotation.body.service[0]
              : annotation.body.service;
            if (typeof service === 'string') {
              annotationId = service;
            } else if (typeof service.id === 'string') {
              annotationId = service.id;
            }
          }
          if (
            annotationId === annotation.id &&
            typeof annotation.body.id === 'string'
          ) {
            annotationId = annotation.body.id;
          }

          if (!annotations[annotationId]) {
            annotations[annotationId] = [];
          }
          annotations[annotationId].push([
            manifest.id,
            manifestPath,
            manifest.label,
          ]);
        }
      });
    };
    (canvas.items || []).forEach(processAnnotationPage);
    (canvas.annotations || []).forEach(processAnnotationPage);
    return annotations;
  }, _annotations || {});

const getThumbnails = thumbnails =>
  (thumbnails || []).map(thumbnail => thumbnail.id);

const getFirstThumbnail = thumbnails => getThumbnails(thumbnails || [])[0];

const getCanvasThumbnail = canvas => {
  let thumbnail = null;
  if (!thumbnail && canvas) {
    if (canvas.thumbnail) {
      thumbnail = getFirstThumbnail(canvas.thumbnail);
    }
    if (!thumbnail) {
      canvas.items.forEach(annotationList => {
        if (!thumbnail && annotationList.items) {
          annotationList.items.forEach(annotation => {
            if (!thumbnail && annotation.thumbnail) {
              thumbnail = getFirstThumbnail(annotation.thumbnail);
            }
          });
        }
      });
    }
  }
  return thumbnail;
};

const getManifestThumbnail = manifest => {
  let thumbnail = null;
  if (manifest.thumbnail) {
    thumbnail = getFirstThumbnail(manifest.thumbnail);
  }

  if (!thumbnail && manifest.posterCanvas) {
    thumbnail = getCanvasThumbnail(manifest.posterCanvas);
  }

  if (
    !thumbnail &&
    Array.isArray(manifest.items) &&
    manifest.items.length > 0
  ) {
    manifest.items.forEach(canvas => {
      if (!thumbnail) {
        thumbnail = getCanvasThumbnail(canvas);
      }
    });
  }
  return thumbnail;
};

// const getAllObjectLinks = (collection, collectionPath, _objectLinks) => {
//   // console.log(collection.items);
//   return (collection.items || []).reduce((objectLinks, manifest) => {
//     // console.log(objectLinks);
//     if (!objectLinks[manifest.id]) {
//       objectLinks[manifest.id] = [];
//     }
//     objectLinks[manifest.id].push([
//       collection.id,
//       collectionPath,
//       collection.label,
//     ]);
//     // console.log(objectLinks);
//     return objectLinks;
//   }, _objectLinks || []);
// };

getCollectionFilePath = (pathname, collectionsGroup) => {
  const split = pathname.split('/');
  return './content/' + split[0] + '/' + collectionsGroup + '/' + split[1];
};

const createCollectionPages = objectLinks => {
  const collectionTemplate = path.resolve(`src/pages/Collection/Collection.js`);
  const collectionsPath = './content/collections';
  return getCollections(collectionsPath).reduce(
    (meta, item) => {
      const [pathname, context] = getManifestContext(item);
      const collectionGroup = getCollectionGroup(item);
      const filepath = getCollectionFilePath(pathname, collectionGroup);
      let items = checkifFolder(filepath)
        ? getJSONFilesUnderPath(filepath)
        : [];

      if (items.length > 0) {
        items = getObjectsInCollection(items);
        context.items = items;
      }

      meta.pages[pathname] = {
        path: pathname,
        component: collectionTemplate,
        context: {
          objectLinks,
          collection: context,
          collectionGroup: collectionGroup,
        },
      };
      meta.thumbnails[pathname] = getManifestThumbnail(context);
      meta.links[context.id] = pathname;
      meta.reverseLinks[pathname] = context.id;
      // getAllObjectLinks(context, pathname, meta.objectInCollections);
      return meta;
    },
    {
      thumbnails: {},
      links: {},
      reverseLinks: {},
      objectInCollections: {},
      pages: {},
      items: [],
    }
  );
};

const createObjectPages = () => {
  const manifestTemplate = path.resolve(`src/pages/Object/Object.js`);
  const collectionsPath = './content/collections';
  const manifestsPath = './content/objects';

  const joined = [
    ...getJSONFilesUnderPath(collectionsPath),
    ...getJSONFilesUnderPath(manifestsPath),
  ];

  return joined.reduce(
    (meta, item) => {
      let [pathname, context] = getManifestContext(item);
      meta.pages[pathname] = {
        path: pathname.replace('collections/', 'objects/'),
        component: manifestTemplate,
        context,
      };
      // TODO: cover image if defined, first canvas thumbnail as fall-back,
      // than first canvas image fallback...
      meta.thumbnails[pathname] = getManifestThumbnail(context);
      meta.links[context.id] = pathname;
      meta.reverseLinks[pathname] = context.id;
      getAllAnnotationsFromManifest(
        context,
        pathname,
        meta.annotationsPartOfObjects
      );
      return meta;
    },
    {
      thumbnails: {},
      links: {},
      reverseLinks: {},
      annotationsPartOfObjects: {},
      pages: {},
    }
  );
};

const createExhibitionPages = () => {
  const exhibitionTemplate = path.resolve(`src/pages/Exhibition/Exhibition.js`);
  const exhibitionsPath = 'content/exhibitions';
  return getJSONFilesUnderPath(exhibitionsPath).reduce(
    (meta, item) => {
      const [pathname, context] = getManifestContext(item);
      meta.pages[pathname] = {
        path: pathname,
        component: exhibitionTemplate,
        context,
      };
      meta.thumbnails[pathname] = getManifestThumbnail(context);
      meta.links[context.id || context['@id']] = pathname;
      meta.reverseLinks[pathname] = context.id || context['@id'];
      getAllAnnotationsFromManifest(
        context,
        pathname,
        meta.annotationsPartOfExhibition
      );
      return meta;
    },
    {
      thumbnails: {},
      links: {},
      reverseLinks: {},
      annotationsPartOfExhibition: {},
      pages: {},
    }
  );
};

exports.createPages = ({ actions, graphql }) => {
  const { createPage } = actions;
  const objectMeta = createObjectPages();
  const collectionMeta = createCollectionPages(objectMeta.links);
  const exhibitionMeta = createExhibitionPages();
  const mdTemplate = path.resolve(`src/pages/Markdown/markdown.js`);
  const publicationsTemplate = path.resolve(
    `src/pages/Publications/Publications.js`
  );

  return graphql(`
    {
      allMarkdownRemark(
        sort: { order: DESC, fields: [frontmatter___date] }
        limit: 1000
      ) {
        edges {
          node {
            html
            frontmatter {
              path
            }
          }
        }
      }
    }
  `).then(result => {
    if (result.errors) {
      return Promise.reject(result.errors);
    }

    result.data.allMarkdownRemark.edges.forEach(({ node }) => {
      const manifestLinks = node.html.match(
        /<a href="(?:\/(?:en|nl))(\/(collection|exhibition|object)s\/.*)">/g
      );
      const thumbnails = (manifestLinks || []).reduce((t, item) => {
        const pathname = item
          .split('"')[1]
          .replace(/^\/(en|nl)/, '')
          .substr(1);
        if (objectMeta.thumbnails.hasOwnProperty(pathname)) {
          t[pathname] = objectMeta.thumbnails[pathname];
        } else if (collectionMeta.thumbnails.hasOwnProperty(pathname)) {
          t[pathname] = collectionMeta.thumbnails[pathname];
        } else if (exhibitionMeta.thumbnails.hasOwnProperty(pathname)) {
          t[pathname] = exhibitionMeta.thumbnails[pathname];
        }
        return t;
      }, {});
      createPage({
        path: node.frontmatter.path,
        component: mdTemplate,
        context: {
          thumbnails,
        }, // additional data can be passed via context
      });
    });
    TRANSLATIONS.forEach(language =>
      createPage({
        path: `${language}/publications/`,
        component: publicationsTemplate,
      })
    );

    Object.values(objectMeta.pages).forEach(object => {
      object.context.collections =
        collectionMeta.objectInCollections[object.context.id];

      const annos = Object.entries(objectMeta.annotationsPartOfObjects)
        .filter(
          ([key, value]) =>
            value.filter(item => item[1] === object.path).length > 0
        )
        .map(([key]) => key);

      object.context.exhibitions = Object.values(
        annos.reduce((_exhibitions, annotation) => {
          if (exhibitionMeta.annotationsPartOfExhibition[annotation]) {
            exhibitionMeta.annotationsPartOfExhibition[annotation].forEach(
              exhibition => {
                _exhibitions[exhibition[1]] = exhibition;
              }
            );
          }
          return _exhibitions;
        }, {})
      );
      createTranslatedPage(object, createPage);
    });
    Object.values(exhibitionMeta.pages).forEach(exhibition => {
      const annos = Object.entries(exhibitionMeta.annotationsPartOfExhibition)
        .filter(
          ([key, value]) =>
            value.filter(item => item[1] === exhibition.path).length > 0
        )
        .reduce((_annos, [key]) => {
          try {
            _annos[key] = objectMeta.annotationsPartOfObjects[key][0][1];
          } catch (err) {
            // console.log(key, err);
          }
          return _annos;
        }, {});
      exhibition.context.annotationDetails = annos;
      createTranslatedPage(exhibition, createPage);
    });
    Object.values(collectionMeta.pages).forEach(collection =>
      createTranslatedPage(collection, createPage)
    );
  });
};

exports.onCreateWebpackConfig = ({ stage, loaders, actions }) => {
  if (stage === 'build-html') {
    actions.setWebpackConfig({
      module: {
        rules: [
          {
            test: /@canvas-panel\/(core|slideshow)/,
            use: loaders.null(),
          },
          {
            test: /openseadragon/,
            use: loaders.null(),
          },
        ],
      },
    });
  }
};
