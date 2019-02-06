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

const createCollectionPages = (createPage, objectLinks) => {
  const collectionTemplate = path.resolve(`src/pages/Collection/Collection.js`);
  const collectionsPath = './src/collections';
  return fs
    .readdirSync(collectionsPath)
    .filter(
      item => fs.statSync(path.join(collectionsPath, item)).isFile()
        && path.extname(item) === '.json',
    ).map(
      item => path.join(collectionsPath, item),
    ).reduce(
      (meta, item) => {
        const pathname = item.replace(/^src\//, '').replace(/\.json$/, '');
        const context = convertToV3ifNecessary(JSON.parse(fs.readFileSync(item)));
        createTranslatedPage({
          path: pathname,
          component: collectionTemplate,
          context: {
            objectLinks,
            collection: context,
          },
        }, createPage);
        meta.thumbnails[pathname] = context.items[0].thumbnail[0].id;
        meta.links[context.id] = pathname;
        meta.reverseLinks[pathname] = context.id;
        return meta;
      }, { thumbnails: {}, links: {}, reverseLinks: {} },
    );
};

const createObjectPages = (createPage) => {
  const manifestTemplate = path.resolve(`src/pages/Object/Object.js`);
  const manifestsPath = './src/objects';
  return fs
    .readdirSync(manifestsPath)
    .filter(
      item => fs.statSync(path.join(manifestsPath, item)).isFile()
        && path.extname(item) === '.json',
    ).map(
      item => path.join(manifestsPath, item),
    ).reduce(
      (meta, item) => {
        const pathname = item.replace(/^src\//, '').replace(/\.json$/, '');
        const context = convertToV3ifNecessary(JSON.parse(fs.readFileSync(item)), true);
        createTranslatedPage({
          path: pathname,
          component: manifestTemplate,
          context,
        }, createPage);
        // TODO: cover image if defined, first canvas thumbnail as fall-back, than first canvas image fallback...
        meta.thumbnails[pathname] = context.items[0].thumbnail[0].id;
        meta.links[context.id] = pathname;
        meta.reverseLinks[pathname] = context.id;
        return meta;
      }, { thumbnails: {}, links: {}, reverseLinks: {} },
    );
};

const createExhibitionPages = (createPage) => {
  const exhibitionTemplate = path.resolve(`src/pages/Exhibition/Exhibition.js`);
  const exhibitionsPath = './src/exhibitions';
  return fs
    .readdirSync(exhibitionsPath)
    .filter(
      item => fs.statSync(path.join(exhibitionsPath, item)).isFile()
        && path.extname(item) === '.json',
    ).map(
      item => path.join(exhibitionsPath, item),
    ).reduce(
      (meta, item) => {
        const pathname = item.replace(/^src\//, '').replace(/\.json$/, '');
        const context = JSON.parse(fs.readFileSync(item));
        createTranslatedPage({
          path: pathname,
          component: exhibitionTemplate,
          context,
        }, createPage);
        meta.thumbnails[pathname] = context.items[0].thumbnail[0].id || context.items[0].thumbnail[0]['@id'];
        meta.links[(context.id || context['@id'])] = pathname;
        meta.reverseLinks[pathname] = (context.id || context['@id']);
        return meta;
      }, { thumbnails: {}, links: {}, reverseLinks: {} },
    );
};

exports.createPages = ({ actions, graphql }) => {
  const { createPage } = actions;
  const objectMeta = createObjectPages(createPage);
  const collectionMeta = createCollectionPages(createPage, objectMeta.links);
  const exhibitionMeta = createExhibitionPages(createPage);
  const mdTemplate = path.resolve(`src/pages/Markdown/markdown.js`);
  const publicationsTemplate = path.resolve(`src/pages/Publications/Publications.js`);

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
        ],
      },
    });
  }
};
