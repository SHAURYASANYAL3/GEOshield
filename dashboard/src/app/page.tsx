'use client';
import { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend, ResponsiveContainer, ReferenceLine, Area, ComposedChart } from 'recharts';
import { ShieldAlert, Activity, Cpu, Database, Download, CloudOff, FileText, ArrowUpRight, CheckCircle2, Maximize2, X } from 'lucide-react';
import Image from 'next/image';

export default function OperationalDashboard() {
  const [threshold, setThreshold] = useState(0.5);
  const [showGrasp, setShowGrasp] = useState(false);
  const [currentTime, setCurrentTime] = useState('');
  const [activeImage, setActiveImage] = useState<string | null>(null);

  useEffect(() => {
    setCurrentTime(new Date().toISOString().substring(11, 16) + ' UTC');
    const timer = setInterval(() => {
      setCurrentTime(new Date().toISOString().substring(11, 16) + ' UTC');
    }, 60000);
    return () => clearInterval(timer);
  }, []);

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

  const verificationImages = [
    { src: '/screenshots/checklist.png', title: '16-Section Verification Checklist', desc: 'Shuffle tests, R99 metrics, and data integrity.' },
    { src: '/screenshots/advance_warning.png', title: '12.0h Advance Warning', desc: 'Model correctly firing 12h ahead of the P99 cross.' },
    { src: '/screenshots/peak_capture.png', title: 'P90 Peak Capture', desc: 'P90 upper band capturing 83% of the extreme April 2017 peak.' },
    { src: '/screenshots/mitigations.png', title: 'Tested Mitigations', desc: 'Regime-conditional conformal calibration (80% exact coverage).' }
  ];

  return (
    <main className="min-h-screen bg-[#050816] text-[#e2e8f0] font-sans selection:bg-[#00E5FF] selection:text-[#050816] overflow-x-hidden relative">
      
      {/* --- IMAGE MODAL --- */}
      {activeImage && (
        <div className="fixed inset-0 z-[100] bg-[#050816]/90 backdrop-blur-xl flex items-center justify-center p-4 md:p-12 animate-in fade-in duration-200">
          <div className="relative max-w-7xl w-full h-full flex flex-col items-center justify-center">
            <button 
              onClick={() => setActiveImage(null)}
              className="absolute top-4 right-4 bg-[#1e293b] hover:bg-[#FF4B5C] text-white p-2 rounded-full transition-colors z-10"
            >
              <X className="w-6 h-6" />
            </button>
            <div className="relative w-full h-[80vh] border border-[#1e293b] rounded-xl overflow-hidden shadow-2xl shadow-[#00E5FF]/10">
              <Image src={activeImage} alt="Verification" fill className="object-contain bg-[#0f172a]" unoptimized />
            </div>
            <p className="mt-4 font-mono text-[#94a3b8] tracking-widest uppercase">ESC to close</p>
          </div>
        </div>
      )}

      {/* Top Navbar */}
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

        {/* --- SECTION 1: STATUS HERO --- */}
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

        {/* --- SECTION 2: LIVE MONITORING --- */}
        <div className="col-span-12 lg:col-span-3 flex flex-col gap-6">
          <div className="bg-[#0f172a] border border-[#1e293b] rounded-xl p-6 flex flex-col gap-4">
            <h2 className="text-[#94a3b8] font-mono text-xs font-bold uppercase tracking-widest border-b border-[#1e293b] pb-2">NOAA SWPC Live Feed</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-[#64748b] font-mono text-xs mb-1">SPEED</div>
                <div className="font-mono text-xl text-white flex items-center gap-1">720 <ArrowUpRight className="w-4 h-4 text-[#FF4B5C]" /></div>
              </div>
              <div>
                <div className="text-[#64748b] font-mono text-xs mb-1">IMF Bz</div>
                <div className="font-mono text-xl text-white flex items-center gap-1">-8.4 <ArrowUpRight className="w-4 h-4 text-[#FFB300] rotate-90" /></div>
              </div>
              <div>
                <div className="text-[#64748b] font-mono text-xs mb-1">Kp INDEX</div>
                <div className="font-mono text-xl text-[#FF4B5C] font-bold">6.0</div>
              </div>
              <div>
                <div className="text-[#64748b] font-mono text-xs mb-1">DENSITY</div>
                <div className="font-mono text-xl text-white">4.2</div>
              </div>
            </div>
            <div className="mt-2 pt-4 border-t border-[#1e293b]">
              <div className="text-[#64748b] font-mono text-xs mb-1">CURRENT &gt;2MeV FLUX</div>
              <div className="font-mono text-2xl text-white flex items-center gap-2">2,400 <span className="text-sm text-[#FFB300] bg-[#FFB300]/10 px-2 py-0.5 rounded">↑ RISING</span></div>
            </div>
          </div>

          {/* --- SECTION 6: EXPLAINABILITY --- */}
          <div className="bg-[#0f172a] border border-[#1e293b] rounded-xl p-6">
            <h2 className="text-[#94a3b8] font-mono text-xs font-bold uppercase tracking-widest border-b border-[#1e293b] pb-2 mb-4">SHAP Explainability</h2>
            <ul className="space-y-4">
              <li className="flex flex-col gap-1"><span className="text-xs text-[#00E5FF] font-mono">TOP DRIVER</span><span className="text-sm">Solar wind speed 720 km/s ↑</span></li>
              <li className="flex flex-col gap-1"><span className="text-xs text-[#64748b] font-mono">SECONDARY</span><span className="text-sm">VBs coupling 4,800</span></li>
            </ul>
          </div>
        </div>

        {/* --- SECTION 4 & 3: CHART & HORIZONS --- */}
        <div className="col-span-12 lg:col-span-9 flex flex-col gap-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-[#0f172a] border border-[#1e293b] rounded-xl p-5 border-t-4 border-t-[#00FF88]">
              <div className="text-[#64748b] font-mono text-xs mb-3 flex justify-between"><span>45 MINUTES</span></div>
              <div className="font-mono text-2xl text-white mb-1">2,800</div>
              <div className="text-xs font-mono text-[#00FF88] flex items-center gap-1"><CheckCircle2 className="w-3 h-3" /> BELOW P99</div>
            </div>
            <div className="bg-[#0f172a] border border-[#1e293b] rounded-xl p-5 border-t-4 border-t-[#FFB300]">
              <div className="text-[#64748b] font-mono text-xs mb-3 flex justify-between"><span>6 HOURS</span></div>
              <div className="flex items-baseline gap-2 mb-1"><div className="font-mono text-2xl text-white">8,000</div><div className="font-mono text-xs text-[#64748b]">MEDIAN</div></div>
              <div className="text-xs font-mono text-[#FFB300] mb-2">⚠ ABOVE P95 IN 4H</div>
            </div>
            <div className="bg-[#0f172a] border border-[#FF4B5C]/50 rounded-xl p-5 border-t-4 border-t-[#FF4B5C] relative shadow-[0_0_15px_rgba(255,75,92,0.1)]">
              <div className="text-[#64748b] font-mono text-xs mb-3 flex justify-between"><span>12 HOURS</span></div>
              <div className="flex items-baseline gap-2 mb-1"><div className="font-mono text-2xl text-white">58,000</div><div className="font-mono text-xs text-[#64748b]">MEDIAN</div></div>
              <div className="text-xs font-mono text-[#FF4B5C] mb-2 font-bold flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-[#FF4B5C] animate-pulse"></span> P99 EXPECTED 14:20</div>
            </div>
          </div>

          <div className="bg-[#0f172a] border border-[#1e293b] rounded-xl p-6 relative">
            <div className="flex justify-between items-end mb-6">
              <h2 className="text-[#94a3b8] font-mono text-xs font-bold uppercase tracking-widest">Forecast Timeline (Log Scale)</h2>
              <button onClick={() => setShowGrasp(!showGrasp)} className={`font-mono text-xs px-3 py-1.5 rounded border transition-all ${showGrasp ? 'bg-[#534AB7]/20 border-[#534AB7] text-[#818cf8]' : 'bg-transparent border-[#1e293b] text-[#64748b] hover:text-white'}`}>
                {showGrasp ? 'HIDE ISRO GRASP' : 'SHOW ISRO GRASP COMPARISON'}
              </button>
            </div>
            <div className="h-[350px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={forecastData} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                  <XAxis dataKey="time" stroke="#64748b" tick={{ fill: '#64748b', fontSize: 12, fontFamily: 'monospace' }} />
                  <YAxis scale="log" domain={['auto', 'auto']} stroke="#64748b" tick={{ fill: '#64748b', fontSize: 12, fontFamily: 'monospace' }} tickFormatter={(val) => val.toLocaleString()} />
                  <RechartsTooltip contentStyle={{ backgroundColor: '#050816', borderColor: '#1e293b', fontFamily: 'monospace', color: '#fff' }} />
                  <ReferenceLine y={59153} stroke="#FF4B5C" strokeDasharray="3 3" />
                  <ReferenceLine x="NOW" stroke="#94a3b8" />
                  <Area type="monotone" dataKey="p90" stroke="none" fill="#FFB300" fillOpacity={0.1} />
                  <Line type="monotone" dataKey="actual" stroke="#00E5FF" strokeWidth={2} dot={false} />
                  <Line type="monotone" dataKey="median" stroke="#00FF88" strokeWidth={2} strokeDasharray="5 5" dot={false} />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* --- INTERACTIVE SCIENTIFIC PROOF GALLERY --- */}
        <div className="col-span-12 mt-4">
          <div className="flex items-center gap-3 mb-6">
            <h2 className="text-[#94a3b8] font-mono text-sm font-bold uppercase tracking-widest border-l-4 border-[#00E5FF] pl-3">Scientific Model Verification</h2>
            <div className="h-px bg-[#1e293b] flex-grow"></div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {verificationImages.map((img, i) => (
              <div 
                key={i} 
                className="group relative bg-[#0f172a] border border-[#1e293b] rounded-xl overflow-hidden cursor-pointer hover:border-[#00E5FF] transition-all"
                onClick={() => setActiveImage(img.src)}
              >
                <div className="aspect-video relative w-full border-b border-[#1e293b]">
                  <Image src={img.src} alt={img.title} fill className="object-cover opacity-60 group-hover:opacity-100 transition-opacity" unoptimized />
                  <div className="absolute inset-0 bg-[#00E5FF]/0 group-hover:bg-[#00E5FF]/10 flex items-center justify-center transition-all">
                    <Maximize2 className="w-8 h-8 text-[#00E5FF] opacity-0 group-hover:opacity-100 transition-all scale-75 group-hover:scale-100 drop-shadow-lg" />
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="font-mono text-[#e2e8f0] text-sm font-bold mb-1">{img.title}</h3>
                  <p className="text-[#64748b] text-xs leading-relaxed">{img.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </main>
  );
}
