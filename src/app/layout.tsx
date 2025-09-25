import "./globals.css";

import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import Script from "next/script";

import ForgotPasswordModal from "@/app/(public)/_components/dialogs/auth/forgot-password-modal";
import LoginModal from "@/app/(public)/_components/dialogs/auth/login-modal";
import SignUpModal from "@/app/(public)/_components/dialogs/auth/signup-modal";
import GoogleAnalyticsScripts from "@/app/_components/google-analytics";
import SonnarToaster from "@/app/_components/sonner-toaster";
import { geologica } from "@/app/_config/fonts";
import { getJsonLd } from "@/app/_config/jsonId";
import { metadata } from "@/app/_config/metadata";
import { viewport } from "@/app/_config/viewport";
import { DialogProvider } from "@/context/dialog-context";

import AuthProvider from "@/app/providers/session-provider";

export { metadata, viewport };

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${geologica.variable} font-sans antialiased`}>
        <AuthProvider>
          <DialogProvider>
              {/* <Navbar /> */}
              {children}
              <LoginModal /> 
              <SignUpModal />
              <ForgotPasswordModal />
              <SonnarToaster />
              <GoogleAnalyticsScripts />
              <SpeedInsights />
              <Analytics />
          </DialogProvider>
        </AuthProvider>
        <Script
          id="json-ld"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(getJsonLd()) }}
        />
      </body>
    </html>
  );
}