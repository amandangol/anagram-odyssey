use wasm_bindgen::prelude::*;
use serde::{Serialize, Deserialize};
use std::collections::VecDeque;
use crate::storage::{get_local_storage_item, set_local_storage_item};

#[derive(Serialize, Deserialize)]
struct WordHistoryData {
    words: VecDeque<String>,
}

#[wasm_bindgen]
pub struct WordHistory {
    data: WordHistoryData,
    max_size: usize,
}

#[wasm_bindgen]
impl WordHistory {
    #[wasm_bindgen(constructor)]
    pub fn new(max_size: usize) -> Self {
        // Attempt to load existing data from local storage
        let stored_data = get_local_storage_item("word_history");
        let data = if let Some(stored) = stored_data {
            serde_json::from_str(&stored).unwrap_or(WordHistoryData { words: VecDeque::new() })
        } else {
            WordHistoryData { words: VecDeque::new() }
        };
        WordHistory { data, max_size }
    }

    // Private method to save current state to local storage
    fn save(&self) {
        let json = serde_json::to_string(&self.data).unwrap();
        set_local_storage_item("word_history", &json);
    }

    // Method to add a new word to the history
    pub fn add(&mut self, word: String) {
        if self.data.words.contains(&word) {
            self.data.words.retain(|w| w != &word);
        }
        self.data.words.push_front(word);
        // If we've exceeded max_size, remove the oldest word
        if self.data.words.len() > self.max_size {
            self.data.words.pop_back();
        }
        self.save();
    }

    // Method to retrieve all words in the history
    pub fn get_all(&self) -> Vec<String> {
        self.data.words.iter().cloned().collect()
    }
}