use wasm_bindgen::prelude::*;
use serde::{Serialize, Deserialize};
use std::collections::HashMap;
use crate::storage::{get_local_storage_item, set_local_storage_item};

#[derive(Serialize, Deserialize)]
struct FavoriteWordsData {
    words: HashMap<String, u64>, 
}

#[wasm_bindgen]
pub struct FavoriteWords {
    data: FavoriteWordsData,
}

#[wasm_bindgen]
impl FavoriteWords {
    #[wasm_bindgen(constructor)]
    pub fn new() -> Self {
        let stored_data = get_local_storage_item("favorite_words");
        let data = if let Some(stored) = stored_data {
            serde_json::from_str(&stored).unwrap_or(FavoriteWordsData { words: HashMap::new() })
        } else {
            FavoriteWordsData { words: HashMap::new() }
        };
        FavoriteWords { data }
    }

    fn save(&self) {
        let json = serde_json::to_string(&self.data).unwrap();
        set_local_storage_item("favorite_words", &json);
    }

    pub fn add(&mut self, word: String) {
        self.data.words.insert(word, js_sys::Date::now() as u64);
        self.save();
    }

    pub fn remove(&mut self, word: &str) {
        self.data.words.remove(word);
        self.save();
    }

    pub fn contains(&self, word: &str) -> bool {
        self.data.words.contains_key(word)
    }

    pub fn get_all(&self) -> JsValue {
        let mut words_with_timestamps: Vec<(String, u64)> = self.data.words.iter()
            .map(|(word, &timestamp)| (word.clone(), timestamp))
            .collect();
        
        // Sort by timestamp in descending order
        words_with_timestamps.sort_by(|a, b| b.1.cmp(&a.1));
        
        serde_wasm_bindgen::to_value(&words_with_timestamps).unwrap()
    }
}

#[wasm_bindgen]
pub fn clear_favorite_words(favorite_words: &mut FavoriteWords) {
    favorite_words.data.words.clear();
    favorite_words.save();
}