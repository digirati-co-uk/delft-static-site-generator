import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'gatsby';
import GithubLink from '../../components/GithubLink/GithubLink';
import Layout from '../../components/Layout/layout';
import { getTranslation as translate, getPageLanguage } from '../../utils';

const getThumbnailImageSource = (thumbnail) => {
  if (typeof thumbnail === 'string') {
    return thumbnail;
  }
  return Array.isArray(thumbnail)
      ? getThumbnailImageSource(thumbnail[0])
      : (thumbnail.id || thumbnail['@id']);
};

const getMetatataIfExist = (allMetadata, key, lang, prependKey = false) => {
  const matching = allMetadata.filter(metadata => Object.values(metadata.label)
      .map(value => value.join('')).indexOf(key) !== -1);
  if (matching.length > 0) {
    if (matching[0].value) {
      return (prependKey ? `${translate(matching[0].label, lang)} ` : '')
      + translate(matching[0].value, lang);
    }
  }
  return '';
};

const CollectionPage = ({ pageContext, '*': path }) => {
  const { collection, objectLinks } = pageContext;
  if (!collection) {
    return 'Error: collection not defined, please check the source manifest.';
  }
  const pageLanguage = getPageLanguage(path);
  const title = translate(collection.label, pageLanguage);
  const curator = getMetatataIfExist(collection.metadata || [], 'Curated By', 'none', true);
  const summary = translate(collection.summary, pageLanguage, '\n').split('\n').map(paragraph => <p>{paragraph}</p>);
  const items = (collection.items || []).filter(
    resource => resource.type === 'Manifest',
  );
  return (
    <Layout language={pageLanguage} path={path}>
      <main>
        <div className="blocks blocks--auto-height">
          <aside className="w-4">
            <div className="block title cutcorners w-4 h-4 title--fountain-blue">
              <div className="boxtitle">Collection</div>
              <div className="maintitle">
                {title}
                <GithubLink href={path} />
              </div>
              <div className="boxtitle">{curator}</div>
            </div>
            <div className="block info cutcorners w-4">{summary}</div>
          </aside>
          <article className="w-8">
            {
            items.map(
              manifest => (
                <div className="w-4 h-6 block--align-right">
                  <div className="block w-3 h-6">
                    <div className="block image cutcorners w-3 h-3">
                      <img src={getThumbnailImageSource(manifest.thumbnail)} className="object-link__image" alt="" />
                    </div>
                    <p className="collection-list__label">{translate(manifest.label, pageLanguage)}</p>
                    {manifest.summary
                      ? translate(manifest.summary, pageLanguage, '\n')
                        .split('\n')
                        .map(paragraph => <p className="collection-list__summary">{paragraph}</p>)
                      : ''
                    }
                    <Link to={[pageLanguage, objectLinks[manifest.id || manifest['@id']]].join('/')}>Read More</Link>
                  </div>
                </div>
              ),
            )
          }
          </article>
        </div>
      </main>
      {/* debug: <pre>{JSON.stringify(props, null, 2)}</pre> */}
    </Layout>
  );
};

CollectionPage.propTypes = {
  pageContext: PropTypes.object.isRequired,
  '*': PropTypes.string.isRequired,
};

export default CollectionPage;
