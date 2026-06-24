'use client';
import { motion } from 'framer-motion';
import Link from 'next/link';

export default function Hero() {
  return (
    <section className="relative w-full min-h-screen flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 bg-background">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/10 rounded-full blur-[120px] animate-pulse"></div>
      </div>
      
      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="flex flex-col gap-6"
        >
          <div className="text-primary font-mono text-sm tracking-widest uppercase">GEOShield</div>
          <h1 className="text-5xl lg:text-7xl font-bold leading-tight text-white">
            Forecasting <br/> Satellite Radiation <br/> Hazards
            <span className="block text-gray-400 text-3xl lg:text-5xl mt-2">Before They Become Failures</span>
          </h1>
          <p className="text-xl text-gray-400 max-w-lg leading-relaxed">
            Physics-driven hazard forecasting using GOES, OMNI, and operational event detection.
          </p>
          <div className="flex gap-4 mt-8">
            <Link href="/forecast" className="px-8 py-4 bg-primary text-background font-bold rounded hover:bg-primary/90 transition-all">
              Launch Dashboard
            </Link>
            <Link href="/validation" className="px-8 py-4 bg-card border border-gray-800 text-white font-bold rounded hover:bg-gray-800 transition-all">
              View Validation
            </Link>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="relative h-[600px] flex items-center justify-center"
        >
          <div className="relative w-full max-w-md">
            {[ 
              { title: "🔴 Hazard", top: "0px", z: 30, scale: 1 },
              { title: "🟠 Event Window", top: "40px", z: 20, scale: 0.95 },
              { title: "🟢 Forecast", top: "80px", z: 10, scale: 0.90 }
            ].map((card, i) => (
              <motion.div 
                key={i}
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 4, repeat: Infinity, delay: i * 0.5 }}
                className="absolute w-full p-6 bg-card border border-gray-800 rounded-xl shadow-2xl backdrop-blur-sm"
                style={{ top: card.top, zIndex: card.z, transform: `scale(${card.scale})` }}
              >
                <div className="text-lg font-mono font-bold text-white">{card.title}</div>
                <div className="h-24 mt-4 w-full bg-gray-900 rounded border border-gray-800"></div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
