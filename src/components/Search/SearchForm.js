import React, { useState } from 'react';
import { navigate } from 'gatsby';

const SearchForm = ({ pageLanguage, query, showTitle }) => {
  const [value, setValue] = useState('');

  const handleChange = e => {
    setValue(e.target.value);
  };

  const handleSubmit = e => {
    e.preventDefault();
    navigate(`/${pageLanguage}/search/?keywords=${encodeURIComponent(value)}`);
  };

  return showTitle ? (
    <form role="search" method="GET">
      <label htmlFor="search-input">
        {showTitle ? <h1>Search posts</h1> : ''}
      </label>
      <input
        type="search"
        id="search-input"
        name="keywords"
        value={query ? query : ''}
        onChange={e =>
          navigate(
            `/${pageLanguage}/search/?keywords=${encodeURIComponent(
              e.target.value
            )}`
          )
        }
      />
      <button type="submit">Submit</button>
    </form>
  ) : (
    <form role="search" method="GET" onSubmit={e => handleSubmit(e)}>
      <label htmlFor="search-input">{''}</label>
      <input
        type="search"
        id="search-input"
        name="keywords"
        value={value}
        onChange={e => handleChange(e)}
      />
      <button type="submit">Submit</button>
    </form>
  );
};

export default SearchForm;
