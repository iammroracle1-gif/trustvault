import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Trust Vault - Your Crypto. Your Control.",
  description: "Secure cryptocurrency wallet with full control over your assets",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
