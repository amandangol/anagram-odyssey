import React, { useState } from 'react';
import { FaHistory, FaTimes, FaCalendarDay, FaArrowCircleLeft,FaRandom,FaTrash } from 'react-icons/fa';
import useWasmInit from '../hooks/useWasmInit';
import AnagramsTab from './AnagramsTab';
import FavoritesTab from './FavoritesTab';
import TabButton from './TabButton';
import '../styles/Letters.css';

import init, { letters, fetch_definition, FavoriteWords } from '../pkg/anagram_odyssey.js';


function Letters({ darkMode }) {
  const {  wordlist, 
    favoriteWords, 
    wordHistory, 
    wordOfTheDay, 
    error: initError, 
    setFavoriteWords,
    sortAnagrams,
    getWordStats,
    isPalindrome,
    hasRepeatedLetters,
    selectRandomWord,
    calculateScrabbleScore,
    calculateDifficulty,

     } = useWasmInit();
  const [input, setInput] = useState('');
  const [minLength, setMinLength] = useState(3);
  const [maxResults, setMaxResults] = useState(20);
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedWord, setSelectedWord] = useState('');
  const [definition, setDefinition] = useState('');
  const [totalResults, setTotalResults] = useState(0);
  const [sidebarVisible, setSidebarVisible] = useState(false);
  const [activeTab, setActiveTab] = useState('anagrams');
  const [hasSearched, setHasSearched] = useState(false);
  const [wordInfo, setWordInfo] = useState(null);
 




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
        let groupedResults = groupResultsByLength(wordArray.slice(0, maxResults));
        
        // Sort anagrams
        groupedResults = groupedResults.map(([length, words]) => [
          length,
          sortAnagrams(words, 'alphabetical')
        ]);

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
  const showWordInfo = (word) => {
    const stats = getWordStats(word);
    const palindrome = isPalindrome(word);
    const repeated = hasRepeatedLetters(word);
    const scrabbleScore = calculateScrabbleScore(word);
    const difficulty = calculateDifficulty(word);
    setWordInfo({ word, stats, palindrome, repeated, scrabbleScore, difficulty });
  };

  const handleRandomWordSelection = () => {
    if (!wordlist) {
      setError('Wordlist not loaded yet');
      return;
    }
    try {
      const randomWord = selectRandomWord();
      setInput(randomWord);
    } catch (error) {
      console.error('Error selecting random word:', error);
      setError('Failed to select a random word. Please try again.');
    }
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

  const inputClass = `
  border p-3 w-full rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500
  ${darkMode ? 'bg-gray-800 border-gray-700 text-white' : 'bg-white border-gray-300 text-gray-900'}
`;


  const buttonClass = `px-6 py-3 rounded-lg font-semibold shadow-md hover:shadow-lg transition-all duration-300 ${darkMode ? 'bg-indigo-600 text-white hover:bg-indigo-700' : 'bg-indigo-500 text-white hover:bg-indigo-600'
    }`;

  const labelClass = `
  block text-sm font-medium mb-1
  ${darkMode ? 'text-gray-400' : 'text-gray-700'}
`;

  return (
    <div className="transition-colors duration-300">
      <div className="flex h-full">
      <button
  onClick={() => setSidebarVisible(!sidebarVisible)}
  className={`fixed top-24 left-4 z-20 p-3 rounded-full transition-all duration-300 ${
    darkMode ? 'bg-gray-700 text-white hover:bg-gray-600' : 'bg-white text-gray-800 hover:bg-gray-100'
  } shadow-lg ${sidebarVisible ? 'translate-x-64' : 'translate-x-0'}`}
>
  <FaArrowCircleLeft className={`transform transition-transform duration-300 ${sidebarVisible ? 'rotate-180' : ''}`} />
</button>

        {/* Sidebar */}
        <div
  className={`fixed top-0 left-0 h-full pt-20 transition-all duration-300 overflow-hidden ${
    sidebarVisible ? 'w-64' : 'w-0'
  } ${darkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-800 shadow-lg'}`}
>
  <div className="p-6 h-full flex flex-col">
    <h2 className="text-xl font-semibold mb-6 flex items-center">
      <FaHistory className="mr-2" /> Word History
    </h2>
    <div className="flex-grow overflow-y-auto">
      {wordHistory && wordHistory.get_all().length > 0 ? (
        <ul className="space-y-2 text-sm">
          {wordHistory.get_all().map((word, index) => (
            <li
              key={index}
              className={`p-2 rounded-md transition-colors duration-200 ${
                darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-100 hover:bg-gray-200'
              }`}
            >
              {word}
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-center text-gray-500">No word history available.</p>
      )}
    </div>
  </div>
</div>

        {/* Main Content */}
        <div className={`flex-1 transition-all duration-300 ${sidebarVisible ? 'ml-64' : 'ml-0'} p-6 pt-8`}>
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
                className={`px-3 py-1 text-sm rounded-full font-medium transition-colors duration-200 ${darkMode ? 'bg-indigo-600 text-white hover:bg-indigo-700' : 'bg-indigo-500 text-white hover:bg-indigo-600'
                  }`}
              >
                Use
              </button>
            </div>
          </div>

          {/* Input Form */}
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

        {/* <button
          type="button"
          onClick={clearFields}
          className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-200 ml-2"
          title="Clear"
        >
          <FaTrash />
        </button> */}
        
      </div>
    </div>
  </div>
  
  {/* Rest of the form */}
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
                showWordInfo={showWordInfo}

              />
            </div>
            <div className={`tab-content ${activeTab === 'favorites' ? 'active' : ''}`}>
              <FavoritesTab
                favoriteWords={favoriteWords}
                darkMode={darkMode}
                fetchDefinition={fetchDefinition}
                toggleFavorite={toggleFavorite}
                showWordInfo={showWordInfo}

              />
            </div>
          </div>

          {/* Definition Modal */}
          {selectedWord && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
              <div className={`relative max-w-md w-full rounded-lg shadow-lg ${darkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'
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
                    className={`w-full py-2 px-4 rounded-md transition-colors ${darkMode
                        ? 'bg-gray-700 hover:bg-gray-600 text-white'
                        : 'bg-gray-200 hover:bg-gray-300 text-gray-800'
                      }`}
                  >
                    Close
                  </button>
                </div>
                <button
                  onClick={() => setSelectedWord('')}
                  className={`absolute top-3 right-3 text-2xl ${darkMode ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-gray-800'
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
    {/* Word Info Modal */}
{wordInfo && (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
    <div className={`relative max-w-md w-full rounded-lg shadow-lg ${darkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'}`}>
      <div className="p-6">
        <h3 className={`text-xl font-bold mb-2 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
          {wordInfo.word}
        </h3>
        <div className="space-y-2 mb-6">
          <InfoRow label="Length" value={wordInfo.stats.length} />
          <InfoRow label="Vowels" value={wordInfo.stats.vowel_count} />
          <InfoRow label="Consonants" value={wordInfo.stats.consonant_count} />
          <InfoRow label="Unique Letters" value={wordInfo.stats.unique_letters} />
          <InfoRow label="Is Palindrome" value={wordInfo.palindrome ? 'Yes' : 'No'} />
          <InfoRow label="Has Repeated Letters" value={wordInfo.repeated ? 'Yes' : 'No'} />
          <InfoRow label="Scrabble Score" value={wordInfo.scrabbleScore} />
          <InfoRow label="Difficulty" value={wordInfo.difficulty} />
        </div>
        <button
          onClick={() => setWordInfo(null)}
          className={`w-full py-2 px-4 rounded-md transition-colors ${
            darkMode
              ? 'bg-gray-700 hover:bg-gray-600 text-white'
              : 'bg-gray-200 hover:bg-gray-300 text-gray-800'
          }`}
        >
          Close
        </button>
      </div>
    </div>
  </div>
)}

    </div>
  );
}
const InfoRow = ({ label, value }) => (
  <div className="flex justify-between">
    <span className="font-medium">{label}:</span>
    <span className="font-bold">{value}</span>
  </div>
);

export default Letters;