// Component for handling user login with email authentication
import { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import Toast from "./Toast";

// LoginForm component that handles user authentication and displays success/error messages
const LoginForm = ({ onSuccess, setToast }) => {
  // State management for email input and error handling
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  // Form submission handler that validates email and attempts login
  const handleSubmit = (e) => {
    e.preventDefault();
    // Basic email validation check
    if (!email.includes("@")) {
      setError("Please enter a valid email address.");
      if (setToast) setToast({ show: true, type: 'error', message: 'Login failed: Invalid email address.' });
      return;
    }
    setError("");
    // Attempt to login with provided email
    const success = login(email);
    if (success) {
      // Show success message and redirect after successful login
      if (setToast) setToast({ show: true, type: 'success', message: 'Login successful!' });
      setTimeout(() => {
        if (setToast) setToast({ show: false, type: 'success', message: '' });
        if (onSuccess) onSuccess();
        else navigate("/");
      }, 1500);
    } else {
      // Handle failed login attempt
      setError("No account found. Please sign up first.");
      if (setToast) setToast({ show: true, type: 'error', message: 'No account found. Please sign up first.' });
    }
  };

  // Render login form with email input and submit button
  return (
    <div className="w-full">
      <div className="text-center mb-6">
        <h1 className="text-3xl font-extrabold text-[#1877f2] tracking-tight">Welcome Back</h1>
        <p className="text-sm text-gray-600 mt-1">Log in to explore countries you love</p>
      </div>
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
            Email Address
          </label>
          <input
            id="email"
            type="email"
            placeholder="you@example.com"
            className={`w-full px-4 py-3 rounded-xl border ${error ? "border-red-500" : "border-gray-300"} focus:outline-none focus:ring-2 ${error ? "focus:ring-red-400" : "focus:ring-[#1877f2]"} transition duration-200 shadow-inner`}
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
          className="w-full py-3 rounded-xl font-bold text-lg bg-gradient-to-r from-blue-500 to-blue-700 shadow-md hover:from-blue-600 hover:to-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-400 active:scale-95 transition-all duration-200 text-white"
        >
          Login
        </button>
      </form>
    </div>
  );
};

export default LoginForm; 