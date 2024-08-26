use wasm_bindgen::prelude::*;
use wasm_bindgen_futures::JsFuture;
use web_sys::{Request, RequestInit, RequestMode, Response};
use serde::{Deserialize, Serialize};
use std::collections::HashMap;
use once_cell::sync::Lazy;
use std::sync::Mutex;

static CACHE: Lazy<Mutex<HashMap<String, WordInfo>>> = Lazy::new(|| Mutex::new(HashMap::new()));

static API_KEY: Lazy<Mutex<String>> = Lazy::new(|| Mutex::new(String::new()));

#[wasm_bindgen]
pub fn set_api_key(key: &str) {
    let mut api_key = API_KEY.lock().unwrap();
    *api_key = key.to_string();
}

#[derive(Serialize, Deserialize, Clone)]
pub struct WordInfo {
    definition: Option<String>,
    etymology: Option<String>,
    synonyms: Option<Vec<String>>,
    part_of_speech: Option<String>,
}

#[wasm_bindgen]
pub async fn fetch_definition(word: &str) -> Result<JsValue, JsValue> {
    // Check cache first
    {
        let cache = CACHE.lock().map_err(|e| JsValue::from_str(&format!("Cache error: {}", e)))?;
        if let Some(info) = cache.get(word) {
            return Ok(serde_wasm_bindgen::to_value(info)?);
        }
    }
    
    let mut opts = RequestInit::new();
    opts.method("GET");
    opts.mode(RequestMode::Cors);

    let api_key = API_KEY.lock().map_err(|e| JsValue::from_str(&format!("API key error: {}", e)))?;
    let url = format!(
        "https://dictionaryapi.com/api/v3/references/collegiate/json/{}?key={}",
        word, api_key
    );

    let request = Request::new_with_str_and_init(&url, &opts)?;

    let window = web_sys::window().unwrap();
    let resp_value = JsFuture::from(window.fetch_with_request(&request)).await?;
    let resp: Response = resp_value.dyn_into().unwrap();

    let json = JsFuture::from(resp.json()?).await?;
    
    let entries: Vec<serde_json::Value> = serde_wasm_bindgen::from_value(json)?;
    
    if let Some(entry) = entries.first() {
        let mut word_info = WordInfo {
            definition: None,
            etymology: None,
            synonyms: None,
            part_of_speech: None,
        };

        // Extract definition
        if let Some(shortdef) = entry.get("shortdef").and_then(|sd| sd.as_array()) {
            let definitions: Vec<String> = shortdef.iter()
                .filter_map(|d| d.as_str())
                .map(|s| s.to_string())
                .collect();
            if !definitions.is_empty() {
                word_info.definition = Some(definitions.join("; "));
            }
        }

        // Extract etymology (if available)
        if let Some(et) = entry.get("et").and_then(|et| et.as_array()).and_then(|et_arr| et_arr.first()) {
            let etymology = et.as_array()
                .map(|arr| arr.iter().filter_map(|v| v.as_str()).collect::<Vec<_>>().join(" "))
                .unwrap_or_default();
            if !etymology.is_empty() {
                word_info.etymology = Some(etymology.replace("{et_link|pan:2|pan:2}", "pan"));
            }
        }

        // Extract synonyms (if available)
        let mut synonyms = Vec::new();
        if let Some(def_array) = entry.get("def").and_then(|def| def.as_array()) {
            for def in def_array {
                if let Some(sseq_array) = def.get("sseq").and_then(|sseq| sseq.as_array()) {
                    for sseq in sseq_array {
                        if let Some(sense_array) = sseq.as_array() {
                            for sense in sense_array {
                                if let Some(dt_array) = sense.get("dt").and_then(|dt| dt.as_array()) {
                                    for dt in dt_array {
                                        if let Some(text) = dt.as_str() {
                                            if text.contains("{sx|") {
                                                let start = text.find("{sx|").unwrap() + 4;
                                                let end = text[start..].find("|").unwrap() + start;
                                                synonyms.push(text[start..end].to_string());
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
        if !synonyms.is_empty() {
            word_info.synonyms = Some(synonyms);
        }

        // Add part of speech
        if let Some(fl) = entry.get("fl").and_then(|fl| fl.as_str()) {
            word_info.part_of_speech = Some(fl.to_string());
        }

        // Add to cache
        {
            let mut cache = CACHE.lock().map_err(|e| JsValue::from_str(&format!("Cache error: {}", e)))?;
            cache.insert(word.to_string(), word_info.clone());
        }

        return Ok(serde_wasm_bindgen::to_value(&word_info)?);
    }

    Ok(JsValue::from_str("No information found"))
}