import React from 'react';
import { FaHistory } from 'react-icons/fa';

function Sidebar({ sidebarVisible, darkMode, wordHistory }) {
  return (
    <div
      className={`fixed top-0 left-0 h-full pt-20 transition-all duration-300 overflow-hidden ${
        sidebarVisible ? 'w-64' : 'w-0'
      } ${darkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-800 shadow-lg'}`}
    >
      <div className="p-6 h-full flex flex-col">
        <h2 className="text-xl font-semibold mb-6 flex items-center">
          <FaHistory className="mr-2" /> Word History
        </h2>
        <div className="flex-grow overflow-y-auto">
          {wordHistory && wordHistory.get_all().length > 0 ? (
            <ul className="space-y-2 text-sm">
              {wordHistory.get_all().map((word, index) => (
                <li
                  key={index}
                  className={`p-2 rounded-md transition-colors duration-200 ${
                    darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-100 hover:bg-gray-200'
                  }`}
                >
                  {word}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-center text-gray-500">No word history available.</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default Sidebar;