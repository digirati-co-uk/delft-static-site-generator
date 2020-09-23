import React from 'react';
import PropTypes from 'prop-types';
import { GITHUB_BASE } from '../../utils';

const getGitLink = href => {
  console.log(href);
  if (
    href.includes('collections') ||
    href.includes('objects') ||
    href.includes('collections')
  ) {
    return `${href.replace(/\/(en|nl)/, `${GITHUB_BASE}content`)}.json`;
  }
  return `${GITHUB_BASE}content${href}.md`;
};

const GithubLink = ({ href }) => (
  <div className="github-link-wrapper">
    <a
      href={getGitLink(href)}
      className="github-link"
      title="View source on Github"
      target="_blank"
      rel="noopener noreferrer"
    >
      View source on GitHub
    </a>
  </div>
);

GithubLink.propTypes = {
  href: PropTypes.string.isRequired,
};

export default GithubLink;
