import React from 'react';
import { Link } from 'gatsby';
import Menu from '../Menu/menu';

const Header = ({ siteTitle }) => (
  <div
    style={{
      background: 'yellow',
    }}
  >
    <div
      style={{
        display: 'flex',
        msFlexDirection: 'row',
        padding: '1rem 1.0875rem',
      }}
    >
      <h1 style={{ margin: 0, fontSize: 18, flex: 1 }}>
        <Link
          to="/"
          style={{
            color: 'black',
            textDecoration: 'none',
          }}
        >
          {siteTitle}
        </Link>
      </h1>
      <Menu />
    </div>
  </div>
)

export default Header
