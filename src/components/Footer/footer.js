import React from 'react';
import PropTypes from 'prop-types';
import { SocialMedia } from '../SocialMedia/SocialMedia';

import './footer.css';

const Footer = ({ path, title, twitterHandle, url }) => {
  const currentPath =
    typeof window !== `undefined` ? location : `${url}${path}`;
  return (
    <footer className="footer">
      {/* <SocialMedia
        socialConfig={{
          twitterHandle,
          config: { ...{ url: currentPath }, title },
        }}
        tags={[]}
      /> */}
    </footer>
  );
};

Footer.propTypes = {
  path: PropTypes.string.isRequired,
  url: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  twitterHandle: PropTypes.string.isRequired,
};

export default Footer;
