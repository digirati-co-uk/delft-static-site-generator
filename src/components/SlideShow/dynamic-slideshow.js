import React from 'react';
import PropTypes from 'prop-types';
import withLocation from '../withLocation/withLocation';
import Slideshow from './slideshow';

const DynamicSlideShow = ({ search, context, location }) => {
  const { id } = search || '';
  return (
    <Slideshow
      jsonld={context}
      pathname={location ? location.pathname : ''}
      id={id}
      location={location ? location.href : ''}
    />
  );
};

DynamicSlideShow.propTypes = {
  search: PropTypes.object,
};

export default withLocation(DynamicSlideShow);
