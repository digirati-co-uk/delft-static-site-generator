import React from 'react';
import PropTypes from 'prop-types';
import IIIFIcon from '../../../public/icons/logo-iiif-34x30.png';
import './IIIFLink.scss';

const RAW_BASE = 'https://raw.githubusercontent.com/digirati-co-uk/delft-static-site-generator/master/src';

const getIIIFLink = (href) => {
  console.log(href);
  if (/\/(collections|objects|exhibitions)\//.test(href)) {
    const baselink = `${href.replace(/(en|nl)/, `${RAW_BASE}`)}.json`;
    const manifest = `${href.replace(/(en|nl)/, `?manifest=${RAW_BASE}`)}.json`;
    return baselink + manifest;
  }
  // return `${RAW_BASE}content/${href}.md`;
};

const IIIFLink = ({ href }) => (
  <a className="iiif-link-wrapper" href={getIIIFLink(href)} title="Drag and Drop IIIF Resource">
    <img src={IIIFIcon} alt="IIIF logo" />
  </a>
);


IIIFLink.propTypes = {
  href: PropTypes.string.isRequired,
};


export { IIIFLink };
