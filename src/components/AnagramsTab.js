import React from 'react';
import { FaInfoCircle, FaHeart, FaChartBar } from 'react-icons/fa';

const AnagramsTab = ({ results, isLoading, error, darkMode, fetchDefinition, toggleFavorite, favoriteWords, hasSearched, totalResults, showWordInfo }) => (
  <div className="w-full">
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
    <div className="mt-4">
      {results.length > 0 ? (
        results.map(([length, words]) => (
          <div key={length} className="mb-6">
            <h4 className={`text-lg font-semibold mb-2 border-b pb-1 ${darkMode ? 'text-gray-300 border-gray-500' : 'text-gray-700 border-gray-300'}`}>
              {length}-Letter Words
            </h4>
            <ul className="grid grid-cols-3 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {words.map((word, index) => (
                <li
                  key={index}
                  className={`p-3 rounded-lg flex flex-col sm:flex-row items-start sm:items-center justify-between 
                    transition-all duration-300 hover:shadow-md hover:-translate-y-0.5 ${
                      darkMode ? 'bg-gray-800 hover:bg-gray-750' : 'bg-white hover:bg-gray-50'
                    }`}
                >
                  <span
                    className={`text-md font-medium mb-2 sm:mb-0 ${
                      darkMode ? 'text-gray-200' : 'text-gray-700'
                    }`}
                  >
                    {word}
                  </span>
                  <div className="flex items-center space-x-3 sm:space-x-2">
                    <button
                      onClick={() => fetchDefinition(word)}
                      className={`p-1 rounded-full focus:outline-none transition-colors duration-200 ${
                        darkMode ? 'text-blue-400 hover:text-blue-300 hover:bg-blue-900' : 'text-blue-500 hover:text-blue-600 hover:bg-blue-100'
                      }`}
                      title="Get definition"
                    >
                      <FaInfoCircle size={18} />
                    </button>
                    <button
                      onClick={() => toggleFavorite(word)}
                      className={`p-1 rounded-full focus:outline-none transition-colors duration-200 
                        ${favoriteWords && (typeof favoriteWords.contains === 'function' ? favoriteWords.contains(word) : favoriteWords.includes(word))
                          ? 'text-pink-500 hover:text-pink-400 hover:bg-pink-100'
                          : darkMode
                            ? 'text-gray-400 hover:text-gray-300 hover:bg-gray-700'
                            : 'text-gray-500 hover:text-gray-400 hover:bg-gray-200'
                        }`}
                      title="Toggle favorite"
                    >
                      <FaHeart size={18} />
                    </button>
                    <button
                      onClick={() => showWordInfo(word)}
                      className={`p-1 rounded-full focus:outline-none transition-colors duration-200 ${
                        darkMode ? 'text-green-400 hover:text-green-300 hover:bg-green-900' : 'text-green-500 hover:text-green-600 hover:bg-green-100'
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
  </div>
);

export default AnagramsTab;