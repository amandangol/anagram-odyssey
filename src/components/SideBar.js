import React from 'react';


const SidebarToggle = ({ sidebarVisible, setSidebarVisible, darkMode }) => (
  <button
    onClick={() => setSidebarVisible(!sidebarVisible)}
    title={sidebarVisible ? 'Hide Word History' : 'Show Word History'}
    className={`fixed top-24 left-4 z-20 p-3 rounded-full transition-all duration-300 ${
      darkMode ? 'bg-gray-700 text-white hover:bg-gray-600' : 'bg-white text-gray-800 hover:bg-gray-100'
    } shadow-lg ${sidebarVisible ? 'translate-x-64' : 'translate-x-0'}`}
  >
    <FaArrowCircleLeft className={`transform transition-transform duration-300 ${sidebarVisible ? 'rotate-180' : ''}`} />
  </button>
);

const Sidebar = ({ sidebarVisible, wordHistory, darkMode }) => (
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