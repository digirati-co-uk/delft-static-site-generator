import React from 'react';
import './footer.css';

const Footer = () => (
  <footer className="footer">
    <a
        href="https://twitter.com/share?ref_src=twsrc%5Etfw"
        className="twitter-share-button"
        data-show-count="false">
    Tweet
      </a>
  <script
    async
    src="https://platform.twitter.com/widgets.js"
    charset="utf-8"
  />
  </footer>
);

export default Footer;
