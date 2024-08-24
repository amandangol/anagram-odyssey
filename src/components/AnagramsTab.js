import React from 'react';
import { FaInfoCircle, FaHeart, FaChartBar } from 'react-icons/fa';

const AnagramsTab = ({ results, isLoading, error, darkMode, fetchDefinition, toggleFavorite, favoriteWords, hasSearched, totalResults, showWordInfo }) => (
  <div>
    {isLoading && (
      <p className={`text-lg ${darkMode ? 'text-gray-400' : 'text-gray-700'}`}>
        Searching for anagrams...
      </p>
    )}
    {!isLoading && !error && totalResults > 0 && (
      <p className={`text-lg ${darkMode ? 'text-gray-400' : 'text-gray-700'}`}>
        Found <span className="font-semibold text-indigo-400">{totalResults}</span> anagrams in total
      </p>
    )}
    <br />
    {results.length > 0 ? (
      results.map(([length, words]) => (
        <div key={length} className="mb-6">
          <h4 className={`text-lg font-semibold mb-3 ${darkMode ? 'text-gray-300' : 'text-gray-900'}`}>
            {length}-Letter Words
          </h4>
          <ul className="grid grid-cols-3 sm:grid-cols-5 gap-2">
            {words.map((word, index) => (
              <li key={index} className={`p-3 rounded-md flex items-center justify-between ${
                darkMode ? 'bg-gray-800' : 'bg-white shadow'
              }`}>
                <span className={`text-md ${darkMode ? 'text-gray-300' : 'text-gray-900'}`}>{word}</span>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => fetchDefinition(word)}
                    className={`focus:outline-none transition-colors duration-200 ${
                      darkMode ? 'text-blue-400 hover:text-blue-300' : 'text-blue-500 hover:text-blue-600'
                    }`}
                    title="Get definition"
                  >
                    <FaInfoCircle size={18} />
                  </button>
                  <button
                    onClick={() => toggleFavorite(word)}
                    className={`focus:outline-none transition-colors duration-200 ${
                      favoriteWords && favoriteWords.contains(word) 
                        ? 'text-pink-500 hover:text-pink-400' 
                        : darkMode 
                          ? 'text-gray-500 hover:text-gray-400' 
                          : 'text-gray-700 hover:text-gray-600'
                    }`}
                    title="Toggle favorite"
                  >
                    <FaHeart size={18} />
                  </button>
                  <button
                    onClick={() => showWordInfo(word)}
                    className={`focus:outline-none transition-colors duration-200 ${
                      darkMode ? 'text-green-400 hover:text-green-300' : 'text-green-500 hover:text-green-600'
                    }`}
                    title="Show word info"
                  >
                    <FaChartBar size={18} />
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      ))
    ) : (
      !isLoading && !error && (
        <p className={`text-lg ${darkMode ? 'text-gray-400' : 'text-gray-700'}`}>
          {hasSearched ? "No anagrams found. Try different letters or adjust the minimum length." : "Enter letters and click 'Find Anagrams' to start searching."}
        </p>
      )
    )}
  </div>
);

export default AnagramsTab;