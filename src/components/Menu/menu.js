import React from 'react';
import PropTypes from 'prop-types';
import { translate } from 'react-translate';
import { Link } from 'gatsby';
import './menu.css';

const Menu = ({ t, style, language }) => (
  <nav style={style} className="main-menu">
    <ul className="main-menu__list">
      <li className="main-menu__list-item">
        <Link to={`/${language}/exhibitions/`} className="main-menu__link">
          {t('EXHIBITIONS')}
        </Link>
      </li>
      <li className="main-menu__list-item">
        <Link to={`/${language}/collections/`} className="main-menu__link">
          {t('COLLECTIONS')}
        </Link>
      </li>
      <li className="main-menu__list-item">
        <Link to={`/${language}/publications/`} className="main-menu__link">
          {t('PUBLICATIONS')}
        </Link>
      </li>
      <li className="main-menu__list-item">
        <Link to={`/${language}/about/`} className="main-menu__link">
          {t('ABOUT')}
        </Link>
      </li>
    </ul>
  </nav>
);

Menu.propTypes = {
  t: PropTypes.func,
  style: PropTypes.object,
  language: PropTypes.string.isRequired,
};

Menu.defaultProps = {
  style: {},
  t: (key) => key,
};

export default translate('Menu')(Menu);
