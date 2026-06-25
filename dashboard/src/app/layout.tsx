import type { Metadata } from "next";
import "./globals.css";
import Link from 'next/link';

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
      <body className="font-sans bg-[#050816] text-white min-h-screen overflow-x-hidden relative">
        <nav className="flex gap-4 p-4 border-b border-gray-800">
          <Link href="/" className="font-bold">Home</Link>
          <Link href="/about">About</Link>
        </nav>
        {children}
        
        {/* Tiny Provenance Footer */}
        <div className="fixed bottom-4 right-4 text-[10px] font-mono text-gray-600 text-right pointer-events-none z-50">
          <p>Built from GOES + OMNI</p>
          <p>Validated with GRASP</p>
          <p>Generated:</p>
          <p>2026-06-24</p>
          <p>Model:</p>
          <p>XGBoost Delta X100</p>
        </div>
      </body>
    </html>
  );
}
