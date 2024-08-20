use wasm_bindgen::prelude::*;

#[wasm_bindgen]
extern "C" {
    #[wasm_bindgen(js_namespace = window)]
    pub fn get_local_storage_item(key: &str) -> Option<String>;

    #[wasm_bindgen(js_namespace = window)]
    pub fn set_local_storage_item(key: &str, val: &str);
}