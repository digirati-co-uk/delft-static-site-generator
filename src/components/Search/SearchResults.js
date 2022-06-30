import React from 'react';
import { connectHighlight } from 'react-instantsearch-dom';

const withHighlight = ({ hit }) => {
  // const parsedHit = highlight({
  //   highlightProperty: '_highlightResult',
  //   attribute,
  //   hit,
  // });
  return (
    <div
      key={hit.title}
      style={{
        display: 'flex',
        alignItems: 'center',
        right: 'auto',
      }}
    >
      <div
        style={{
          width: '100%',
          display: 'flex',
          justifyContent: 'flex-start',
        }}
      >
        <div
          className="block cutcorners w-4 h-4"
          style={
            hit.image && {
              marginRight: '1rem',
              width: '30rem',
              marginBottom: '0',
              paddingBottom: '0',
              height: '30rem',
            }
          }
        >
          <img
            style={{
              objectFit: 'cover',
              width: '30rem',
              marginBottom: '0',
              paddingBottom: '0',
              height: '30rem',
            }}
            src={hit.image}
          />
        </div>
        <div className="search-results-list__heading">
          <a
            style={{
              fontWeight: 'bold',
              textDecoration: 'none',
              fontSize: '1.5rem',
            }}
            href={hit.page_path}
            className="search-results-list__link"
          >
            {hit.title ? hit.title : hit.page_path}
          </a>
          <p style={{ textTransform: 'capitalize', marginBottom: '0.25rem' }}>
            {hit.type}
          </p>
          <div
            style={{
              borderBottom: '1px solid black',
              width: '100%',
              paddingBottom: '1rem',
            }}
          />
          <p>{hit.about}</p>
          <p>{hit.content}</p>
          <p>{hit.author}</p>
        </div>
      </div>
    </div>
  );
};

export const SearchResult = withHighlight;

// const SearchResult = connectHighlight(withHighlight);
