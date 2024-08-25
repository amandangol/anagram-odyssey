use std::collections::HashSet;
use std::collections::HashMap;
use rand::prelude::*;
use wasm_bindgen::prelude::*;
use once_cell::sync::Lazy;
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
    
    // Letter frequency in English
    let freq: HashMap<char, f32> = [
        ('e', 12.70), ('t', 9.06), ('a', 8.17), ('o', 7.51), ('i', 6.97),
        ('n', 6.75), ('s', 6.33), ('h', 6.09), ('r', 5.99), ('d', 4.25),
        ('l', 4.03), ('c', 2.78), ('u', 2.76), ('m', 2.41), ('w', 2.36),
        ('f', 2.23), ('g', 2.02), ('y', 1.97), ('p', 1.93), ('b', 1.29),
        ('v', 0.98), ('k', 0.77), ('j', 0.15), ('x', 0.15), ('q', 0.10),
        ('z', 0.07)
    ].iter().cloned().collect();

    let rarity_score: f32 = word.chars()
        .map(|c| 13.0 - freq.get(&c.to_ascii_lowercase()).unwrap_or(&0.0))
        .sum();

    let consecutive_consonants = word.to_lowercase()
        .chars()
        .collect::<Vec<char>>()
        .windows(3)
        .filter(|w| w.iter().all(|&c| !"aeiou".contains(c)))
        .count() as u8;

    (length_score + unique_letters + (rarity_score as u8) + (consecutive_consonants * 2)).min(255)
}

static SCRABBLE_SCORES: Lazy<HashMap<char, u16>> = Lazy::new(|| {
    let mut m = HashMap::new();
    for c in "aeioulnstr".chars() { m.insert(c, 1); }
    for c in "dg".chars() { m.insert(c, 2); }
    for c in "bcmp".chars() { m.insert(c, 3); }
    for c in "fhvwy".chars() { m.insert(c, 4); }
    m.insert('k', 5);
    for c in "jx".chars() { m.insert(c, 8); }
    for c in "qz".chars() { m.insert(c, 10); }
    m
});

#[wasm_bindgen]
pub fn calculate_scrabble_score(word: &str) -> u16 {
    word.chars()
        .map(|c| SCRABBLE_SCORES.get(&c.to_ascii_lowercase()).copied().unwrap_or(0))
        .sum()
}

