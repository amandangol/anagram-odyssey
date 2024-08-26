import React from 'react';

function DefinitionModal({ selectedWord, definition, darkMode, onClose }) {
  if (!selectedWord) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className={`relative max-w-md w-full rounded-lg shadow-lg ${darkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'}`}>
        <div className="p-6">
          <h3 className="text-2xl font-bold mb-2">{selectedWord}</h3>
          
          {definition.partOfSpeech && (
            <p className={`text-sm mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              {definition.partOfSpeech}
            </p>
          )}

          <div className={`text-sm mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            Definition
          </div>
          <p className={`mb-4 ${darkMode ? 'text-gray-100' : 'text-gray-800'}`}>
            {definition.definition === 'Loading...' ? (
              <span className="inline-block animate-pulse">Loading...</span>
            ) : (
              definition.definition
            )}
          </p>

          {definition.etymology && (
            <>
              <div className={`text-sm mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                Etymology
              </div>
              <p className={`mb-4 ${darkMode ? 'text-gray-100' : 'text-gray-800'}`}>
                {definition.etymology}
              </p>
            </>
          )}

          {definition.synonyms && definition.synonyms.length > 0 && (
            <>
              <div className={`text-sm mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                Synonyms
              </div>
              <p className={`mb-4 ${darkMode ? 'text-gray-100' : 'text-gray-800'}`}>
                {definition.synonyms.join(', ')}
              </p>
            </>
          )}

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

export default DefinitionModal;