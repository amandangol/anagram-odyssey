use wasm_bindgen::prelude::*;
use serde::{Serialize, Deserialize};
use std::collections::HashSet;
use crate::storage::{get_local_storage_item, set_local_storage_item};

#[derive(Serialize, Deserialize)]
struct FavoriteWordsData {
    words: HashSet<String>,
}

#[wasm_bindgen]
pub struct FavoriteWords {
    data: FavoriteWordsData,
}

#[wasm_bindgen]
pub fn clear_favorite_words(favorite_words: &mut FavoriteWords) {
    favorite_words.data.words.clear();
    favorite_words.save();
}

#[wasm_bindgen]
impl FavoriteWords {
    #[wasm_bindgen(constructor)]
    pub fn new() -> Self {
        let stored_data = get_local_storage_item("favorite_words");
        let data = if let Some(stored) = stored_data {
            serde_json::from_str(&stored).unwrap_or(FavoriteWordsData { words: HashSet::new() })
        } else {
            FavoriteWordsData { words: HashSet::new() }
        };
        FavoriteWords { data }
    }

    fn save(&self) {
        let json = serde_json::to_string(&self.data).unwrap();
        set_local_storage_item("favorite_words", &json);
    }

    pub fn add(&mut self, word: String) {
        self.data.words.insert(word);
        self.save();
    }

    pub fn remove(&mut self, word: &str) {
        self.data.words.remove(word);
        self.save();
    }

    pub fn contains(&self, word: &str) -> bool {
        self.data.words.contains(word)
    }

    pub fn get_all(&self) -> Vec<String> {
        self.data.words.iter().cloned().collect()
    }
}