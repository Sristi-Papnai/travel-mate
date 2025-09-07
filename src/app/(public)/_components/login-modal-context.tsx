"use client";

import { createContext, useContext, useState } from "react";

type ModalContextType = {
  isLoginOpen: boolean;
  openLogin: () => void;
  closeLogin: () => void;
};

const LoginModalContext = createContext<ModalContextType | undefined>(undefined);

export function LoginModalProvider({ children }: { children: React.ReactNode }) {
  const [isLoginOpen, setIsLoginOpen] = useState(false);

  const openLogin = () => setIsLoginOpen(true);
  const closeLogin = () => setIsLoginOpen(false);

  return (
    <LoginModalContext.Provider value={{ isLoginOpen, openLogin, closeLogin }}>
      {children}
    </LoginModalContext.Provider>
  );
}

export function useLoginModal() {
  const context = useContext(LoginModalContext);
  if (!context) {
    throw new Error("useLoginModal must be used within LoginModalProvider");
  }
  return context;
}
