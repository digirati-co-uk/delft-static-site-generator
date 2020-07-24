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
          {results.map(({ title, path, date, content, author, image }) => (
            <li
              key={title}
              key={path}
              style={{
                listStyle: 'none',
                display: 'flex',
                justifyContent: 'left',
              }}
            >
              {image ? (
                <div>
                  <img
                    className="block cutcorners"
                    src={image}
                    style={{
                      height: '10rem',
                      width: '10rem',
                      objectFit: 'cover',
                      marginRight: ' 0.75rem',
                    }}
                  />
                </div>
              ) : (
                <></>
              )}
              <div>
                <h3 className="search-results-list__heading">
                  <a href={path} className="search-results-list__link">
                    {title ? title : path}
                  </a>
                  <p>{path ? path.split('/')[2] : <></>}</p>

                  <p>{author}</p>
                  {/* we might want to summerise the content here but too much for now */}
                  <p dangerouslySetInnerHTML={{ __html: content }}></p>
                </h3>
                <p>{date}</p>
              </div>
            </li>
          ))}{' '}
        </ul>
      )}
    </section>
  );
};

export default SearchResults;
