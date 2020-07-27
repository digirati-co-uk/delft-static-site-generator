import React, { useState } from 'react';
import { navigate } from 'gatsby';

const SearchIcon = ({ color }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill={color ? color : 'white'}
      width="32px"
      height="32px"
    >
      <path d="M0 0h24v24H0z" fill="none" />
      <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" />
    </svg>
  );
};

const SearchForm = ({ pageLanguage, query, showTitle }) => {
  const [value, setValue] = useState('');

  // const handleChange = e => {
  //   setValue(e.target.value);
  // };

  // const handleSubmit = e => {
  //   e.preventDefault();
  //   navigate(`/${pageLanguage}/search/?keywords=${encodeURIComponent(value)}`);
  // };

  return showTitle ? (
    <>
      <h1>Search posts</h1>
      <form
        role="search"
        method="GET"
        style={{
          backgroundColor: 'white',
          padding: '0.25rem',
          display: 'flex',
          alignItems: 'center',
        }}
      >
        <label htmlFor="search-input"></label>
        <button type="submit" style={{ border: 'none', background: 'none' }}>
          <SearchIcon color="black" />
        </button>
        <input
          type="search"
          id="search-input"
          name="keywords"
          style={{ width: '90%', border: 'none', height: '100%' }}
          value={query ? query : ''}
          onChange={e =>
            navigate(
              `/${pageLanguage}/search/?keywords=${encodeURIComponent(
                e.target.value
              )}`
            )
          }
        />
      </form>
    </>
  ) : (
    // <form role="search" method="GET" onSubmit={e => handleSubmit(e)}>
    //   <label htmlFor="search-input">{''}</label>
    //   <input
    //     type="search"
    //     id="search-input"
    //     name="keywords"
    //     value={value}
    //     onChange={e => handleChange(e)}
    //   />
    //   <button type="submit">
    //     <SearchIcon />
    //   </button>
    // </form>
    <button
      style={{ border: 'none', background: 'none' }}
      onClick={() =>
        navigate(
          `/${pageLanguage}/search/?keywords=${encodeURIComponent(value)}`
        )
      }
    >
      <SearchIcon color="white" />
    </button>
  );
};

export default SearchForm;
