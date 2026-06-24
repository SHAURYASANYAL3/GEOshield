'use client';
import { useEffect, useState } from 'react';

export default function AlertPanel() {
  const [metrics, setMetrics] = useState<any>(null);
  
  useEffect(() => {
    fetch('/data/metrics.json').then(r => r.json()).then(setMetrics);
  }, []);

  return (
    <div className="w-full bg-card p-6 rounded-xl border border-warning shadow-[0_0_15px_rgba(255,179,0,0.15)] flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h3 className="text-warning font-bold font-mono tracking-widest">SYSTEM ALERT</h3>
        <span className="h-3 w-3 bg-warning rounded-full animate-pulse"></span>
      </div>
      
      <div className="space-y-4">
        <div>
          <div className="text-sm text-gray-500 font-mono">Probability</div>
          <div className="text-3xl font-bold text-white">0.91</div>
        </div>
        <div>
          <div className="text-sm text-gray-500 font-mono">Lead Time</div>
          <div className="text-3xl font-bold text-white">{metrics?.lead_time || 12}h</div>
        </div>
      </div>

      <div className="mt-4 pt-4 border-t border-gray-800">
        <div className="text-sm text-gray-500 font-mono mb-2">Recommended Action</div>
        <div className="p-3 bg-warning/10 text-warning border border-warning/20 rounded font-bold text-sm">
          Prepare Safe Mode
        </div>
      </div>
    </div>
  );
}
