"use client";

import { createContext, useContext, useState } from "react";

type DialogContextType = {
  isLoginOpen: boolean;
  openLogin: () => void;
  closeLogin: () => void;

  isSignupOpen: boolean;
  openSignup: () => void;
  closeSignup: () => void;

  isForgotOpen: boolean;
  openForgot: () => void;
  closeForgot: () => void;
};

const DialogContext = createContext<DialogContextType | undefined>(undefined);

export function DialogProvider({ children }: { children: React.ReactNode }) {
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isSignupOpen, setIsSignupOpen] = useState(false);
  const [isForgotOpen, setIsForgotOpen] = useState(false);

  const openLogin = () => setIsLoginOpen(true);
  const closeLogin = () => setIsLoginOpen(false);

  const openSignup = () => setIsSignupOpen(true);
  const closeSignup = () => setIsSignupOpen(false);

  const openForgot = () => setIsForgotOpen(true);
  const closeForgot = () => setIsForgotOpen(false);

  return (
    <DialogContext.Provider
      value={{
        isLoginOpen,
        openLogin,
        closeLogin,
        isSignupOpen,
        openSignup,
        closeSignup,
        isForgotOpen,
        openForgot,
        closeForgot,
      }}
    >
      {children}
    </DialogContext.Provider>
  );
}

export function useDialog() {
  const context = useContext(DialogContext);
  if (!context) {
    throw new Error("useDialog must be used within DialogProvider");
  }
  return context;
}
