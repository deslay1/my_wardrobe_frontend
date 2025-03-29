import React from 'react';
import Button from './Button';

const Modal = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-75">
      <div className="relative bg-gray-800 rounded shadow-lg max-h-[90vh] w-[90vw] md:w-auto overflow-y-auto">
        <div className="sticky top-0 bg-gray-800 p-4 border-b border-gray-700">
          <Button onClick={onClose} type="red">Close</Button>
        </div>
        <div className="p-4">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Modal;
