// Declaring the modules
mod definition;
mod favorite_words;
mod letters;
mod storage;
mod word_history;
mod word_of_day;
mod utils; 

pub use definition::fetch_definition;
pub use favorite_words::{FavoriteWords, clear_favorite_words};
pub use letters::letters;
pub use word_history::WordHistory;
pub use word_of_day::get_word_of_the_day;
use wasm_bindgen::prelude::*;


pub use storage::*;

pub use utils::{
    is_valid_word,
    sort_anagrams,
    SortCriteria,
    word_stats,
    WordStats,
    is_palindrome,
    has_repeated_letters,
    select_random_word,
    calculate_scrabble_score,
    calculate_difficulty

   
};
