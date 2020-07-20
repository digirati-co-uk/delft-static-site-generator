import React from 'react';
import { navigate } from 'gatsby';

const SearchForm = ({ pageLanguage, query }) => (
  <form role="search" method="GET">
    <label htmlFor="search-input">{query ? <h1>Search posts</h1> : ''}</label>
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
);

export default SearchForm;
