import React, { useState } from 'react';
import { FaThumbsUp, FaThumbsDown } from 'react-icons/fa';

export default function Feedback({ messageId }) {
  const [feedback, setFeedback] = useState(null);
  
  const handleFeedback = (isPositive) => {
    setFeedback(isPositive);
    // Here you could send the feedback to a backend API
    console.log(`Feedback for message ${messageId}: ${isPositive ? 'positive' : 'negative'}`);
  };
  
  if (feedback === true) {
    return <p className="text-xs text-green-500 mt-1">Thanks for your feedback!</p>;
  }
  
  if (feedback === false) {
    return <p className="text-xs text-gray-500 mt-1">Thanks for your feedback. We'll improve our responses.</p>;
  }
  
  return (
    <div className="flex items-center gap-2 mt-1">
      <p className="text-xs text-gray-400">Was this helpful?</p>
      <button 
        onClick={() => handleFeedback(true)}
        className="text-gray-400 hover:text-green-500 transition-colors"
      >
        <FaThumbsUp size={12} />
      </button>
      <button 
        onClick={() => handleFeedback(false)}
        className="text-gray-400 hover:text-red-500 transition-colors"
      >
        <FaThumbsDown size={12} />
      </button>
    </div>
  );
}