import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "react-hot-toast";
import { Providers } from "@/components/providers";


const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Frankly — Honest, anonymous feedback",
  description: "Receive honest, constructive feedback and questions from your circle through your personal shareable link. Clean, responsive, and secure.",
   icons: {
    icon: "/icon.png",
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
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
       <body
        className={`${geistSans.variable} ${geistMono.variable} min-h-screen bg-background text-foreground bg-grid-pattern antialiased flex flex-col font-sans transition-colors duration-300`}
      >
       <Providers>
         {children}
        <Toaster/>
       </Providers>
      </body>
    </html>
  );
}
