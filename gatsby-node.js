// You can delete this file if you're not using it
const path = require('path');
const fs = require('fs');
const Upgrader = require('iiif-prezi2to3');

const upgrader = new Upgrader({ 'deref_links ': false });
const TRANSLATIONS = ['en', 'nl'];
const IIIF_PRESENTATION_V3_CONTEXT_NAMESPACE = 'http://iiif.io/api/presentation/3/context.json';

const createTranslatedPage = (params, createPage) => TRANSLATIONS.forEach(
    language => createPage({
        ...params,
        path: `${language}/${params.path}`,
      }),
  );

const convertToV3ifNecessary = (manifest) => {
  const context = manifest['@context'];
  const isNotP3 = context
    && ((context.constructor === Array
      && context.filter(
        namespace => namespace === IIIF_PRESENTATION_V3_CONTEXT_NAMESPACE,
      ).length === 0)
      || (context.constructor === String
        && !context !== IIIF_PRESENTATION_V3_CONTEXT_NAMESPACE));
  if (isNotP3) {
    return upgrader.processResource(manifest, true);
  }
    return manifest;
};

const getManifestContext = (itemPath) => {
  const pathname = itemPath.replace(/^src\//, '').replace(/\.json$/, '');
  return [pathname, convertToV3ifNecessary(JSON.parse(fs.readFileSync(itemPath)))];
};

const getJSONFilesUnderPath = rootPath => fs
  .readdirSync(rootPath)
  .filter(
    item => fs.statSync(path.join(rootPath, item)).isFile()
      && path.extname(item) === '.json',
  ).map(
    item => path.join(rootPath, item),
  );

const getAllAnnotationsFromManifest = (
  manifest,
  manifestPath,
  _annotations,
) => (manifest.items || [])
    .reduce((annotations, canvas) => {
      const processAnnotationPage = (annotationPage) => {
        (annotationPage.items || []).forEach(
          (annotation) => {
            const annotationId = annotation.service && annotation.service.length > 0
              ? annotation.service[0].id
              : annotation.id;
            if (!annotations[annotationId]) {
              annotations[annotationId] = [];
            }
            annotations[annotationId].push([manifest.id, manifestPath, manifest.label]);
          },
        );
      };
      (canvas.items || []).forEach(processAnnotationPage);
      (canvas.annotations || []).forEach(processAnnotationPage);
      return annotations;
    }, _annotations || {});


const getAllObjectLinks = (
  collection,
  collectionPath,
  _objectLinks,
) => (collection.items || [])
  .reduce((objectLinks, manifest) => {
    if (!objectLinks[manifest.id]) {
      objectLinks[manifest.id] = [];
    }
    objectLinks[manifest.id].push([collection.id, collectionPath, collection.label]);
    return objectLinks;
  }, _objectLinks || []);

const createCollectionPages = (objectLinks) => {
  const collectionTemplate = path.resolve(`src/pages/Collection/Collection.js`);
  const collectionsPath = './src/collections';
  return getJSONFilesUnderPath(collectionsPath)
    .reduce(
      (meta, item) => {
        const [pathname, context] = getManifestContext(item);
        // createTranslatedPage({
        //   path: pathname,
        //   component: collectionTemplate,
        //   context: {
        //     objectLinks,
        //     collection: context,
        //   },
        // }, createPage);
        meta.pages[pathname] = {
          path: pathname,
          component: collectionTemplate,
          context: {
            objectLinks,
            collection: context,
          },
        };
        meta.thumbnails[pathname] = context.items[0].thumbnail[0].id;
        meta.links[context.id] = pathname;
        meta.reverseLinks[pathname] = context.id;
        getAllObjectLinks(context, pathname, meta.objectInCollections);
        return meta;
      }, {
        thumbnails: {},
        links: {},
        reverseLinks: {},
        objectInCollections: {},
        pages: {},
      },
    );
};

const createObjectPages = () => {
  const manifestTemplate = path.resolve(`src/pages/Object/Object.js`);
  const manifestsPath = './src/objects';
  return getJSONFilesUnderPath(manifestsPath)
    .reduce(
      (meta, item) => {
        const [pathname, context] = getManifestContext(item);
        // createTranslatedPage({
        //   path: pathname,
        //   component: manifestTemplate,
        //   context,
        // }, createPage);
        meta.pages[pathname] = {
          path: pathname,
          component: manifestTemplate,
          context,
        };
        // TODO: cover image if defined, first canvas thumbnail as fall-back,
        // than first canvas image fallback...
        meta.thumbnails[pathname] = context.items[0].thumbnail[0].id;
        meta.links[context.id] = pathname;
        meta.reverseLinks[pathname] = context.id;
        getAllAnnotationsFromManifest(context, pathname, meta.annotationsPartOfObjects);
        return meta;
      }, {
       thumbnails: {},
       links: {},
       reverseLinks: {},
       annotationsPartOfObjects: {},
       pages: {},
      },
    );
};


const createExhibitionPages = () => {
  const exhibitionTemplate = path.resolve(`src/pages/Exhibition/Exhibition.js`);
  const exhibitionsPath = './src/exhibitions';
  return getJSONFilesUnderPath(exhibitionsPath)
    .reduce(
      (meta, item) => {
        const [pathname, context] = getManifestContext(item);
        // createTranslatedPage({
        //   path: pathname,
        //   component: exhibitionTemplate,
        //   context,
        // }, createPage);
        meta.pages[pathname] = {
          path: pathname,
          component: exhibitionTemplate,
          context,
        };
        meta.thumbnails[pathname] = context.items[0].thumbnail[0].id || context.items[0].thumbnail[0]['@id'];
        meta.links[(context.id || context['@id'])] = pathname;
        meta.reverseLinks[pathname] = (context.id || context['@id']);

        getAllAnnotationsFromManifest(context, pathname, meta.annotationsPartOfExhibition);
        return meta;
      }, {
        thumbnails: {},
        links: {},
        reverseLinks: {},
        annotationsPartOfExhibition: {},
        pages: {},
      },
    );
};

exports.createPages = ({ actions, graphql }) => {
  const { createPage } = actions;
  const objectMeta = createObjectPages();
  const collectionMeta = createCollectionPages(objectMeta.links);
  const exhibitionMeta = createExhibitionPages();
  const mdTemplate = path.resolve(`src/pages/Markdown/markdown.js`);
  const publicationsTemplate = path.resolve(`src/pages/Publications/Publications.js`);

  // console.log(JSON.stringify(exhibitionMeta.annotationsPartOfExhibition, null, 2));
  // console.log(JSON.stringify(objectMeta.annotationsPartOfObjects, null, 2));
  console.log(JSON.stringify(collectionMeta.objectInCollections, null, 2));

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
  `).then((result) => {
    if (result.errors) {
      return Promise.reject(result.errors);
    }

    result.data.allMarkdownRemark.edges.forEach(({ node }) => {
      const manifestLinks = node.html.match(
        /<a href="(?:\/(?:en|nl))(\/(collection|exhibition|object)s\/.*)">/g,
      );
      const thumbnails = (manifestLinks || []).reduce((t, item) => {
        const pathname = item.split('"')[1].replace(/^\/(en|nl)/, '').substr(1);
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
    TRANSLATIONS.forEach(
      language => createPage({
          path: `${language}/publications/`,
          component: publicationsTemplate,
        }),
    );

    Object.values(objectMeta.pages).forEach(
      (object) => {
        object.context.collections = collectionMeta.objectInCollections[object.context.id];
        object.context.exhibitions = Object.values(
          Object.keys(objectMeta.annotationsPartOfObjects)
            .reduce((_exhibitions, annotation) => {
              if (exhibitionMeta.annotationsPartOfExhibition[annotation]) {
                exhibitionMeta.annotationsPartOfExhibition[annotation].forEach(
                  (exhibition) => {
                    _exhibitions[exhibition[1]] = exhibition;
                  },
                );
              }
              return _exhibitions;
          }, {}),
          );
        createTranslatedPage(object, createPage);
      },
    );
    Object.values(exhibitionMeta.pages).forEach(
      exhibition => createTranslatedPage(exhibition, createPage),
    );
    Object.values(collectionMeta.pages).forEach(
      collection => createTranslatedPage(collection, createPage),
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
