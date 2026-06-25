'use client';
import { useState, useEffect } from 'react';
import { XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, ReferenceLine, Area, ComposedChart, Line } from 'recharts';

export default function OperationalDashboard() {
  const [showGrasp, setShowGrasp] = useState(false);
  
  const [dataState, setDataState] = useState<{ status: string, state: any }>({
    status: 'loading',
    state: null
  });

  useEffect(() => {
    const loadData = async () => {
      const stateData = await (await fetch('/data/state.json')).json();
      const forecastData = await (await fetch('/data/forecast.json')).json();
      
      stateData.forecast_timeline = forecastData.map((d: any) => ({
        time: d.time.split(' ')[1].substring(0, 5),
        actual: d.actual,
        median: d.predicted,
        p90: d.upper,
        grasp: d.actual * 0.933
      }));
      
      setDataState({ status: 'success', state: stateData });
    };
    loadData();
  }, []);



  const defaultState = {
    "status_horizon": "N/A",
    "p99_time": "--:-- UTC",
    "p99_hours_from_now": "--",
    "prob_p99": 0,
    "flux_current": 0,
    "flux_status": "-",
    "speed": 0,
    "imf_bz": 0,
    "kp_index": 0,
    "density": 0,
    "alerts": [],
    "shap_primary": "-",
    "shap_secondary": "-",
    "forecast_timeline": []
  };

  const appState = dataState.state || defaultState;

  return (
    <main className="min-h-screen bg-[#050816] text-[#E6EDF7] font-sans selection:bg-[#00E5FF] selection:text-[#050816] overflow-x-hidden">

      {/* TOP NAVIGATION / STATUS BAR */}
      <header className="border-b border-white/10 bg-[#0A0E17] sticky top-0 z-50">
        <div className="max-w-[1800px] mx-auto px-4 py-2 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <span className="text-[#00E5FF] font-mono text-lg font-bold">[GEO]</span>
            <div className="flex flex-col">
              <span className="font-mono font-bold tracking-widest uppercase text-sm text-white leading-none">GEOShield</span>
              <span className="text-[#8892A6] text-[9px] font-mono tracking-widest mt-0.5 uppercase">Operational Console</span>
            </div>
          </div>
          <div className="flex items-center gap-6 font-mono text-[10px]">
            <div className="flex items-center gap-2 text-[#00FF88]">
              <span className="w-1.5 h-1.5 bg-[#00FF88] rounded-full"></span>
              SYS.NOMINAL
            </div>
            <div className="flex items-center gap-2 text-[#FFB300] border border-[#FFB300]/30 bg-[#FFB300]/5 px-2 py-1 uppercase tracking-wider">
              PROTOTYPE
            </div>
            <div className="text-white tracking-widest border-l border-white/10 pl-4">SYS_TIME: SYNCED</div>
          </div>
        </div>
      </header>

      <div className="max-w-[1800px] mx-auto px-4 py-6 flex flex-col gap-4">
        


        {/* --- GRID SYSTEM: ROW 1 (HERO & TELEMETRY) --- */}
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-4">
          
          {/* CRITICAL STATUS BOARD */}
          <div className="col-span-12 xl:col-span-8 bg-[#0A0E17] border border-white/10 p-5 flex flex-col justify-between">
            <div className="flex justify-between items-start mb-6 border-b border-white/10 pb-3">
              <div className="flex items-center gap-3">
                <div className="bg-[#FF4B5C] text-black px-2 py-0.5 font-mono font-bold text-[10px] uppercase tracking-widest flex items-center gap-1.5">
                  RED ALERT
                </div>
                <span className="font-mono text-[#8892A6] text-[10px] uppercase tracking-widest">HORIZON: {appState.status_horizon}</span>
              </div>
              <div className="text-[10px] font-mono text-[#8892A6] uppercase">SYS_TRACK: 1.2M_KM</div>
            </div>
            
            <div className="flex flex-col md:flex-row justify-between items-end gap-6">
              <div>
                <h1 className="text-4xl md:text-5xl font-mono text-white tracking-tighter mb-1">
                  P99 CROSSING <span className="text-[#00E5FF]">{appState.p99_time}</span>
                </h1>
                <p className="text-[#8892A6] font-mono text-sm uppercase tracking-widest">Time to impact: {appState.p99_hours_from_now} hours</p>
              </div>
              
              <div className="flex items-center gap-6 border-l border-white/10 pl-6">
                <div className="flex flex-col items-center">
                  <span className="text-3xl font-mono text-white leading-none">{appState.prob_p99}%</span>
                  <span className="text-[9px] font-mono text-[#8892A6] mt-1 tracking-widest uppercase">P99 PROBABILITY</span>
                </div>
                <div className="flex flex-col items-center">
                  <span className="text-3xl font-mono text-[#FF4B5C] leading-none">{appState.kp_index}</span>
                  <span className="text-[9px] font-mono text-[#8892A6] mt-1 tracking-widest uppercase">Kp INDEX</span>
                </div>
              </div>
            </div>
          </div>

          {/* TELEMETRY FEED */}
          <div className="col-span-12 xl:col-span-4 bg-[#0A0E17] border border-white/10 p-5">
            <div className="flex justify-between items-center mb-4 border-b border-white/10 pb-2">
              <span className="text-[#8892A6] font-mono text-[10px] font-bold uppercase tracking-widest">Live Telemetry</span>
              <span className="text-[#00FF88] font-mono">~</span>
            </div>
            <div className="grid grid-cols-2 gap-x-4 gap-y-5">
              <div>
                <div className="text-[#8892A6] font-mono text-[9px] tracking-widest mb-1 uppercase">SPEED (km/s)</div>
                <div className="font-mono text-lg text-white flex items-center gap-2">
                  {appState.speed} <span className="text-[#FFB300] text-xs">↗</span>
                </div>
              </div>
              <div>
                <div className="text-[#8892A6] font-mono text-[9px] tracking-widest mb-1 uppercase">IMF Bz (nT)</div>
                <div className="font-mono text-lg text-white flex items-center gap-2">
                  {appState.imf_bz} <span className="text-[#FFB300] text-xs">↗</span>
                </div>
              </div>
              <div>
                <div className="text-[#8892A6] font-mono text-[9px] tracking-widest mb-1 uppercase">DENSITY (p/cc)</div>
                <div className="font-mono text-lg text-white flex items-center gap-2">
                  {appState.density} <span className="w-1.5 h-1.5 rounded-full bg-[#00FF88]"></span>
                </div>
              </div>
              <div>
                <div className="text-[#00E5FF] font-mono text-[9px] tracking-widest mb-1 uppercase">&gt;2MeV FLUX</div>
                <div className="font-mono text-lg text-white flex items-center gap-2">
                  {appState.flux_current.toLocaleString()}
                  <span className="text-[9px] text-[#FFB300] ml-1">↑ {appState.flux_status}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* --- GRID SYSTEM: ROW 2 (FORECAST CHART & LOGS) --- */}
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-4">
          
          {/* MAIN CHART */}
          <div className="col-span-12 xl:col-span-9 bg-[#0A0E17] border border-white/10 p-5 flex flex-col">
            <div className="flex justify-between items-center mb-6 border-b border-white/10 pb-2">
              <div className="flex gap-4 items-center">
                <span className="text-white font-mono text-xs uppercase tracking-widest">Forecast Projection</span>
                <span className="text-[#8892A6] font-mono text-[9px] uppercase tracking-widest bg-white/5 px-2 py-0.5">Log Scale</span>
              </div>
              <button onClick={() => setShowGrasp(!showGrasp)} className={`font-mono text-[9px] px-3 py-1 uppercase tracking-widest transition-colors ${showGrasp ? 'bg-[#00E5FF] text-black font-bold' : 'bg-transparent border border-white/20 text-[#8892A6] hover:text-white'}`}>
                {showGrasp ? 'GRASP: ACTIVE' : 'GRASP: INACTIVE'}
              </button>
            </div>
            
            <div className="w-full h-[320px]">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={appState.forecast_timeline} margin={{ top: 5, right: 0, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="1 3" stroke="rgba(255,255,255,0.1)" vertical={true} horizontal={true} />
                  <XAxis dataKey="time" stroke="#8892A6" tick={{ fill: '#8892A6', fontSize: 10, fontFamily: 'monospace' }} axisLine={false} tickLine={false} dy={10} />
                  <YAxis scale="log" domain={['auto', 'auto']} stroke="#8892A6" tick={{ fill: '#8892A6', fontSize: 10, fontFamily: 'monospace' }} tickFormatter={(val) => val.toLocaleString()} axisLine={false} tickLine={false} dx={-10} />
                  <RechartsTooltip cursor={{ stroke: 'rgba(255,255,255,0.2)', strokeWidth: 1 }} contentStyle={{ backgroundColor: '#050816', border: '1px solid rgba(255,255,255,0.1)', fontFamily: 'monospace', fontSize: '10px', color: '#fff' }} />
                  
                  <ReferenceLine y={59153} stroke="#FF4B5C" strokeWidth={1} label={{ position: 'insideTopLeft', value: 'P99 LIMIT', fill: '#FF4B5C', fontSize: 9, fontFamily: 'monospace' }} />
                  <ReferenceLine x="NOW" stroke="#00E5FF" strokeWidth={1} strokeDasharray="3 3" />
                  
                  <Area type="step" dataKey="p90" stroke="none" fill="#FFB300" fillOpacity={0.1} />
                  <Line type="step" dataKey="actual" stroke="#00E5FF" strokeWidth={1.5} dot={false} />
                  <Line type="step" dataKey="median" stroke="#00FF88" strokeWidth={1.5} strokeDasharray="4 4" dot={false} />
                  {showGrasp && <Line type="stepAfter" dataKey="grasp" stroke="#b14bc9" strokeWidth={1.5} dot={false} />}
                </ComposedChart>
              </ResponsiveContainer>
            </div>
            
            {/* HORIZON METRICS */}
            <div className="grid grid-cols-3 gap-0 border-t border-white/10 mt-4 pt-4">
              <div className="border-r border-white/10 px-4">
                <div className="text-[#8892A6] font-mono text-[9px] mb-1 tracking-widest uppercase">T+45 MIN</div>
                <div className="flex items-baseline gap-2">
                  <span className="text-white font-mono text-base">2,800</span>
                  <span className="text-[9px] font-mono text-[#00FF88]">NOMINAL</span>
                </div>
              </div>
              <div className="border-r border-white/10 px-4">
                <div className="text-[#8892A6] font-mono text-[9px] mb-1 tracking-widest uppercase">T+6 HR</div>
                <div className="flex items-baseline gap-2">
                  <span className="text-white font-mono text-base">8,000</span>
                  <span className="text-[9px] font-mono text-[#FFB300]">ELEVATED</span>
                </div>
              </div>
              <div className="px-4">
                <div className="text-[#8892A6] font-mono text-[9px] mb-1 tracking-widest uppercase">T+12 HR</div>
                <div className="flex items-baseline gap-2">
                  <span className="text-white font-mono text-base">58,000</span>
                  <span className="text-[9px] font-mono text-[#FF4B5C] bg-[#FF4B5C]/10 px-1">CRITICAL</span>
                </div>
              </div>
            </div>
          </div>

          {/* DRIVERS & LOG */}
          <div className="col-span-12 xl:col-span-3 flex flex-col gap-4">
            <div className="bg-[#0A0E17] border border-white/10 p-5 flex-grow flex flex-col">
              <div className="text-[#8892A6] font-mono text-[10px] font-bold uppercase tracking-widest border-b border-white/10 pb-2 mb-4">SHAP Explainability</div>
              <div className="flex flex-col gap-3 mb-6">
                <div>
                  <div className="text-[9px] font-mono text-[#00E5FF] tracking-widest uppercase">PRM_DRIVER</div>
                  <div className="text-xs text-white font-mono truncate">{appState.shap_primary}</div>
                </div>
                <div>
                  <div className="text-[9px] font-mono text-[#8892A6] tracking-widest uppercase">SEC_DRIVER</div>
                  <div className="text-xs text-white font-mono truncate">{appState.shap_secondary}</div>
                </div>
              </div>
              
              <div className="text-[#8892A6] font-mono text-[10px] font-bold uppercase tracking-widest border-b border-white/10 pb-2 mb-3 mt-auto">Action Log</div>
              <div className="flex flex-col gap-2 overflow-y-auto max-h-[160px] pr-1">
                {appState.alerts.map((alert: any, idx: number) => (
                  <div key={idx} className="border-l-2 border-white/20 pl-3 py-1">
                    <div className="flex justify-between items-baseline mb-0.5">
                      <span className={alert.status === 'CORRECT' ? "text-[#00FF88] font-mono text-[9px] uppercase tracking-widest" : "text-[#FFB300] font-mono text-[9px] uppercase tracking-widest"}>
                        {alert.status === 'CORRECT' ? 'PASS' : 'LIMIT'}
                      </span>
                      <span className="text-[#8892A6] font-mono text-[9px]">{alert.date}</span>
                    </div>
                    <div className="text-white font-mono text-[10px]">{alert.status === 'CORRECT' ? `Lead: ${alert.lead}` : alert.lead}</div>
                    <div className="text-[#8892A6] font-mono text-[9px] truncate">{alert.outcome}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* --- GRID SYSTEM: ROW 3 (VALIDATION PANELS) --- */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 mt-4">
          <div className="col-span-1 xl:col-span-2 flex items-center gap-3 border-b border-white/10 pb-2">
            <span className="text-[#00E5FF] font-mono font-bold">[OK]</span>
            <span className="text-white font-mono text-xs uppercase tracking-widest">Model Validation Matrix</span>
          </div>

          {/* ADVANCE WARNING */}
          <div className="bg-[#0A0E17] border border-white/10 p-4">
            <div className="flex justify-between items-center mb-4 border-b border-white/5 pb-2">
              <span className="font-mono text-[9px] text-[#8892A6] tracking-widest uppercase">Advance Warning Profile</span>
              <span className="text-[#00FF88] border border-[#00FF88]/30 px-1.5 py-0.5 text-[9px] font-mono uppercase">PASS</span>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="font-mono text-[10px] text-[#8892A6] flex flex-col justify-center gap-2 border-r border-white/5 pr-4">
                <div className="flex justify-between"><span>ACT_PEAK:</span><span className="text-white">330,105 (5.6x)</span></div>
                <div className="flex justify-between"><span>FST_ALERT:</span><span className="text-white">04-23 07:00</span></div>
                <div className="flex justify-between"><span>ACT_ONSET:</span><span className="text-white">04-23 19:00</span></div>
                <div className="flex justify-between text-[#00E5FF] mt-2 pt-2 border-t border-white/10"><span>LEAD_TIME:</span><span>12.0 HRS</span></div>
              </div>
              <div className="flex items-center justify-center bg-white p-1 border border-white/20">
                <img src="/plots/Screenshot_1.png" alt="Advance Warning" className="w-full h-auto object-contain" />
              </div>
            </div>
          </div>

          {/* PEAK CAPTURE */}
          <div className="bg-[#0A0E17] border border-white/10 p-4">
            <div className="flex justify-between items-center mb-4 border-b border-white/5 pb-2">
              <span className="font-mono text-[9px] text-[#8892A6] tracking-widest uppercase">Peak Capture Efficacy</span>
              <span className="text-[#FFB300] border border-[#FFB300]/30 px-1.5 py-0.5 text-[9px] font-mono uppercase">WARNING</span>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="font-mono text-[10px] text-[#8892A6] flex flex-col justify-center gap-2 border-r border-white/5 pr-4">
                <div className="flex justify-between"><span>STORM_PEAK:</span><span className="text-white">330,105</span></div>
                <div className="flex justify-between"><span>MEDIAN_FCST:</span><span className="text-white">200,214 (61%)</span></div>
                <div className="flex justify-between text-[#FFB300] mt-2 pt-2 border-t border-white/10"><span>P90_BAND:</span><span>308,247 (93%)</span></div>
              </div>
              <div className="flex items-center justify-center bg-white p-1 border border-white/20">
                <img src="/plots/Screenshot_2.png" alt="Peak Capture" className="w-full h-auto object-contain" />
              </div>
            </div>
          </div>

          {/* SHAP IMPORTANCE */}
          <div className="bg-[#0A0E17] border border-white/10 p-4">
            <div className="mb-4 border-b border-white/5 pb-2">
              <span className="font-mono text-[9px] text-[#8892A6] tracking-widest uppercase">Global SHAP Importance</span>
            </div>
            <div className="flex justify-center bg-white p-2 border border-white/20">
              <img src="/plots/Screenshot_3.png" alt="SHAP Importance" className="w-full h-auto object-contain" />
            </div>
          </div>

          {/* SHAP BEESWARM */}
          <div className="bg-[#0A0E17] border border-white/10 p-4">
            <div className="mb-4 border-b border-white/5 pb-2">
              <span className="font-mono text-[9px] text-[#8892A6] tracking-widest uppercase">SHAP Feature Impact</span>
            </div>
            <div className="flex justify-center bg-white p-2 border border-white/20">
              <img src="/plots/Screenshot_4.png" alt="SHAP Beeswarm" className="w-full h-auto object-contain" />
            </div>
          </div>
        </div>

        {/* --- FOOTER: TEAM / SPECS --- */}
        <div className="mt-8 pt-4 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="text-[#8892A6] font-mono text-[9px] tracking-widest uppercase flex gap-4">
            <span>ISRO GEOShield OPS</span>
            <span className="text-white/20">|</span>
            <span>DATA: GOES/OMNI</span>
          </div>
          <div className="flex gap-4">
            {['PB', 'SS', 'SR', 'SB'].map((initials, i) => (
              <div key={i} className="text-[#8892A6] font-mono text-[9px] border border-white/10 px-1.5 py-0.5">
                {initials}
              </div>
            ))}
          </div>
        </div>

      </div>
    </main>
  );
}
