'use client';
import { useEffect, useState } from 'react';

export default function FailureGallery() {
  const [failures, setFailures] = useState([]);

  useEffect(() => {
    fetch('/data/failures.json').then(r => r.json()).then(setFailures);
  }, []);

  return (
    <section className="py-12 border-t border-b border-gray-800 my-8 bg-black/20">
      <h2 className="text-2xl font-bold text-danger mb-8">Failure Gallery</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {failures.map((f: any, i) => (
          <div key={i} className="p-6 bg-background border border-danger/20 rounded-xl relative">
            <h3 className="text-white font-bold mb-3">{f.type}</h3>
            <p className="text-gray-400 text-sm mb-4">{f.description}</p>
            
            {/* Fake mini chart */}
            <div className="h-16 w-full border-b border-l border-gray-700 flex items-end mb-4 px-1 pb-1">
               <div className="w-full flex justify-between items-end gap-1">
                 {[10, 15, 20, 80, 20, 10].map((h, j) => (
                   <div key={j} className={`w-full ${h > 50 ? 'bg-danger' : 'bg-gray-700'} rounded-t`} style={{ height: `${h}%` }}></div>
                 ))}
               </div>
            </div>

            <div className="bg-danger/10 p-3 rounded border border-danger/20">
              <span className="text-danger font-mono text-xs uppercase block mb-1">Why it failed</span>
              <span className="text-danger/80 text-sm">{f.reason}</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
