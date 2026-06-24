'use client';
import { useEffect, useState } from 'react';

export default function EventHero() {
  const [prob, setProb] = useState(0);
  useEffect(() => {
    const i = setInterval(() => {
      setProb(p => p < 91 ? p + 1 : 91);
    }, 15);
    return () => clearInterval(i);
  }, []);

  return (
    <section className="py-12 border-b border-gray-800">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12">
        <div>
          <h1 className="text-4xl lg:text-5xl font-bold text-white mb-4">EventWindow Forecast Engine</h1>
          <p className="text-xl text-gray-400 max-w-2xl">
            Predicting hazardous radiation windows before critical thresholds are crossed.
          </p>
        </div>
        <div className="mt-6 md:mt-0 px-4 py-2 bg-primary/10 border border-primary/30 rounded-full flex items-center gap-3">
          <span className="h-2 w-2 bg-primary rounded-full animate-pulse"></span>
          <span className="text-primary font-mono text-sm tracking-widest uppercase">12h Forecast Active</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-8 bg-card border border-danger/30 rounded-xl shadow-[0_0_20px_rgba(255,75,92,0.1)]">
          <div className="text-sm font-mono text-gray-500 uppercase mb-2">Event Probability</div>
          <div className="text-5xl font-bold text-danger">{prob}%</div>
        </div>
        <div className="p-8 bg-card border border-warning/30 rounded-xl shadow-[0_0_20px_rgba(255,179,0,0.1)]">
          <div className="text-sm font-mono text-gray-500 uppercase mb-2">Lead Time</div>
          <div className="text-5xl font-bold text-warning">12h</div>
        </div>
        <div className="p-8 bg-card border border-success/30 rounded-xl shadow-[0_0_20px_rgba(0,255,136,0.1)]">
          <div className="text-sm font-mono text-gray-500 uppercase mb-2">Alert State</div>
          <div className="text-5xl font-bold text-success animate-pulse">ELEVATED</div>
        </div>
      </div>
    </section>
  );
}
