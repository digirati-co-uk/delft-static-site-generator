'use strict';

const OFF = 0;
const ALLOW = 1;
const ERROR = 2;

module.exports = {
  extends: ['airbnb', "plugin:compat/recommended", "plugin:json/recommended"],
  parser: 'babel-eslint',
  rules: {
    'no-undef': OFF,
    'no-use-before-define': OFF,
    // 'prettier/prettier': ERROR,
    'accessor-pairs': OFF,
    'brace-style': [ERROR, '1tbs'],
    'consistent-return': OFF,
    'dot-location': [ERROR, 'property'],
    'dot-notation': ERROR,
    'eol-last': ERROR,
    eqeqeq: [ERROR, 'allow-null'],
    indent: OFF,
    'jsx-quotes': [ERROR, 'prefer-double'],
    'keyword-spacing': [ERROR, { after: true, before: true }],
    'no-bitwise': OFF,
    'no-inner-declarations': [ERROR, 'functions'],
    'no-multi-spaces': ERROR,
    'no-restricted-syntax': [ERROR, 'WithStatement'],
    'no-shadow': ERROR,
    'no-unused-expressions': ERROR,
    'no-useless-concat': OFF,
    'react/no-danger': OFF,
    'no-underscore-dangle': OFF,
    'no-prototype-builtins': OFF,
    'no-param-reassign': OFF,
    'react/forbid-prop-types': OFF,
    'import/prefer-default-export': OFF,
    'jsx-a11y/media-has-caption': OFF,
    'react/jsx-filename-extension': [ALLOW, { extensions: ['.js', '.jsx'] }],
    quotes: [
      ERROR,
      'single',
      { avoidEscape: true, allowTemplateLiterals: true },
    ],
    'space-before-blocks': ERROR,
    'space-before-function-paren': OFF,
  },
  "env": {
    "browser": true
  },
  "plugins": [
      "json"
  ],
  "rules": {
      "json/*": ["error"]
  }
};
