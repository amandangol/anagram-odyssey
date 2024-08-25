import { useState, useEffect } from 'react';
import init, { 
  FavoriteWords, 
  WordHistory, 
  get_word_of_the_day,
  is_valid_word,
  sort_anagrams,
  word_stats,
  is_palindrome,
  has_repeated_letters,
  select_random_word,
  calculate_scrabble_score,
  calculate_difficulty,
  SortCriteria,
  generate_shareable_content
} from '../pkg/anagram_odyssey.js';

const useWasmInit = () => {
  const [wordlist, setWordlist] = useState('');
  const [favoriteWords, setFavoriteWords] = useState(null);
  const [wordHistory, setWordHistory] = useState(null);
  const [wordOfTheDay, setWordOfTheDay] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const initializeWasm = async () => {
      try {
        await init();
        const response = await fetch('/wordcollection.gz');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const buffer = await response.arrayBuffer();
        const decompressed = await new Response(
          new Blob([buffer]).stream().pipeThrough(new DecompressionStream('gzip'))
        ).text();
        setWordlist(decompressed.trim());
        setFavoriteWords(new FavoriteWords());
        setWordHistory(new WordHistory(15));
        const todaysWord = get_word_of_the_day(decompressed);
        setWordOfTheDay(todaysWord);
      } catch (error) {
        console.error('Error during WASM initialization:', error);
        setError(`Failed to initialize: ${error.message}. Please refresh the page and try again.`);
      }
    };

    initializeWasm();
  }, []);

  return {  
    wordlist, 
    favoriteWords, 
    wordHistory, 
    wordOfTheDay, 
    error,
    setFavoriteWords,
    isValidWord: (word) => is_valid_word(word, wordlist),
    sortAnagrams: (anagrams, sortBy) => sort_anagrams(anagrams, sortBy),
    getWordStats: word_stats,
    isPalindrome: is_palindrome,
    hasRepeatedLetters: has_repeated_letters,
    selectRandomWord: () => select_random_word(wordlist),
    calculateScrabbleScore: calculate_scrabble_score,
    calculateDifficulty: calculate_difficulty,
    SortCriteria,
    generateShareableContent: generate_shareable_content,

  };
};

export default useWasmInit;