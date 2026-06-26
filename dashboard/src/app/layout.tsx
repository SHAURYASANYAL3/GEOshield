import type { Metadata } from "next";
import { Inter, Orbitron } from "next/font/google";
import "./globals.css";
import Link from 'next/link';

const inter = Inter({ subsets: ["latin"], weight: ["300", "400", "500"], variable: "--font-inter" });
const orbitron = Orbitron({ subsets: ["latin"], weight: ["400", "500", "600", "700"], variable: "--font-orbitron" });

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
      <body className={`${inter.variable} ${orbitron.variable} font-[family-name:var(--font-inter)] bg-[#060606] text-[#FFFFFF] min-h-screen overflow-x-hidden relative flex flex-col`}>
        
        {/* TOP NAV: Exactly 58px high, 1320px wide, no border-radius */}
        <div className="w-full bg-[#060606] pt-[30px] flex justify-center z-50">
          <nav className="h-[58px] w-full max-w-[1320px] bg-[#11151E] border border-[#343B46] flex items-center justify-between px-6">
            <div className="flex items-center gap-4">
              <img src="https://h2svision.github.io/publicAssets2/bah2026/nav-logo.webp" alt="ISRO BAH 2026" className="h-8 w-auto" />
              <span className="font-[family-name:var(--font-orbitron)] font-medium text-white text-lg hidden sm:block tracking-wider">GEOShield</span>
            </div>
            <div className="flex h-full border-l border-[#343B46]">
              <Link href="/" className="h-full w-[130px] sm:w-[264px] flex items-center justify-center font-[family-name:var(--font-orbitron)] text-[18px] text-black bg-white transition-all duration-300">Home</Link>
              <Link href="/about" className="h-full w-[130px] sm:w-[264px] flex items-center justify-center font-[family-name:var(--font-orbitron)] text-[18px] text-white bg-[#11151E] hover:bg-[#1A2230] transition-all duration-300 border-l border-[#343B46]">About</Link>
            </div>
          </nav>
        </div>
        
        <div className="flex-grow max-w-[1400px] mx-auto w-full pt-[65px]">
          {children}
        </div>
        
        {/* FOOTER */}
        <footer className="mt-16 bg-[#060606] w-full border-t border-[#343B46]">
          <div className="max-w-[1400px] mx-auto px-4 md:px-8 py-8 flex flex-col md:flex-row justify-between items-center gap-4">
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
