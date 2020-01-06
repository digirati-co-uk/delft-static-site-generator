import React from 'react';
import PropTypes from 'prop-types';
import withQueryString from './withQuerySearch';

const IdQueryStringComponent = ({ search}) => {
  const { id } = search;
  return <p>ID: {id}</p>;
};

IdQueryStringComponent.propTypes = {
  search: PropTypes.object,
};

export default withQueryString(IdQueryStringComponent);
