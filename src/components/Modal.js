import React from 'react';
import Button from './Button';

const Modal = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-75">
      <div className="bg-gray-800 p-4 rounded shadow-lg">
        <Button onClick={onClose} type="red" className="mb-4">Close</Button>
        {children}
      </div>
    </div>
  );
};

export default Modal;
