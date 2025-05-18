// Import required dependencies for animations and effects
import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Toast component for displaying temporary success/error messages
const Toast = ({ message, type = 'success', onClose, duration = 3000 }) => {
  // Auto-close toast after specified duration
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  // Set background color and icon based on toast type
  const bgColor = type === 'success' ? 'bg-green-500' : 'bg-red-500';
  const icon = type === 'success' ? (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
    </svg>
  ) : (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
    </svg>
  );

  // Render animated toast notification
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -50 }}
        className={`fixed top-4 left-1/2 transform -translate-x-1/2 z-50 ${bgColor} text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-2`}
      >
        {icon}
        <span>{message}</span>
      </motion.div>
    </AnimatePresence>
  );
};

export default Toast; 