import React from 'react';
import { Highlight, Snippet } from 'react-instantsearch-dom';

const withHighlight = ({ hit }) => {
  const language = hit.page_path.split('/')[1];
  return (
    <div
      key={hit.title}
      style={{
        display: 'flex',
        alignItems: 'center',
        right: 'auto',
        paddingTop: '1.5rem',
      }}
    >
      <div
        style={{
          width: '100%',
          display: 'flex',
          justifyContent: 'flex-start',
        }}
      >
        {hit.image && (
          <div className="block">
            <div
              className="block cutcorners w-2 h-2"
              style={
                hit.image && {
                  marginRight: '1rem',
                  width: '5rem',
                  marginBottom: '0',
                  paddingBottom: '0',
                  height: '5rem',
                }
              }
            >
              <img
                style={{
                  objectFit: 'cover',
                  width: '10rem',
                  marginBottom: '0',
                  paddingBottom: '0',
                  height: '10rem',
                }}
                src={hit.image}
              />
            </div>
          </div>
        )}

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
            <Highlight attribute={'title'} hit={hit} /> ({language})
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
          <Highlight attribute={'about'} hit={hit} />
          <Snippet attribute={'content'} hit={hit} separator=" - " />
          <Highlight attribute={'author'} hit={hit} />
        </div>
      </div>
    </div>
  );
};

export const SearchResult = withHighlight;
