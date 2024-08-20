import React from 'react';
import { FaInfoCircle, FaHeart } from 'react-icons/fa';

const FavoritesTab = ({ favoriteWords, darkMode, fetchDefinition, toggleFavorite }) => (
  <div className="h-full">
    {favoriteWords && favoriteWords.get_all().length > 0 ? (
      <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {favoriteWords.get_all().map((word, index) => (
          <li key={index} className={`p-3 rounded-md flex items-center justify-between ${
            darkMode ? 'bg-gray-700' : 'bg-white shadow'
          }`}>
            <span className="text-md">{word}</span>
            <div className="flex items-center">
              <button
                onClick={() => fetchDefinition(word)}
                className={`mr-2 focus:outline-none ${
                  darkMode ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-500'
                }`}
                title="Get definition"
              >
                <FaInfoCircle size={20} />
              </button>
              <button
                onClick={() => toggleFavorite(word)}
                className={`focus:outline-none text-pink-500 hover:text-pink-400`}
              >
                <FaHeart size={20} />
              </button>
            </div>
          </li>
        ))}
      </ul>
    ) : (
      <p className={`text-lg ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
        No favorite words added yet. Add words to your favorites to see them here.
      </p>
    )}
  </div>
);

export default FavoritesTab;