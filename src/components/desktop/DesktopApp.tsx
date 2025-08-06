"use client";

import React, { useState, useEffect } from 'react';
import BootScreen from './BootScreen';
import Desktop from './Desktop';
import '@/styles/macos.css';

const DesktopApp: React.FC = () => {
  const [isBooted, setIsBooted] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleBootComplete = () => {
    setIsBooted(true);
  };

  // Mobile fallback - show simplified version
  if (isMobile) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 p-4">
        <div className="max-w-md mx-auto">
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 text-white text-center">
            <div className="mb-6">
              <div className="w-16 h-16 bg-teal-600 rounded-2xl mx-auto mb-4 flex items-center justify-center">
                <span className="text-2xl font-bold">P</span>
              </div>
              <h1 className="text-2xl font-bold">PharmOS</h1>
              <p className="text-teal-300">Pharmacy Management System</p>
            </div>
            
            <div className="space-y-4">
              <p className="text-sm opacity-80">
                For the full desktop experience, please visit on a larger screen.
              </p>
              
              <div className="grid grid-cols-2 gap-3">
                <button className="bg-white/20 hover:bg-white/30 rounded-lg p-3 transition-colors">
                  <div className="text-sm font-medium">Features</div>
                </button>
                <button className="bg-white/20 hover:bg-white/30 rounded-lg p-3 transition-colors">
                  <div className="text-sm font-medium">Pricing</div>
                </button>
                <button className="bg-white/20 hover:bg-white/30 rounded-lg p-3 transition-colors">
                  <div className="text-sm font-medium">Reviews</div>
                </button>
                <button className="bg-white/20 hover:bg-white/30 rounded-lg p-3 transition-colors">
                  <div className="text-sm font-medium">Contact</div>
                </button>
              </div>
              
              <button className="w-full bg-teal-600 hover:bg-teal-700 text-white py-3 rounded-lg font-medium transition-colors">
                Start Free Trial
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen w-screen overflow-hidden">
      {!isBooted ? (
        <BootScreen onBootComplete={handleBootComplete} />
      ) : (
        <Desktop />
      )}
    </div>
  );
};

export default DesktopApp;