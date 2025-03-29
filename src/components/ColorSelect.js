import { useState, useRef, useEffect } from 'react';
import ColorOption from './ColorOption';

const ColorSelect = ({ value, onChange, required, placeholder, colors }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <div
        className="border rounded p-2 mb-2 w-full cursor-pointer bg-gray-800 text-white flex items-center justify-between"
        onClick={() => setIsOpen(!isOpen)}
      >
        {value ? <ColorOption color={value} /> : placeholder}
        <span className="ml-2">▼</span>
      </div>
      {isOpen && (
        <div className="absolute z-50 w-full bg-gray-800 border border-gray-700 rounded mt-1 max-h-60 overflow-y-auto">
          {placeholder && (
            <div
              className="p-2 cursor-pointer hover:bg-gray-700 text-white"
              onClick={() => {
                onChange('');
                setIsOpen(false);
              }}
            >
              {placeholder}
            </div>
          )}
          {colors.map((color) => (
            <div
              key={color}
              className="p-2 cursor-pointer hover:bg-gray-700 text-white"
              onClick={() => {
                onChange(color);
                setIsOpen(false);
              }}
            >
              <ColorOption color={color} />
            </div>
          ))}
        </div>
      )}
      {required && !value && (
        <input
          tabIndex={-1}
          autoComplete="off"
          style={{
            opacity: 0,
            width: 0,
            height: 0,
            position: 'absolute',
          }}
          value=""
          onChange={() => {}}
          required
        />
      )}
    </div>
  );
};

export default ColorSelect;
