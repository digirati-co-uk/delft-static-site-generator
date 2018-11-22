import React from 'react';

// TODO: add demo static static query results as a parameter.
const GatsbyDemoHelper = ({children, pathPrefix}) => {
  window.__PATH_PREFIX__ = pathPrefix || '/';
  return (
    <>
      {children}
    </>
	);
};

export default GatsbyDemoHelper;
