'use client';
import { useState } from 'react';

export default function ThresholdSlider() {
  const [threshold, setThreshold] = useState(0.70);

  // Fake recompute
  const precision = Math.min(0.99, 0.70 + (threshold * 0.3)).toFixed(2);
  const recall = Math.max(0.60, 1.0 - (threshold * 0.4)).toFixed(2);
  const f1 = (2 * parseFloat(precision) * parseFloat(recall) / (parseFloat(precision) + parseFloat(recall))).toFixed(2);
  const alerts = Math.floor(45 - (threshold * 30));

  return (
    <section className="py-12">
      <h2 className="text-2xl font-bold text-white mb-6">Threshold Simulator</h2>
      <p className="text-gray-400 mb-8 font-mono text-sm">Higher threshold reduces false alarms but shortens warning time.</p>
      
      <div className="p-8 bg-card border border-gray-800 rounded-xl">
        <div className="mb-12">
          <div className="flex justify-between mb-4">
            <span className="text-gray-400 font-mono">0.30 (Paranoid)</span>
            <span className="text-primary font-bold text-xl">{threshold.toFixed(2)}</span>
            <span className="text-gray-400 font-mono">0.95 (Conservative)</span>
          </div>
          <input 
            type="range" 
            min="0.30" 
            max="0.95" 
            step="0.05" 
            value={threshold} 
            onChange={(e) => setThreshold(parseFloat(e.target.value))}
            className="w-full h-2 bg-gray-800 rounded-lg appearance-none cursor-pointer accent-primary"
          />
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="text-sm font-mono text-gray-500 mb-1">Precision</div>
            <div className="text-3xl font-bold text-white">{precision}</div>
          </div>
          <div className="text-center">
            <div className="text-sm font-mono text-gray-500 mb-1">Recall</div>
            <div className="text-3xl font-bold text-white">{recall}</div>
          </div>
          <div className="text-center">
            <div className="text-sm font-mono text-gray-500 mb-1">F1 Score</div>
            <div className="text-3xl font-bold text-primary">{f1}</div>
          </div>
          <div className="text-center">
            <div className="text-sm font-mono text-gray-500 mb-1">Alert Count</div>
            <div className="text-3xl font-bold text-warning">{alerts}</div>
          </div>
        </div>
      </div>
    </section>
  );
}
