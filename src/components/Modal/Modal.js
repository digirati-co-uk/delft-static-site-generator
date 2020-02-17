import React from 'react';
import PropTypes from 'prop-types';
import { Close } from '../Close/Close';

import './Modal.scss';

export const Modal = ({ modalContent, close }) => {
  return (
    <div className="modal">
      <div className="modal__details">{modalContent}</div>
      <button onClick={close} className="modal__close" type="button">
        <Close />
      </button>
    </div>
  );
};

Modal.propTypes = {
  modalContent: PropTypes.array,
  close: PropTypes.func,
};
