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
}

#[wasm_bindgen]
pub fn sort_anagrams(anagrams: &JsValue, sort_by: SortCriteria) -> JsValue {
    let mut anagrams: Vec<String> = serde_wasm_bindgen::from_value(anagrams.clone()).unwrap();
    match sort_by {
        SortCriteria::Alphabetical => anagrams.sort(),
        SortCriteria::Length => anagrams.sort_by_key(|a| a.len()),
    }
    serde_wasm_bindgen::to_value(&anagrams).unwrap()
}

#[wasm_bindgen]
pub struct WordStats {
    pub length: usize,
    pub vowel_count: usize,
    pub consonant_count: usize,
}

#[wasm_bindgen]
pub fn word_stats(word: &str) -> WordStats {
    WordStats {
        length: word.len(),
        vowel_count: word.chars().filter(|&c| "aeiou".contains(c)).count(),
        consonant_count: word.chars().filter(|&c| c.is_alphabetic() && !"aeiou".contains(c)).count(),
    }
}


#[wasm_bindgen]
pub fn is_palindrome(word: &str) -> bool {
    word.chars().eq(word.chars().rev())
}

#[wasm_bindgen]
pub fn has_repeated_letters(word: &str) -> bool {
    let mut seen = HashSet::new();
    word.chars().any(|c| !seen.insert(c))
}


#[wasm_bindgen]
pub fn select_random_word(wordlist: &str) -> String {
    web_sys::console::log_1(&"Entering select_random_word".into());
    web_sys::console::log_1(&format!("Wordlist length: {}", wordlist.len()).into());
    let words: Vec<&str> = wordlist.split_whitespace().collect();
    web_sys::console::log_1(&format!("Number of words: {}", words.len()).into());
    let mut rng = thread_rng();
    let result = words.choose(&mut rng).unwrap_or(&"").to_string();
    web_sys::console::log_1(&format!("Selected word: {}", result).into());
    result
}