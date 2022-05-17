import React from 'react';
import PropTypes from 'prop-types';
import withLocation from '../withLocation/withLocation';
import CanvasModal from './CanvasModal';

const DynamicCanvasModal = (props) => {
  return (
    <CanvasModal {...props} pathname={props.location.pathname} id={props.id} />
  );
};

DynamicCanvasModal.propTypes = {
  location: PropTypes.any,
  selectedCanvas: PropTypes.any,
  hideCanvasDetails: PropTypes.func.isRequired,
  pageLanguage: PropTypes.string.isRequired,
  annotationDetails: PropTypes.any,
};

export default withLocation(DynamicCanvasModal);
