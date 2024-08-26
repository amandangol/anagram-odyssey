# Anagram Odyssey

Anagram Odyssey is a powerful web application for word enthusiasts and puzzle solvers. It combines Rust's speed with React's interactivity to deliver a seamless anagram-solving experience.

## Features

- Fast anagram generation using Rust and WebAssembly
- User-friendly React interface
- Word of the Day for daily inspiration
- Favorite words list and search history
- In-app definition lookup along with words etymology and synonyms
- Dark mode support
- Customizable search parameters (minimum word length, maximum results)
- Detailed word statistics (length, vowels, consonants, etc.)
- Random word generation
- Scrabble score calculation
- Palindrome and repeated letters detection
- Word difficulty calculation
- Shareable results

## Why Choose Anagram Odyssey?

1. **Speed**: Rust-powered searches complete in milliseconds.
2. **Educational Value**: Expand your vocabulary effortlessly.
3. **Puzzle Solving**: Ideal for word games like Scrabble.
4. **User-Friendly**: Intuitive design for all skill levels.
5. **Personalization**: Save favorites and track search history.
6. **Comprehensive Analysis**: Get detailed word information and statistics.
7. **Social Sharing**: Share your anagram discoveries with others..

## Video Demo

[Link to video demo to be added]

<img src="https://github.com/user-attachments/assets/680c2a21-eaf9-49a2-b8d9-4723d857be37" alt="image" width="800" height="400">

## How It Works

Anagram Odyssey uses a Rust backend compiled to WebAssembly for efficient anagram generation and word analysis. The React frontend provides an interactive user interface, allowing users to input letters, set search parameters, and view results.

Key components:

- Rust functions for anagram generation and word analysis
- React hooks for state management and WebAssembly initialization
- Custom components for features like word history and favorites

The application offers a tab-based interface for easy navigation between anagrams and favorite words. Users can customize their search with minimum word length and maximum results options. Each word comes with detailed statistics, including Scrabble score and difficulty rating.

Anagram Odyssey goes beyond simple anagram solving by providing comprehensive word analysis tools. Whether you're a casual word game player or a serious linguist, this application offers valuable insights and a fun way to explore language.

With its combination of speed, functionality, and user-friendly design, Anagram Odyssey is the perfect tool for anyone looking to enhance their word skills or solve challenging puzzles.

## Data Sources

**Dictionary API**: Anagram Odyssey uses the Merriam-Webster Dictionary API for word definitions and etymologies.
**Word Collection**: The application uses a compressed word list stored as wordcollection.gz in the public folder of the React application. This ensures fast loading and efficient storage of the extensive word database.

## Building and Running

### Prerequisites

- Rust (latest stable)
- Node.js (v14+)
- wasm-pack

### Build Rust/WebAssembly Module

```sh
cd rust
wasm-pack build --target web
```

Move the generated `pkg` directory to the React app's `src` folder.

### Set Up React Application

```sh
npm install
npm start
```

Open `http://localhost:3000` in your browser.

### Deployment

1. Build the Rust/WebAssembly module as above.
2. Build the React app:
   ```sh
   npm run build
   ```
3. Deploy the contents of the `build` folder.
