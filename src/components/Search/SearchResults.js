import React from 'react';

const SearchResults = ({ results }) => {
  console.log(results);
  return (
    <section aria-label="Search results for all posts">
      {!!results.length && (
        <h2
          className="search-results-count"
          id="search-results-count"
          aria-live="assertive"
        >
          {results.length} results
        </h2>
      )}
      {!!results.length && (
        <ul className="search-results-list">
          {results.map(({ title, path, date, content, author, type }) => (
            <li key={title}>
              <h3 className="search-results-list__heading">
                <a href={path} className="search-results-list__link">
                  {title}
                </a>
                <p>{path.split('/')[2]}</p>

                <p>{author}</p>
                {/* we might want to summerise the content here but too much for now */}
                <p dangerouslySetInnerHTML={{ __html: content }}></p>
              </h3>
              <p>{date}</p>
            </li>
          ))}{' '}
        </ul>
      )}
    </section>
  );
};

export default SearchResults;
