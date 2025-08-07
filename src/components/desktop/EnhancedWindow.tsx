"use client";

import React, { useState, useRef, useEffect } from 'react';
import { motion, PanInfo } from 'framer-motion';
import { X, Minimize2, Maximize2, Square, MoreHorizontal } from 'lucide-react';

interface WindowProps {
  window: {
    id: string;
    title: string;
    component: React.ReactNode;
    icon: React.ReactNode;
    position: { x: number; y: number };
    size: { width: number; height: number };
    isMinimized: boolean;
    isMaximized: boolean;
    zIndex: number;
  };
  onClose: () => void;
  onMinimize: () => void;
  onMaximize: () => void;
  onBringToFront: () => void;
  onUpdatePosition: (position: { x: number; y: number }) => void;
  onUpdateSize: (size: { width: number; height: number }) => void;
}

const EnhancedWindow: React.FC<WindowProps> = ({
  window,
  onClose,
  onMinimize,
  onMaximize,
  onBringToFront,
  onUpdatePosition,
  onUpdateSize
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [resizeDirection, setResizeDirection] = useState<string>('');
  const windowRef = useRef<HTMLDivElement>(null);

  // Handle window dragging
  const handleDragStart = () => {
    setIsDragging(true);
    onBringToFront();
  };

  const handleDragEnd = (event: any, info: PanInfo) => {
    setIsDragging(false);
    const newX = Math.max(0, Math.min(window.position.x + info.offset.x, window.innerWidth - window.size.width));
    const newY = Math.max(28, Math.min(window.position.y + info.offset.y, window.innerHeight - window.size.height));
    onUpdatePosition({ x: newX, y: newY });
  };

  // Handle window resizing
  const handleResizeStart = (direction: string) => {
    setIsResizing(true);
    setResizeDirection(direction);
    onBringToFront();
  };

  const handleResizeEnd = () => {
    setIsResizing(false);
    setResizeDirection('');
  };

  // Prevent rendering if minimized
  if (window.isMinimized) {
    return null;
  }

  return (
    <motion.div
      ref={windowRef}
      className="absolute bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/30 overflow-hidden"
      style={{
        left: window.position.x,
        top: window.position.y,
        width: window.size.width,
        height: window.size.height,
        zIndex: window.zIndex,
      }}
      initial={{ 
        opacity: 0, 
        scale: 0.8, 
        y: 100,
        rotateX: 15,
        filter: "blur(10px)"
      }}
      animate={{ 
        opacity: 1, 
        scale: 1, 
        y: 0,
        rotateX: 0,
        filter: "blur(0px)",
        transition: { 
          type: "spring", 
          stiffness: 400, 
          damping: 35,
          duration: 0.6,
          ease: [0.25, 0.46, 0.45, 0.94]
        }
      }}
      exit={{ 
        opacity: 0, 
        scale: 0.8, 
        y: -50,
        rotateX: -10,
        filter: "blur(5px)",
        transition: { 
          duration: 0.4,
          ease: [0.55, 0.06, 0.68, 0.19]
        }
      }}
      drag={!window.isMaximized && !isResizing}
      dragMomentum={false}
      dragElastic={0.1}
      dragConstraints={{
        left: -50,
        top: 28,
        right: typeof window !== 'undefined' ? window.innerWidth - window.size.width + 50 : 0,
        bottom: typeof window !== 'undefined' ? window.innerHeight - window.size.height + 50 : 0,
      }}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      whileDrag={{ 
        scale: 1.03,
        rotate: isDragging ? [0, 1, -1, 0] : 0,
        boxShadow: "0 35px 60px -12px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(255, 255, 255, 0.1)",
        transition: { 
          duration: 0.2,
          rotate: { duration: 0.3, repeat: Infinity }
        }
      }}
      whileHover={{
        boxShadow: "0 20px 40px -12px rgba(0, 0, 0, 0.3), 0 0 0 1px rgba(255, 255, 255, 0.1)",
        transition: { duration: 0.3 }
      }}
      onClick={onBringToFront}
    >
      {/* Enhanced Window Header */}
      <motion.div 
        className="flex items-center justify-between p-4 bg-gradient-to-r from-white/95 to-white/85 backdrop-blur-md border-b border-white/30 relative overflow-hidden"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.4 }}
      >
        {/* Subtle animated background */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-blue-500/5 via-purple-500/5 to-teal-500/5"
          animate={{
            backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "linear"
          }}
          style={{ backgroundSize: '200% 100%' }}
        />
        
        <div className="flex items-center space-x-3 relative z-10">
          <motion.div 
            className="w-6 h-6 flex items-center justify-center"
            whileHover={{ rotate: 360, scale: 1.1 }}
            transition={{ duration: 0.5 }}
          >
            {window.icon}
          </motion.div>
          <motion.h3 
            className="font-semibold text-gray-900 text-sm tracking-wide"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2, duration: 0.3 }}
          >
            {window.title}
          </motion.h3>
        </div>
        
        {/* Enhanced Professional Window Controls */}
        <div className="flex items-center space-x-2 relative z-10">
          <motion.button
            className="w-4 h-4 rounded-full bg-gradient-to-br from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 shadow-sm border border-yellow-600/20 flex items-center justify-center group relative overflow-hidden"
            whileHover={{ 
              scale: 1.3,
              boxShadow: "0 4px 12px rgba(245, 158, 11, 0.4)"
            }}
            whileTap={{ scale: 0.9 }}
            onClick={(e) => {
              e.stopPropagation();
              onMinimize();
            }}
            title="Minimize"
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, duration: 0.2 }}
          >
            <motion.div
              className="w-2 h-0.5 bg-yellow-800/60 rounded-full opacity-0 group-hover:opacity-100"
              initial={{ width: 0 }}
              whileHover={{ width: 8 }}
              transition={{ duration: 0.2 }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-yellow-600/20 to-transparent rounded-full" />
          </motion.button>
          
          <motion.button
            className="w-4 h-4 rounded-full bg-gradient-to-br from-green-400 to-green-500 hover:from-green-500 hover:to-green-600 shadow-sm border border-green-600/20 flex items-center justify-center group relative overflow-hidden"
            whileHover={{ 
              scale: 1.3,
              boxShadow: "0 4px 12px rgba(34, 197, 94, 0.4)"
            }}
            whileTap={{ scale: 0.9 }}
            onClick={(e) => {
              e.stopPropagation();
              onMaximize();
            }}
            title={window.isMaximized ? "Restore" : "Maximize"}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.35, duration: 0.2 }}
          >
            <motion.div
              className="opacity-0 group-hover:opacity-100"
              initial={{ scale: 0 }}
              whileHover={{ scale: 1 }}
              transition={{ duration: 0.2 }}
            >
              {window.isMaximized ? (
                <div className="w-1.5 h-1.5 border border-green-800/60 rounded-sm" />
              ) : (
                <div className="w-2 h-2 border border-green-800/60 rounded-sm" />
              )}
            </motion.div>
            <div className="absolute inset-0 bg-gradient-to-t from-green-600/20 to-transparent rounded-full" />
          </motion.button>
          
          <motion.button
            className="w-4 h-4 rounded-full bg-gradient-to-br from-red-400 to-red-500 hover:from-red-500 hover:to-red-600 shadow-sm border border-red-600/20 flex items-center justify-center group relative overflow-hidden"
            whileHover={{ 
              scale: 1.3,
              boxShadow: "0 4px 12px rgba(239, 68, 68, 0.4)"
            }}
            whileTap={{ scale: 0.9 }}
            onClick={(e) => {
              e.stopPropagation();
              onClose();
            }}
            title="Close"
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4, duration: 0.2 }}
          >
            <motion.div
              className="opacity-0 group-hover:opacity-100"
              initial={{ rotate: 0 }}
              whileHover={{ rotate: 90 }}
              transition={{ duration: 0.2 }}
            >
              <X className="w-2 h-2 text-red-800/60" />
            </motion.div>
            <div className="absolute inset-0 bg-gradient-to-t from-red-600/20 to-transparent rounded-full" />
          </motion.button>
        </div>
      </motion.div>

      {/* Window Content */}
      <div className="h-full overflow-hidden">
        <div className="h-full overflow-auto">
          {window.component}
        </div>
      </div>

      {/* Resize Handles (only show when not maximized) */}
      {!window.isMaximized && (
        <>
          {/* Corner resize handles */}
          <div
            className="absolute bottom-0 right-0 w-4 h-4 cursor-se-resize opacity-0 hover:opacity-100 transition-opacity"
            onMouseDown={() => handleResizeStart('se')}
            style={{
              background: 'linear-gradient(-45deg, transparent 30%, rgba(0,0,0,0.1) 30%, rgba(0,0,0,0.1) 70%, transparent 70%)'
            }}
          />
          <div
            className="absolute bottom-0 left-0 w-4 h-4 cursor-sw-resize opacity-0 hover:opacity-100 transition-opacity"
            onMouseDown={() => handleResizeStart('sw')}
            style={{
              background: 'linear-gradient(45deg, transparent 30%, rgba(0,0,0,0.1) 30%, rgba(0,0,0,0.1) 70%, transparent 70%)'
            }}
          />
          <div
            className="absolute top-0 right-0 w-4 h-4 cursor-ne-resize opacity-0 hover:opacity-100 transition-opacity"
            onMouseDown={() => handleResizeStart('ne')}
            style={{
              background: 'linear-gradient(45deg, transparent 30%, rgba(0,0,0,0.1) 30%, rgba(0,0,0,0.1) 70%, transparent 70%)'
            }}
          />
          <div
            className="absolute top-0 left-0 w-4 h-4 cursor-nw-resize opacity-0 hover:opacity-100 transition-opacity"
            onMouseDown={() => handleResizeStart('nw')}
            style={{
              background: 'linear-gradient(-45deg, transparent 30%, rgba(0,0,0,0.1) 30%, rgba(0,0,0,0.1) 70%, transparent 70%)'
            }}
          />

          {/* Edge resize handles */}
          <div
            className="absolute top-0 left-4 right-4 h-1 cursor-n-resize opacity-0 hover:opacity-100 transition-opacity bg-black/10"
            onMouseDown={() => handleResizeStart('n')}
          />
          <div
            className="absolute bottom-0 left-4 right-4 h-1 cursor-s-resize opacity-0 hover:opacity-100 transition-opacity bg-black/10"
            onMouseDown={() => handleResizeStart('s')}
          />
          <div
            className="absolute left-0 top-4 bottom-4 w-1 cursor-w-resize opacity-0 hover:opacity-100 transition-opacity bg-black/10"
            onMouseDown={() => handleResizeStart('w')}
          />
          <div
            className="absolute right-0 top-4 bottom-4 w-1 cursor-e-resize opacity-0 hover:opacity-100 transition-opacity bg-black/10"
            onMouseDown={() => handleResizeStart('e')}
          />
        </>
      )}

      {/* Window Status Indicator */}
      {isDragging && (
        <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-black/80 text-white text-xs px-2 py-1 rounded">
          Moving {window.title}
        </div>
      )}
      
      {isResizing && (
        <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-black/80 text-white text-xs px-2 py-1 rounded">
          Resizing {window.title}
        </div>
      )}
    </motion.div>
  );
};

export default EnhancedWindow;