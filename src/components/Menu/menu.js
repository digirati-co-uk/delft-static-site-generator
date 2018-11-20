import React from 'react';
import PropTypes from 'prop-types';
import Link from '../Link/link';
import './menu.css';

const Menu = props => (
  <nav style={props.style||{}} className="main-menu">
    <ul className="main-menu__list">
      <li className="main-menu__list-item"><Link to="/exhibitions/" className="main-menu__link">Exhibitions</Link></li>
      <li className="main-menu__list-item"><Link to="/collections/" className="main-menu__link">Collections</Link></li>
      <li className="main-menu__list-item"><Link to="/about/" className="main-menu__link">About</Link></li>
    </ul>
  </nav>
);

// const Menu = props => (
//   <nav style={props.style} className="main-menu">
//     <ul className="main-menu__list">
//       <li className="main-menu__list-item"><a href="/exhibitions/" className="main-menu__link">Exhibitions</a></li>
//       <li className="main-menu__list-item"><a href="/collections/" className="main-menu__link">Collections</a></li>
//       <li className="main-menu__list-item"><a href="/about/" className="main-menu__link">About</a></li>
//     </ul>
//   </nav>
// );

Menu.propTypes = { 
  style: PropTypes.object,
}

Menu.defaultProps = {
  style: {},
}

export default Menu;