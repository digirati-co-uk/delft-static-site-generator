import React from 'react';
import PropTypes from 'prop-types';
import {
 TwitterShareButton, TwitterIcon, FacebookIcon, FacebookShareButton, LinkedinShareIcon, LinkedinShareButton, WhatsappShareButton, WhatsappShareIcon, RedditShareButton,
} from 'react-share';
import './SocialMedia.scss';


export const SocialMedia = ({ socialConfig, tags }) => <React.Fragment>
           <FacebookShareButton url={socialConfig.config.url} className="button is-outlined is-rounded facebook">
             <FacebookIcon />
           </FacebookShareButton>
           <TwitterShareButton url={socialConfig.config.url} title={socialConfig.config.title} via={socialConfig.twitterHandle
               .split('@')
               .join(
                 ''
               )} hashtags={tags} className="social" title="Share on Twitter">
             <TwitterIcon />
           </TwitterShareButton>
           {/* <LinkedinShareButton url={socialConfig.config.url} className="button is-outlined is-rounded linkedin" title={socialConfig.config.title}>
             <LinkedinShareIcon />
            </LinkedinShareButton>
           <RedditShareButton url={socialConfig.config.url} className="button is-outlined is-rounded reddit" title={socialConfig.config.title} />
           <WhatsappShareButton url={socialConfig.config.url} className="button is-outlined is-rounded whatsapp" title={socialConfig.config.title} /> */}
         </React.Fragment>;

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
