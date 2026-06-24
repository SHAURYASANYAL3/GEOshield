import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import TransitionProvider from "@/components/TransitionProvider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "GEOShield Dashboard",
  description: "Radiation Hazards Early Warning System",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-[#050816] text-white min-h-screen overflow-x-hidden`}>
        <Navbar />
        <TransitionProvider>
          {children}
        </TransitionProvider>
      </body>
    </html>
  );
}
