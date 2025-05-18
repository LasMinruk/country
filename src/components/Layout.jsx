import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useFavorites } from "../contexts/FavoritesContext";
import { useAuth } from "../contexts/AuthContext";
import { FaHeart, FaUser, FaSignOutAlt, FaGlobe, FaChartBar, FaHome, FaClock } from "react-icons/fa";
import { useLoginModal } from "../contexts/LoginModalContext";
import AuthModal from "./AuthModal";

const DEFAULT_MEMOJI = "https://api.dicebear.com/7.x/bottts/svg?seed=default";

const navVariants = {
  hidden: { opacity: 0, y: -20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, type: "spring" } },
};
const linkVariants = {
  hidden: { opacity: 0, y: -10 },
  visible: (i) => ({ opacity: 1, y: 0, transition: { delay: 0.1 + i * 0.08 } }),
  hover: { scale: 1.08, color: "#7c3aed" },
};

const navLinks = [
  { to: "/", label: "Home", icon: <FaHome /> },
  { to: "/favorites", label: "Favorites", icon: <FaHeart />, showBadge: true },
  { to: "/live-timer", label: "Live Timer", icon: <FaClock /> },
  { to: "/comparison", label: "Comparison", icon: <FaChartBar /> },
];

const Layout = ({ children }) => {
  const { favorites } = useFavorites();
  const { currentUser, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [navOpen, setNavOpen] = useState(false);
  const { openLoginModal } = useLoginModal();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex flex-col">
      {/* Header (hidden on mobile) */}
      <motion.header
        initial="hidden"
        animate="visible"
        variants={navVariants}
        className="bg-white sticky top-0 z-50 shadow-sm border-b border-gray-200 hidden sm:block"
      >
        <div className="max-w-7xl mx-auto px-2 sm:px-4 py-3 sm:py-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-2 sm:gap-0">
            {/* Brand */}
            <Link
              to="/"
              className="group flex items-center space-x-2 mb-2 sm:mb-0"
            >
              <motion.div
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.5 }}
                className="w-8 h-8 bg-[#1877f2] rounded-lg flex items-center justify-center"
              >
                <FaGlobe className="text-white text-lg" />
              </motion.div>
              <span className="text-lg sm:text-2xl font-bold text-[#1877f2] group-hover:text-blue-800 transition-all duration-300">
                Country Explorer
              </span>
            </Link>

            {/* Responsive Nav */}
            <nav className="w-full sm:w-auto">
              <button
                className="sm:hidden p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                onClick={() => setNavOpen(!navOpen)}
                aria-label="Toggle navigation menu"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
              <AnimatePresence>
                {navOpen && (
                  <motion.ul
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3, type: "spring" }}
                    className="sm:hidden bg-white rounded-lg shadow p-4 absolute left-0 right-0 z-40 mt-2"
                  >
                    {navLinks.map((link, i) => (
                      <motion.li
                        key={link.to}
                        custom={i}
                        initial="hidden"
                        animate="visible"
                        whileHover="hover"
                        variants={linkVariants}
                        className="inline-block relative"
                      >
                        <Link
                          to={link.to}
                          className={`block px-4 py-2 text-gray-700 font-medium transition-colors duration-200 ${location.pathname === link.to ? "text-[#1877f2] font-bold border-b-2 border-[#1877f2]" : "hover:text-[#1877f2]"}`}
                          onClick={() => setNavOpen(false)}
                        >
                          {link.label}
                          {link.showBadge && favorites.length > 0 && (
                            <span className="absolute -top-1 -right-2 bg-red-500 text-white text-xs font-bold rounded-full px-1.5 py-0.5 min-w-[20px] text-center shadow border border-white">
                              {favorites.length}
                            </span>
                          )}
                        </Link>
                      </motion.li>
                    ))}
                  </motion.ul>
                )}
              </AnimatePresence>
              <ul className="hidden sm:flex sm:items-center sm:gap-4 mt-2 sm:mt-0 bg-transparent p-0 static">
                {navLinks.map((link, i) => (
                  <motion.li
                    key={link.to}
                    custom={i}
                    initial="hidden"
                    animate="visible"
                    whileHover="hover"
                    variants={linkVariants}
                    className="inline-block relative"
                  >
                    <Link
                      to={link.to}
                      className={`block px-4 py-2 text-gray-700 font-medium transition-colors duration-200 ${location.pathname === link.to ? "text-[#1877f2] font-bold border-b-2 border-[#1877f2]" : "hover:text-[#1877f2]"}`}
                    >
                      {link.icon} <span className="ml-1">{link.label}</span>
                      {link.showBadge && favorites.length > 0 && (
                        <span className="absolute -top-1 -right-2 bg-red-500 text-white text-xs font-bold rounded-full px-1.5 py-0.5 min-w-[20px] text-center shadow border border-white">
                          {favorites.length}
                        </span>
                      )}
                    </Link>
                  </motion.li>
                ))}
              </ul>
            </nav>

            <div className="flex items-center gap-2 sm:gap-4 mt-2 sm:mt-0">
              {/* Auth Buttons */}
              {currentUser ? (
                <>
                  <img
                    src={currentUser.profileImg || DEFAULT_MEMOJI}
                    alt="Profile"
                    className="w-9 h-9 rounded-full object-cover border-2 border-blue-200 shadow cursor-pointer hover:scale-105 transition-transform duration-200"
                    title={currentUser.username}
                  />
                  <motion.button
                    onClick={() => {
                      logout();
                    }}
                    className="flex items-center gap-2 bg-[#1877f2] text-white px-4 py-2 rounded-full text-sm font-medium shadow-sm hover:shadow-md transition-all duration-300"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <FaSignOutAlt />
                    <span>Logout</span>
                  </motion.button>
                </>
              ) : (
                <button
                  onClick={openLoginModal}
                  className="flex items-center gap-2 bg-[#1877f2] text-white px-4 py-2 rounded-full text-sm font-medium shadow-sm hover:shadow-md transition-all duration-300"
                >
                  <FaUser />
                  <span>Login</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </motion.header>

      {/* Bottom Nav for Mobile */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 shadow flex sm:hidden justify-around py-2">
        {navLinks.map((link, i) => (
          <Link
            key={link.to}
            to={link.to}
            className={`flex flex-col items-center text-xs px-2 ${location.pathname === link.to ? 'text-blue-600 font-bold' : 'text-gray-500'}`}
          >
            <span className="text-lg mb-0.5">{link.icon}</span>
            {link.showBadge && favorites.length > 0 && (
              <span className="absolute top-1 right-2 bg-red-500 text-white text-xs font-bold rounded-full px-1.5 py-0.5 min-w-[20px] text-center shadow border border-white">
                {favorites.length}
              </span>
            )}
            {link.label}
          </Link>
        ))}
        {currentUser ? (
          <img
            src={currentUser.profileImg || DEFAULT_MEMOJI}
            alt="Profile"
            className="w-8 h-8 rounded-full object-cover border-2 border-blue-200 shadow cursor-pointer"
            title={currentUser.username}
          />
        ) : (
          <button
            onClick={openLoginModal}
            className="flex flex-col items-center text-xs px-2 text-gray-500"
          >
            <span className="text-lg mb-0.5"><FaUser /></span>
            Login
          </button>
        )}
      </nav>

      {/* Main Content */}
      <main className="flex-grow max-w-7xl mx-auto w-full px-2 sm:px-4 py-4 sm:py-8 mb-16 sm:mb-0">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {children}
        </motion.div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 py-4">
        <div className="max-w-7xl mx-auto px-2 sm:px-4">
          <div className="text-center text-xs sm:text-sm text-gray-600">
            <p>© {new Date().getFullYear()} Country Explorer</p>
            <p className="mt-1">Created by Lasiru Minruk</p>
          </div>
        </div>
      </footer>
      <AuthModal />
    </div>
  );
};

export default Layout;
