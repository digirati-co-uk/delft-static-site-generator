import React from 'react';

export const Illustration = props => {
  console.log(props);

  return <div style={{ backgroundColor: 'yellow' }}>I am an illustration</div>;
};

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
