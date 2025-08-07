"use client";

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  CheckCircle,
  AlertTriangle,
  XCircle,
  Info,
  X,
  Clock,
  Bell,
  Zap
} from 'lucide-react';
import { PharmacyNotification } from './NotificationCenter';

interface NotificationToastProps {
  notification: PharmacyNotification;
  onDismiss: (id: string) => void;
  onAction?: (id: string, actionIndex: number) => void;
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left' | 'top-center';
  autoHideDuration?: number;
}

const NotificationToast: React.FC<NotificationToastProps> = ({
  notification,
  onDismiss,
  onAction,
  position = 'top-right',
  autoHideDuration = 5000
}) => {
  const [isVisible, setIsVisible] = useState(true);
  const [progress, setProgress] = useState(100);

  useEffect(() => {
    if (autoHideDuration > 0 && notification.priority !== 'critical') {
      const interval = setInterval(() => {
        setProgress(prev => {
          const newProgress = prev - (100 / (autoHideDuration / 100));
          if (newProgress <= 0) {
            clearInterval(interval);
            handleDismiss();
            return 0;
          }
          return newProgress;
        });
      }, 100);

      return () => clearInterval(interval);
    }
  }, [autoHideDuration, notification.priority]);

  const handleDismiss = () => {
    setIsVisible(false);
    setTimeout(() => onDismiss(notification.id), 300);
  };

  const getIcon = () => {
    const iconClass = "w-6 h-6";
    switch (notification.type) {
      case 'success':
        return <CheckCircle className={`${iconClass} text-green-500`} />;
      case 'warning':
        return <AlertTriangle className={`${iconClass} text-yellow-500`} />;
      case 'error':
        return <XCircle className={`${iconClass} text-red-500`} />;
      case 'prescription':
        return <Clock className={`${iconClass} text-blue-500`} />;
      case 'inventory':
        return <AlertTriangle className={`${iconClass} text-orange-500`} />;
      case 'patient':
        return <Info className={`${iconClass} text-purple-500`} />;
      default:
        return <Bell className={`${iconClass} text-gray-500`} />;
    }
  };

  const getColorScheme = () => {
    switch (notification.type) {
      case 'success':
        return {
          bg: 'bg-green-50 border-green-200',
          accent: 'bg-green-500',
          text: 'text-green-800',
          subtext: 'text-green-600'
        };
      case 'warning':
        return {
          bg: 'bg-yellow-50 border-yellow-200',
          accent: 'bg-yellow-500',
          text: 'text-yellow-800',
          subtext: 'text-yellow-600'
        };
      case 'error':
        return {
          bg: 'bg-red-50 border-red-200',
          accent: 'bg-red-500',
          text: 'text-red-800',
          subtext: 'text-red-600'
        };
      case 'prescription':
        return {
          bg: 'bg-blue-50 border-blue-200',
          accent: 'bg-blue-500',
          text: 'text-blue-800',
          subtext: 'text-blue-600'
        };
      case 'inventory':
        return {
          bg: 'bg-orange-50 border-orange-200',
          accent: 'bg-orange-500',
          text: 'text-orange-800',
          subtext: 'text-orange-600'
        };
      case 'patient':
        return {
          bg: 'bg-purple-50 border-purple-200',
          accent: 'bg-purple-500',
          text: 'text-purple-800',
          subtext: 'text-purple-600'
        };
      default:
        return {
          bg: 'bg-gray-50 border-gray-200',
          accent: 'bg-gray-500',
          text: 'text-gray-800',
          subtext: 'text-gray-600'
        };
    }
  };

  const getPositionClasses = () => {
    switch (position) {
      case 'top-right':
        return 'top-4 right-4';
      case 'top-left':
        return 'top-4 left-4';
      case 'bottom-right':
        return 'bottom-4 right-4';
      case 'bottom-left':
        return 'bottom-4 left-4';
      case 'top-center':
        return 'top-4 left-1/2 transform -translate-x-1/2';
      default:
        return 'top-4 right-4';
    }
  };

  const getAnimationVariants = () => {
    const isTop = position.includes('top');
    const isRight = position.includes('right');
    const isCenter = position.includes('center');

    return {
      initial: {
        opacity: 0,
        scale: 0.8,
        x: isCenter ? 0 : isRight ? 100 : -100,
        y: isTop ? -100 : 100,
        rotate: isRight ? 10 : -10
      },
      animate: {
        opacity: 1,
        scale: 1,
        x: 0,
        y: 0,
        rotate: 0
      },
      exit: {
        opacity: 0,
        scale: 0.8,
        x: isCenter ? 0 : isRight ? 100 : -100,
        y: isTop ? -50 : 50,
        rotate: isRight ? 5 : -5
      }
    };
  };

  const colorScheme = getColorScheme();
  const variants = getAnimationVariants();

  if (!isVisible) return null;

  return (
    <motion.div
      className={`fixed z-50 ${getPositionClasses()}`}
      variants={variants}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={{
        type: "spring",
        stiffness: 400,
        damping: 30,
        duration: 0.5
      }}
    >
      <div
        className={`
          relative max-w-sm w-full ${colorScheme.bg} border-2 rounded-xl shadow-2xl 
          backdrop-blur-sm overflow-hidden
          ${notification.priority === 'critical' ? 'ring-4 ring-red-500/50 animate-pulse' : ''}
        `}
      >
        {/* Priority indicator */}
        {notification.priority === 'critical' && (
          <motion.div
            className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-red-500 via-yellow-500 to-red-500"
            animate={{
              backgroundPosition: ['0% 50%', '100% 50%', '0% 50%']
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "linear"
            }}
            style={{ backgroundSize: '200% 100%' }}
          />
        )}

        {/* Progress bar for auto-hide */}
        {autoHideDuration > 0 && notification.priority !== 'critical' && (
          <div className="absolute top-0 left-0 right-0 h-1 bg-gray-200">
            <motion.div
              className={`h-full ${colorScheme.accent}`}
              style={{ width: `${progress}%` }}
              transition={{ duration: 0.1 }}
            />
          </div>
        )}

        <div className="p-4">
          <div className="flex items-start space-x-3">
            {/* Icon with animation */}
            <motion.div
              className="flex-shrink-0 mt-0.5"
              animate={notification.priority === 'critical' ? {
                scale: [1, 1.2, 1],
                rotate: [0, 10, -10, 0]
              } : {}}
              transition={{
                duration: 1,
                repeat: notification.priority === 'critical' ? Infinity : 0
              }}
            >
              {getIcon()}
            </motion.div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h4 className={`text-sm font-semibold ${colorScheme.text} leading-tight`}>
                    {notification.title}
                    {notification.priority === 'critical' && (
                      <motion.span
                        className="ml-2 inline-flex items-center"
                        animate={{ scale: [1, 1.1, 1] }}
                        transition={{ duration: 1, repeat: Infinity }}
                      >
                        <Zap className="w-4 h-4 text-red-500" />
                      </motion.span>
                    )}
                  </h4>
                  <p className={`text-sm ${colorScheme.subtext} mt-1 leading-relaxed`}>
                    {notification.message}
                  </p>

                  {/* Metadata */}
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-xs text-gray-500">
                      {new Date(notification.timestamp).toLocaleTimeString()}
                    </span>
                    <div className="flex items-center space-x-2">
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        notification.priority === 'critical' ? 'bg-red-100 text-red-700' :
                        notification.priority === 'high' ? 'bg-orange-100 text-orange-700' :
                        notification.priority === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-blue-100 text-blue-700'
                      }`}>
                        {notification.priority}
                      </span>
                    </div>
                  </div>

                  {/* Action buttons */}
                  {notification.actions && notification.actions.length > 0 && (
                    <div className="flex space-x-2 mt-3">
                      {notification.actions.slice(0, 2).map((action, index) => (
                        <motion.button
                          key={index}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => onAction?.(notification.id, index)}
                          className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all duration-200 ${
                            action.variant === 'primary' 
                              ? `${colorScheme.accent} text-white hover:opacity-90 shadow-md` :
                            action.variant === 'danger' 
                              ? 'bg-red-600 text-white hover:bg-red-700 shadow-md' :
                              'bg-white/80 text-gray-700 hover:bg-white border border-gray-200'
                          }`}
                        >
                          {action.label}
                        </motion.button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Close button */}
                <motion.button
                  whileHover={{ scale: 1.1, rotate: 90 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={handleDismiss}
                  className="flex-shrink-0 p-1.5 rounded-full hover:bg-white/50 transition-colors ml-2"
                >
                  <X className="w-4 h-4 text-gray-500" />
                </motion.button>
              </div>
            </div>
          </div>
        </div>

        {/* Glow effect for critical notifications */}
        {notification.priority === 'critical' && (
          <motion.div
            className="absolute inset-0 rounded-xl pointer-events-none"
            animate={{
              boxShadow: [
                '0 0 0 0 rgba(239, 68, 68, 0.4)',
                '0 0 0 10px rgba(239, 68, 68, 0)',
                '0 0 0 0 rgba(239, 68, 68, 0)'
              ]
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        )}
      </div>
    </motion.div>
  );
};

// Toast Container Component
interface NotificationToastContainerProps {
  notifications: PharmacyNotification[];
  onDismiss: (id: string) => void;
  onAction?: (id: string, actionIndex: number) => void;
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left' | 'top-center';
  maxToasts?: number;
}

export const NotificationToastContainer: React.FC<NotificationToastContainerProps> = ({
  notifications,
  onDismiss,
  onAction,
  position = 'top-right',
  maxToasts = 5
}) => {
  // Show only recent unread notifications as toasts
  const toastNotifications = notifications
    .filter(n => !n.isRead && !n.isArchived)
    .slice(0, maxToasts)
    .reverse(); // Show newest first

  return (
    <div className="fixed inset-0 pointer-events-none z-50">
      <AnimatePresence mode="popLayout">
        {toastNotifications.map((notification, index) => (
          <motion.div
            key={notification.id}
            layout
            style={{
              zIndex: 50 + index
            }}
            className="pointer-events-auto"
          >
            <NotificationToast
              notification={notification}
              onDismiss={onDismiss}
              onAction={onAction}
              position={position}
              autoHideDuration={notification.priority === 'critical' ? 0 : 5000}
            />
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};

export default NotificationToast;