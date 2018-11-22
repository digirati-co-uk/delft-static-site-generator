import React from 'react';

const GatsbyDemoHelper = ({children, pathPrefix}) => {
  window.__PATH_PREFIX__ = pathPrefix || '/';
  return (
    <>
      {children}
    </>
	);
};

export default GatsbyDemoHelper;
