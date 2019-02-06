import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'gatsby';
import './menu.css';

const Menu = ({ style, language }) => (
  <nav style={style} className="main-menu">
    <ul className="main-menu__list">
      <li className="main-menu__list-item"><Link to={`/${language}/exhibitions/`} className="main-menu__link">Exhibitions</Link></li>
      <li className="main-menu__list-item"><Link to={`/${language}/collections/`} className="main-menu__link">Collections</Link></li>
      <li className="main-menu__list-item"><Link to={`/${language}/publications/`} className="main-menu__link">Publications</Link></li>
      <li className="main-menu__list-item"><Link to={`/${language}/about/`} className="main-menu__link">About</Link></li>
    </ul>
  </nav>
);

Menu.propTypes = {
  style: PropTypes.object,
  language: PropTypes.string.isRequired,
};

Menu.defaultProps = {
  style: {},
};

export default Menu;
