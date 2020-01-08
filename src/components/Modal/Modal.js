import React from 'react';
import PropTypes from 'prop-types';
import { Close } from '../Close/Close';

import './Modal.scss';

export const Modal = ({summary, close}) => {
  console.log(summary)
  return <div className="modal">
      <div className="modal__details">{summary}</div>
      <button onClick={close} className="modal__close" type="button">
        <Close />
      </button>
    </div>;
}

Modal.propTypes = {
  summary: PropTypes.array
}
