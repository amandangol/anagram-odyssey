use std::collections::HashSet;
use rand::prelude::*;
use wasm_bindgen::prelude::*;
use serde::{Serialize, Deserialize};

#[wasm_bindgen]
pub fn is_valid_word(word: &str, wordlist: &JsValue) -> bool {
    let wordlist: Vec<String> = serde_wasm_bindgen::from_value(wordlist.clone()).unwrap();
    wordlist.binary_search(&word.to_lowercase()).is_ok()
}

#[wasm_bindgen]
pub enum SortCriteria {
    Alphabetical,
    Length,
    Difficulty,
    ScrabbleScore,
}

#[wasm_bindgen]
pub fn sort_anagrams(anagrams: &JsValue, sort_by: SortCriteria) -> JsValue {
    let mut anagrams: Vec<String> = serde_wasm_bindgen::from_value(anagrams.clone()).unwrap();
    match sort_by {
        SortCriteria::Alphabetical => anagrams.sort(),
        SortCriteria::Length => anagrams.sort_by_key(|a| a.len()),
        SortCriteria::Difficulty => anagrams.sort_by_key(|a| calculate_difficulty(a)),
        SortCriteria::ScrabbleScore => anagrams.sort_by_key(|a| calculate_scrabble_score(a)),
    }
    serde_wasm_bindgen::to_value(&anagrams).unwrap()
}

#[wasm_bindgen]
#[derive(Serialize, Deserialize)]
pub struct WordStats {
    pub length: usize,
    pub vowel_count: usize,
    pub consonant_count: usize,
    pub unique_letters: usize,
    pub is_palindrome: bool,
    pub has_repeated_letters: bool,
    pub difficulty: u8,
    pub scrabble_score: u16,
}

#[wasm_bindgen]
pub fn word_stats(word: &str) -> JsValue {
    let stats = WordStats {
        length: word.len(),
        vowel_count: word.chars().filter(|&c| "aeiouAEIOU".contains(c)).count(),
        consonant_count: word.chars().filter(|&c| c.is_alphabetic() && !"aeiouAEIOU".contains(c)).count(),
        unique_letters: word.chars().collect::<HashSet<_>>().len(),
        is_palindrome: is_palindrome(word),
        has_repeated_letters: has_repeated_letters(word),
        difficulty: calculate_difficulty(word),
        scrabble_score: calculate_scrabble_score(word),   
     };
        serde_wasm_bindgen::to_value(&stats).unwrap()
}

#[wasm_bindgen]
pub fn is_palindrome(word: &str) -> bool {
    let word = word.to_lowercase();
    word.chars().eq(word.chars().rev())
}

#[wasm_bindgen]
pub fn has_repeated_letters(word: &str) -> bool {
    let mut seen = HashSet::new();
    word.chars().any(|c| !seen.insert(c.to_lowercase().next().unwrap()))
}

#[wasm_bindgen]
pub fn select_random_word(wordlist: &str) -> String {
    let words: Vec<&str> = wordlist.split_whitespace().collect();
    let mut rng = thread_rng();
    words.choose(&mut rng).unwrap_or(&"").to_string()
}

#[wasm_bindgen]
pub fn calculate_difficulty(word: &str) -> u8 {
    let length_score = word.len() as u8;
    let unique_letters = word.chars().collect::<HashSet<_>>().len() as u8;
    let rare_letters_score = word.chars()
        .filter(|&c| "jqxzJQXZ".contains(c))
        .count() as u8 * 2;
    
    length_score + unique_letters + rare_letters_score
}

#[wasm_bindgen]
pub fn calculate_scrabble_score(word: &str) -> u16 {
    word.chars().map(|c| match c.to_ascii_lowercase() {
        'a' | 'e' | 'i' | 'o' | 'u' | 'l' | 'n' | 's' | 't' | 'r' => 1,
        'd' | 'g' => 2,
        'b' | 'c' | 'm' | 'p' => 3,
        'f' | 'h' | 'v' | 'w' | 'y' => 4,
        'k' => 5,
        'j' | 'x' => 8,
        'q' | 'z' => 10,
        _ => 0,
    }).sum()
}
