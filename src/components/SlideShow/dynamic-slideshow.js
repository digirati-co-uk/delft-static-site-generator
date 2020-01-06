import React from 'react';
import PropTypes from 'prop-types';
import withLocation from '../withLocation/withLocation';
import Slideshow from './slideshow';

const DynamicSlideShow = ({ search, context, location }) => {
  const { id } = search;

  return (
  <React.Fragment>
    <p> {`The id = ${id}`}</p>
    <Slideshow jsonld={context} pathname={location.pathname} id={id} />
  </React.Fragment>
  )
};

DynamicSlideShow.propTypes = {
  search: PropTypes.object,
};

export default withLocation(DynamicSlideShow);
