import type { Metadata, Viewport } from "next";
import "./globals.css";
import { ThemeProvider } from "@/contexts/ThemeContext";
import InstallPrompt from "@/components/InstallPrompt";
import ServiceWorkerRegistration from "@/components/ServiceWorkerRegistration";
import UserSessionCheck from "@/components/UserSessionCheck";

export const metadata: Metadata = {
  title: "Trust Vault - Your Crypto. Your Control.",
  description: "Secure cryptocurrency wallet with full control over your assets",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Trust Vault",
  },
  icons: {
    icon: "/icon.png",
    apple: "/icon.png",
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: '#4938F5',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <link rel="apple-touch-icon" href="/icon.png" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="Trust Vault" />
      </head>
      <body>
        <ThemeProvider>
          <ServiceWorkerRegistration />
          <UserSessionCheck />
          <InstallPrompt />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
