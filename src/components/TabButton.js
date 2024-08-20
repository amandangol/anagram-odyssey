import React from 'react';

const TabButton = ({ active, onClick, children, darkMode }) => (
  <button
    className={`py-2 px-4 font-medium transition-all duration-300 ${
      active
        ? 'border-b-2 border-indigo-500 text-indigo-600'
        : 'text-gray-500 hover:text-gray-700'
    } ${darkMode ? 'hover:text-gray-300' : 'hover:text-gray-700'}`}
    onClick={onClick}
  >
    {children}
  </button>
);

export default TabButton;