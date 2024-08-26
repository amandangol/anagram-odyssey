use wasm_bindgen::prelude::*;
use wasm_bindgen_futures::JsFuture;
use web_sys::{Request, RequestInit, RequestMode, Response};
use serde::Deserialize;

#[derive(Debug, Deserialize)]
struct DictionaryEntry {
    #[serde(default)]
    shortdef: Vec<String>,
    #[serde(default)]
    et: Vec<Vec<EtymologyPart>>,
    def: Vec<Definition>,
}

#[derive(Debug, Deserialize)]
#[serde(untagged)]
enum EtymologyPart {
    Text { text: String },
    Other(serde_json::Value),
}

#[derive(Debug, Deserialize)]
struct Definition {
    sseq: Vec<Vec<Vec<SenseSequence>>>,
}

#[derive(Debug, Deserialize)]
#[serde(untagged)]
enum SenseSequence {
    Sense { dt: Vec<DefText> },
    Other(serde_json::Value),
}

#[derive(Debug, Deserialize)]
#[serde(untagged)]
enum DefText {
    Text { text: String },
    Other(serde_json::Value),
}

#[wasm_bindgen]
pub async fn fetch_definition(word: &str) -> Result<JsValue, JsValue> {
    let mut opts = RequestInit::new();
    opts.method("GET");
    opts.mode(RequestMode::Cors);

    let api_key = "71c4c1ac-eae0-40e6-96ab-7016c3b9eb2d";
    let url = format!(
        "https://dictionaryapi.com/api/v3/references/collegiate/json/{}?key={}",
        word, api_key
    );

    let request = Request::new_with_str_and_init(&url, &opts)?;

    let window = web_sys::window().unwrap();
    let resp_value = JsFuture::from(window.fetch_with_request(&request)).await?;
    let resp: Response = resp_value.dyn_into().unwrap();

    let json = JsFuture::from(resp.json()?).await?;
    
    // Log the raw API response
    web_sys::console::log_1(&format!("Raw API response: {:?}", json).into());

    let entries: Vec<serde_json::Value> = serde_wasm_bindgen::from_value(json)?;
    
    if let Some(entry) = entries.first() {
        let mut result = serde_json::Map::new();

        // Extract definition
        if let Some(shortdef) = entry.get("shortdef").and_then(|sd| sd.as_array()) {
            let definitions: Vec<String> = shortdef.iter()
                .filter_map(|d| d.as_str())
                .map(|s| s.to_string())
                .collect();
            if !definitions.is_empty() {
                result.insert("definition".to_string(), serde_json::Value::String(definitions.join("; ")));
            }
        }


        // Extract etymology (if available)
        if let Some(et) = entry.get("et").and_then(|et| et.as_array()).and_then(|et_arr| et_arr.first()) {
            let etymology = et.as_array()
                .map(|arr| arr.iter().filter_map(|v| v.as_str()).collect::<Vec<_>>().join(" "))
                .unwrap_or_default();
            if !etymology.is_empty() {
                result.insert("etymology".to_string(), serde_json::Value::String(etymology.replace("{et_link|pan:2|pan:2}", "pan")));
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
            result.insert("synonyms".to_string(), serde_json::Value::Array(
                synonyms.into_iter().map(serde_json::Value::String).collect()
            ));
        }

        // Add part of speech
        if let Some(fl) = entry.get("fl").and_then(|fl| fl.as_str()) {
            result.insert("partOfSpeech".to_string(), serde_json::Value::String(fl.to_string()));
        }

        // Log the processed result
        web_sys::console::log_1(&format!("Processed result: {:?}", result).into());

        return Ok(serde_wasm_bindgen::to_value(&result)?);
    }

    Ok(JsValue::from_str("No information found"))
}