import React from 'react';

export const Grid = (onClick, currentlySelected, items) => (
  <React.Fragment>
    {items.map((item) => (
      <div>{item}</div>
    ))}
  </React.Fragment>
);
