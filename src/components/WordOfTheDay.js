import React from 'react';
import { FaCalendarDay } from 'react-icons/fa';

function WordOfTheDay({ darkMode, wordOfTheDay, useWordOfTheDay }) {
  return (
    <div className={`mb-8 p-4 rounded-lg ${darkMode ? 'bg-gray-800' : 'bg-gray-100'}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <FaCalendarDay className={`mr-3 text-xl ${darkMode ? 'text-yellow-400' : 'text-indigo-500'}`} />
          <div>
            <p className={`text-sm uppercase font-medium ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Word of the Day
            </p>
            <p className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
              {wordOfTheDay}
            </p>
          </div>
        </div>
        <button
          onClick={useWordOfTheDay}
          className={`px-3 py-1 text-sm rounded-full font-medium transition-colors duration-200 ${
            darkMode ? 'bg-indigo-600 text-white hover:bg-indigo-700' : 'bg-indigo-500 text-white hover:bg-indigo-600'
          }`}
        >
          Use
        </button>
      </div>
    </div>
  );
}

export default WordOfTheDay;