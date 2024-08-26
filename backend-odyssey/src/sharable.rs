// sharable.rs

use wasm_bindgen::prelude::*;
use serde::{Serialize, Deserialize};

// Define a struct to hold the content we want to share
#[derive(Serialize, Deserialize)]
pub struct ShareableContent {
    pub original_input: String,
    pub anagrams: Vec<String>,
    pub word_of_the_day: String,
}

#[wasm_bindgen]
pub fn generate_shareable_content(input: &str, anagrams: &JsValue, word_of_the_day: &str) -> JsValue {
    // Convert the JsValue containing anagrams back into a Rust Vec<String>
    let anagrams: Vec<String> = serde_wasm_bindgen::from_value(anagrams.clone()).unwrap();
    
    // Create a new ShareableContent instance with the provided data
    let content = ShareableContent {
        original_input: input.to_string(),
        anagrams,
        word_of_the_day: word_of_the_day.to_string(),
    };
    
    // Serialize the ShareableContent back to a JsValue for return to JavaScript
    serde_wasm_bindgen::to_value(&content).unwrap()
}