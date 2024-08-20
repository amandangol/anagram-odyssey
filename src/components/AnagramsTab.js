import React from 'react';
import { FaInfoCircle, FaHeart } from 'react-icons/fa';

const AnagramsTab = ({ results, isLoading, error, darkMode, fetchDefinition, toggleFavorite, favoriteWords, hasSearched, totalResults }) => (
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
                <div className="flex items-center">
                  <button
                    onClick={() => fetchDefinition(word)}
                    className={`mr-1 focus:outline-none ${
                      darkMode ? 'text-blue-400' : 'text-blue-500'
                    }`}
                    title="Get definition"
                  >
                    <FaInfoCircle size={20} />
                  </button>
                  <button
                    onClick={() => toggleFavorite(word)}
                    className={`focus:outline-none ${
                      favoriteWords && favoriteWords.contains(word) ? 'text-pink-500' : darkMode ? 'text-gray-500' : 'text-gray-700'
                    }`}
                  >
                    <FaHeart size={20} />
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
