'use client';
import { useEffect, useState } from 'react';

export default function ResultsGrid() {
  const [metrics, setMetrics] = useState<any>(null);

  useEffect(() => {
    fetch('/data/validation.json').then(r => r.json()).then(setMetrics);
  }, []);

  if (!metrics) return null;

  return (
    <section className="py-24 bg-background">
      <div className="max-w-7xl mx-auto px-6">
        <h2 className="text-3xl font-bold mb-16 text-center">Results</h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { label: "Lead Time", value: `${metrics.lead_time}h`, color: "text-primary" },
            { label: "Precision", value: `${(metrics.precision * 100).toFixed(1)}%`, color: "text-white" },
            { label: "Recall", value: `${(metrics.recall * 100).toFixed(1)}%`, color: "text-white" },
            { label: "Log RMSE", value: metrics.log_rmse.toFixed(3), color: "text-warning" }
          ].map((m, i) => (
            <div key={i} className="p-8 bg-card border border-gray-800 hover:-translate-y-1 transition-transform rounded-xl text-center flex flex-col justify-center">
              <div className={`text-5xl font-bold mb-2 ${m.color}`}>{m.value}</div>
              <div className="text-sm font-mono text-gray-500 uppercase tracking-wider">{m.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
