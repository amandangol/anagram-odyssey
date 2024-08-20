import React, { useState } from 'react';
import {  FaHistory, FaTimes, FaCalendarDay, FaBars } from 'react-icons/fa';
import useWasmInit from '../hooks/useWasmInit';
import AnagramsTab from './AnagramsTab';
import FavoritesTab from './FavoritesTab';
import TabButton from './TabButton';
import '../styles/Letters.css';

import init, { letters, fetch_definition,FavoriteWords } from '../pkg/anagram_odyssey.js';


function Letters({ darkMode }) {
  const { wordlist, favoriteWords, wordHistory, wordOfTheDay, error: initError,setFavoriteWords } = useWasmInit();
  const [input, setInput] = useState('');
  const [minLength, setMinLength] = useState(4);
  const [maxResults, setMaxResults] = useState(10);
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedWord, setSelectedWord] = useState('');
  const [definition, setDefinition] = useState('');
  const [totalResults, setTotalResults] = useState(0);
  const [sidebarVisible, setSidebarVisible] = useState(true);
  const [activeTab, setActiveTab] = useState('anagrams');
  const [hasSearched, setHasSearched] = useState(false);

  const useWordOfTheDay = () => {
    setInput(wordOfTheDay);
  };

  const toggleFavorite = (word) => {
    if (favoriteWords.contains(word)) {
      favoriteWords.remove(word);
    } else {
      favoriteWords.add(word);
    }
    // Update favoriteWords state
    setFavoriteWords(new FavoriteWords(favoriteWords.get_all()));
  };
  const fetchDefinition = async (word) => {
    setSelectedWord(word);
    setDefinition('Loading...');
    try {
      const result = await fetch_definition(word);
      const def = result.toString(); 
      setDefinition(def === "No definition found" ? def : def);
    } catch (error) {
      console.error('Error fetching definition:', error);
      setDefinition('Failed to fetch definition');
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!letters || !wordlist || !wordHistory) {
      setError('WASM module not yet initialized or wordlist not loaded');
      return;
    }
    setIsLoading(true);
    setError('');
    setHasSearched(true);
    setTimeout(() => {
      try {
        const result = letters(input, wordlist, minLength);
        const [wordArray, searchedWord] = result;
        const groupedResults = groupResultsByLength(wordArray.slice(0, maxResults));
        setResults(groupedResults);
        setTotalResults(wordArray.length);
        wordHistory.add(searchedWord);
        if (wordArray.length === 0) {
          setError('No words found. Try different letters or reduce the minimum length.');
        }
      } catch (error) {
        console.error('Error calling letters function:', error);
        setError('An error occurred while searching for words.');
      } finally {
        setIsLoading(false);
      }
    }, 500);
  };

  const groupResultsByLength = (words) => {
    const grouped = {};
    words.forEach(word => {
      const length = word.length;
      if (!grouped[length]) {
        grouped[length] = [];
      }
      grouped[length].push(word);
    });
    return Object.entries(grouped).sort((a, b) => b[0] - a[0]);
  };

  const clearFields = () => {
    setInput('');
    setMinLength(4);
    setMaxResults(10);
    setResults([]);
    setTotalResults(0);
    setError('');
  };

  const inputClass = `border p-3 w-full rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${
    darkMode ? 'bg-gray-800 border-gray-700 text-white' : 'bg-white border-gray-300 text-gray-900'
  }`;

  const buttonClass = `px-6 py-3 rounded-lg font-semibold shadow-md hover:shadow-lg transition-all duration-300 ${
    darkMode ? 'bg-indigo-600 text-white hover:bg-indigo-700' : 'bg-indigo-500 text-white hover:bg-indigo-600'
  }`;

  return (
    <div className="transition-colors duration-300">
      <div className="flex h-full">
        <button
          onClick={() => setSidebarVisible(!sidebarVisible)}
          className={`fixed top-4 left-4 z-10 p-2 rounded-full transition-all duration-300 ${
            darkMode ? 'bg-gray-700 text-white' : 'bg-gray-200 text-gray-800'
          } ${sidebarVisible ? 'ml-64' : 'ml-0'}`}
        >
          <FaBars />
        </button>
        
        {/* Sidebar */}
        <div
          className={`fixed top-0 left-0 h-full transition-all duration-300 ${
            sidebarVisible ? 'w-64' : 'w-0 overflow-hidden'
          } ${darkMode ? 'bg-gray-800 text-white' : 'bg-white shadow-lg'}`}
        >
          <div className="p-6">
            <h2 className="text-xl font-semibold mb-6 flex items-center">
              <FaHistory className="mr-2" /> Word History
            </h2>
            {wordHistory && wordHistory.get_all().length > 0 ? (
              <ul className="space-y-2 text-sm">
                {wordHistory.get_all().map((word, index) => (
                  <li
                    key={index}
                    className={`p-2 rounded-md ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}
                  >
                    {word}
                  </li>
                ))}
              </ul>
            ) : (
              <p>No word history available.</p>
            )}
          </div>
        </div>

        {/* Main Content */}
        <div className={`flex-1 transition-all duration-300 ${sidebarVisible ? 'ml-64' : 'ml-0'} p-6`}>
          {/* Word of the Day */}
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

          {/* Input Form */}
          <form onSubmit={handleSubmit} className="space-y-6 mb-8">
            <div>
              <label htmlFor="input" className="block text-sm font-medium mb-1">
                Enter Letters
              </label>
              <input
                id="input"
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className={inputClass}
                placeholder="Enter letters"
              />
            </div>
            <div className="flex space-x-4">
              <div className="flex-1">
                <label htmlFor="minLength" className="block text-sm font-medium mb-1">
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
                <label htmlFor="maxResults" className="block text-sm font-medium mb-1">
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
            <div className="flex space-x-4">
              <button type="submit" className={buttonClass} disabled={isLoading}>
                {isLoading ? 'Searching...' : 'Find Anagrams'}
              </button>
              <button type="button" onClick={clearFields} className={`${buttonClass} bg-gray-500 hover:bg-gray-600`}>
                Clear
              </button>
            </div>
          </form>

          {/* Error Display */}
          {!isLoading && error && (
            <p className="text-red-500 text-lg mb-4">{error}</p>
          )}

          {/* Tabs */}
          <div className="mb-6">
            <div className={`flex border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
              <TabButton
                active={activeTab === 'anagrams'}
                onClick={() => setActiveTab('anagrams')}
                darkMode={darkMode}
              >
                Anagrams
              </TabButton>
              <TabButton
                active={activeTab === 'favorites'}
                onClick={() => setActiveTab('favorites')}
                darkMode={darkMode}
              >
                Favorites
              </TabButton>
            </div>
          </div>

          {/* Tab Content */}
          <div className="flex-grow">
            <div className={`tab-content ${activeTab === 'anagrams' ? 'active' : ''}`}>
              <AnagramsTab
                results={results}
                isLoading={isLoading}
                error={error}
                darkMode={darkMode}
                fetchDefinition={fetchDefinition}
                toggleFavorite={toggleFavorite}
                favoriteWords={favoriteWords}
                hasSearched={hasSearched}
                totalResults={totalResults}
              />
            </div>
            <div className={`tab-content ${activeTab === 'favorites' ? 'active' : ''}`}>
              <FavoritesTab
                favoriteWords={favoriteWords}
                darkMode={darkMode}
                fetchDefinition={fetchDefinition}
                toggleFavorite={toggleFavorite}
              />
            </div>
          </div>

          {/* Definition Modal */}
          {selectedWord && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
              <div className={`relative max-w-md w-full rounded-lg shadow-lg ${
                darkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'
              }`}>
                <div className="p-6">
                  <h3 className="text-2xl font-bold mb-2">{selectedWord}</h3>
                  <div className={`text-sm mb-4 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                    Definition
                  </div>
                  <p className={`mb-6 ${darkMode ? 'text-gray-100' : 'text-gray-800'}`}>
                    {definition === 'Loading...' ? (
                      <span className="inline-block animate-pulse">Loading...</span>
                    ) : (
                      definition
                    )}
                  </p>
                  <button 
                    onClick={() => setSelectedWord('')}
                    className={`w-full py-2 px-4 rounded-md transition-colors ${
                      darkMode 
                        ? 'bg-gray-700 hover:bg-gray-600 text-white' 
                        : 'bg-gray-200 hover:bg-gray-300 text-gray-800'
                    }`}
                  >
                    Close
                  </button>
                </div>
                <button 
                  onClick={() => setSelectedWord('')} 
                  className={`absolute top-3 right-3 text-2xl ${
                    darkMode ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-gray-800'
                  }`}
                >
                  <FaTimes />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
      <style jsx>{`
        .tab-content {
          transition: opacity 0.3s ease-in-out, transform 0.3s ease-in-out;
          opacity: 0;
          transform: translateY(10px);
          display: none;
        }
        .tab-content.active {
          opacity: 1;
          transform: translateY(0);
          display: block;
        }
      `}</style>
    </div>
  );
}

export default Letters;