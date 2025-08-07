"use client";

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, Minimize2, Maximize2 } from 'lucide-react';

interface AIAssistantProps {
  eyePosition: { x: number; y: number };
  isUserTyping: boolean;
  onClose: () => void;
}

const AIAssistant: React.FC<AIAssistantProps> = ({ eyePosition, isUserTyping, onClose }) => {
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<Array<{ type: 'user' | 'ai'; content: string }>>([
    { type: 'ai', content: 'Hello! I\'m your AI pharmacy assistant. How can I help you today?' }
  ]);
  const [inputValue, setInputValue] = useState('');
  const assistantRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Calculate eye direction based on cursor position
  const calculateEyeDirection = () => {
    if (!assistantRef.current) return { x: 0, y: 0 };
    
    const rect = assistantRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    const deltaX = eyePosition.x - centerX;
    const deltaY = eyePosition.y - centerY;
    
    // Limit eye movement range
    const maxDistance = 8;
    const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
    const normalizedX = distance > 0 ? (deltaX / distance) * Math.min(distance / 100, maxDistance) : 0;
    const normalizedY = distance > 0 ? (deltaY / distance) * Math.min(distance / 100, maxDistance) : 0;
    
    return { x: normalizedX, y: normalizedY };
  };

  const eyeDirection = calculateEyeDirection();

  // Focus eyes on input when typing
  const getEyePosition = () => {
    if (isUserTyping && inputRef.current && assistantRef.current) {
      const inputRect = inputRef.current.getBoundingClientRect();
      const assistantRect = assistantRef.current.getBoundingClientRect();
      
      const inputCenterX = inputRect.left + inputRect.width / 2;
      const inputCenterY = inputRect.top + inputRect.height / 2;
      const assistantCenterX = assistantRect.left + assistantRect.width / 2;
      const assistantCenterY = assistantRect.top + assistantRect.height / 2;
      
      const deltaX = inputCenterX - assistantCenterX;
      const deltaY = inputCenterY - assistantCenterY;
      
      const maxDistance = 6;
      const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
      const normalizedX = distance > 0 ? (deltaX / distance) * Math.min(distance / 80, maxDistance) : 0;
      const normalizedY = distance > 0 ? (deltaY / distance) * Math.min(distance / 80, maxDistance) : 0;
      
      return { x: normalizedX, y: normalizedY };
    }
    
    return eyeDirection;
  };

  const currentEyePosition = getEyePosition();

  const handleSendMessage = () => {
    if (!inputValue.trim()) return;
    
    setMessages(prev => [...prev, { type: 'user', content: inputValue }]);
    
    // Simulate AI response
    setTimeout(() => {
      const responses = [
        "I can help you with inventory management, patient records, and prescription tracking.",
        "Would you like me to check the current stock levels or help with billing?",
        "I'm here to assist with any pharmacy management tasks you need.",
        "Let me know if you need help with reports or analytics.",
        "I can guide you through the system features and answer any questions."
      ];
      const randomResponse = responses[Math.floor(Math.random() * responses.length)];
      setMessages(prev => [...prev, { type: 'ai', content: randomResponse }]);
    }, 1000);
    
    setInputValue('');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  if (isMinimized) {
    return (
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        className="fixed bottom-6 right-6 z-50"
      >
        <motion.button
          onClick={() => setIsMinimized(false)}
          className="w-16 h-16 bg-gradient-to-br from-teal-500 to-blue-600 rounded-full shadow-2xl flex items-center justify-center hover:scale-110 transition-transform"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
          {/* AI Avatar Face */}
          <div className="relative">
            <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
              <div className="flex space-x-1">
                <motion.div
                  className="w-2 h-2 bg-white rounded-full"
                  animate={{
                    x: currentEyePosition.x,
                    y: currentEyePosition.y,
                  }}
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
                <motion.div
                  className="w-2 h-2 bg-white rounded-full"
                  animate={{
                    x: currentEyePosition.x,
                    y: currentEyePosition.y,
                  }}
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
              </div>
            </div>
            {/* Notification dot for new messages */}
            <motion.div
              className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          </div>
        </motion.button>
      </motion.div>
    );
  }

  return (
    <motion.div
      ref={assistantRef}
      initial={{ opacity: 0, scale: 0.8, y: 50 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.8, y: 50 }}
      className="fixed bottom-6 right-6 w-96 h-[500px] bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20 z-50 flex flex-col overflow-hidden"
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200/50">
        <div className="flex items-center space-x-3">
          {/* Enhanced AI Avatar */}
          <div className="relative">
            <motion.div
              className="w-12 h-12 bg-gradient-to-br from-teal-500 to-blue-600 rounded-full flex items-center justify-center shadow-lg"
              animate={{
                boxShadow: [
                  "0 4px 20px rgba(20, 184, 166, 0.3)",
                  "0 4px 25px rgba(20, 184, 166, 0.5)",
                  "0 4px 20px rgba(20, 184, 166, 0.3)"
                ]
              }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              {/* Eyes that follow cursor/typing */}
              <div className="flex space-x-1.5">
                <motion.div
                  className="w-2.5 h-2.5 bg-white rounded-full relative"
                  animate={{
                    x: currentEyePosition.x,
                    y: currentEyePosition.y,
                  }}
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                >
                  <div className="absolute inset-0.5 bg-gray-800 rounded-full" />
                </motion.div>
                <motion.div
                  className="w-2.5 h-2.5 bg-white rounded-full relative"
                  animate={{
                    x: currentEyePosition.x,
                    y: currentEyePosition.y,
                  }}
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                >
                  <div className="absolute inset-0.5 bg-gray-800 rounded-full" />
                </motion.div>
              </div>
              
              {/* Mouth animation based on typing */}
              <motion.div
                className="absolute bottom-1 w-3 h-1 bg-white/80 rounded-full"
                animate={isUserTyping ? {
                  scaleX: [1, 1.2, 1],
                  scaleY: [1, 0.8, 1]
                } : {}}
                transition={{ duration: 0.5, repeat: isUserTyping ? Infinity : 0 }}
              />
            </motion.div>
            
            {/* Status indicator */}
            <motion.div
              className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white"
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          </div>
          
          <div>
            <h3 className="font-semibold text-gray-800">AI Assistant</h3>
            <p className="text-xs text-gray-600">
              {isUserTyping ? 'Listening...' : 'Online'}
            </p>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setIsMinimized(true)}
            className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <Minimize2 className="w-4 h-4 text-gray-600" />
          </button>
          <button
            onClick={onClose}
            className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-4 h-4 text-gray-600" />
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        <AnimatePresence>
          {messages.map((message, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] p-3 rounded-2xl ${
                  message.type === 'user'
                    ? 'bg-teal-500 text-white'
                    : 'bg-gray-100 text-gray-800'
                }`}
              >
                <p className="text-sm">{message.content}</p>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Input */}
      <div className="p-4 border-t border-gray-200/50">
        <div className="flex items-center space-x-2">
          <input
            ref={inputRef}
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask me anything about pharmacy management..."
            className="flex-1 px-3 py-2 bg-gray-100 rounded-lg border-none outline-none focus:ring-2 focus:ring-teal-500 text-sm"
          />
          <motion.button
            onClick={handleSendMessage}
            disabled={!inputValue.trim()}
            className="p-2 bg-teal-500 text-white rounded-lg hover:bg-teal-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <MessageCircle className="w-4 h-4" />
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

export default AIAssistant;