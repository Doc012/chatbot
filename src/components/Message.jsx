import React from 'react';
import { FaRobot, FaUser, FaCheck, FaCheckDouble } from 'react-icons/fa';
import Feedback from './Feedback';

export default function Message({ message, isLastMessage, onSuggestedQuestionClick, darkMode }) {
  const { text, sender, timestamp = new Date().toISOString(), id = timestamp, suggestedQuestions } = message;
  
  // Remove the typing effect states and useEffect
  
  const formattedTime = new Date(timestamp).toLocaleTimeString([], { 
    hour: '2-digit', 
    minute: '2-digit' 
  });

  return (
    <div className={`flex ${sender === 'user' ? 'justify-end' : 'justify-start'}`}>
      <div className={`relative max-w-[90%] sm:max-w-[80%] p-2 sm:p-3 rounded-2xl shadow-sm ${
        sender === 'user' 
          ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-br-none' 
          : 'bg-white text-gray-800 rounded-bl-none'
      }`}>
        <div className="flex items-start">
          {sender === 'bot' && (
            <div className="flex-shrink-0 w-6 sm:w-8 flex items-center justify-center mr-2 sm:mr-3"> 
              <FaRobot className="text-blue-500 text-sm sm:text-base" />
            </div>
          )}
          
          <div className="flex-1 pl-1 sm:pl-2"> 
            {/* Use text directly instead of displayText */}
            <p className="text-xs sm:text-sm whitespace-pre-wrap">
              {text}
            </p>
            
            {sender === 'bot' && (
              <>
                <Feedback messageId={id} />
                
                {suggestedQuestions && suggestedQuestions.length > 0 && (
                  <div className="mt-2">
                    <p className="text-xs text-gray-500 mb-1">You might want to ask:</p>
                    <div className="flex flex-wrap gap-1">
                      {suggestedQuestions.map((question, index) => (
                        <button
                          key={index}
                          onClick={() => onSuggestedQuestionClick(question)}
                          className="text-xs bg-gray-100 hover:bg-gray-200 px-2 py-1 rounded-full text-blue-600 transition-colors"
                          aria-label={`Ask: ${question}`}
                        >
                          {question}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
          
          {sender === 'user' && (
            <div className="flex-shrink-0 w-6 flex items-center justify-center ml-3">
              <FaUser className="text-white" />
            </div>
          )}
        </div>
        
        <div className={`flex items-center text-xs mt-1 gap-1 ${
          sender === 'user' ? 'text-blue-100 justify-end' : 'text-gray-400'
        }`}>
          <span>{formattedTime}</span>
          {sender === 'user' && isLastMessage && (
            <FaCheckDouble className="text-blue-200" />
          )}
          {sender === 'user' && !isLastMessage && (
            <FaCheck className="text-blue-200" />
          )}
        </div>
      </div>
    </div>
  );
}