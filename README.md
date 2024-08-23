# Anagram Odyssey

Anagram Odyssey is a powerful and user-friendly tool for word enthusiasts, puzzle solvers, and anyone looking to enhance their vocabulary. This web application combines the speed of Rust with the interactivity of React to provide a seamless anagram-solving experience.

## Features

- Fast anagram generation using Rust and WebAssembly
- Interactive user interface built with React
- Word of the Day feature
- Favorite words list
- Word history tracking
- Definition lookup for discovered words
- Dark mode support

## Why Use Anagram Odyssey?

1. **Speed**: Leveraging Rust's performance, Anagram Odyssey finds anagrams incredibly fast.
2. **Learn New Words**: Discover words you've never encountered before and expand your vocabulary.
3. **Puzzle Solving**: Perfect for solving word puzzles or games like Scrabble.
4. **User-Friendly**: Intuitive interface makes it easy for users of all levels.
5. **Personalization**: Save favorite words and track your word history.

## Video Demo

[video demo to be added...]

## Building and Running the Application

### Prerequisites

- Rust (latest stable version)
- Node.js (v14 or later)
- wasm-pack

### Building the Rust/WebAssembly Module

1. Navigate to the `rust` directory:
   cd rust

2. Build the WebAssembly module:
   wasm-pack build --target web

3. Move the generated `pkg` directory to the `src` folder of your React app.

### Setting Up the React Application

1. Install dependencies:
   npm install
   Copy
2. Start the development server:
   npm start
   Copy
3. Open your browser and navigate to `http://localhost:3000`.

## Deployment

To build for production:

1. Build the Rust/WebAssembly module as described above.

2. Build the React application:
   npm run build

3. The `build` folder will contain your production-ready files.
