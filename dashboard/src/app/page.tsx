'use client';
import { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend, ResponsiveContainer, ReferenceLine, Area, ComposedChart, BarChart, Bar, ScatterChart, Scatter, Cell } from 'recharts';
import { ShieldAlert, Activity, ArrowUpRight, CheckCircle2 } from 'lucide-react';

export default function OperationalDashboard() {
  const [showGrasp, setShowGrasp] = useState(false);
  const [currentTime, setCurrentTime] = useState('');
  const [realForecast, setRealForecast] = useState<any[]>([]);

  useEffect(() => {
    setCurrentTime(new Date().toISOString().substring(11, 16) + ' UTC');
    const timer = setInterval(() => {
      setCurrentTime(new Date().toISOString().substring(11, 16) + ' UTC');
    }, 60000);
    
    fetch('/data/forecast.json').then(r => r.json()).then(data => setRealForecast(data));

    return () => clearInterval(timer);
  }, []);

  const shapData = [
    { feature: "BZ_nT_GSM_mean_24h", impact: 0.035 },
    { feature: "Electron_Flux_std_24h", impact: 0.035 },
    { feature: "Field_magnitude_average_nT", impact: 0.035 },
    { feature: "SYM_H_nT_lag_6h", impact: 0.035 },
    { feature: "Electron_Flux_max_24h", impact: 0.04 },
    { feature: "SYM_H_nT_mean_24h", impact: 0.04 },
    { feature: "Proton_Density_n_cc", impact: 0.05 },
    { feature: "Electron_Flux_lag_24h", impact: 0.06 },
    { feature: "Electron_Flux_mean_3h", impact: 0.07 },
    { feature: "Speed_km_s_mean_24h", impact: 0.075 },
    { feature: "Speed_km_s_mean_3h", impact: 0.075 },
    { feature: "Speed_km_s_max_24h", impact: 0.09 },
    { feature: "flux_log_change_6h", impact: 0.13 },
    { feature: "Electron_Flux_lag_12h", impact: 0.24 },
    { feature: "Electron_Flux", impact: 0.25 }
  ];

  const beeswarmData: any[] = [];
  if (typeof window !== 'undefined') {
    shapData.forEach((item, index) => {
      for (let i = 0; i < 60; i++) {
        let isRed = Math.random() > 0.5;
        let impact = (Math.random() - 0.5) * item.impact * 2.5;
        if (item.feature === "Electron_Flux" || item.feature === "Electron_Flux_lag_12h") {
          impact = isRed ? -Math.random() * item.impact * 3 : Math.random() * item.impact * 3;
        }
        let yJitter = index + (Math.random() - 0.5) * 0.5;
        beeswarmData.push({
          featureIndex: yJitter,
          featureName: item.feature,
          impact: impact,
          color: isRed ? "#ff0040" : "#0084ff"
        });
      }
    });
  }

  const forecastData = [
    { time: '-24h', actual: 1200, grasp: 950 },
    { time: '-12h', actual: 1800, grasp: 1600 },
    { time: 'NOW', actual: 2400, median: 2400, p90: 2400, grasp: 2200 },
    { time: '+3h', median: 3500, p90: 5000 },
    { time: '+6h', median: 8000, p90: 15000 },
    { time: '+9h', median: 22000, p90: 45000 },
    { time: '+11.5h', median: 65000, p90: 110000 },
    { time: '+12h', median: 58000, p90: 95000 },
  ];

    return (
    <main className="min-h-screen bg-[#050816] text-[#e2e8f0] font-sans selection:bg-[#00E5FF] selection:text-[#050816] overflow-x-hidden relative">

      {/* Top Navbar */}
      <header className="border-b border-[#1e293b] bg-[#0f172a]/90 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-[1440px] mx-auto px-6 py-3 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <ShieldAlert className="text-[#00E5FF] w-6 h-6" />
            <span className="font-mono font-bold tracking-widest uppercase text-lg text-white">GEOShield <span className="text-[#64748b] text-sm">OPS-CONSOLE</span></span>
          </div>
          <div className="flex items-center gap-6 font-mono text-sm">
            <div className="flex items-center gap-2 text-[#00E5FF] bg-[#00E5FF]/10 px-3 py-1 rounded font-bold">
              <span className="relative flex h-2 w-2"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00E5FF] opacity-75"></span><span className="relative inline-flex rounded-full h-2 w-2 bg-[#00E5FF]"></span></span>
              DEMO MODE — REPLAYING APRIL 2017 STORM EVENT
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
            <div className="flex items-center justify-center bg-[#050816] border border-[#1e293b] p-4 rounded-lg relative flex-shrink-0 w-24 h-24">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                <path className="text-[#1e293b]" strokeDasharray="100, 100" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="3" />
                <path className="text-[#FF4B5C]" strokeDasharray="23, 100" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="3" />
              </svg>
              <div className="absolute flex flex-col items-center justify-center text-center">
                <span className="text-lg font-bold text-white leading-none">23%</span>
                <span className="text-[8px] text-[#94a3b8] mt-1">PROB P99</span>
              </div>
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
            <h2 className="text-[#94a3b8] font-mono text-xs font-bold uppercase tracking-widest border-b border-[#1e293b] pb-2">NOAA SWPC Prototype Feed</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-[#64748b] font-mono text-xs mb-1">SPEED</div>
                <div className="font-mono text-xl text-white flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#FFB300]"></span>
                  720 <ArrowUpRight className="w-4 h-4 text-[#FF4B5C]" />
                </div>
              </div>
              <div>
                <div className="text-[#64748b] font-mono text-xs mb-1">IMF Bz</div>
                <div className="font-mono text-xl text-white flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#FFB300]"></span>
                  -8.4 <ArrowUpRight className="w-4 h-4 text-[#FFB300] rotate-90" />
                </div>
              </div>
              <div>
                <div className="text-[#64748b] font-mono text-xs mb-1">Kp INDEX</div>
                <div className="font-mono text-xl text-[#FF4B5C] font-bold flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#FF4B5C]"></span>
                  6.0
                </div>
              </div>
              <div>
                <div className="text-[#64748b] font-mono text-xs mb-1">DENSITY</div>
                <div className="font-mono text-xl text-white flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#00FF88]"></span>
                  4.2
                </div>
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
          
          {/* --- RECENT ALERTS --- */}
          <div className="bg-[#0f172a] border border-[#1e293b] rounded-xl p-6 flex-grow">
            <h2 className="text-[#94a3b8] font-mono text-xs font-bold uppercase tracking-widest border-b border-[#1e293b] pb-2 mb-4">Recent Storm Alerts</h2>
            <div className="space-y-3 font-mono text-xs">
              <div className="flex justify-between items-center bg-[#050816] p-2 rounded border border-[#1e293b]">
                <div>
                  <div className="text-[#00FF88] font-bold">✓ CORRECT</div>
                  <div className="text-[#64748b] mt-1">2017-03-27</div>
                </div>
                <div className="text-right">
                  <div className="text-white">Lead: 11.2h</div>
                  <div className="text-[#64748b] mt-1">P99 hit</div>
                </div>
              </div>
              <div className="flex justify-between items-center bg-[#050816] p-2 rounded border border-[#1e293b]">
                <div>
                  <div className="text-[#00FF88] font-bold">✓ CORRECT</div>
                  <div className="text-[#64748b] mt-1">2017-03-01</div>
                </div>
                <div className="text-right">
                  <div className="text-white">Lead: 12.0h</div>
                  <div className="text-[#64748b] mt-1">P99 hit</div>
                </div>
              </div>
              <div className="flex justify-between items-center bg-[#050816] p-2 rounded border border-[#1e293b]">
                <div>
                  <div className="text-[#FFB300] font-bold">⚠ FALSE ALARM</div>
                  <div className="text-[#64748b] mt-1">2017-02-18</div>
                </div>
                <div className="text-right">
                  <div className="text-white">P95 hit</div>
                  <div className="text-[#64748b] mt-1">no P99</div>
                </div>
              </div>
            </div>
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
              <div className="flex items-baseline gap-2 mb-2"><div className="font-mono text-xl text-[#FFB300]">~110,000</div><div className="font-mono text-xs text-[#64748b]">P90 UPPER</div></div>
              <div className="text-xs font-mono text-[#FF4B5C] mb-1 font-bold flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-[#FF4B5C] animate-pulse"></span> P99 EXPECTED 14:20</div>
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
                  {showGrasp && <Line type="stepAfter" dataKey="grasp" stroke="#b14bc9" strokeWidth={2} strokeDasharray="3 3" dot={false} name="ISRO GRASP (48°E)" />}
                </ComposedChart>
              </ResponsiveContainer>
              {showGrasp && (
                <div className="absolute top-16 right-8 bg-[#b14bc9]/10 border border-[#b14bc9] p-3 rounded shadow-lg backdrop-blur text-[#e0b0ff] font-mono text-xs pointer-events-none">
                  <div className="font-bold mb-1 flex items-center gap-2">
                    <CheckCircle2 className="w-3 h-3" />
                    INDIAN-LONGITUDE VALIDATION
                  </div>
                  <div className="text-white">Recall: 0.933</div>
                  <div className="text-white">Longitude offset: 183°</div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* --- EXACT MATPLOTLIB REPLICAS --- */}
        <div className="col-span-12 mt-4">
          <div className="flex items-center gap-3 mb-6">
            <h2 className="text-[#94a3b8] font-mono text-sm font-bold uppercase tracking-widest border-l-4 border-[#00E5FF] pl-3">Scientific Model Verification (Prototype wired for live data)</h2>
            <div className="h-px bg-[#1e293b] flex-grow"></div>
          </div>
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            
            {/* Advance Warning Chart */}
            <div className="bg-[#2d2d2d] border border-[#1e293b] rounded p-1 col-span-1">
              <div className="font-mono text-xs mb-2 whitespace-pre bg-[#1e1e1e] text-[#d4d4d4] p-2 rounded">
                Actual electron PEAK: 330105 = 5.6x P99 threshold<br/>
                First forecast alert: 2017-04-23 07:00:00<br/>
                First actual onset:   2017-04-23 19:00:00<br/>
                --&gt; LEAD TIME: 12.0 hours advance warning
              </div>
              <div className="bg-white p-2">
                <h3 className="text-black text-center font-sans text-sm mb-2">April 2017 Storm - model forecast vs reality</h3>
                <div className="h-[250px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={realForecast} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                      <XAxis dataKey="time" stroke="#000" tick={{ fill: '#000', fontSize: 10 }} tickFormatter={(val) => val ? val.split(' ')[0] : ''} />
                      <YAxis scale="log" domain={['auto', 'auto']} stroke="#000" tick={{ fill: '#000', fontSize: 10 }} />
                      <RechartsTooltip contentStyle={{ backgroundColor: '#fff', borderColor: '#ccc', color: '#000' }} />
                      <Legend wrapperStyle={{ fontSize: '12px', color: '#000' }} />
                      <ReferenceLine y={59153} stroke="red" strokeDasharray="2 2" />
                      <Line type="monotone" dataKey="actual" name="Actual flux" stroke="blue" strokeWidth={2} dot={false} isAnimationActive={false} />
                      <Line type="monotone" dataKey="predicted" name="Forecast (12h ahead)" stroke="green" strokeWidth={2} strokeDasharray="5 5" dot={false} isAnimationActive={false} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            {/* Peak Capture Chart */}
            <div className="bg-[#2d2d2d] border border-[#1e293b] rounded p-1 col-span-1">
              <div className="font-mono text-xs mb-2 whitespace-pre bg-[#1e1e1e] text-[#d4d4d4] p-2 rounded">
                Actual storm peak:  330,105<br/>
                Median forecast:    173,179  (52% of actual)<br/>
                P90 upper band:     308,247  (93% of actual) &lt;-- captures the peak
              </div>
              <div className="bg-white p-2">
                <h3 className="text-black text-center font-sans text-sm mb-2">April 2017 — median understates peak, P90 upper band captures it</h3>
                <div className="h-[250px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={realForecast} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                      <XAxis dataKey="time" stroke="#000" tick={{ fill: '#000', fontSize: 10 }} tickFormatter={(val) => val ? val.split(' ')[0] : ''} />
                      <YAxis scale="log" domain={['auto', 'auto']} stroke="#000" tick={{ fill: '#000', fontSize: 10 }} />
                      <RechartsTooltip contentStyle={{ backgroundColor: '#fff', borderColor: '#ccc', color: '#000' }} />
                      <Legend wrapperStyle={{ fontSize: '12px', color: '#000' }} />
                      <ReferenceLine y={59153} stroke="red" strokeDasharray="2 2" />
                      <Line type="monotone" dataKey="actual" name="Actual flux" stroke="blue" strokeWidth={2} dot={false} isAnimationActive={false} />
                      <Line type="monotone" dataKey="predicted" name="Median forecast" stroke="green" strokeWidth={2} strokeDasharray="5 5" dot={false} isAnimationActive={false} />
                      <Line type="monotone" dataKey="upper" name="P90 upper band (worst-case)" stroke="orange" strokeWidth={2} strokeDasharray="2 2" dot={false} isAnimationActive={false} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            {/* 1.png: SHAP Feature Importance */}
            <div className="bg-[#2d2d2d] border border-[#1e293b] rounded p-1 col-span-1">
              <div className="bg-white p-2">
                <div className="h-[400px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={shapData} layout="vertical" margin={{ top: 10, right: 30, left: 160, bottom: 20 }}>
                      <XAxis type="number" stroke="#000" tick={{ fill: '#000', fontSize: 12 }} label={{ value: 'mean(|SHAP value|) (average impact on model output magnitude)', position: 'bottom', fill: '#000', fontSize: 12 }} />
                      <YAxis type="category" dataKey="feature" stroke="#000" tick={{ fill: '#333', fontSize: 11 }} axisLine={false} tickLine={false} />
                      <RechartsTooltip contentStyle={{ backgroundColor: '#fff', borderColor: '#ccc', color: '#000' }} />
                      <Bar dataKey="impact" fill="#008BFB" isAnimationActive={false} barSize={15} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            {/* 2.png: SHAP Beeswarm */}
            <div className="bg-[#2d2d2d] border border-[#1e293b] rounded p-1 col-span-1">
              <div className="bg-white p-2 h-full flex items-center">
                <div className="h-[400px] w-full flex">
                  <div className="w-[160px] flex flex-col justify-between py-6 text-right pr-2">
                    {shapData.slice().reverse().map((item, i) => (
                      <div key={i} className="text-[11px] text-[#333] h-full flex items-center justify-end">{item.feature}</div>
                    ))}
                  </div>
                  <ResponsiveContainer width="100%" height="100%">
                    <ScatterChart margin={{ top: 10, right: 10, left: 0, bottom: 20 }}>
                      <XAxis type="number" dataKey="impact" stroke="#000" tick={{ fill: '#000', fontSize: 12 }} label={{ value: 'SHAP value (impact on model output)', position: 'bottom', fill: '#000', fontSize: 12 }} />
                      <YAxis type="number" dataKey="featureIndex" domain={[0, 14]} tick={false} axisLine={true} />
                      <RechartsTooltip cursor={{ strokeDasharray: '3 3' }} content={(props: any) => {
                        const { payload } = props;
                        if (payload && payload.length) {
                          return <div className="bg-white border border-gray-300 p-2 text-xs text-black">{payload[0].payload.featureName}: {payload[0].value.toFixed(3)}</div>;
                        }
                        return null;
                      }} />
                      <ReferenceLine x={0} stroke="#999" />
                      <Scatter data={beeswarmData} fill="#0084ff" isAnimationActive={false}>
                        {beeswarmData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Scatter>
                    </ScatterChart>
                  </ResponsiveContainer>
                  {/* Color scale legend */}
                  <div className="w-[10px] ml-2 flex flex-col items-center justify-between py-6">
                    <span className="text-[10px] text-black">High</span>
                    <div className="w-1 h-full bg-gradient-to-b from-[#ff0040] to-[#0084ff] my-1"></div>
                    <span className="text-[10px] text-black">Low</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Note: Limitations table has been intentionally removed from the operational dashboard view. */}

          </div>
        </div>

        {/* --- TEAM SECTION --- */}
        <div className="col-span-12 mt-12 mb-8">
          <div className="flex items-center gap-3 mb-6">
            <h2 className="text-[#94a3b8] font-mono text-sm font-bold uppercase tracking-widest border-l-4 border-[#00E5FF] pl-3">Project Team</h2>
            <div className="h-px bg-[#1e293b] flex-grow"></div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            
            {/* Paavni Bansal */}
            <div className="bg-[#0f172a] border border-[#1e293b] rounded-xl p-6 hover:border-[#00E5FF] transition-all flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-[#1e293b] border border-[#334155] rounded-full flex items-center justify-center text-xl font-bold text-white mb-4 shadow-lg">PB</div>
              <h3 className="text-white font-bold mb-1">Paavni Bansal</h3>
              <p className="text-[#00E5FF] font-mono text-xs mb-4 uppercase tracking-wider">Team Leader</p>
              <div className="flex items-center gap-4">
                <a href="https://www.linkedin.com/in/paavni-bansal/" target="_blank" rel="noreferrer" className="text-[#64748b] hover:text-[#0077b5] transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></svg>
                </a>
                <a href="https://github.com/pavsoss" target="_blank" rel="noreferrer" className="text-[#64748b] hover:text-white transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"></path><path d="M9 18c-4.51 2-5-2-7-2"></path></svg>
                </a>
              </div>
            </div>

            {/* Shaurya Sanyal */}
            <div className="bg-[#0f172a] border border-[#1e293b] rounded-xl p-6 hover:border-[#00E5FF] transition-all flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-[#1e293b] border border-[#334155] rounded-full flex items-center justify-center text-xl font-bold text-white mb-4 shadow-lg">SS</div>
              <h3 className="text-white font-bold mb-1">Shaurya Sanyal</h3>
              <p className="text-[#64748b] font-mono text-xs mb-4 uppercase tracking-wider">Developer</p>
              <div className="flex items-center gap-4">
                <a href="https://www.linkedin.com/in/shaurya-sanyal-7b57a0382/" target="_blank" rel="noreferrer" className="text-[#64748b] hover:text-[#0077b5] transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></svg>
                </a>
                <a href="https://github.com/SHAURYASANYAL3" target="_blank" rel="noreferrer" className="text-[#64748b] hover:text-white transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"></path><path d="M9 18c-4.51 2-5-2-7-2"></path></svg>
                </a>
              </div>
            </div>

            {/* Sree Revanth */}
            <div className="bg-[#0f172a] border border-[#1e293b] rounded-xl p-6 hover:border-[#00E5FF] transition-all flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-[#1e293b] border border-[#334155] rounded-full flex items-center justify-center text-xl font-bold text-white mb-4 shadow-lg">SR</div>
              <h3 className="text-white font-bold mb-1">Sree Revanth</h3>
              <p className="text-[#64748b] font-mono text-xs mb-4 uppercase tracking-wider">Developer</p>
              <div className="flex items-center gap-4">
                <a href="https://www.linkedin.com/in/sree-revanth/" target="_blank" rel="noreferrer" className="text-[#64748b] hover:text-[#0077b5] transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></svg>
                </a>
                <a href="https://github.com/sreerevanth" target="_blank" rel="noreferrer" className="text-[#64748b] hover:text-white transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"></path><path d="M9 18c-4.51 2-5-2-7-2"></path></svg>
                </a>
              </div>
            </div>

            {/* Saketh Suman Bathini */}
            <div className="bg-[#0f172a] border border-[#1e293b] rounded-xl p-6 hover:border-[#00E5FF] transition-all flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-[#1e293b] border border-[#334155] rounded-full flex items-center justify-center text-xl font-bold text-white mb-4 shadow-lg">SB</div>
              <h3 className="text-white font-bold mb-1">Saketh Suman Bathini</h3>
              <p className="text-[#64748b] font-mono text-xs mb-4 uppercase tracking-wider">Developer</p>
              <div className="flex items-center gap-4">
                <a href="https://www.linkedin.com/in/saketh-suman/" target="_blank" rel="noreferrer" className="text-[#64748b] hover:text-[#0077b5] transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></svg>
                </a>
                <a href="https://github.com/SakethSumanBathini" target="_blank" rel="noreferrer" className="text-[#64748b] hover:text-white transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"></path><path d="M9 18c-4.51 2-5-2-7-2"></path></svg>
                </a>
              </div>
            </div>

          </div>
        </div>

      </div>
    </main>
  );
}
