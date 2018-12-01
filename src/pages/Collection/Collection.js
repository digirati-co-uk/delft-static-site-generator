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

const CollectionPage = (props) => {
  const { collection, objectLinks } = props.pageContext;
  return (
    <Layout>
      <main>
        <h1>{collection && collection.label && getTranslation(collection.label, 'en')}</h1>
        {
          collection && 
          collection.summary 
          ? getTranslation(collection.summary, 'en', '\n').split('\n')
            .map(
              paragraph=> <p>{paragraph}</p>
            )
          : ''
        }
        <div className="object-listing">
        { 
          collection &&
          collection.items && 
          collection.items.filter(
            resource => resource.type === 'Manifest'
          ).map(
            manifest =>
              <div className="object-link">
                <img src={getThumbnailImageSource(manifest.thumbnail)} className="object-link__image" alt="" />
                <div className="object-link__details">
                  <h2 className="object-link__header">{getTranslation(manifest.label, 'en')}</h2>
                  {manifest.summary 
                    ? getTranslation(manifest.summary, 'en', '\n')
                      .split('\n')
                      .map(
                        paragraph=>
                          <p className="object-link__paragraph">
                            {paragraph}
                          </p>
                      )
                    : ''
                  }
                  <Link to={objectLinks[manifest.id||manifest['@id']]}>Read More</Link>
                </div>
              </div>
          )
        }
        </div>
      </main>
      {/* debug: <pre>{JSON.stringify(props, null, 2)}</pre> */}
    </Layout>
  )
};

export default CollectionPage;
