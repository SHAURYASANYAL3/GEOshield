'use client';
import { useEffect, useState } from 'react';

export default function LeadTable() {
  const [rows, setRows] = useState([]);

  useEffect(() => {
    fetch('/data/leadtime.json')
      .then(r => r.json())
      .then(setRows);
  }, []);

  return (
    <section className="py-12 pb-24">
      <h2 className="text-2xl font-bold text-white mb-6">Lead-Time Evaluation</h2>
      <div className="w-full overflow-x-auto bg-card border border-gray-800 rounded-xl">
        <table className="w-full text-left">
          <thead className="bg-gray-900 border-b border-gray-800 text-gray-400 font-mono text-sm uppercase">
            <tr>
              <th className="p-4">Event</th>
              <th className="p-4">Predicted</th>
              <th className="p-4">Actual</th>
              <th className="p-4">Lead Time</th>
              <th className="p-4 text-right">Result</th>
            </tr>
          </thead>
          <tbody className="text-white">
            {rows.map((r: any, i) => (
              <tr key={i} className="border-b border-gray-800 hover:bg-gray-800/50 transition-colors">
                <td className="p-4 font-bold">{r.event}</td>
                <td className="p-4 text-gray-400">{r.predicted}</td>
                <td className="p-4 text-gray-400">{r.actual}</td>
                <td className="p-4 font-mono font-bold text-primary">{r.lead}</td>
                <td className={`p-4 text-right font-bold ${r.result.includes('HIT') ? 'text-danger' : r.result.includes('WATCH') ? 'text-warning' : 'text-gray-500'}`}>
                  {r.result}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
