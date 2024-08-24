import React from 'react';
import { FaInfoCircle, FaHeart,FaChartBar } from 'react-icons/fa';

const FavoritesTab = ({ favoriteWords, darkMode, fetchDefinition, toggleFavorite,showWordInfo }) => (
  <div className="h-full">
    {favoriteWords && favoriteWords.get_all().length > 0 ? (
      <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {favoriteWords.get_all().map((word, index) => (
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
    ) : (
      <p className={`text-lg ${darkMode ? 'text-gray-400' : 'text-gray-700'}`}>
        No favorite words added yet. Add words to your favorites to see them here.
      </p>
    )}
  </div>
);

export default FavoritesTab;
