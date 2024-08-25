import React, { useState, useCallback, useMemo } from 'react';
import { FaArrowCircleLeft } from 'react-icons/fa';
import useWasmInit from '../hooks/useWasmInit';
import AnagramsTab from './AnagramsTab';
import FavoritesTab from './FavoritesTab';
import TabButton from './TabButton';
import WordOfTheDay from './WordOfTheDay';
import InputForm from './InputForm';
import DefinitionModal from './DefinitionModal';
import WordInfoModal from './WordInfoModal';
import ShareModal from './ShareModal';
import Sidebar  from './SideBar.js';
import '../styles/Letters.css';

import { letters, fetch_definition, FavoriteWords } from '../pkg/anagram_odyssey.js';

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
  }, [input, results, wordOfTheDay, generateShareableContent]);

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
        setHasResults(wordArray.length > 0);
        if (wordArray.length === 0) {
          setError('No words found. Try different letters or reduce the minimum length.');
        }
      } catch (error) {
        console.error('Error calling letters function:', error);
        setError('An error occurred while searching for words.');
        setHasResults(false);
      } finally {
        setIsLoading(false);
      }
    }, 500);
  }, [input, wordlist, minLength, maxResults, sortAnagrams, wordHistory, letters]);

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

  return (
    <div className="transition-colors duration-300">
      <div className="flex h-full">
        <button
          onClick={() => setSidebarVisible(!sidebarVisible)}
          title={sidebarVisible ? 'Hide Word History' : 'Show Word History'}
          className={`fixed top-24 left-4 z-20 p-3 rounded-full transition-all duration-300 ${
            darkMode ? 'bg-gray-700 text-white hover:bg-gray-600' : 'bg-white text-gray-800 hover:bg-gray-100'
          } shadow-lg ${sidebarVisible ? 'translate-x-64' : 'translate-x-0'}`}
        >
          <FaArrowCircleLeft className={`transform transition-transform duration-300 ${sidebarVisible ? 'rotate-180' : ''}`} />
        </button>

        <Sidebar
          sidebarVisible={sidebarVisible}
          darkMode={darkMode}
          wordHistory={wordHistory}
        />

        <div className={`flex-1 transition-all duration-300 ${sidebarVisible ? 'ml-64' : 'ml-0'} p-6 pt-8`}>
          <WordOfTheDay
            darkMode={darkMode}
            wordOfTheDay={wordOfTheDay}
            useWordOfTheDay={useWordOfTheDay}
          />

          <InputForm
            darkMode={darkMode}
            input={input}
            setInput={setInput}
            minLength={minLength}
            setMinLength={setMinLength}
            maxResults={maxResults}
            setMaxResults={setMaxResults}
            handleSubmit={handleSubmit}
            handleRandomWordSelection={handleRandomWordSelection}
            clearFields={clearFields}
            handleShare={handleShare}
            hasResults={hasResults}
            isLoading={isLoading}
          />

          {!isLoading && error && (
            <p className="text-red-500 text-lg mb-4">{error}</p>
          )}

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

          <DefinitionModal
            selectedWord={selectedWord}
            definition={definition}
            darkMode={darkMode}
            onClose={() => setSelectedWord('')}
          />

          <WordInfoModal
            wordInfo={wordInfo}
            darkMode={darkMode}
            onClose={() => setWordInfo(null)}
          />

          <ShareModal
            showShareModal={showShareModal}
            shareContent={shareContent}
            darkMode={darkMode}
            onClose={() => setShowShareModal(false)}
          />
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