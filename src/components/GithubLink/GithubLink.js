import React from 'react';
import PropTypes from 'prop-types';
import { GITHUB_BASE } from '../../utils';

const getGitLink = href => {
  if (/\/(collections|objects|exhibitions)\//.test(href)) {
    return `${href.replace(/(en|nl)/, `${GITHUB_BASE}src`)}.json`;
  }
  return `${GITHUB_BASE}content/${href}.md`;
};

const GithubLink = ({ href }) => (
  <div className="github-link-wrapper">
    <a
      href={getGitLink(href)}
      className="github-link"
      title="View source on Github"
    >
      View source on GitHub
    </a>
  </div>
);

GithubLink.propTypes = {
  href: PropTypes.string.isRequired,
};

export default GithubLink;
