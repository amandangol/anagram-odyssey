### Anagram Odyssey

Anagram Odyssey is an innovative web application designed for word enthusiasts, puzzle solvers, and anyone looking to expand their vocabulary. This powerful tool combines the performance of Rust with the interactivity of React to deliver a seamless and engaging anagram-solving experience.

#### Key Features

- **Speedy Anagram Generation**: Powered by Rust and WebAssembly, Anagram Odyssey offers lightning-fast anagram generation, making it perfect for quick searches and word puzzles.

- **Interactive Interface**: Built with React, the interface is user-friendly and intuitive, catering to both casual users and seasoned word experts.

- **Word of the Day**: Stay inspired daily with a new word, helping users discover and learn new vocabulary.

- **Favorite Words List**: Keep track of the words that captivate you by adding them to your favorites.

- **Word History**: Easily revisit words you've searched for in the past with the word history feature.

- **Definition Lookup**: Find meanings for any discovered word directly within the application.

- **Dark Mode Support**: Enjoy a visually pleasing experience regardless of the time of day with dark mode.

#### Why Choose Anagram Odyssey?

1. **Blazing Speed**: Utilizing Rust's performance capabilities, Anagram Odyssey ensures anagram searches are completed in milliseconds.

2. **Educational Value**: Whether you're a student, writer, or puzzle enthusiast, this tool helps you discover new words and enhances your vocabulary.

3. **Perfect for Puzzle Solvers**: Ideal for solving anagram puzzles or games like Scrabble, Anagram Odyssey offers a vast array of word possibilities.

4. **Ease of Use**: The application is designed with simplicity in mind, making it accessible to users of all levels.

5. **Personalization**: Customize your experience by saving your favorite words and tracking your search history.

#### Building and Running the Application

**Prerequisites**:

- Rust (latest stable version)
- Node.js (v14 or later)
- wasm-pack

**Building the Rust/WebAssembly Module**:

1. Navigate to the `rust` directory:
   ```sh
   cd rust
   ```
2. Build the WebAssembly module:
   ```sh
   wasm-pack build --target web
   ```
3. Move the generated `pkg` directory to the `src` folder of your React app.

**Setting Up the React Application**:

1. Install dependencies:
   ```sh
   npm install
   ```
2. Start the development server:
   ```sh
   npm start
   ```
3. Open your browser and navigate to `http://localhost:3000`.

**Deployment**:

1. Build the Rust/WebAssembly module as described above.
2. Build the React application:
   ```sh
   npm run build
   ```
3. The `build` folder will contain your production-ready files.

#### Conclusion

Anagram Odyssey is more than just a tool—it's a gateway to word discovery and puzzle-solving mastery. Whether you're looking to improve your vocabulary, find words for a game, or simply explore the vast world of anagrams, Anagram Odyssey provides the speed, efficiency, and user experience needed to make your journey enjoyable and productive.

**Video Demo**: [video demo to be added...]
