"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Monitor, Loader2, Activity, CheckCircle } from 'lucide-react';

interface BootScreenProps {
  onBootComplete: () => void;
}

const BootScreen: React.FC<BootScreenProps> = ({ onBootComplete }) => {
  const [bootStage, setBootStage] = useState(0);
  const [loadingText, setLoadingText] = useState('');
  const [showLogo, setShowLogo] = useState(true);
  const [systemChecks, setSystemChecks] = useState<boolean[]>([]);

  const bootMessages = [
    { text: 'Initializing AI Systems...', icon: Monitor },
    { text: 'Loading Core Modules...', icon: Activity },
    { text: 'PharmOS Ready!', icon: CheckCircle }
  ];

  useEffect(() => {
    const bootSequence = async () => {
      // Reduced logo display time for faster boot
      await new Promise(resolve => setTimeout(resolve, 1000));
      setShowLogo(false);
      
      // Faster boot sequence with reduced delays
      for (let i = 0; i < bootMessages.length; i++) {
        setBootStage(i);
        setLoadingText(bootMessages[i].text);
        
        // Reduced simulation time for faster boot
        await new Promise(resolve => setTimeout(resolve, 300));
        setSystemChecks(prev => [...prev, true]);
        await new Promise(resolve => setTimeout(resolve, 200));
      }
      
      // Minimal delay before showing desktop
      setTimeout(() => {
        onBootComplete();
      }, 300);
    };

    bootSequence();
  }, [onBootComplete]);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black flex flex-col items-center justify-center text-white"
      >
        {showLogo ? (
          /* Custom PharmOS Logo Boot */
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 1.1, opacity: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="flex flex-col items-center"
          >
            {/* Custom Pharmacy Logo */}
            <div className="relative mb-8">
              <motion.div
                className="w-32 h-32 bg-gradient-to-br from-teal-400 via-teal-500 to-teal-600 rounded-3xl flex items-center justify-center shadow-2xl"
                animate={{ 
                  boxShadow: [
                    "0 25px 50px -12px rgba(20, 184, 166, 0.25)",
                    "0 25px 50px -12px rgba(20, 184, 166, 0.5)",
                    "0 25px 50px -12px rgba(20, 184, 166, 0.25)"
                  ]
                }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <svg viewBox="0 0 24 24" className="w-16 h-16 text-white">
                  <path fill="currentColor" d="M19 8h-2v3h-3v2h3v3h2v-3h3v-2h-3V8zM4 6h9v2H4zm0 5h9v2H4zm0 5h9v2H4z"/>
                </svg>
              </motion.div>
              <div className="absolute -inset-4 bg-gradient-to-br from-teal-400/30 to-teal-600/30 rounded-3xl blur-2xl" />
            </div>

            {/* Company Branding */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.8 }}
              className="text-center"
            >
              <h1 className="text-6xl font-bold bg-gradient-to-r from-teal-400 to-teal-600 bg-clip-text text-transparent mb-2">
                PharmOS
              </h1>
              <p className="text-xl text-gray-400 font-light">AI Powered Pharmacy Management System</p>
              <p className="text-sm text-gray-500 mt-2">Powering Healthcare Excellence</p>
              
              {/* AI Robot Greeting */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1.5, duration: 0.8 }}
                className="mt-6 flex items-center justify-center space-x-3"
              >
                <motion.div
                  animate={{ 
                    rotate: [0, 10, -10, 0],
                    scale: [1, 1.1, 1]
                  }}
                  transition={{ 
                    duration: 2, 
                    repeat: Infinity, 
                    ease: "easeInOut" 
                  }}
                  className="w-12 h-12 bg-gradient-to-br from-teal-400 to-blue-500 rounded-full flex items-center justify-center shadow-lg"
                >
                  <span className="text-2xl">🤖</span>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 2, duration: 0.6 }}
                  className="bg-white/10 backdrop-blur-sm rounded-2xl px-4 py-2 border border-white/20"
                >
                  <p className="text-white text-sm font-medium">Hi! I'm your AI assistant 👋</p>
                </motion.div>
              </motion.div>
            </motion.div>

            {/* Loading Indicator */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.2, duration: 0.5 }}
              className="mt-12 flex flex-col items-center"
            >
              <div className="w-64 h-2 bg-gray-800 rounded-full overflow-hidden mb-4">
                <motion.div
                  className="h-full bg-gradient-to-r from-teal-400 to-teal-600 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: "100%" }}
                  transition={{ duration: 1.8, ease: "easeInOut" }}
                />
              </div>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-gray-400 text-sm"
              >
                Initializing System...
              </motion.p>
            </motion.div>
          </motion.div>
        ) : (
          /* PharmOS Logo and Loading */
          <>
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="mb-12"
            >
              <div className="flex flex-col items-center space-y-4">
                <div className="relative">
                  <div className="w-20 h-20 bg-gradient-to-br from-teal-400 to-teal-600 rounded-3xl flex items-center justify-center shadow-2xl">
                    <Monitor className="w-10 h-10 text-white" />
                  </div>
                  <div className="absolute -inset-2 bg-gradient-to-br from-teal-400/20 to-teal-600/20 rounded-3xl blur-xl" />
                </div>
                <div className="text-center">
                  <h1 className="text-5xl font-light text-white mb-2">PharmOS</h1>
                  <p className="text-gray-400 text-lg">Pharmacy Management System</p>
                </div>
              </div>
            </motion.div>

            {/* System Checks Display */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.5 }}
              className="w-full max-w-md space-y-3"
            >
              {bootMessages.map((message, index) => {
                const IconComponent = message.icon;
                const isCompleted = systemChecks[index];
                const isCurrent = bootStage === index;
                
                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: index <= bootStage ? 1 : 0.3, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className={`flex items-center space-x-3 p-3 rounded-lg transition-all duration-300 ${
                      isCurrent ? 'bg-teal-900/30 border border-teal-500/30' : 'bg-gray-900/20'
                    }`}
                  >
                    <div className={`p-2 rounded-lg transition-all duration-300 ${
                      isCompleted ? 'bg-teal-600' : isCurrent ? 'bg-teal-700' : 'bg-gray-700'
                    }`}>
                      {isCompleted ? (
                        <CheckCircle className="w-4 h-4 text-white" />
                      ) : isCurrent ? (
                        <Loader2 className="w-4 h-4 text-white animate-spin" />
                      ) : (
                        <IconComponent className="w-4 h-4 text-gray-400" />
                      )}
                    </div>
                    <div className="flex-1">
                      <p className={`text-sm transition-colors duration-300 ${
                        isCompleted ? 'text-teal-300' : isCurrent ? 'text-white' : 'text-gray-400'
                      }`}>
                        {message.text}
                      </p>
                    </div>
                    {isCompleted && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="text-teal-400"
                      >
                        <CheckCircle className="w-4 h-4" />
                      </motion.div>
                    )}
                  </motion.div>
                );
              })}
            </motion.div>

            {/* Overall Progress */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
              className="mt-8 w-full max-w-md"
            >
              <div className="flex justify-between text-xs text-gray-400 mb-2">
                <span>System Initialization</span>
                <span>{Math.round(((bootStage + 1) / bootMessages.length) * 100)}%</span>
              </div>
              <div className="w-full h-2 bg-gray-800 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-teal-500 to-teal-400 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${((bootStage + 1) / bootMessages.length) * 100}%` }}
                  transition={{ duration: 0.5, ease: "easeOut" }}
                />
              </div>
            </motion.div>

            {/* Version Info */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 2 }}
              className="absolute bottom-8 text-center text-gray-500 text-sm"
            >
              <p>PharmOS v2.0.1</p>
              <p>© 2024 Pharmacy Management Solutions</p>
            </motion.div>
          </>
        )}
      </motion.div>
    </AnimatePresence>
  );
};

export default BootScreen;