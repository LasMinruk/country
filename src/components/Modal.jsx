// Reusable modal component with smooth animations using Framer Motion
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Animation configuration for the backdrop (overlay)
const backdropVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.2 } },
  exit: { opacity: 0, transition: { duration: 0.2 } },
};

// Animation configuration for the modal content
const modalVariants = {
  hidden: { opacity: 0, scale: 0.95, y: 40 },
  visible: { opacity: 1, scale: 1, y: 0, transition: { duration: 0.25, type: 'spring', stiffness: 300 } },
  exit: { opacity: 0, scale: 0.95, y: 40, transition: { duration: 0.2 } },
};

// Modal component that provides a centered overlay with animated content
const Modal = ({ isOpen, onClose, children }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        // Main container for the modal and backdrop
        <motion.div
          className="fixed inset-0 flex items-center justify-center z-50"
          initial="hidden"
          animate="visible"
          exit="exit"
          variants={backdropVariants}
        >
          {/* Semi-transparent backdrop with blur effect */}
          <motion.div
            className="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-sm"
            onClick={onClose}
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={backdropVariants}
          />
          {/* Modal content container with animations */}
          <motion.div
            className="relative z-10 w-full max-w-md mx-2 sm:mx-4 bg-white bg-opacity-90 rounded-xl shadow-2xl p-0 overflow-hidden flex flex-col
              flex-shrink-0 flex-grow-0
              max-h-screen overflow-y-auto"
            style={{ maxHeight: '95vh' }}
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={modalVariants}
          >
            {/* Scrollable content area */}
            <div className="flex-1 overflow-y-auto px-4 py-6 sm:p-6">
              {children}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Modal; 