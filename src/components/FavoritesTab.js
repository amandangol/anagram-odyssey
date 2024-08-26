import React, { useState, useEffect } from 'react';
import { FaInfoCircle, FaHeart, FaChartBar,FaHeartBroken } from 'react-icons/fa';

const FavoritesTab = ({ favoriteWords, darkMode, fetchDefinition, toggleFavorite, showWordInfo }) => {
  const [groupedFavorites, setGroupedFavorites] = useState({});

  useEffect(() => {
    if (favoriteWords && typeof favoriteWords.get_all === 'function') {
      const allFavorites = favoriteWords.get_all();
      const grouped = allFavorites.reduce((acc, [word, timestamp]) => {
        const length = word.length;
        if (!acc[length]) acc[length] = [];
        acc[length].push({ word, timestamp });
        return acc;
      }, {});
      
      // Sort words within each length group by timestamp
      Object.keys(grouped).forEach(length => {
        grouped[length].sort((a, b) => b.timestamp - a.timestamp);
      });
      
      setGroupedFavorites(grouped);
    }
  }, [favoriteWords]);

  return (
    <div className="w-full">
      {Object.keys(groupedFavorites).length > 0 ? (
        Object.entries(groupedFavorites).sort(([a], [b]) => b - a).map(([length, words]) => (
          <div key={length} className="mb-6">
            <h4 className={`text-lg font-semibold mb-2 border-b pb-1 ${darkMode ? 'text-gray-300 border-gray-500' : 'text-gray-700 border-gray-300'}`}>
              {length}-Letter Words
            </h4>
            <ul className="grid grid-cols-3 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {words.map(({ word, timestamp }, index) => (
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
                      className="p-2 rounded-full focus:outline-none transition-colors duration-200 
                        text-pink-500 hover:text-pink-400 hover:bg-pink-100 group"
                      title="Remove from favorites"
                    >
                      <FaHeart size={18} className="group-hover:hidden" />
                      <FaHeartBroken size={18} className="hidden group-hover:block" />
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
        <p className={`text-lg ${darkMode ? 'text-gray-400' : 'text-gray-700'}`}>
          No favorite words added yet. Add words to your favorites to see them here.
        </p>
      )}
    </div>
  );
};

export default FavoritesTab;