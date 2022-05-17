import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { GITHUB_RAW_JSON_BASE } from '../../utils';
import './IIIFLink.scss';

const getIIIFLink = (href) => {
  if (
    href.includes('exhibitions') ||
    href.includes('objects') ||
    href.includes('collections')
  ) {
    const baselink = `${href.replace(
      /\/(en|nl)/,
      `${GITHUB_RAW_JSON_BASE}`
    )}.json`;
    return baselink.replace('/src/', '/content/');
  }
  return `${GITHUB_RAW_JSON_BASE}/content/${href}.md`;
};

const IIIFLink = ({ href }) => {
  const [link, setLink] = useState('');

  useEffect(() => {
    const resolved = getIIIFLink(href);
    setLink(resolved);
  }, []);

  return (
    <div className="iiif-link-wrapper">
      <a
        href={link + '?manifest=' + link}
        target="_blank"
        title="Drag and Drop IIIF Resource"
      ></a>
    </div>
  );
};

IIIFLink.propTypes = {
  href: PropTypes.string.isRequired,
};

export { IIIFLink };
