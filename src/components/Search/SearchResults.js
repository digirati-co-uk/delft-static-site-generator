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
          {results.map(
            ({ title, path, date, content, author, type, image }) => (
              <li key={title} key={path}>
                <h3 className="search-results-list__heading">
                  {image ? (
                    <div classname="blocks">
                      <img
                        classname="block cutcorners"
                        src={image}
                        style={{ height: '50px' }}
                      />
                    </div>
                  ) : (
                    <></>
                  )}
                  <a href={path} className="search-results-list__link">
                    {title ? title : path}
                  </a>
                  <p>{path ? path.split('/')[2] : <></>}</p>

                  <p>{author}</p>
                  {/* we might want to summerise the content here but too much for now */}
                  <p dangerouslySetInnerHTML={{ __html: content }}></p>
                </h3>
                <p>{date}</p>
              </li>
            )
          )}{' '}
        </ul>
      )}
    </section>
  );
};

export default SearchResults;
