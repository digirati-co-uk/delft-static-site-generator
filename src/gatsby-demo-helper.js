import React from 'react';

// // TODO: add demo static static query results as a parameter.
const GatsbyDemoHelper = ({ children, pathPrefix }) => {
  if (typeof window !== 'undefined') {
    window.__PATH_PREFIX__ = pathPrefix;
  } else {
    ('/');
  }
  return <>{children}</>;
};

export default GatsbyDemoHelper;
