import React from 'react';
import { FaRandom, FaShare } from 'react-icons/fa';

function InputForm({
  darkMode,
  input,
  setInput,
  minLength,
  setMinLength,
  maxResults,
  setMaxResults,
  handleSubmit,
  handleRandomWordSelection,
  clearFields,
  handleShare,
  hasResults,
  isLoading,
}) {
  const inputClass = `border p-3 w-full rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500
    ${darkMode ? 'bg-gray-800 border-gray-700 text-white' : 'bg-white border-gray-300 text-gray-900'}`;

  const buttonClass = `px-6 py-3 rounded-lg font-semibold shadow-md hover:shadow-lg transition-all duration-300 
    ${darkMode ? 'bg-indigo-600 text-white hover:bg-indigo-700' : 'bg-indigo-500 text-white hover:bg-indigo-600'}`;

  const labelClass = `block text-sm font-medium mb-1
    ${darkMode ? 'text-gray-400' : 'text-gray-700'}`;

  return (
    <form onSubmit={handleSubmit} className="space-y-6 mb-8">
      <div className="relative">
        <label htmlFor="input" className={labelClass}>
          Enter Letters
        </label>
        <div className="flex items-center">
          <input
            id="input"
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className={`${inputClass} flex-grow`}
            placeholder="Enter letters"
          />
          <div className="flex ml-2">
            <button
              type="button"
              onClick={handleRandomWordSelection}
              className="p-3 rounded-full bg-gradient-to-r from-purple-400 via-indigo-500 to-blue-500 hover:from-purple-500 hover:via-blue-600 hover:to-purple-600 
                         transition-all duration-200 transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-offset-2 
                         focus:ring-pink-500 dark:focus:ring-offset-gray-900 shadow-lg dark:hover:bg-gray-700"
              title="Random Word"
            >
              <FaRandom className="text-white text-lg transform hover:rotate-180 transition-transform duration-300" />
            </button>
          </div>
        </div>
      </div>
      
      <div className="flex space-x-4">
        <div className="flex-1">
          <label htmlFor="minLength" className={labelClass}>
            Min Length
          </label>
          <input
            id="minLength"
            type="number"
            value={minLength}
            onChange={(e) => setMinLength(parseInt(e.target.value))}
            className={inputClass}
            min="1"
            placeholder="Min Length"
          />
        </div>
        <div className="flex-1">
          <label htmlFor="maxResults" className={labelClass}>
            Max Results
          </label>
          <input
            id="maxResults"
            type="number"
            value={maxResults}
            onChange={(e) => setMaxResults(parseInt(e.target.value))}
            className={inputClass}
            min="1"
            placeholder="Max Results"
          />
        </div>
      </div>
      <div className="flex flex-wrap gap-4 mt-6">
        <button 
          type="submit" 
          className={`${buttonClass} flex-grow sm:flex-grow-0 bg-indigo-600 hover:bg-indigo-700 text-white`}
          disabled={isLoading}
        >
          {isLoading ? (
            <span className="flex items-center justify-center">
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Searching...
            </span>
          ) : (
            <span className="flex items-center justify-center">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              Find Anagrams
            </span>
          )}
        </button>
        
        <button 
          type="button" 
          onClick={clearFields} 
          className={`${buttonClass} flex-grow sm:flex-grow-0 bg-red-500 hover:bg-red-600 text-white`}
        >
          <span className="flex items-center justify-center">
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
            Clear
          </span>
        </button>
        
        {hasResults && (
          <button 
            type="button" 
            onClick={handleShare} 
            className={`${buttonClass} flex-grow sm:flex-grow-0 bg-green-500 hover:bg-green-600 text-white`}
          >
            <span className="flex items-center justify-center">
              <FaShare className="mr-2" /> Share
            </span>
          </button>
        )}
      </div>
    </form>
  );
}

export default InputForm;