import React from 'react';
import PropTypes from 'prop-types';
import IIIFIcon from '../../images/logo-iiif-34x30.png';
import { GITHUB_RAW_JSON_BASE } from '../../utils';
import './IIIFLink.scss';


const getIIIFLink = (href) => {
  if (/\/(collections|objects|exhibitions)\//.test(href)) {
    const baselink = `${href.replace(/(en|nl)/, `${GITHUB_RAW_JSON_BASE}`)}.json`;
    const manifest = `${href.replace(/(en|nl)/, `?manifest=${GITHUB_RAW_JSON_BASE}`)}.json`;
    return baselink + manifest;
  }
  return `${RAW_BASE}content/${href}.md`;
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
