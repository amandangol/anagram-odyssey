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
        let stored_data = get_local_storage_item("word_history");
        let data = if let Some(stored) = stored_data {
            serde_json::from_str(&stored).unwrap_or(WordHistoryData { words: VecDeque::new() })
        } else {
            WordHistoryData { words: VecDeque::new() }
        };
        WordHistory { data, max_size }
    }

    fn save(&self) {
        let json = serde_json::to_string(&self.data).unwrap();
        set_local_storage_item("word_history", &json);
    }

    pub fn add(&mut self, word: String) {
        if self.data.words.contains(&word) {
            self.data.words.retain(|w| w != &word);
        }
        self.data.words.push_front(word);
        if self.data.words.len() > self.max_size {
            self.data.words.pop_back();
        }
        self.save();
    }

    pub fn get_all(&self) -> Vec<String> {
        self.data.words.iter().cloned().collect()
    }
}