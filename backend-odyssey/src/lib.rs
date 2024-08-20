// Declaring the modules
mod definition;
mod favorite_words;
mod letters;
mod storage;
mod word_history;
mod word_of_day;

pub use definition::fetch_definition;
pub use favorite_words::{FavoriteWords, clear_favorite_words};
pub use letters::letters;
pub use word_history::WordHistory;
pub use word_of_day::get_word_of_the_day;

pub use storage::*;
