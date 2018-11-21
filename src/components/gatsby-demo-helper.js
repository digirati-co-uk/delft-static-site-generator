import React from 'react';

const GatsbyDemoHelper = props => {
	window.__PATH_PREFIX__ = props.pathPrefix || '/';
	return (
    <>
      {props.children}
    </>
	);
};

export default GatsbyDemoHelper;
