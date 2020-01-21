import React, { useRef, useEffect } from 'react';
import './grid.scss';
import '../ManifestCabinet/ManifestCabinet.scss';

import { Link, navigate } from 'gatsby';

const useMountEffect = fun => useEffect(fun, []);
const scrollToRef = (div, ref) => console.log(div, ref);

// const calculateScrollLength = (width, count, index, columnWidth) => {
//   const array = Array.apply(null, { length: count }).map(Number.call, Number);
//   const indexToStopAt = array.find(i => (count - i) * columnWidth < width);
//   // needs to go left by very slightly under columnWidth
//   const pixels = columnWidth * 0.999;
//   // need to change by very small number to trigger rerender of the grid component (so selected value shown)
//   if ((count - index) * columnWidth < width)
//     return indexToStopAt * pixels + index * 0.01;
//   if (count * columnWidth < width) return index;
//   if (count * columnWidth > width) return index * columnWidth;
// };

export const Grid = ({
  thumbnails,
  onClick,
  selected,
  pathname,
  height,
  width,
}) => {
  const divRef = useRef(null);
  console.log(selected);
  useMountEffect(() => {
    scrollToRef(divRef, selected);
  });

  // anyRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });

  return (
    <div className="grid" ref={divRef}>
      {thumbnails.map((thumbnail, index) => {
        console.log(index, selected);
        return (
          <div
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
                  index == selected || (selected === 0 && index === 0)
                    ? {
                        width: 116,
                        height: 116,
                        borderBottom: '5px solid #1d1c73',
                      }
                    : console.log('in here')
                  // : { width: 116, height: 116 }
                }
              >
                {thumbnail ? (
                  <img
                    src={thumbnail}
                    className="manifest-cabinet__thumb-img"
                    alt=""
                  />
                ) : (
                  <div className="manifest-cabinet__thumb-missing">
                    {' '}
                    no thumb{' '}
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
