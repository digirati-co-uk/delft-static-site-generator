import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { GITHUB_BASE } from '../../utils';

const getGitLink = (href) => {
  if (
    href.includes('exhibitions') ||
    href.includes('objects') ||
    href.includes('collections')
  ) {
    return `${href.replace(/\/(en|nl)/, `${GITHUB_BASE}content`)}.json`;
  } else {
    return `${GITHUB_BASE}content${href}.md`;
  }
};

const GithubLink = ({ href }) => {
  const [link, setLink] = useState('');

  useEffect(() => {
    const resolved = getGitLink(href);
    setLink(resolved);
  }, []);

  return (
    <div className="github-link-wrapper">
      <a
        href={link}
        className="github-link"
        title="View source on Github"
        target="_blank"
        rel="noopener noreferrer"
      >
        View source on GitHub
      </a>
    </div>
  );
};

GithubLink.propTypes = {
  href: PropTypes.string.isRequired,
};

export default GithubLink;
