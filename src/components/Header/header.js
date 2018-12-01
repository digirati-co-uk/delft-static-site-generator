import React from 'react';
import { Link } from 'gatsby';
import Menu from '../Menu/menu';

const Header = ({ siteTitle }) => (
  <div
    style={{
      background: '#e1c136',
    }}
  >
    <div
      style={{
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0.6rem 1.0875rem',
      }}
    >
      
        <Link
          to="/"
          style={{
            color: 'black',
            textDecoration: 'none',
            borderBottom: 0,
            fontWeight: 'bold',
          }}
        >
          {siteTitle}
        </Link>
      
      <Menu />
    </div>
  </div>
)

export default Header
