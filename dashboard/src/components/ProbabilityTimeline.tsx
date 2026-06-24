'use client';
import { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';

export default function ProbabilityTimeline() {
  const [data, setData] = useState<any>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    fetch('/data/events.json')
      .then(res => {
        if (!res.ok) throw new Error('Data not found');
        return res.json();
      })
      .then(json => {
        const labels = json.map((d: any) => {
          const parts = d.timestamp.split(' ');
          return parts.length > 1 ? parts[1] : d.timestamp;
        });
        const probs = json.map((d: any) => d.probability);
        const thresholds = json.map((d: any) => d.threshold);

        setData({
          labels,
          datasets: [
            {
              label: 'Alert Threshold',
              data: thresholds,
              borderColor: '#FF4B5C',
              borderWidth: 2,
              borderDash: [5, 5],
              pointRadius: 0,
              fill: false
            },
            {
              label: 'Probability',
              data: probs,
              borderColor: '#00E5FF',
              backgroundColor: 'rgba(0, 229, 255, 0.1)',
              fill: true,
              tension: 0.4
            }
          ]
        });
      })
      .catch(() => setError(true));
  }, []);

  if (error) {
    return (
      <section className="py-12">
        <h2 className="text-2xl font-bold text-white mb-6">Interactive Event Timeline (Real Export)</h2>
        <div className="h-[400px] w-full bg-card rounded-xl border border-gray-800 flex items-center justify-center text-gray-500 font-mono">
          No exported model data found.
        </div>
      </section>
    );
  }

  if (!data) return <div className="h-[400px] bg-card rounded-xl animate-pulse"></div>;

  return (
    <section className="py-12">
      <h2 className="text-2xl font-bold text-white mb-6">Interactive Event Timeline (Real Export)</h2>
      <div className="w-full bg-card p-6 rounded-xl border border-gray-800 shadow-xl relative">
        <div className="h-[400px]">
          <Line 
            data={data} 
            options={{
              responsive: true,
              maintainAspectRatio: false,
              scales: {
                y: { min: 0, max: 1, grid: { color: '#1f2937' }, ticks: { color: '#9ca3af' } },
                x: { grid: { color: '#1f2937' }, ticks: { color: '#9ca3af' } }
              },
              plugins: {
                legend: { labels: { color: '#ffffff', font: { family: 'monospace' } } },
                tooltip: { backgroundColor: '#050816', titleColor: '#00E5FF', borderColor: '#1f2937', borderWidth: 1 }
              }
            }} 
          />
        </div>
      </div>
    </section>
  );
}
