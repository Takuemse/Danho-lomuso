// src/app/layout.tsx
import type { Metadata, Viewport } from "next";
import { Fraunces, Plus_Jakarta_Sans } from "next/font/google";
import SessionWrapper from "@/components/SessionWrapper";
import "./globals.css";

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-serif",
  display: "swap",
  weight: ["300", "400", "500", "600", "700", "900"],
});

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
  weight: ["300", "400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: {
    default: "Danho Lomuso — Bridge to Your Future",
    template: "%s | Danho Lomuso",
  },
  description:
    "AI-powered life and career guidance for Zimbabwe's youth. Talk to Zoe, explore career paths, and unlock your potential.",
  keywords: ["Zimbabwe", "career guidance", "ZIMSEC", "education", "Zoe AI", "youth"],
  authors: [{ name: "Danho Lomuso" }],
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Danho Lomuso",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#0D4429",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${fraunces.variable} ${plusJakarta.variable}`}>
      <head>
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.6.0/css/all.min.css"
          crossOrigin="anonymous"
        />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body
        className="font-sans antialiased"
        style={{ backgroundColor: "#FFFDF9" }}
        suppressHydrationWarning
      >
        <SessionWrapper>{children}</SessionWrapper>
      </body>
    </html>
  );
}