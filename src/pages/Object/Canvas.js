import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import Layout from '../../components/Layout/layout';
import { getPageLanguage } from '../../utils';
import { navigate } from 'gatsby';

const CanvasPage = ({ location, pageContext, path }) => {
  useEffect(() => {
    navigate(getRedirectRoute());
  }, []);

  const getRedirectRoute = () => {
    let pathSplit = path.split('/');
    pathSplit.splice(4, 0, '?id=');
    return pathSplit.join('/').replace('/?id=/', '/?id=');
  };

  const getPageMetaData = () => {
    let description = '';
    if (location.pathname.includes('/en/')) {
      pageContext.metadata.map((property) => {
        if (
          property &&
          property.label &&
          property.label.en &&
          property.label.en[0] === 'Title'
        ) {
          description = property.value.en[0];
        }
      });
    } else if (location.pathname.includes('/nl/')) {
      pageContext.metadata.map((property) => {
        if (
          property &&
          property.label &&
          property.label.nl &&
          property.label.nl[0] === 'Titel'
        ) {
          description = property.value.nl[0];
        }
      });
    }

    const meta = {
      image: pageContext.image,
      description: description,
    };
    return meta;
  };

  const pageLanguage = getPageLanguage(path);

  return (
    <Layout
      language={pageLanguage}
      path={path}
      meta={getPageMetaData()}
    ></Layout>
  );
};

CanvasPage.propTypes = {
  pageContext: PropTypes.object.isRequired,
  path: PropTypes.string.isRequired,
};

export default CanvasPage;
