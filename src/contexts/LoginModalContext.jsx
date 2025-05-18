import React, { createContext, useContext, useState, useCallback } from "react";

const LoginModalContext = createContext();

export const useLoginModal = () => useContext(LoginModalContext);

export const LoginModalProvider = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [mode, setMode] = useState("login"); // 'login' or 'signup'

  const openLoginModal = useCallback(() => {
    setMode("login");
    setIsOpen(true);
  }, []);
  const openSignupModal = useCallback(() => {
    setMode("signup");
    setIsOpen(true);
  }, []);
  const closeLoginModal = useCallback(() => setIsOpen(false), []);

  return (
    <LoginModalContext.Provider value={{ isOpen, openLoginModal, openSignupModal, closeLoginModal, mode, setMode }}>
      {children}
    </LoginModalContext.Provider>
  );
}; 