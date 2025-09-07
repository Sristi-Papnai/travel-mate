import "./globals.css";

import Script from "next/script";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";

import GoogleAnalyticsScripts from "@/app/_components/google-analytics";
import SonnarToaster from "@/app/_components/sonner-toaster";
import { geologica } from "@/app/_config/fonts";
import { getJsonLd } from "@/app/_config/jsonId";
import { metadata } from "@/app/_config/metadata";
import { viewport } from "@/app/_config/viewport";

import LoginModal from "@/app/(public)/_components/login-modal";
import { LoginModalProvider } from "@/app/(public)/_components/login-modal-context";
import { SignUpModalProvider } from "@/app/(public)/_components/signup-modal-context";
import SignUpModal from "@/app/(public)/_components/signup-modal";
import { ForgotPasswordModalProvider } from "@/app/(public)/_components/forgot-password-modal-context";
import ForgotPasswordModal from "@/app/(public)/_components/forgot-password-modal";

export { metadata, viewport };

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${geologica.variable} font-sans antialiased`}>
        <LoginModalProvider>
          <SignUpModalProvider>
            <ForgotPasswordModalProvider>
            {children}
            <LoginModal /> 
            <SignUpModal />
            <ForgotPasswordModal />
            <SonnarToaster />
            <GoogleAnalyticsScripts />
            <SpeedInsights />
            <Analytics />
            </ForgotPasswordModalProvider>
          </SignUpModalProvider>
        </LoginModalProvider>
        <Script
          id="json-ld"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(getJsonLd()) }}
        />
      </body>
    </html>
  );
}