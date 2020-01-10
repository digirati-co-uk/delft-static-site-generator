import React from 'react';
import PropTypes from 'prop-types';
import * as classnames from 'classnames';
import { translate } from 'react-translate';
import { Link } from 'gatsby';
import Menu from '../Menu/menu';
import Logo from '../Logo/logo';
import BurgerMenu from '../BurgerMenu/BurgerMenu';
import LanguageSelector from '../LanguageSelector/languageSelector';
import './header.css';


class Header extends React.Component {
  state = {
    isMobileMenuOpen: false,
  }

  toggleMobileMenu = () => {
    const { isMobileMenuOpen } = this.state;
    this.setState({
      isMobileMenuOpen: !isMobileMenuOpen,
    });
  }

  render() {
    const { language, path, t } = this.props;
    const { isMobileMenuOpen } = this.state;

    return (
      <header className="header">
        <div className="header__content">
          <BurgerMenu className="header__burger-menu" onClick={this.toggleMobileMenu} />
          <Link to={`/${language}/`} className="header__site-title">
            {t('SITE_TITLE')}
          </Link>
          <div
            className={
              classnames('header__mobile', { 'header__mobile--open': isMobileMenuOpen })
            }
          >
            <Menu language={language} />
            <LanguageSelector language={language} path={path} />
            <Logo />
          </div>
        </div>
      </header>
    );
  }
}

Header.propTypes = {
  t: PropTypes.func,
  language: PropTypes.string.isRequired,
  path: PropTypes.string.isRequired,
};

Header.defaultProps = {
  t: key => key,
};

export default translate('Header')(Header);
