import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Nav from "@/components/Nav";
import Script from "next/script";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Search for Squash Courts Worldwide | SquashHeads",
  description: "Find squash courts, clubs, and players near you. Discover squash courts worldwide, view locations on the map, and connect with the global squash community.",
  icons: {
    icon: "favicon/favicon.ico",
    apple: "favicon/apple-touch-icon.png",
  },
  manifest: "favicon/site.webmanifest",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <Script
          src="https://unpkg.com/maplibre-gl@latest/dist/maplibre-gl.js"
          strategy="beforeInteractive"
        />
        <Nav />
        {children}
      </body>
    </html>
  );
}
