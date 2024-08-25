import React from 'react';
import { FaTimes, FaCopy, FaShareAlt } from 'react-icons/fa';

function ShareModal({ showShareModal, shareContent, darkMode, onClose }) {
  if (!showShareModal) return null;

  const handleCopyToClipboard = () => {
    navigator.clipboard.writeText(shareContent);
    onClose();
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Anagram Odyssey Results',
          text: shareContent,
          url: 'https://anagram-odyssey.vercel.app'
        });
      } catch (error) {
        console.error('Error sharing:', error);
      }
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className={`relative max-w-md w-full rounded-lg shadow-xl ${darkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'}`}>
        <div className="p-6">
          <h3 className="text-2xl font-bold mb-4 flex items-center">
            <FaShareAlt className="mr-2 text-indigo-500" />
            Share Results
            </h3>
          <textarea
            className={`w-full h-48 p-3 rounded-md mb-4 border ${
              darkMode 
                ? 'bg-gray-700 text-white border-gray-600 focus:border-indigo-500' 
                : 'bg-gray-100 text-gray-800 border-gray-300 focus:border-indigo-500'
            } focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50 transition-all duration-200 ease-in-out`}
            value={shareContent}
            readOnly
          />
          <div className="flex flex-wrap justify-end gap-3">
            <button
              onClick={onClose}
              className={`py-2 px-4 rounded-md transition-colors duration-200 ease-in-out flex items-center ${
                darkMode ? 'bg-gray-700 hover:bg-gray-600 text-gray-300' : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
              }`}
            >
              <FaTimes className="mr-2" /> Close
            </button>
            <button
              onClick={handleCopyToClipboard}
              className={`py-2 px-4 rounded-md transition-colors duration-200 ease-in-out flex items-center ${
                darkMode ? 'bg-indigo-600 hover:bg-indigo-700' : 'bg-indigo-500 hover:bg-indigo-600'
              } text-white`}
            >
              <FaCopy className="mr-2" /> Copy to Clipboard
            </button>
            {navigator.share && (
              <button
                onClick={handleNativeShare}
                className={`py-2 px-4 rounded-md transition-colors duration-200 ease-in-out flex items-center ${
                  darkMode ? 'bg-green-600 hover:bg-green-700' : 'bg-green-500 hover:bg-green-600'
                } text-white`}
              >
                <FaShareAlt className="mr-2" /> Share
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ShareModal;