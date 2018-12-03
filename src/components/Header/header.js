import React from 'react';
import { Link } from 'gatsby';
import Menu from '../Menu/menu';
import Logo from '../Logo/logo';
import LanguageSelector from '../LanguageSelector/languageSelector';
import './header.css'

const Header = ({ siteTitle }) => (
  <header className="header">
    <div className="header__content">
      <Link to="/" className="header__site-title">
        {siteTitle}
      </Link>
      <Menu />
      <LanguageSelector />
      <Logo />
    </div>
  </header>
)

export default Header
