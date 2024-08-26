use wasm_bindgen::prelude::*;
use regex::Regex;
use std::collections::HashMap;

#[wasm_bindgen]
pub fn letters(input: &str, wordlist: &str, min_word_length: usize) -> JsValue {
    // Remove non-alphabetic characters and convert to lowercase
    let letters = Regex::new("[^a-z]").unwrap();
    let downcased = input.to_ascii_lowercase();
    let cleaned = letters.replace_all(downcased.trim(), "");

    // Count the frequency of each character in the input
    let mut in_counts = HashMap::new();
    for c in cleaned.chars() {
        in_counts.entry(c).and_modify(|v| *v += 1).or_insert(1usize);
    }

    // Create a regex pattern to match words made from the input letters
    let pattern = format!("^[{cleaned}]{{{min_word_length},}}$");
    let matcher = Regex::new(&pattern).expect("The search pattern failed to compile. 😞");

    let mut candidates = Vec::new();
    for line in wordlist.lines() {
        if matcher.is_match(line) {
            // Count the frequency of each character in the candidate word
            let mut cand_counts = HashMap::new();
            for c in line.chars() {
                cand_counts
                    .entry(c)
                    .and_modify(|v| *v += 1)
                    .or_insert(1usize);
            }

            // Check if the candidate word can be formed from the input letters
            if cand_counts.into_iter().all(|(ch, f)| f <= in_counts[&ch]) {
                candidates.push(line.to_string());
            }
        }
    }

    // Sort candidates by length in descending order
    candidates.sort_unstable_by(|a, b| a.len().cmp(&b.len()).reverse());

    // Prepare the result as a tuple of candidates and the original input
    let result = (candidates, input.to_string());
    serde_wasm_bindgen::to_value(&result).unwrap()
}