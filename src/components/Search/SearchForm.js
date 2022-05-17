import React, { useState, useEffect } from 'react';
import { navigate } from 'gatsby';

import './SearchForm.scss';

const SearchIcon = ({ color }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill={color ? color : 'white'}
      width="32px"
      height="32px"
      className="search-form__button--icon"
    >
      <path d="M0 0h24v24H0z" fill="none" />
      <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" />
    </svg>
  );
};

const useDebounce = (val, delay) => {
  const [debouncedValue, setDebouncedValue] = useState(val);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(val);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [val, delay]);

  return debouncedValue;
};

const SearchForm = ({ pageLanguage, query, showTitle }) => {
  const [value, setValue] = useState('');
  const debouncedSearchTerm = useDebounce(value, 500);

  useEffect(() => {
    setValue(query);
  }, []);

  useEffect(
    () => {
      if (showTitle) {
        navigate(
          `/${pageLanguage}/search/?keywords=${encodeURIComponent(
            debouncedSearchTerm
          )}`,
          { replace: true }
        );
      }
    },

    [debouncedSearchTerm] // Only call effect if debounced search term changes
  );

  return showTitle ? (
    <>
      <h1>Search posts</h1>
      <form
        className="search-form"
        role="search"
        method="GET"
        onSubmit={(e) => e.preventDefault()}
        style={{
          backgroundColor: 'white',
          padding: '0.25rem',
          display: 'flex',
          alignItems: 'center',
        }}
      >
        <label htmlFor="search-input"></label>
        <button
          type="submit"
          style={{
            border: 'none',
            background: 'none',
            justifySelf: 'flex-start',
          }}
        >
          <SearchIcon color="black" />
        </button>
        <input
          type="search"
          className="search-form__input"
          id="search-input"
          name="keywords"
          style={{ width: '90%', border: 'none', height: '100%' }}
          value={value}
          onChange={(e) => setValue(e.target.value)}
        />
      </form>
    </>
  ) : (
    <button
      className="search-form__button"
      onClick={() => navigate(`/${pageLanguage}/search`)}
    >
      <SearchIcon color="white" />
    </button>
  );
};

export default SearchForm;
