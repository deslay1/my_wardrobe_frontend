import React from 'react';

const Button = ({ children, onClick, className, type }) => {
  // Define button styles based on the type
  const buttonStyles = {
    default: 'bg-blue-500 hover:bg-blue-600',
    red: 'bg-red-500 hover:bg-red-600',
    yellow: 'bg-yellow-500 hover:bg-yellow-600',
    green: 'bg-green-500 hover:bg-green-600',
  };

  return (
    <button 
      onClick={onClick} 
      className={`text-white rounded p-2 cursor-pointer ${buttonStyles[type] || buttonStyles.default} ${className}`}>
      {children}
    </button>
  );
};

export default Button;