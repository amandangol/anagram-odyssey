use wasm_bindgen::prelude::*;
use wasm_bindgen_futures::JsFuture;
use web_sys::{Request, RequestInit, RequestMode, Response};
use serde::Deserialize;

#[derive(Debug, Deserialize)]
struct DefinitionItem {
    word: String,
    defs: Option<Vec<String>>, 
}

#[wasm_bindgen]
pub async fn fetch_definition(word: &str) -> Result<JsValue, JsValue> {
    let mut opts = RequestInit::new();
    opts.method("GET");
    opts.mode(RequestMode::Cors);

    let url = format!("https://api.datamuse.com/words?sp={}&md=d", word);

    let request = Request::new_with_str_and_init(&url, &opts)?;

    let window = web_sys::window().unwrap();
    let resp_value = JsFuture::from(window.fetch_with_request(&request)).await?;
    let resp: Response = resp_value.dyn_into().unwrap();

    let json = JsFuture::from(resp.json()?).await?;

    let definitions: Vec<DefinitionItem> = serde_wasm_bindgen::from_value(json)?;

    if let Some(first_def) = definitions.first() {
        if let Some(defs) = &first_def.defs {
            if let Some(def) = defs.first() {
                return Ok(JsValue::from_str(def));
            }
        }
    }
    
    Ok(JsValue::from_str("No definition found"))
}