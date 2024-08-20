import React, { useState, useEffect } from 'react';
import Letters from './components/Letters';
import { FaSun, FaMoon, FaGithub, FaTwitter } from 'react-icons/fa';
import { getLocalStorageItem, setLocalStorageItem } from './utils/localStorage';
import ErrorBoundary from './components/ErrorBoundary';
import 'tailwindcss/tailwind.css';

function App() {
  const [darkMode, setDarkMode] = useState(() => {
    return getLocalStorageItem('darkMode') === 'true';
  });

  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode);
    setLocalStorageItem('darkMode', darkMode);
  }, [darkMode]);

  const toggleDarkMode = () => {
    setDarkMode((prevMode) => !prevMode);
  };

  return (
    <div className={`min-h-screen flex flex-col transition-colors duration-300 ${
      darkMode ? 'dark bg-gray-900' : 'bg-gradient-to-br from-indigo-100 via-purple-200 to-blue-200'
    }`}>
      <header className={`py-4 px-6 lg:px-8 ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-md`}>
        <div className="max-w-7xl mx-auto flex items-center justify-between flex-wrap">
          <div className="flex items-center flex-shrink-0">
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight relative">
              <span className={`${darkMode ? 'text-teal-300' : 'text-teal-600'}`}>
                Anagram
              </span>
              <span className={`${darkMode ? 'text-purple-300' : 'text-purple-600'} ml-2`}>
                Odyssey
              </span>
              <span className="absolute -top-1 -right-6 text-2xl sm:text-3xl animate-pulse">🔎</span>
            </h1>
          </div>

          <div className="flex items-center space-x-4 mt-2 lg:mt-0">
            <button
              onClick={toggleDarkMode}
              className={`p-2 rounded-full ${
                darkMode ? 'bg-yellow-400 text-gray-900' : 'bg-indigo-600 text-white'
              } hover:opacity-80 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500`}
            >
              {darkMode ? <FaSun size={20} /> : <FaMoon size={20} />}
            </button>
        
          </div>
        </div>
      </header>
      <main className="flex-grow px-4 sm:px-6 lg:px-8 py-8 transition-colors duration-300">
        <div className="max-w-7xl mx-auto">
          <ErrorBoundary>
            <Letters darkMode={darkMode} />
          </ErrorBoundary>
        </div>
      </main>
      <footer
        className={`py-6 ${
          darkMode ? 'bg-gray-800 text-gray-300' : 'bg-gray-100 text-gray-700'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-center items-center space-x-0 md:space-x-4">
            <p className="mb-4 md:mb-0">&copy; 2024 Anagram Odyssey by 4m.4n. All rights reserved.</p>
            <div className="flex space-x-4">
              <a href="https://github.com/amandangol" target="_blank" rel="noopener noreferrer" className={`hover:text-indigo-500 transition-colors duration-300 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                <FaGithub size={24} />
              </a>
              <a href="https://twitter.com/amand4ngol" target="_blank" rel="noopener noreferrer" className={`hover:text-indigo-500 transition-colors duration-300 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                <FaTwitter size={24} />
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
