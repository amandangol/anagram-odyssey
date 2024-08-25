// sharable.rs

use wasm_bindgen::prelude::*;
use serde::{Serialize, Deserialize};

#[derive(Serialize, Deserialize)]
pub struct ShareableContent {
    pub original_input: String,
    pub anagrams: Vec<String>,
    pub word_of_the_day: String,
}

#[wasm_bindgen]
pub fn generate_shareable_content(input: &str, anagrams: &JsValue, word_of_the_day: &str) -> JsValue {
    let anagrams: Vec<String> = serde_wasm_bindgen::from_value(anagrams.clone()).unwrap();
    
    let content = ShareableContent {
        original_input: input.to_string(),
        anagrams,
        word_of_the_day: word_of_the_day.to_string(),
    };
    
    serde_wasm_bindgen::to_value(&content).unwrap()
}