import React from 'react';
import PropTypes from 'prop-types';

export const Modal = ({summary, close}) => {
  console.log(summary)
  return (
    <div>
      {summary}
      <button onClick={close}>Close</button>
    </div>
  )
}

Modal.propTypes = {
  summary: PropTypes.array
}
