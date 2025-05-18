// Import React and required dependencies
import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

// 404 Not Found page component
const NotFound = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen flex flex-col justify-center items-center bg-gray-100 px-6 text-center"
    >
      <h1 className="text-6xl font-bold text-blue-600 mb-4">404</h1>
      <p className="text-xl text-gray-700 mb-2">Oops! Page Not Found</p>
      <p className="text-sm text-gray-500 mb-6">
        The page you are looking for doesn't exist or has been moved.
      </p>
      <Link
        to="/"
        className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-3 rounded-lg transition"
      >
        ⬅️ Back to Home
      </Link>
    </motion.div>
  );
};

export default NotFound;
