import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export const metadata: Metadata = {
  title: "PricePulse - Smart Price Tracking",
  description: "Automate your shopping with AI-powered price monitoring. Track products across eBay, Best Buy, and Steam with real-time alerts.",
  keywords: ["price tracking", "e-commerce", "deal alerts", "price drop", "shopping"],
  authors: [{ name: "PricePulse" }],
  creator: "PricePulse",
  themeColor: "#0a0a0a",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://pricepulse.dev",
    siteName: "PricePulse",
    title: "PricePulse - Smart Price Tracking",
    description: "Automate your shopping with AI-powered price monitoring.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} font-sans antialiased min-h-screen`}
      >
        {children}
      </body>
    </html>
  );
}
