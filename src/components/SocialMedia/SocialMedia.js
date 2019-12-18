import React from 'react';
import PropTypes from 'prop-types';
import { TwitterShareButton, TwitterIcon } from 'react-share';
import './SocialMedia.scss';


export const SocialMedia = ({ socialConfig, tags }) => (
  <React.Fragment>
    <TwitterShareButton
      url={socialConfig.config.url}
      title={socialConfig.config.title}
      via={socialConfig.twitterHandle.split('@').join('')}
      hashtags={tags}
    >
      <TwitterIcon />
      <span className="text">Twitter</span>
    </TwitterShareButton>
  </React.Fragment>
);

SocialMedia.propTypes = {
  socialConfig: PropTypes.shape({
    twitterHandle: PropTypes.string.isRequired,
    config: PropTypes.shape({
      url: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
    }),
  }).isRequired,
  tags: PropTypes.arrayOf(PropTypes.string),
};
SocialMedia.defaultProps = {
  tags: [],
};
