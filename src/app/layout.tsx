import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/sonner";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    template: "%s | Blood Connect",
    default: "Blood Connect - Donate Blood, Save Lives",
  },
  description:
    "Join Blood Connect – InfoPark News Initiate, Kochi in our mission to save lives through blood donation. Register as a donor, request blood, and learn about the importance of blood donation.",
  keywords: [
    "blood donation",
    "blood donor",
    "donate blood",
    "save lives",
    "blood bank",
    "NGO",
    "healthcare",
  ],
  openGraph: {
    type: "website",
    locale: "en_IN",
    siteName: "Blood Connect",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`}>
      <body className="antialiased">
        <TooltipProvider>
          {children}
          <Toaster richColors position="top-right" />
        </TooltipProvider>
      </body>
    </html>
  );
}
