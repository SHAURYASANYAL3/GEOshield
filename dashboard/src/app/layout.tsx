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
      <body className={`${inter.className} bg-[#050816] text-white min-h-screen overflow-x-hidden relative`}>
        <Navbar />
        <TransitionProvider>
          {children}
        </TransitionProvider>
        
        {/* Tiny Provenance Footer */}
        <div className="fixed bottom-4 right-4 text-[10px] font-mono text-gray-600 text-right pointer-events-none z-50">
          <p>Built from:</p>
          <p>GOES + OMNI + GRASP</p>
          <p>Generated:</p>
          <p>2026-06-24</p>
          <p>Model:</p>
          <p>XGB EventWindow</p>
        </div>
      </body>
    </html>
  );
}
