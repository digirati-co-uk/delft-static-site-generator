import React from 'react';

const SearchResults = ({ results }) => {
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
        <ul className="search-results-list" style={{ marginLeft: '0' }}>
          {results.map(({ title, path, date, content, author }) => (
            <div
              key={title}
              key={path}
              style={{
                listStyle: 'none',
                display: 'flex',
                justifyContent: 'left',
              }}
            >
              <div style={{ maxWidth: '70%' }}>
                <h3 className="search-results-list__heading">
                  <a href={path} className="search-results-list__link">
                    {title ? title : path}
                  </a>
                  <p style={{ textTransform: 'capitalize' }}>
                    {path ? path.split('/')[2] : <></>}
                  </p>

                  <p>{author}</p>
                  {/* we might want to summerise the content here but too much for now */}
                  <p dangerouslySetInnerHTML={{ __html: content }}></p>
                </h3>
                <p>{date}</p>
              </div>
            </div>
          ))}
        </ul>
      )}
    </section>
  );
};

export default SearchResults;
