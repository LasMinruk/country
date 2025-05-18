import React, { createContext, useContext, useState, useEffect } from "react";

// Create authentication context
const AuthContext = createContext();

// Provider component for managing user authentication
export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("currentUser"));
    if (user) setCurrentUser(user);
  }, []);

  const signup = (username, email, profileImg) => {
    const users = JSON.parse(localStorage.getItem("users") || "[]");
    if (users.find((u) => u.email === email)) return false;
    const newUser = { username, email, profileImg };
    users.push(newUser);
    localStorage.setItem("users", JSON.stringify(users));
    return true;
  };

  const login = (email) => {
    const users = JSON.parse(localStorage.getItem("users") || "[]");
    const user = users.find((u) => u.email === email);
    if (user) {
      setCurrentUser(user);
      localStorage.setItem("currentUser", JSON.stringify(user));
      return true;
    }
    return false;
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem("currentUser");
  };

  return (
    <AuthContext.Provider value={{ currentUser, login, logout, signup }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use auth context
export const useAuth = () => useContext(AuthContext);
