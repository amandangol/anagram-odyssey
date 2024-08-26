import React, { useState, useEffect } from 'react';
import { FaInfoCircle, FaHeart, FaChartBar } from 'react-icons/fa';

const FavoritesTab = ({ favoriteWords, darkMode, fetchDefinition, toggleFavorite, showWordInfo }) => {
  const [localFavorites, setLocalFavorites] = useState([]);

  useEffect(() => {
    if (favoriteWords && typeof favoriteWords.get_all === 'function') {
      setLocalFavorites(favoriteWords.get_all());
    }
  }, [favoriteWords]);

  const handleToggleFavorite = (word) => {
    toggleFavorite(word);
    setLocalFavorites(prevFavorites => prevFavorites.filter(w => w !== word));
  };

  return (
    <div className="h-full">
      {localFavorites.length > 0 ? (
        <ul className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {localFavorites.map((word, index) => (
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
                  className="focus:outline-none transition-colors duration-200 
                    text-pink-500 hover:text-pink-400"
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
      ) : (
        <p className={`text-lg ${darkMode ? 'text-gray-400' : 'text-gray-700'}`}>
          No favorite words added yet. Add words to your favorites to see them here.
        </p>
      )}
    </div>
  );
};

export default FavoritesTab;