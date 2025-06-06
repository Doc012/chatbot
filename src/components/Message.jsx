import React from 'react';
import { FaRobot, FaUser, FaCheck, FaCheckDouble } from 'react-icons/fa';
import Feedback from './Feedback';

export default function Message({ message, isLastMessage, onSuggestedQuestionClick }) {
  const { text, sender, timestamp = new Date().toISOString(), id = timestamp, suggestedQuestions } = message;
  
  const formattedTime = new Date(timestamp).toLocaleTimeString([], { 
    hour: '2-digit', 
    minute: '2-digit' 
  });

  return (
    <div className={`flex ${sender === 'user' ? 'justify-end' : 'justify-start'}`}>
      <div className={`relative max-w-[80%] p-3 rounded-2xl shadow-sm ${
        sender === 'user' 
          ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-br-none' 
          : 'bg-white text-gray-800 rounded-bl-none'
      }`}>
        <div className="flex items-start gap-2">
          {sender === 'bot' && <FaRobot className="mt-1 text-blue-500 flex-shrink-0" />}
          <p className="text-sm">{text}</p>
          {sender === 'user' && <FaUser className="mt-1 text-white flex-shrink-0" />}
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
        
        {sender === 'bot' && (
          <>
            <Feedback messageId={id} />
            
            {/* Suggested follow-up questions */}
            {suggestedQuestions && suggestedQuestions.length > 0 && (
              <div className="mt-2">
                <p className="text-xs text-gray-500 mb-1">You might want to ask:</p>
                <div className="flex flex-wrap gap-1">
                  {suggestedQuestions.map((question, index) => (
                    <button
                      key={index}
                      onClick={() => onSuggestedQuestionClick(question)}
                      className="text-xs bg-gray-100 hover:bg-gray-200 px-2 py-1 rounded-full text-blue-600 transition-colors"
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
    </div>
  );
}