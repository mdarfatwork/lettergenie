import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/navbar";
import { ClerkProvider } from "@clerk/nextjs";
import Footer from "@/components/footer";
import { Toaster } from "@/components/ui/sonner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "LetterGenie - AI Cover Letter Generator",
  description: "Instantly craft tailored cover letters with AI",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen`}
        >
          <div className="fixed inset-0 -z-10 h-full w-full bg-gradient-to-br from-purple-50 via-white to-blue-50">
            <div className="absolute top-0 right-0 h-[500px] w-[500px] -translate-x-[30%] translate-y-[20%] rounded-full bg-[rgba(92,106,196,0.3)] opacity-60 blur-[100px]"></div>
            <div className="absolute bottom-0 left-0 h-[400px] w-[400px] translate-x-[10%] -translate-y-[20%] rounded-full bg-[rgba(173,109,244,0.25)] opacity-50 blur-[80px]"></div>
            <div className="absolute top-1/2 left-1/2 h-[300px] w-[300px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[rgba(92,106,196,0.2)] opacity-40 blur-[60px]"></div>
          </div>

          <div className="relative z-10">
            <Navbar />
            {children}
            <Footer />
            <Toaster position="bottom-center" richColors />
          </div>
        </body>
      </html>
    </ClerkProvider>
  );
}
