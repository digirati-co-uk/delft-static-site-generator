import React from 'react';
import Layout from '../../components/Layout/layout';
import { getTranslation } from '../../utils';
import { Link } from 'gatsby';

const getThumbnailImageSource = thumbnail =>
  typeof thumbnail === "string"
    ? thumbnail
    : Array.isArray(thumbnail)
      ? getThumbnailImageSource(thumbnail[0])
      : (thumbnail.id || thumbnail['@id']);

const getMetatataIfExist = (all_metadata, key, lang, prependKey = false) => {
  const matching = all_metadata.filter(metadata =>
    Object.values(metadata.label)
      .map(value => value.join('')).indexOf(key) !== -1
  );
  if (matching.length > 0) {
    if (matching[0].value) {
      return (prependKey ? getTranslation(matching[0].label, lang)  + ' ' : '') +
        getTranslation(matching[0].value, lang);
    }
  }
  return '';
};

const CollectionPage = (props) => {
  const { collection, objectLinks } = props.pageContext;
  if (!collection) {
    return 'Error: collection not defined, please check the source manifest.';
  }
  const title = getTranslation(collection.label, 'en');
  const curator = getMetatataIfExist(collection.metadata || [], 'Curated By', 'none', true)
  const summary = getTranslation(collection.summary, 'en', '\n').split('\n').map(paragraph=> <p>{paragraph}</p>)
  const items = (collection.items || []).filter(
    resource => resource.type === 'Manifest'
  );
  return (
    <Layout>
      <main>
        <div className="blocks blocks--auto-height">
          <aside className="w-4">
            <div className="block title cutcorners w-4 h-4 title--fountain-blue">
              <div className="boxtitle">Collection</div>
              <div className="maintitle">{title}</div>
              <div className="boxtitle">{curator}</div>
            </div>
            <div className="block info cutcorners w-4">{summary}</div>
          </aside>
          <article className="w-8">
          { 
            items.map(
              manifest =>
                <div className="w-4 h-6 block--align-right">
                  <div className="block w-3 h-6" >
                    <div className="block image cutcorners w-3 h-3">
                      <img src={getThumbnailImageSource(manifest.thumbnail)} className="object-link__image" alt="" />
                    </div>
                    <p>{getTranslation(manifest.label, 'en')}</p>
                    {manifest.summary 
                      ? getTranslation(manifest.summary, 'en', '\n')
                        .split('\n')
                        .map(paragraph=> <p>{paragraph}</p>)
                      : ''
                    }
                    <Link to={objectLinks[manifest.id||manifest['@id']]}>Read More</Link>
                  </div>
                </div>
            )
          }
          </article>
        </div>
      </main>
      {/* debug: <pre>{JSON.stringify(props, null, 2)}</pre> */}
    </Layout>
  )
};

export default CollectionPage;
