import React, { useState, useCallback, useMemo } from 'react';
import { FaHistory, FaTimes, FaCalendarDay, FaArrowCircleLeft, FaRandom, FaShare,FaCopy,FaShareAlt } from 'react-icons/fa';
import useWasmInit from '../hooks/useWasmInit';
import AnagramsTab from './AnagramsTab';
import FavoritesTab from './FavoritesTab';
import TabButton from './TabButton';
import '../styles/Letters.css';

import { letters, fetch_definition, FavoriteWords,generateShareableContent } from '../pkg/anagram_odyssey.js';

function Letters({ darkMode }) {
  const {
    wordlist,
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
    generateShareableContent
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
  const [showShareModal, setShowShareModal] = useState(false);
  const [shareContent, setShareContent] = useState('');
  const [hasResults, setHasResults] = useState(false);



  const useWordOfTheDay = useCallback(() => {
    setInput(wordOfTheDay);
  }, [wordOfTheDay]);

  const toggleFavorite = useCallback((word) => {
    setFavoriteWords((prevFavorites) => {
      const newFavorites = new FavoriteWords(prevFavorites.get_all());
      if (newFavorites.contains(word)) {
        newFavorites.remove(word);
      } else {
        newFavorites.add(word);
      }
      return newFavorites;
    });
  }, [setFavoriteWords]);

  const fetchDefinition = useCallback(async (word) => {
    setSelectedWord(word);
    setDefinition('Loading...');
    try {
      const result = await fetch_definition(word);
      setDefinition(result.toString());
    } catch (error) {
      console.error('Error fetching definition:', error);
      setDefinition('Failed to fetch definition');
    }
  }, []);

  const handleShare = useCallback(() => {
    const allAnagrams = results.flatMap(([_, words]) => words);
    const shareableContent = generateShareableContent(input, allAnagrams, wordOfTheDay);
    const { original_input, anagrams, word_of_the_day } = shareableContent;
    
    const content = `Anagram Odyssey\n\nI found ${anagrams.length} anagrams for "${original_input}":\n\n${anagrams.join(', ')}\n\nWord of the day: ${word_of_the_day}\n\nCheck it out at https://anagram-odyssey.vercel.app`;
  
    setShareContent(content);
    setShowShareModal(true);
  }, [input, results, wordOfTheDay]);

  const handleNativeShare = useCallback(async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Anagram Odyssey Results',
          text: shareContent,
          url: 'https://anagram-odyssey.vercel.app'
        });
      } catch (error) {
        console.error('Error sharing:', error);
      }
    }
  }, [shareContent]);

  const handleSubmit = useCallback((e) => {
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
        const [wordArray, searchedWord] = letters(input, wordlist, minLength);
        let groupedResults = groupResultsByLength(wordArray.slice(0, maxResults));
        
        groupedResults = groupedResults.map(([length, words]) => [
          length,
          sortAnagrams(words, 'alphabetical')
        ]);
  
        setResults(groupedResults);
        setTotalResults(wordArray.length);
        wordHistory.add(searchedWord);
        setHasResults(wordArray.length > 0); // Set hasResults based on whether we found any anagrams
        if (wordArray.length === 0) {
          setError('No words found. Try different letters or reduce the minimum length.');
        }
      } catch (error) {
        console.error('Error calling letters function:', error);
        setError('An error occurred while searching for words.');
        setHasResults(false); // Ensure hasResults is false if there's an error
      } finally {
        setIsLoading(false);
      }
    }, 500);
  }, [input, wordlist, minLength, maxResults, sortAnagrams, wordHistory]);

  const showWordInfo = useCallback((word) => {
    const stats = getWordStats(word);
    const palindrome = isPalindrome(word);
    const repeated = hasRepeatedLetters(word);
    const scrabbleScore = calculateScrabbleScore(word);
    const difficulty = calculateDifficulty(word);
    setWordInfo({ word, stats, palindrome, repeated, scrabbleScore, difficulty });
  }, [getWordStats, isPalindrome, hasRepeatedLetters, calculateScrabbleScore, calculateDifficulty]);

  const handleRandomWordSelection = useCallback(() => {
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
  }, [wordlist, selectRandomWord]);

  const clearFields = useCallback(() => {
    setInput('');
    setMinLength(3);
    setMaxResults(20);
    setResults([]);
    setTotalResults(0);
    setError('');
    setHasResults(false); 
  }, []);

  const groupResultsByLength = useCallback((words) => {
    const grouped = {};
    words.forEach(word => {
      const length = word.length;
      if (!grouped[length]) {
        grouped[length] = [];
      }
      grouped[length].push(word);
    });
    return Object.entries(grouped).sort((a, b) => b[0] - a[0]);
  }, []);

  const inputClass = useMemo(() => `
    border p-3 w-full rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500
    ${darkMode ? 'bg-gray-800 border-gray-700 text-white' : 'bg-white border-gray-300 text-gray-900'}
  `, [darkMode]);

  const buttonClass = useMemo(() => `
    px-6 py-3 rounded-lg font-semibold shadow-md hover:shadow-lg transition-all duration-300 
    ${darkMode ? 'bg-indigo-600 text-white hover:bg-indigo-700' : 'bg-indigo-500 text-white hover:bg-indigo-600'}
  `, [darkMode]);

  const labelClass = useMemo(() => `
    block text-sm font-medium mb-1
    ${darkMode ? 'text-gray-400' : 'text-gray-700'}
  `, [darkMode]);

  return (
    <div className="transition-colors duration-300">
      <div className="flex h-full">
      <button
  onClick={() => setSidebarVisible(!sidebarVisible)}
  title=  {sidebarVisible ? 'Hide Word History' : 'Show Word History'}
  className={`fixed top-24 left-4 z-20 p-3 rounded-full transition-all duration-300 ${
    darkMode ? 'bg-gray-700 text-white hover:bg-gray-600' : 'bg-white text-gray-800 hover:bg-gray-100'
  } shadow-lg ${sidebarVisible ? 'translate-x-64' : 'translate-x-0'}`}
>
  <FaArrowCircleLeft className={`transform transition-transform duration-300 ${sidebarVisible ? 'rotate-180' : ''}`}   />
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

  
  {hasResults && ( // Only show the share button if we have results
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
  {showShareModal && (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
    <div className={`relative max-w-md w-full rounded-lg shadow-xl ${darkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'}`}>
      <div className="p-6">
        <h3 className="text-2xl font-bold mb-4 flex items-center">
          <FaShare className="mr-2 text-indigo-500" />
          Share Results
        </h3>
        <textarea
          className={`w-full h-48 p-3 rounded-md mb-4 border ${
            darkMode 
              ? 'bg-gray-700 text-white border-gray-600 focus:border-indigo-500' 
              : 'bg-gray-100 text-gray-800 border-gray-300 focus:border-indigo-500'
          } focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50 transition-all duration-200 ease-in-out`}
          value={shareContent}
          readOnly
        />
        <div className="flex flex-wrap justify-end gap-3">
          <button
            onClick={() => setShowShareModal(false)}
            className={`py-2 px-4 rounded-md transition-colors duration-200 ease-in-out flex items-center ${
              darkMode ? 'bg-gray-700 hover:bg-gray-600 text-gray-300' : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
            }`}
          >
            <FaTimes className="mr-2" /> Close
          </button>
          <button
            onClick={() => {
              navigator.clipboard.writeText(shareContent);
              setShowShareModal(false);
            }}
            className={`py-2 px-4 rounded-md transition-colors duration-200 ease-in-out flex items-center ${
              darkMode ? 'bg-indigo-600 hover:bg-indigo-700' : 'bg-indigo-500 hover:bg-indigo-600'
            } text-white`}
          >
            <FaCopy className="mr-2" /> Copy to Clipboard
          </button>
          {navigator.share && (
            <button
              onClick={() => {
                handleNativeShare();
                setShowShareModal(false);
              }}
              className={`py-2 px-4 rounded-md transition-colors duration-200 ease-in-out flex items-center ${
                darkMode ? 'bg-green-600 hover:bg-green-700' : 'bg-green-500 hover:bg-green-600'
              } text-white`}
            >
              <FaShareAlt className="mr-2" /> Share
            </button>
          )}
        </div>
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