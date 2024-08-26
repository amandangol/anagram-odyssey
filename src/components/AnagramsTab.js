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
          <h4 className={`text-lg font-semibold mb-2 border-b pb-1 ${darkMode ? 'text-gray-300 border-gray-500' : 'text-gray-700 border-gray-300'}`}>
            {length}-Letter Words
          </h4>
          <ul className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {words.map((word, index) => (
                <li
                  key={index}
                  className={`p-3 rounded-lg flex flex-col md:flex-row md:items-center justify-between 
                    transition-all duration-300 hover:shadow-md hover:-translate-y-1 ${
                      darkMode ? 'bg-gray-800 hover:bg-gray-750' : 'bg-white hover:bg-gray-50'
                    }`}
                >
                  <span
                    className={`text-md font-medium mb-2 md:mb-0 ${
                      darkMode ? 'text-gray-200' : 'text-gray-700'
                    }`}
                  >
                    {word}
                  </span>
                  <div className="flex items-center justify-center space-x-4 md:space-x-2">
                    <button
                      onClick={() => fetchDefinition(word)}
                      className={`focus:outline-none transition-colors duration-200 ${
                        darkMode ? 'text-blue-400 hover:text-blue-300' : 'text-blue-500 hover:text-blue-600'
                      }`}
                      title="Get definition"
                    >
                      <FaInfoCircle size={16} />
                    </button>
                    <button
                      onClick={() => handleToggleFavorite(word)}
                      className={`focus:outline-none transition-colors duration-200 
                        ${favoriteWords && (typeof favoriteWords.contains === 'function' ? favoriteWords.contains(word) : favoriteWords.includes(word))
                          ? 'text-pink-500 hover:text-pink-400'
                          : darkMode
                            ? 'text-gray-400 hover:text-gray-300'
                            : 'text-gray-500 hover:text-gray-400'
                        }`}
                      title="Toggle favorite"
                    >
                      <FaHeart size={17} />
                    </button>
                    <button
                      onClick={() => showWordInfo(word)}
                      className={`focus:outline-none transition-colors duration-200 ${
                        darkMode ? 'text-green-400 hover:text-green-300' : 'text-green-500 hover:text-green-600'
                      }`}
                      title="Show word info"
                    >
                      <FaChartBar size={17} />
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
