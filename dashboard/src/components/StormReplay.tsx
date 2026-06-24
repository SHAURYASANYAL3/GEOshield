'use client';
import { useState } from 'react';
import { Line } from 'react-chartjs-2';

export default function StormReplay() {
  const [event, setEvent] = useState('April 2017');

  const times = ["T-18", "T-12", "T-6", "T-0 (Event)", "T+6", "T+12"];
  const actual = [1000, 1500, 3000, 12000, 8000, 4000];
  const predicted = [1100, 2500, 6000, 9500, 7000, null];
  const upper = [1300, 3500, 8000, 14000, 10000, null];

  const data = {
    labels: times,
    datasets: [
      {
        label: 'Upper Bound (P90)',
        data: upper,
        borderColor: 'rgba(255, 179, 0, 0.5)',
        backgroundColor: 'rgba(255, 179, 0, 0.1)',
        fill: true,
        borderDash: [5, 5]
      },
      {
        label: 'Prediction',
        data: predicted,
        borderColor: '#00E5FF',
        backgroundColor: 'transparent',
        borderDash: [5, 5],
        tension: 0.4
      },
      {
        label: 'Actual Flux',
        data: actual,
        borderColor: '#ffffff',
        backgroundColor: '#ffffff',
        tension: 0.4
      }
    ]
  };

  return (
    <section className="py-12">
      <div className="flex justify-between items-end mb-6">
        <h2 className="text-2xl font-bold text-white">Storm Replay</h2>
        <select 
          className="bg-card border border-gray-700 text-white px-4 py-2 rounded focus:outline-none focus:border-primary"
          value={event}
          onChange={(e) => setEvent(e.target.value)}
        >
          <option>April 2017</option>
          <option>Aug 2018</option>
          <option>Extreme Event</option>
        </select>
      </div>

      <div className="w-full bg-card p-6 rounded-xl border border-gray-800 relative">
        <div className="absolute top-1/4 left-[33%] bottom-0 w-px bg-danger/50 border-r border-dashed border-danger z-0">
          <div className="absolute -top-6 -left-12 bg-danger text-white text-xs px-2 py-1 rounded">ALERT ISSUED</div>
        </div>
        
        <div className="flex justify-between mb-8 gap-4 z-10 relative">
          <div className="p-4 bg-background border border-gray-800 rounded flex-1">
            <span className="text-sm font-mono text-gray-500 block">Lead:</span>
            <span className="text-xl font-bold text-warning">12h</span>
          </div>
          <div className="p-4 bg-background border border-gray-800 rounded flex-1 text-right">
            <span className="text-sm font-mono text-gray-500 block">Peak Reached:</span>
            <span className="text-xl font-bold text-danger">+11h 54m</span>
          </div>
        </div>

        <div className="h-[300px] relative z-10">
          <Line 
            data={data} 
            options={{
              responsive: true,
              maintainAspectRatio: false,
              scales: {
                y: { grid: { color: '#1f2937' }, ticks: { color: '#9ca3af' } },
                x: { grid: { color: '#1f2937' }, ticks: { color: '#9ca3af' } }
              },
              plugins: { legend: { labels: { color: '#ffffff' } } }
            }} 
          />
        </div>
      </div>
    </section>
  );
}
