import React, { useState } from 'react';
import { FaThumbsUp, FaThumbsDown, FaStar } from 'react-icons/fa';

export default function Feedback({ messageId, darkMode }) {
  const [feedback, setFeedback] = useState(null);
  const [showDetails, setShowDetails] = useState(false);
  
  const handleFeedback = (isPositive) => {
    if (isPositive) {
      setFeedback(true);
      console.log(`Positive feedback for message ${messageId}`);
    } else {
      setShowDetails(true);
      setFeedback(false);
    }
  };
  
  const submitDetailedFeedback = (reason) => {
    console.log(`Feedback for message ${messageId}: negative - ${reason}`);
    setShowDetails(false);
  };
  
  if (feedback === true) {
    return <p className={`text-xs ${darkMode ? 'text-green-400' : 'text-green-500'} mt-1 flex items-center gap-1`}>
      <FaStar className="text-yellow-400" size={12} /> Thanks for your feedback!
    </p>;
  }
  
  if (showDetails) {
    return (
      <div className={`text-xs ${darkMode ? 'text-gray-300' : 'text-gray-600'} mt-1 p-2 border ${
        darkMode ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-gray-50'
      } rounded-lg`}>
        <p className="mb-1">What was the issue?</p>
        <div className="flex flex-wrap gap-1">
          {['Not helpful', 'Incorrect info', 'Not relevant', 'Other'].map(reason => (
            <button
              key={reason}
              onClick={() => submitDetailedFeedback(reason)}
              className={`text-xs px-2 py-1 rounded-full ${
                darkMode 
                  ? 'bg-gray-700 hover:bg-gray-600 text-gray-300' 
                  : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
              }`}
            >
              {reason}
            </button>
          ))}
        </div>
      </div>
    );
  }
  
  if (feedback === false) {
    return <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'} mt-1`}>Thanks for your feedback. We'll improve our responses.</p>;
  }
  
  return (
    <div className="flex items-center gap-2 mt-1">
      <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Was this helpful?</p>
      <button 
        onClick={() => handleFeedback(true)}
        className={`${darkMode ? 'text-gray-400 hover:text-green-400' : 'text-gray-400 hover:text-green-500'} transition-colors`}
        aria-label="Yes, this was helpful"
      >
        <FaThumbsUp size={12} />
      </button>
      <button 
        onClick={() => handleFeedback(false)}
        className={`${darkMode ? 'text-gray-400 hover:text-red-400' : 'text-gray-400 hover:text-red-500'} transition-colors`}
        aria-label="No, this was not helpful"
      >
        <FaThumbsDown size={12} />
      </button>
    </div>
  );
}