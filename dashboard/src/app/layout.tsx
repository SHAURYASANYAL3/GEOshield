import type { Metadata } from "next";
import { Inter, Poppins } from "next/font/google";
import "./globals.css";
import Link from 'next/link';

const inter = Inter({ subsets: ["latin"], weight: ["400", "500"], variable: "--font-inter" });
const poppins = Poppins({ subsets: ["latin"], weight: ["600", "700"], variable: "--font-poppins" });

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
      <body className={`${inter.variable} ${poppins.variable} font-[family-name:var(--font-inter)] bg-bg-deep text-text-primary min-h-screen overflow-x-hidden relative flex flex-col`}>
        
        {/* TOP NAV: solid pure-black (#000000) bar, full width */}
        <nav className="flex justify-between items-center px-4 md:px-8 py-3 bg-isro-black sticky top-0 z-50 w-full">
          <div className="flex items-center gap-4">
            <img src="https://h2svision.github.io/publicAssets2/bah2026/nav-logo.webp" alt="ISRO BAH 2026" className="h-10 w-auto" />
            <span className="font-[family-name:var(--font-poppins)] font-bold text-white text-xl hidden sm:block">GEOShield</span>
          </div>
          <div className="flex gap-6">
            <Link href="/" className="font-[family-name:var(--font-poppins)] text-white hover:text-isro-orange transition-colors">Home</Link>
            <Link href="/about" className="font-[family-name:var(--font-poppins)] text-white hover:text-isro-orange transition-colors">About</Link>
          </div>
        </nav>
        
        {/* THE GRADIENT BAR (top) */}
        <div className="h-1 w-full z-50 sticky top-[64px]" style={{ background: 'var(--isro-gradient)' }}></div>

        <div className="flex-grow">
          {children}
        </div>
        
        {/* FOOTER */}
        <footer className="mt-16 bg-isro-black w-full">
          {/* GRADIENT BAR ON TOP EDGE OF FOOTER */}
          <div className="h-1 w-full" style={{ background: 'var(--isro-gradient)' }}></div>
          <div className="max-w-[1800px] mx-auto px-4 md:px-8 py-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-text-muted text-sm flex gap-4 text-center md:text-left">
              <span>Powered by Hack2skill</span>
              <span className="text-white/20">|</span>
              <span>ISRO Bharatiya Antariksh Hackathon 2026</span>
            </div>
            <div className="flex gap-4 text-text-muted text-sm">
              <Link href="/" className="hover:text-isro-cyan transition-colors">Dashboard</Link>
              <Link href="/about" className="hover:text-isro-cyan transition-colors">About GEOShield</Link>
            </div>
          </div>
        </footer>

      </body>
    </html>
  );
}
