'use client';
import { useEffect, useState } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

export default function ForecastChart() {
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    fetch('/data/forecast.json')
      .then(r => r.json())
      .then(json => {
        const times = json.map((d: any) => {
          const parts = d.time.split(' ');
          return parts.length > 1 ? parts[1] : d.time;
        });
        const actual = json.map((d: any) => d.actual);
        const predicted = json.map((d: any) => d.predicted);
        const upper = json.map((d: any) => d.upper);

        setData({
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
              backgroundColor: 'rgba(0, 229, 255, 0.5)',
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
        });
      });
  }, []);

  if (!data) return <div className="h-[400px] bg-card animate-pulse rounded-xl border border-gray-800"></div>;

  return (
    <div className="w-full bg-card p-6 rounded-xl border border-gray-800 shadow-xl">
      <h3 className="text-lg font-bold mb-4 font-mono text-gray-300">GEO Electron Flux (pfu) - Real Export</h3>
      <div className="h-[400px]">
        <Line 
          data={data} 
          options={{
            responsive: true,
            maintainAspectRatio: false,
            scales: {
              y: { grid: { color: '#1f2937' }, ticks: { color: '#9ca3af' } },
              x: { grid: { color: '#1f2937' }, ticks: { color: '#9ca3af' } }
            },
            plugins: {
              legend: { labels: { color: '#ffffff', font: { family: 'monospace' } } },
              tooltip: {
                mode: 'index',
                intersect: false,
                backgroundColor: '#050816',
                titleColor: '#00E5FF',
                borderColor: '#1f2937',
                borderWidth: 1
              }
            }
          }} 
        />
      </div>
    </div>
  );
}
