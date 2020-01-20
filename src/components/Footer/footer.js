import React from 'react';
import PropTypes from 'prop-types';
import { SocialMedia } from '../SocialMedia/SocialMedia';

import './footer.css';

const Footer = ({ path, title, twitterHandle }) => {
  return (
    <footer className="footer">
      <SocialMedia
        socialConfig={{
          twitterHandle,
          config: { ...{ url: path }, title },
        }}
        tags={[]}
      />
    </footer>
  );
};

Footer.propTypes = {
  path: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  twitterHandle: PropTypes.string.isRequired,
};

export default Footer;
