import React from "react";
import Modal from "./Modal";
import LoginForm from "./LoginForm";
import { useLoginModal } from "../contexts/LoginModalContext";
import { useAuth } from "../contexts/AuthContext";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

const DEFAULT_MEMOJI = "https://api.dicebear.com/7.x/bottts/svg?seed=default";

const SignupForm = ({ onSuccess }) => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [profileImg, setProfileImg] = useState(DEFAULT_MEMOJI);
  const [error, setError] = useState("");
  const [toast, setToast] = useState({ show: false, type: 'success', message: '' });
  const { signup } = useAuth();

  // Handle image upload
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImg(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Generate random memoji/avatar
  const handleGenerateMemoji = () => {
    const seed = Math.random().toString(36).substring(2, 15);
    setProfileImg(`https://api.dicebear.com/7.x/bottts/svg?seed=${seed}`);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!username.trim()) {
      setError("Please enter a username.");
      setToast({ show: true, type: 'error', message: 'Signup failed: Username required.' });
      return;
    }
    if (!email.includes("@")) {
      setError("Please enter a valid email address.");
      setToast({ show: true, type: 'error', message: 'Signup failed: Invalid email address.' });
      return;
    }
    setError("");
    const success = signup(username, email, profileImg || DEFAULT_MEMOJI);
    if (success) {
      setToast({ show: true, type: 'success', message: 'Signup successful! You can now log in.' });
      setTimeout(() => {
        setToast({ show: false, type: 'success', message: '' });
        if (onSuccess) onSuccess();
      }, 1500);
    } else {
      setError("Email already registered. Please log in.");
      setToast({ show: true, type: 'error', message: 'Email already registered. Please log in.' });
    }
  };

  return (
    <div className="w-full">
      <div className="text-center mb-6">
        <h1 className="text-3xl font-extrabold text-green-600 tracking-tight">Create Account</h1>
        <p className="text-sm text-gray-600 mt-1">Sign up to explore countries you love</p>
      </div>
      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="flex flex-col items-center gap-2 mb-2">
          <img
            src={profileImg || DEFAULT_MEMOJI}
            alt="Profile Preview"
            className="w-20 h-20 rounded-full object-cover border-2 border-green-300 shadow"
          />
          <div className="flex gap-2 mt-1">
            <label className="cursor-pointer bg-green-100 text-green-700 px-3 py-1 rounded text-xs font-semibold hover:bg-green-200 transition">
              Upload Image
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleImageChange}
              />
            </label>
            <button
              type="button"
              onClick={handleGenerateMemoji}
              className="bg-green-100 text-green-700 px-3 py-1 rounded text-xs font-semibold hover:bg-green-200 transition"
            >
              Generate Memoji
            </button>
          </div>
        </div>
        <div>
          <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
            Username
          </label>
          <input
            id="username"
            type="text"
            placeholder="Your username"
            className={`w-full px-4 py-3 rounded-xl border ${error ? "border-red-500" : "border-green-300"} focus:outline-none focus:ring-2 ${error ? "focus:ring-red-400" : "focus:ring-green-400"} transition duration-200 shadow-inner`}
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
            Email Address
          </label>
          <input
            id="email"
            type="email"
            placeholder="you@example.com"
            className={`w-full px-4 py-3 rounded-xl border ${error ? "border-red-500" : "border-green-300"} focus:outline-none focus:ring-2 ${error ? "focus:ring-red-400" : "focus:ring-green-400"} transition duration-200 shadow-inner`}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          {error && (
            <p className="text-sm text-red-500 mt-1">{error}</p>
          )}
        </div>
        <button
          type="submit"
          className="w-full bg-green-600 text-white py-3 rounded-xl font-semibold hover:bg-green-800 hover:shadow-xl transition duration-200"
        >
          Sign Up
        </button>
      </form>
    </div>
  );
};

const formVariants = {
  initial: { opacity: 0, x: 40 },
  animate: { opacity: 1, x: 0, transition: { duration: 0.35, type: "spring", stiffness: 200 } },
  exit: { opacity: 0, x: -40, transition: { duration: 0.25 } },
};

const AuthModal = () => {
  const { isOpen, closeLoginModal, mode, setMode } = useLoginModal();

  return (
    <Modal isOpen={isOpen} onClose={closeLoginModal}>
      <button
        onClick={closeLoginModal}
        aria-label="Close"
        className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 text-2xl font-bold z-50 focus:outline-none"
        style={{ lineHeight: 1 }}
      >
        &times;
      </button>
      <div className="flex justify-center mb-6">
        <button
          className={`px-6 py-2 rounded-t-lg font-semibold transition-colors duration-200 focus:outline-none ${mode === "login" ? "bg-blue-100 text-blue-700" : "bg-gray-100 text-gray-500"}`}
          onClick={() => setMode("login")}
        >
          Login
        </button>
        <button
          className={`px-6 py-2 rounded-t-lg font-semibold transition-colors duration-200 focus:outline-none ${mode === "signup" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}
          onClick={() => setMode("signup")}
        >
          Sign Up
        </button>
      </div>
      <div className="p-1 min-h-[340px]">
        <AnimatePresence mode="wait" initial={false}>
          {mode === "login" ? (
            <motion.div
              key="login"
              variants={formVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              className="w-full"
            >
              <LoginForm onSuccess={closeLoginModal} />
              <p className="text-xs text-center text-gray-500 mt-6">
                Country Explorer by <span className="text-[#1877f2] font-medium">Lasiru Minruk</span>
              </p>
            </motion.div>
          ) : (
            <motion.div
              key="signup"
              variants={formVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              className="w-full"
            >
              <SignupForm onSuccess={() => setMode("login")} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </Modal>
  );
};

export default AuthModal; 