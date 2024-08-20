use wasm_bindgen::prelude::*;
use chrono::{Utc, Datelike};
use rand::{SeedableRng, rngs::SmallRng, seq::SliceRandom};

#[wasm_bindgen]
pub fn get_word_of_the_day(wordlist: &str) -> String {
    let today = Utc::now().date_naive();
    let seed = (today.year() as u64) * 10000 + (today.month() as u64) * 100 + (today.day() as u64);
    let mut rng = SmallRng::seed_from_u64(seed);
    
    let words: Vec<&str> = wordlist.lines().collect();
    words.choose(&mut rng).unwrap_or(&"PUZZLE").to_string()
}