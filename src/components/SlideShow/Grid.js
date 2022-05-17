import React, { useRef, useEffect } from 'react';
import './grid.scss';
import '../ManifestCabinet/ManifestCabinet.scss';

import { Link } from 'gatsby';

const useMountEffect = (fun) => useEffect(fun);

export const Grid = ({ thumbnails, onClick, selected, pathname, width }) => {
  const divRef = useRef(null);

  useMountEffect(() => {
    const ref = document.getElementById(selected ? selected : 0);
    if (ref)
      ref.scrollIntoView(false, { behavior: 'smooth', inline: 'center' });
  });

  return (
    <div className="grid" id="grid" ref={divRef}>
      {thumbnails.map((thumbnail, index) => {
        return (
          <div
            id={index}
            key={`${index}--thumb--${index === selected}`}
            style={{ height: 124, width: 116 }}
          >
            <Link
              style={{ borderBottom: 'none' }}
              to={`${pathname}?id=${index}`}
            >
              <button
                onClick={() => onClick(index)}
                type="button"
                className={`manifest-cabinet__thumb ${
                  index === selected ? ` manifest-cabinet__thumb--selected` : ''
                } cutcorners`}
                style={
                  index === parseInt(selected) ||
                  (selected === 0 && index === 0)
                    ? {
                        width: 100,
                        height: 100,
                        borderBottom: '5px solid #1d1c73',
                      }
                    : { width: 100, height: 100 }
                }
              >
                {thumbnail ? (
                  <img
                    src={thumbnail.replace('/full/full/', '/full/!100,100/')}
                    className="manifest-cabinet__thumb-img"
                    alt=""
                  />
                ) : (
                  <div className="manifest-cabinet__thumb-missing">
                    no thumb
                  </div>
                )}
              </button>
            </Link>
          </div>
        );
      })}
    </div>
  );
};
