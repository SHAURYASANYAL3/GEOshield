'use client';
import { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend, ResponsiveContainer, ReferenceLine, Area, ComposedChart } from 'recharts';
import { ShieldAlert, Activity, Cpu, Database, Download, CloudOff, FileText, ArrowUpRight, CheckCircle2 } from 'lucide-react';

export default function OperationalDashboard() {
  const [threshold, setThreshold] = useState(0.5);
  const [showGrasp, setShowGrasp] = useState(false);
  const [currentTime, setCurrentTime] = useState('');

  useEffect(() => {
    setCurrentTime(new Date().toISOString().substring(11, 16) + ' UTC');
    const timer = setInterval(() => {
      setCurrentTime(new Date().toISOString().substring(11, 16) + ' UTC');
    }, 60000);
    return () => clearInterval(timer);
  }, []);

  // Mock data representing the 12h forecast window
  const forecastData = [
    { time: '-24h', actual: 1200 },
    { time: '-12h', actual: 1800 },
    { time: 'NOW', actual: 2400, median: 2400, p90: 2400 },
    { time: '+3h', median: 3500, p90: 5000 },
    { time: '+6h', median: 8000, p90: 15000 },
    { time: '+9h', median: 22000, p90: 45000 },
    { time: '+11.5h', median: 65000, p90: 110000 },
    { time: '+12h', median: 58000, p90: 95000 },
  ];

  return (
    <main className="min-h-screen bg-[#050816] text-[#e2e8f0] font-sans selection:bg-[#00E5FF] selection:text-[#050816] overflow-x-hidden">
      
      {/* Top Navbar / Branding */}
      <header className="border-b border-[#1e293b] bg-[#0f172a]/90 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-[1440px] mx-auto px-6 py-3 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <ShieldAlert className="text-[#00E5FF] w-6 h-6" />
            <span className="font-mono font-bold tracking-widest uppercase text-lg text-white">GEOShield <span className="text-[#64748b] text-sm">OPS-CONSOLE</span></span>
          </div>
          <div className="flex items-center gap-6 font-mono text-sm">
            <div className="flex items-center gap-2 text-[#00FF88]">
              <span className="relative flex h-2 w-2"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00FF88] opacity-75"></span><span className="relative inline-flex rounded-full h-2 w-2 bg-[#00FF88]"></span></span>
              SYSTEM LIVE
            </div>
            <div className="text-[#94a3b8]">{currentTime}</div>
          </div>
        </div>
      </header>

      <div className="max-w-[1440px] mx-auto px-6 py-8 grid grid-cols-12 gap-6">

        {/* --- SECTION 1: STATUS HERO (Col 1-12) --- */}
        <div className="col-span-12 bg-[#0f172a] border border-[#1e293b] rounded-xl p-8 flex flex-col md:flex-row items-center justify-between gap-8 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 left-0 w-2 h-full bg-[#FF4B5C]"></div>
          <div>
            <div className="flex items-center gap-4 mb-2">
              <div className="bg-[#FF4B5C]/20 border border-[#FF4B5C] text-[#FF4B5C] px-4 py-1 rounded-full font-mono font-bold text-sm uppercase tracking-wide flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#FF4B5C] animate-pulse"></span>
                RED ALERT
              </div>
              <span className="font-mono text-[#94a3b8] text-sm">HORIZON: 12 HOURS</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-2 tracking-tight">Next P99 crossing predicted at 14:20 UTC</h1>
            <p className="text-[#94a3b8] font-mono text-lg">11.5 hours from now.</p>
          </div>
          <div className="bg-[#050816] border border-[#1e293b] p-4 rounded-lg flex items-center gap-4 max-w-md">
            <Activity className="text-[#00E5FF] w-8 h-8 flex-shrink-0" />
            <p className="text-sm text-[#cbd5e1] leading-relaxed">
              GEOShield is monitoring 1.2M km of solar wind. Currently tracking elevated speed (720 km/s) — model assigns 23% probability of P99 crossing in next 12h.
            </p>
          </div>
        </div>

        {/* --- SECTION 2: LIVE MONITORING (Col 1-3) --- */}
        <div className="col-span-12 lg:col-span-3 flex flex-col gap-6">
          <div className="bg-[#0f172a] border border-[#1e293b] rounded-xl p-6 flex flex-col gap-4">
            <h2 className="text-[#94a3b8] font-mono text-xs font-bold uppercase tracking-widest border-b border-[#1e293b] pb-2">NOAA SWPC Live Feed</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-[#64748b] font-mono text-xs mb-1">SPEED</div>
                <div className="font-mono text-xl text-white flex items-center gap-1">720 <ArrowUpRight className="w-4 h-4 text-[#FF4B5C]" /></div>
                <div className="text-[#64748b] text-[10px] font-mono">km/s</div>
              </div>
              <div>
                <div className="text-[#64748b] font-mono text-xs mb-1">IMF Bz</div>
                <div className="font-mono text-xl text-white flex items-center gap-1">-8.4 <ArrowUpRight className="w-4 h-4 text-[#FFB300] rotate-90" /></div>
                <div className="text-[#64748b] text-[10px] font-mono">nT (Southward)</div>
              </div>
              <div>
                <div className="text-[#64748b] font-mono text-xs mb-1">Kp INDEX</div>
                <div className="font-mono text-xl text-[#FF4B5C] font-bold">6.0</div>
                <div className="text-[#64748b] text-[10px] font-mono">Storm Level</div>
              </div>
              <div>
                <div className="text-[#64748b] font-mono text-xs mb-1">DENSITY</div>
                <div className="font-mono text-xl text-white">4.2</div>
                <div className="text-[#64748b] text-[10px] font-mono">p/cc</div>
              </div>
            </div>
            <div className="mt-2 pt-4 border-t border-[#1e293b]">
              <div className="text-[#64748b] font-mono text-xs mb-1">CURRENT &gt;2MeV FLUX</div>
              <div className="font-mono text-2xl text-white flex items-center gap-2">2,400 <span className="text-sm text-[#FFB300] bg-[#FFB300]/10 px-2 py-0.5 rounded">↑ RISING</span></div>
            </div>
          </div>

          {/* --- SECTION 6: EXPLAINABILITY PANEL --- */}
          <div className="bg-[#0f172a] border border-[#1e293b] rounded-xl p-6">
            <h2 className="text-[#94a3b8] font-mono text-xs font-bold uppercase tracking-widest border-b border-[#1e293b] pb-2 mb-4">SHAP Explainability</h2>
            <ul className="space-y-4">
              <li className="flex flex-col gap-1">
                <span className="text-xs text-[#00E5FF] font-mono">TOP DRIVER</span>
                <span className="text-sm text-[#e2e8f0]">Solar wind speed 720 km/s ↑</span>
              </li>
              <li className="flex flex-col gap-1">
                <span className="text-xs text-[#64748b] font-mono">SECONDARY</span>
                <span className="text-sm text-[#e2e8f0]">VBs coupling 4,800 (elevated)</span>
              </li>
              <li className="flex flex-col gap-1">
                <span className="text-xs text-[#64748b] font-mono">BACKGROUND</span>
                <span className="text-sm text-[#e2e8f0]">Flux history at 1.2× baseline</span>
              </li>
            </ul>
          </div>
        </div>

        {/* --- SECTION 4 & 3: FORECAST CHART & HORIZONS (Col 4-12) --- */}
        <div className="col-span-12 lg:col-span-9 flex flex-col gap-6">
          
          {/* Horizon Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* 45 Min */}
            <div className="bg-[#0f172a] border border-[#1e293b] rounded-xl p-5 border-t-4 border-t-[#00FF88]">
              <div className="text-[#64748b] font-mono text-xs mb-3 flex justify-between">
                <span>45 MINUTES</span>
                <span>PERSISTENCE</span>
              </div>
              <div className="font-mono text-2xl text-white mb-1">2,800</div>
              <div className="text-xs font-mono text-[#00FF88] flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" /> BELOW P99
              </div>
            </div>
            {/* 6 Hours */}
            <div className="bg-[#0f172a] border border-[#1e293b] rounded-xl p-5 border-t-4 border-t-[#FFB300]">
              <div className="text-[#64748b] font-mono text-xs mb-3 flex justify-between">
                <span>6 HOURS</span>
                <span>DELTA X100</span>
              </div>
              <div className="flex items-baseline gap-2 mb-1">
                <div className="font-mono text-2xl text-white">8,000</div>
                <div className="font-mono text-xs text-[#64748b]">MEDIAN</div>
              </div>
              <div className="text-xs font-mono text-[#FFB300] mb-2 flex items-center gap-1">
                ⚠ ABOVE P95 IN 4H
              </div>
              <div className="bg-[#1e293b] px-2 py-1 rounded flex justify-between text-[10px] font-mono">
                <span className="text-[#94a3b8]">P90 UPPER BAND</span>
                <span className="text-[#FFB300]">15,000</span>
              </div>
            </div>
            {/* 12 Hours */}
            <div className="bg-[#0f172a] border border-[#FF4B5C]/50 rounded-xl p-5 border-t-4 border-t-[#FF4B5C] relative shadow-[0_0_15px_rgba(255,75,92,0.1)]">
              <div className="text-[#64748b] font-mono text-xs mb-3 flex justify-between">
                <span>12 HOURS</span>
                <span>DELTA X100</span>
              </div>
              <div className="flex items-baseline gap-2 mb-1">
                <div className="font-mono text-2xl text-white">58,000</div>
                <div className="font-mono text-xs text-[#64748b]">MEDIAN</div>
              </div>
              <div className="text-xs font-mono text-[#FF4B5C] mb-2 flex items-center gap-1 font-bold">
                <span className="w-2 h-2 rounded-full bg-[#FF4B5C] animate-pulse"></span> P99 EXPECTED 14:20
              </div>
              <div className="bg-[#FF4B5C]/10 px-2 py-1 rounded flex justify-between text-[10px] font-mono border border-[#FF4B5C]/20">
                <span className="text-[#FF4B5C]">P90 UPPER BAND</span>
                <span className="text-[#FF4B5C] font-bold">95,000</span>
              </div>
            </div>
          </div>

          {/* Chart */}
          <div className="bg-[#0f172a] border border-[#1e293b] rounded-xl p-6 relative">
            <div className="flex justify-between items-end mb-6">
              <h2 className="text-[#94a3b8] font-mono text-xs font-bold uppercase tracking-widest">Forecast Timeline (Log Scale)</h2>
              
              {/* --- SECTION 7: GRASP TOGGLE --- */}
              <button 
                onClick={() => setShowGrasp(!showGrasp)}
                className={`font-mono text-xs px-3 py-1.5 rounded border transition-all ${showGrasp ? 'bg-[#534AB7]/20 border-[#534AB7] text-[#818cf8]' : 'bg-transparent border-[#1e293b] text-[#64748b] hover:text-white'}`}
              >
                {showGrasp ? 'HIDE ISRO GRASP' : 'SHOW ISRO GRASP COMPARISON'}
              </button>
            </div>
            
            <div className="h-[350px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={forecastData} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                  <XAxis dataKey="time" stroke="#64748b" tick={{ fill: '#64748b', fontSize: 12, fontFamily: 'monospace' }} />
                  <YAxis scale="log" domain={['auto', 'auto']} stroke="#64748b" tick={{ fill: '#64748b', fontSize: 12, fontFamily: 'monospace' }} tickFormatter={(val) => val.toLocaleString()} />
                  <RechartsTooltip 
                    contentStyle={{ backgroundColor: '#050816', borderColor: '#1e293b', fontFamily: 'monospace', color: '#fff' }}
                    itemStyle={{ color: '#00E5FF' }}
                  />
                  <ReferenceLine y={59153} stroke="#FF4B5C" strokeDasharray="3 3" label={{ position: 'top', value: 'P99 DANGER THRESHOLD (59,153)', fill: '#FF4B5C', fontSize: 10, fontFamily: 'monospace' }} />
                  <ReferenceLine x="NOW" stroke="#94a3b8" label={{ position: 'top', value: 'NOW', fill: '#94a3b8', fontSize: 10, fontFamily: 'monospace' }} />
                  
                  {/* P10-P90 Band */}
                  <Area type="monotone" dataKey="p90" stroke="none" fill="#FFB300" fillOpacity={0.1} />
                  
                  <Line type="monotone" dataKey="actual" stroke="#00E5FF" strokeWidth={2} dot={false} name="Actual Telemetry" />
                  <Line type="monotone" dataKey="median" stroke="#00FF88" strokeWidth={2} strokeDasharray="5 5" dot={false} name="Forecast Median" />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
            
            {showGrasp && (
              <div className="absolute top-16 left-1/2 -translate-x-1/2 bg-[#050816]/90 backdrop-blur border border-[#534AB7] p-3 rounded shadow-2xl z-10 text-center">
                <div className="text-[#818cf8] font-mono text-xs font-bold mb-1">INDIAN-LONGITUDE BLIND TEST (48°E)</div>
                <div className="text-[#94a3b8] font-mono text-[10px]">Recall: 0.933 | Timing Corr: 0.580 | Offset: 183° from training</div>
              </div>
            )}
          </div>
        </div>

        {/* --- SECTION 5: THRESHOLD SLIDER & SECTION 9: HANDOFF (Col 1-12) --- */}
        <div className="col-span-12 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-[#0f172a] border border-[#1e293b] rounded-xl p-6">
             <h2 className="text-[#94a3b8] font-mono text-xs font-bold uppercase tracking-widest border-b border-[#1e293b] pb-2 mb-6">Operator Control: Alert Threshold</h2>
             <div className="flex items-center gap-4 mb-4">
               <input 
                 type="range" 
                 min="0.2" max="0.8" step="0.3" 
                 value={threshold} 
                 onChange={(e) => setThreshold(parseFloat(e.target.value))}
                 className="w-full accent-[#00E5FF]"
               />
               <span className="font-mono font-bold text-[#00E5FF] w-12 text-right">{threshold.toFixed(1)}</span>
             </div>
             <div className="bg-[#050816] border border-[#1e293b] p-3 rounded font-mono text-xs text-[#cbd5e1]">
               {threshold === 0.2 && "At threshold 0.2: 99% of storms caught, median 12.0h warning, max safety (more false alarms)."}
               {threshold === 0.5 && "At threshold 0.5: 97% of storms caught, median 12.0h warning, ~1:1 false-alarm ratio."}
               {threshold === 0.8 && "At threshold 0.8: 97% of storms caught, median 11.7h warning, fewer false alarms."}
             </div>
          </div>

          <div className="bg-[#0f172a] border border-[#1e293b] rounded-xl p-6">
            <h2 className="text-[#94a3b8] font-mono text-xs font-bold uppercase tracking-widest border-b border-[#1e293b] pb-2 mb-4">Operational Handoff</h2>
            <div className="grid grid-cols-2 gap-3">
              <button className="flex items-center justify-center gap-2 bg-[#1e293b] hover:bg-[#334155] transition-colors border border-[#334155] rounded py-2 text-xs font-mono text-white">
                <Download className="w-3 h-3" /> EXPORT PDF LOG
              </button>
              <button className="flex items-center justify-center gap-2 bg-[#1e293b] hover:bg-[#334155] transition-colors border border-[#334155] rounded py-2 text-xs font-mono text-white">
                <Cpu className="w-3 h-3" /> GET /forecast?horizon=12h
              </button>
              <button className="flex items-center justify-center gap-2 bg-[#1e293b] hover:bg-[#334155] transition-colors border border-[#334155] rounded py-2 text-xs font-mono text-white">
                <Database className="w-3 h-3" /> SQLITE AUDIT LOG
              </button>
              <button className="flex items-center justify-center gap-2 bg-[#1e293b] hover:bg-[#334155] transition-colors border border-[#334155] rounded py-2 text-xs font-mono text-[#00FF88]">
                <CloudOff className="w-3 h-3" /> OFFLINE MODE: READY
              </button>
            </div>
          </div>
        </div>

      </div>

      {/* --- SECTION 8: MODEL CARD --- */}
      <footer className="border-t border-[#1e293b] bg-[#050816] py-6">
        <div className="max-w-[1440px] mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-4 text-[10px] font-mono text-[#64748b]">
            <FileText className="w-4 h-4" />
            <div>
              <div>Trained on 458,731 rows of GOES-15 + OMNI ≤2016. Verified on 245,377 rows of unseen data.</div>
              <div>Headline metrics: R99 = 0.434 ± 0.005, PE = 0.809, ECE = 0.019.</div>
              <div>Last validation: 2026-06-24 12:00:00. Shuffle test: PASS (0.339 → 0.127, no leakage).</div>
            </div>
          </div>
          <a href="#" className="text-[#00E5FF] text-[10px] font-mono hover:underline flex items-center gap-1">
            VIEW 30-DAY ALERT HISTORY <ArrowUpRight className="w-3 h-3" />
          </a>
        </div>
      </footer>
    </main>
  );
}
