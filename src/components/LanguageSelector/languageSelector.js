import React from 'react';
import PropTypes from 'prop-types';
import './languageSelector.css';

const LanguageSelector = ({ path }) => {
  const pathNoLocale = path.replace(/^(en|nl)/, '');
  return (
    <span className="language-selector">
      <a href={`/en${pathNoLocale}`} className="language-selector__translation">EN</a>
      /
      <a href={`/nl${pathNoLocale}`} className="language-selector__translation">NL</a>
    </span>
  );
};

LanguageSelector.propTypes = {
  path: PropTypes.string.isRequired,
};

export default LanguageSelector;
