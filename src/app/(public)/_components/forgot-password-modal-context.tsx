"use client";

import { createContext, useContext, useState } from "react";

type ForgotPasswordContextType = {
  isForgotOpen: boolean;
  openForgot: () => void;
  closeForgot: () => void;
};

const ForgotPasswordContext = createContext<ForgotPasswordContextType | undefined>(
  undefined
);

export function ForgotPasswordModalProvider({ children }: { children: React.ReactNode }) {
  const [isForgotOpen, setIsForgotOpen] = useState(false);

  const openForgot = () => setIsForgotOpen(true);
  const closeForgot = () => setIsForgotOpen(false);

  return (
    <ForgotPasswordContext.Provider value={{ isForgotOpen, openForgot, closeForgot }}>
      {children}
    </ForgotPasswordContext.Provider>
  );
}

export function useForgotPasswordModal() {
  const context = useContext(ForgotPasswordContext);
  if (!context) {
    throw new Error("useForgotPasswordModal must be used within ForgotPasswordModalProvider");
  }
  return context;
}
