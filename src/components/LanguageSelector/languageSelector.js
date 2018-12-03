import React from 'react';
import './languageSelector.css';

const LanguageSelector = props => (
  <span className="language-selector">
    <a href="/en" className="language-selector__translation">EN</a>/<a href="/nl" className="language-selector__translation">NL</a>
  </span>
);

export default LanguageSelector;
