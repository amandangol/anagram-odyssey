import React from 'react';

function WordInfoModal({ wordInfo, darkMode, onClose }) {
  if (!wordInfo) return null;

  const InfoRow = ({ label, value }) => (
    <div className="flex justify-between">
      <span className="font-medium">{label}:</span>
      <span className="font-bold">{value}</span>
    </div>
  );

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className={`relative max-w-md w-full rounded-lg shadow-lg ${darkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'}`}>
        <div className="p-6">
          <h3 className={`text-xl font-bold mb-2 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
            {wordInfo.word}
          </h3>
          <div className="space-y-2 mb-6">
            <InfoRow label="Length" value={wordInfo.stats.length} />
            <InfoRow label="Vowels" value={wordInfo.stats.vowel_count} />
            <InfoRow label="Consonants" value={wordInfo.stats.consonant_count} />
            <InfoRow label="Is Palindrome" value={wordInfo.palindrome ? 'Yes' : 'No'} />
            <InfoRow label="Has Repeated Letters" value={wordInfo.repeated ? 'Yes' : 'No'} />
            <InfoRow label="Scrabble Score" value={wordInfo.scrabbleScore} />
            <InfoRow label="Difficulty" value={wordInfo.difficulty} />
          </div>
          <button
            onClick={onClose}
            className={`w-full py-2 px-4 rounded-md transition-colors ${
              darkMode
                ? 'bg-gray-700 hover:bg-gray-600 text-white'
                : 'bg-gray-200 hover:bg-gray-300 text-gray-800'
            }`}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

export default WordInfoModal;