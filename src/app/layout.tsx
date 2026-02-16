import type { Metadata } from "next";
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

export const metadata: Metadata = {
  title: {
    default: "Brevard Coin Club",
    template: "%s | Brevard Coin Club",
  },
  description:
    "A modern coin club web platform with secure member classifieds, authentication, and marketplace features.",
  openGraph: {
    type: "website",
    siteName: "Brevard Coin Club",
    title: {
      default: "Brevard Coin Club",
      template: "%s | Brevard Coin Club",
    },
    description:
      "Secure buy, sell, and trade marketplace for coin collectors.",
  },

};




export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      style={{
        backgroundImage:
          'linear-gradient(rgba(0,0,0,.55), rgba(0,0,0,.70)), url("/textures/brushed-metal.png")',
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        backgroundAttachment: "fixed",
      }}
    >
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen text-white`}
        style={{ background: "transparent" }}
      >
        {children}
      </body>
    </html>
  );
}

