"use client";

import { createContext, useContext, useState } from "react";

type ModalContextType = {
  isSignupOpen: boolean;
  openSignup: () => void;
  closeSignup: () => void;
};

const SignUpModalContext = createContext<ModalContextType | undefined>(undefined);

export function SignUpModalProvider({ children }: { children: React.ReactNode }) {
  const [isSignupOpen, setIsSignupOpen] = useState(false);

  const openSignup = () => setIsSignupOpen(true);
  const closeSignup = () => setIsSignupOpen(false);

  return (
    <SignUpModalContext.Provider value={{ isSignupOpen, openSignup, closeSignup }}>
      {children}
    </SignUpModalContext.Provider>
  );
}

export function useSignupModal() {
  const context = useContext(SignUpModalContext);
  if (!context) {
    throw new Error("useSignupModal must be used within SignUpModalProvider");
  }
  return context;
}
